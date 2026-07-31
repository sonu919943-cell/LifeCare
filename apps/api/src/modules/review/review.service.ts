import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit a review after booking completion
   */
  async submitReview(
    userId: string,
    bookingId: string,
    data: {
      rating: number; // 1-5
      comment?: string;
      revieweeType: 'WORKER' | 'EMPLOYER'; // Who is being reviewed
    },
  ) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { worker: true, employer: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews can only be submitted for completed bookings');
    }

    // Check duplicate
    const existing = await this.prisma.review.findUnique({
      where: { bookingId_reviewerId: { bookingId, reviewerId: userId } },
    });
    if (existing) {
      throw new ConflictException('You have already submitted a review for this booking');
    }

    // Resolve workerId and employerId
    const reviewData: any = {
      bookingId,
      reviewerId: userId,
      rating: data.rating,
      comment: data.comment,
    };

    if (data.revieweeType === 'WORKER') {
      reviewData.workerId = booking.workerId;
    } else {
      reviewData.employerId = booking.employerId;
    }

    const review = await this.prisma.review.create({ data: reviewData });

    // Update aggregate rating for reviewed entity
    if (data.revieweeType === 'WORKER') {
      await this.updateWorkerRating(booking.workerId);
    } else {
      await this.updateEmployerRating(booking.employerId);
    }

    return review;
  }

  private async updateWorkerRating(workerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { workerId },
      select: { rating: true },
    });
    if (reviews.length === 0) return;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.worker.update({
      where: { id: workerId },
      data: { rating: Math.round(avg * 100) / 100 },
    });
  }

  private async updateEmployerRating(employerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { employerId },
      select: { rating: true },
    });
    if (reviews.length === 0) return;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.employer.update({
      where: { id: employerId },
      data: { rating: Math.round(avg * 100) / 100 },
    });
  }

  /**
   * Get reviews for a worker
   */
  async getWorkerReviews(workerId: string) {
    return this.prisma.review.findMany({
      where: { workerId },
      include: {
        booking: {
          include: { employer: { select: { fullName: true, companyName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Get reviews for an employer
   */
  async getEmployerReviews(employerId: string) {
    return this.prisma.review.findMany({
      where: { employerId },
      include: {
        booking: {
          include: { worker: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
