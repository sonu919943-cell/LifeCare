import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate/:bookingId')
  @ApiOperation({ summary: 'Initiate Razorpay payment for a completed booking' })
  initiatePayment(@Request() req: any, @Param('bookingId') bookingId: string) {
    return this.paymentService.initiatePayment(req.user.sub, bookingId);
  }

  @Post('confirm/:paymentId')
  @ApiOperation({ summary: 'Confirm payment (webhook / manual) with Razorpay Payment ID' })
  confirmPayment(
    @Param('paymentId') paymentId: string,
    @Body() body: { razorpayPaymentId: string },
  ) {
    return this.paymentService.confirmPayment(paymentId, body.razorpayPaymentId);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payments for a specific booking' })
  getByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentService.getPaymentsByBooking(bookingId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my payment history (employer: spent, worker: earned)' })
  getMyPayments(@Request() req: any) {
    return this.paymentService.getMyPayments(req.user.sub, req.user.role);
  }
}
