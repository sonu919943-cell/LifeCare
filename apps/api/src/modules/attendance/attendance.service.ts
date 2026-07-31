import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Worker GPS check-in for the day
   */
  async checkIn(userId: string, bookingId: string, latitude: number, longitude: number) {
    const worker = await this.prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      throw new BadRequestException('Worker profile not found');
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.workerId !== worker.id) {
      throw new NotFoundException('Booking not found or unauthorized');
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findUnique({
      where: {
        bookingId_workerId_date: {
          bookingId,
          workerId: worker.id,
          date: today,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Already checked in for today');
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        bookingId,
        workerId: worker.id,
        date: today,
        checkInAt: new Date(),
        checkInLat: latitude,
        checkInLng: longitude,
        status: AttendanceStatus.PRESENT,
      },
    });

    // Update worker last seen GPS
    await this.prisma.worker.update({
      where: { id: worker.id },
      data: { latitude, longitude, lastSeenAt: new Date() },
    });

    return attendance;
  }

  /**
   * Worker GPS check-out for the day
   */
  async checkOut(userId: string, bookingId: string, latitude: number, longitude: number) {
    const worker = await this.prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      throw new BadRequestException('Worker profile not found');
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        bookingId_workerId_date: {
          bookingId,
          workerId: worker.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('No check-in found for today. Please check in first.');
    }

    if (attendance.checkOutAt) {
      throw new BadRequestException('Already checked out for today');
    }

    const checkOutAt = new Date();
    const checkInAt = attendance.checkInAt!;
    const hoursWorked =
      (checkOutAt.getTime() - checkInAt.getTime()) / (1000 * 60 * 60);

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutAt,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
      },
    });
  }

  /**
   * Get full attendance log for a booking
   */
  async getAttendanceForBooking(bookingId: string) {
    return this.prisma.attendance.findMany({
      where: { bookingId },
      include: { worker: true },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Get all worker's attendance history
   */
  async getMyAttendance(userId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId } });
    if (!worker) return [];

    return this.prisma.attendance.findMany({
      where: { workerId: worker.id },
      include: { booking: { include: { job: true, employer: true } } },
      orderBy: { date: 'desc' },
      take: 60,
    });
  }
}
