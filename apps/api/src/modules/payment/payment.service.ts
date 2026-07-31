import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Initiate payment for a completed booking (creates Razorpay order stub)
   */
  async initiatePayment(userId: string, bookingId: string) {
    const employer = await this.prisma.employer.findUnique({ where: { userId } });
    if (!employer) {
      throw new BadRequestException('Employer profile not found');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.employerId !== employer.id) {
      throw new BadRequestException('Unauthorized to initiate payment for this booking');
    }

    // Check no successful payment already exists
    const existingSuccess = booking.payments.find((p) => p.status === PaymentStatus.SUCCESS);
    if (existingSuccess) {
      throw new BadRequestException('Payment for this booking has already been completed');
    }

    const amount = booking.totalAmount || booking.agreedRate;

    // Stub: In production, call Razorpay SDK here to create real order
    const razorpayOrderId = `rz_order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount,
        status: PaymentStatus.INITIATED,
        razorpayOrderId,
      },
    });

    return {
      payment,
      razorpayOrderId,
      amount: Number(amount),
      currency: 'INR',
      // In production: return Razorpay key_id for client-side SDK
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_kaamorax_demo',
    };
  }

  /**
   * Razorpay webhook / manual payment confirmation
   */
  async confirmPayment(paymentId: string, razorpayPaymentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCESS,
        razorpayPaymentId,
        paidAt: new Date(),
      },
    });

    // Update employer's total spent
    await this.prisma.employer.updateMany({
      where: {
        bookings: { some: { id: payment.bookingId } },
      },
      data: {
        totalSpent: { increment: Number(payment.amount) },
      },
    });

    return updated;
  }

  /**
   * Get payment history for a booking
   */
  async getPaymentsByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all payments for employer dashboard
   */
  async getMyPayments(userId: string, role: string) {
    if (role === 'EMPLOYER') {
      const employer = await this.prisma.employer.findUnique({ where: { userId } });
      if (!employer) return [];

      return this.prisma.payment.findMany({
        where: {
          booking: { employerId: employer.id },
        },
        include: {
          booking: {
            include: { worker: true, job: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    } else {
      const worker = await this.prisma.worker.findUnique({ where: { userId } });
      if (!worker) return [];

      return this.prisma.payment.findMany({
        where: {
          booking: { workerId: worker.id },
          status: PaymentStatus.SUCCESS,
        },
        include: {
          booking: {
            include: { employer: true, job: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }
  }
}
