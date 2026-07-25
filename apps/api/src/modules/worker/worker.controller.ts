import { Controller, Post, Get, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkerService } from './worker.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Availability, Role } from '@prisma/client';

@ApiTags('Worker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @Post('onboard')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Complete worker profile onboarding & skills' })
  async onboard(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.workerService.onboardWorker(userId, body);
  }

  @Get('me')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Get current worker profile' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.workerService.getMyProfile(userId);
  }

  @Patch('location')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Update live GPS coordinates for worker' })
  async updateLocation(
    @CurrentUser('id') userId: string,
    @Body() body: { latitude: number; longitude: number }
  ) {
    return this.workerService.updateLocation(userId, body.latitude, body.longitude);
  }

  @Patch('availability')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: 'Set worker availability (AVAILABLE, BUSY, OFFLINE)' })
  async updateAvailability(
    @CurrentUser('id') userId: string,
    @Body() body: { availability: Availability }
  ) {
    return this.workerService.updateAvailability(userId, body.availability);
  }

  @Get('nearby')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Search nearby workers by GPS location and skill' })
  async findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('skill') skill?: string
  ) {
    return this.workerService.findNearbyWorkers(
      parseFloat(lat),
      parseFloat(lng),
      radiusKm ? parseFloat(radiusKm) : 10,
      skill
    );
  }
}
