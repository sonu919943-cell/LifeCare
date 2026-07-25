import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BookingStatus, JobStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, data: { jobId: string; workerId: string; agreedRate: number }) {
    const employer = await this.prisma.employer.findUnique({ where: { userId } });
    if (!employer) {
      throw new BadRequestException('Employer profile not found');
    }

    const job = await this.prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) {
      throw new NotFoundException('Job posting not found');
    }

    const booking = await this.prisma.booking.create({
      data: {
        jobId: data.jobId,
        workerId: data.workerId,
        employerId: employer.id,
        status: BookingStatus.PENDING,
        startDate: job.startDate,
        agreedRate: data.agreedRate,
        totalAmount: Number(data.agreedRate) * (job.duration || 1),
      },
      include: {
        worker: true,
        employer: true,
        job: true,
      },
    });

    return booking;
  }

  async confirmBookingByWorker(userId: string, bookingId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      throw new BadRequestException('Worker profile not found');
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.workerId !== worker.id) {
      throw new NotFoundException('Booking not found or unauthorized');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
      include: { worker: true, employer: true, job: true },
    });

    // Mark job as filled if needed
    await this.prisma.job.update({
      where: { id: booking.jobId },
      data: { status: JobStatus.FILLED },
    });

    return updated;
  }

  async startWork(userId: string, bookingId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.ACTIVE },
    });
  }

  async completeBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        endDate: new Date(),
      },
      include: { worker: true, employer: true },
    });

    // Update worker totals
    await this.prisma.worker.update({
      where: { id: booking.workerId },
      data: {
        totalJobs: { increment: 1 },
        totalEarnings: { increment: booking.totalAmount || 0 },
      },
    });

    return booking;
  }

  async getMyBookings(userId: string, role: string) {
    if (role === 'WORKER') {
      const worker = await this.prisma.worker.findUnique({ where: { userId } });
      if (!worker) return [];
      return this.prisma.booking.findMany({
        where: { workerId: worker.id },
        include: { employer: true, job: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const employer = await this.prisma.employer.findUnique({ where: { userId } });
      if (!employer) return [];
      return this.prisma.booking.findMany({
        where: { employerId: employer.id },
        include: { worker: true, job: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }
}
