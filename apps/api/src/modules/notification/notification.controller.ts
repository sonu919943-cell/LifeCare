import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications (unread first)' })
  getMyNotifications(@Request() req: any) {
    return this.notificationService.getMyNotifications(req.user.sub);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@Request() req: any) {
    return this.notificationService.getUnreadCount(req.user.sub);
  }

  @Post('mark-read')
  @ApiOperation({ summary: 'Mark notifications as read (all, or specific ids)' })
  markRead(@Request() req: any, @Body() body: { ids?: string[] }) {
    return this.notificationService.markRead(req.user.sub, body.ids);
  }
}
