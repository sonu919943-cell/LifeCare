import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in/:bookingId')
  @ApiOperation({ summary: 'Worker GPS check-in for today' })
  checkIn(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.attendanceService.checkIn(req.user.sub, bookingId, body.latitude, body.longitude);
  }

  @Post('check-out/:bookingId')
  @ApiOperation({ summary: 'Worker GPS check-out for today' })
  checkOut(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.attendanceService.checkOut(req.user.sub, bookingId, body.latitude, body.longitude);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get full attendance log for a booking' })
  getBookingAttendance(@Param('bookingId') bookingId: string) {
    return this.attendanceService.getAttendanceForBooking(bookingId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my attendance history (worker)' })
  getMyAttendance(@Request() req: any) {
    return this.attendanceService.getMyAttendance(req.user.sub);
  }
}
