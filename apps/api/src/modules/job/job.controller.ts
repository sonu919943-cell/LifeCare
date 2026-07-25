import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Job')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Create new job posting and trigger instant matching' })
  async createJob(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.jobService.createJob(userId, body);
  }

  @Get('nearby')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Find nearby open jobs matching worker skills & location' })
  async getNearbyJobs(
    @CurrentUser('id') userId: string,
    @Query('radiusKm') radiusKm?: string
  ) {
    return this.jobService.getNearbyJobsForWorker(
      userId,
      radiusKm ? parseFloat(radiusKm) : 15
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed job info, matches, and hires' })
  async getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }
}
