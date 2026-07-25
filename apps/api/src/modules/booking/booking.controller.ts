import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Hire a worker for a job' })
  async createBooking(
    @CurrentUser('id') userId: string,
    @Body() body: { jobId: string; workerId: string; agreedRate: number }
  ) {
    return this.bookingService.createBooking(userId, body);
  }

  @Patch(':id/confirm')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Worker confirms booking request' })
  async confirmBooking(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.bookingService.confirmBookingByWorker(userId, id);
  }

  @Patch(':id/start')
  @Roles(Role.EMPLOYER, Role.WORKER)
  @ApiOperation({ summary: 'Start job work status' })
  async startWork(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.bookingService.startWork(userId, id);
  }

  @Patch(':id/complete')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Complete booking and trigger worker payout' })
  async completeBooking(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.bookingService.completeBooking(userId, id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user list of bookings' })
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookingService.getMyBookings(user.id, user.role);
  }
}
