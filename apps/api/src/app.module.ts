import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { WorkerModule } from './modules/worker/worker.module';
import { EmployerModule } from './modules/employer/employer.module';
import { JobModule } from './modules/job/job.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    AuthModule,
    WorkerModule,
    EmployerModule,
    JobModule,
    BookingModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
