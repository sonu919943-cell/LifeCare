import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { WorkerModule } from './modules/worker/worker.module';
import { EmployerModule } from './modules/employer/employer.module';
import { JobModule } from './modules/job/job.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ReviewModule } from './modules/review/review.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    AuthModule,
    WorkerModule,
    EmployerModule,
    JobModule,
    BookingModule,
    PaymentModule,
    AttendanceModule,
    ReviewModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
