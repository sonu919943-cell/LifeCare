import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a notification for a user
   */
  async create(userId: string, type: NotificationType, title: string, body: string, data?: any) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, data },
    });
  }

  /**
   * Get all notifications for logged-in user (unread first)
   */
  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: [{ read: 'asc' }, { sentAt: 'desc' }],
      take: 50,
    });
  }

  /**
   * Mark notifications as read
   */
  async markRead(userId: string, ids?: string[]) {
    if (ids && ids.length > 0) {
      // Mark specific notifications as read
      await this.prisma.notification.updateMany({
        where: { userId, id: { in: ids } },
        data: { read: true },
      });
    } else {
      // Mark all as read
      await this.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    }
    return { success: true, message: 'Notifications marked as read' };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { unreadCount: count };
  }

  // --- Internal helper methods called from other services ---

  async notifyJobMatch(workerId: string, jobTitle: string, employerName: string, jobId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id: workerId },
      select: { userId: true },
    });
    if (!worker) return;

    return this.create(
      worker.userId,
      NotificationType.JOB_MATCH,
      `⚡ New Job Nearby!`,
      `${employerName} is looking for a worker like you for: "${jobTitle}"`,
      { jobId },
    );
  }

  async notifyBookingCreated(workerId: string, employerName: string, bookingId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id: workerId },
      select: { userId: true },
    });
    if (!worker) return;

    return this.create(
      worker.userId,
      NotificationType.BOOKING,
      `🤝 Hire Request Received!`,
      `${employerName} has sent you a booking request. Accept or decline it now.`,
      { bookingId },
    );
  }

  async notifyPaymentSuccess(workerId: string, amount: number, bookingId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id: workerId },
      select: { userId: true },
    });
    if (!worker) return;

    return this.create(
      worker.userId,
      NotificationType.PAYMENT,
      `💰 Payment Received!`,
      `₹${amount} has been transferred to your account for completed job.`,
      { bookingId, amount },
    );
  }
}
