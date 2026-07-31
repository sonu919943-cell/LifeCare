import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('booking/:bookingId')
  @ApiOperation({ summary: 'Submit a review for a completed booking' })
  submitReview(
    @Request() req: any,
    @Param('bookingId') bookingId: string,
    @Body() body: { rating: number; comment?: string; revieweeType: 'WORKER' | 'EMPLOYER' },
  ) {
    return this.reviewService.submitReview(req.user.sub, bookingId, body);
  }

  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Get all reviews for a worker' })
  getWorkerReviews(@Param('workerId') workerId: string) {
    return this.reviewService.getWorkerReviews(workerId);
  }

  @Get('employer/:employerId')
  @ApiOperation({ summary: 'Get all reviews for an employer' })
  getEmployerReviews(@Param('employerId') employerId: string) {
    return this.reviewService.getEmployerReviews(employerId);
  }
}
