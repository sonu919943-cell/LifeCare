import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Employer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employers')
export class EmployerController {
  constructor(private employerService: EmployerService) {}

  @Post('onboard')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Complete employer profile onboarding' })
  async onboard(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.employerService.onboardEmployer(userId, body);
  }

  @Get('me')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get current employer profile' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.employerService.getMyProfile(userId);
  }
}
