import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { Role } from '@prisma/client';
import { sanitizeIndianPhone } from '@kaamorax/shared-utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phoneRaw: string) {
    const phone = sanitizeIndianPhone(phoneRaw);
    
    // Hardcoded test OTP '123456' for instant developer/demo testing
    const otp = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await this.prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    return {
      message: `OTP sent successfully to ${phone}. (Demo OTP: 123456)`,
      phone,
    };
  }

  async verifyOtp(phoneRaw: string, otp: string, defaultRole: Role = Role.WORKER) {
    const phone = sanitizeIndianPhone(phoneRaw);

    const record = await this.prisma.otpVerification.findFirst({
      where: { phone, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('No active OTP request found');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (record.otp !== otp && otp !== '123456') {
      await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP entered');
    }

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: { worker: true, employer: true },
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          phone,
          role: defaultRole,
          isVerified: true,
        },
        include: { worker: true, employer: true },
      });
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate Tokens
    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = `ref_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        worker: user.worker,
        employer: user.employer,
      },
      isNewUser,
    };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await this.prisma.session.delete({ where: { id: session.id } });

    const newRefreshToken = `ref_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    await this.prisma.session.create({
      data: {
        userId: session.userId,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = this.jwtService.sign({
      sub: session.user.id,
      phone: session.user.phone,
      role: session.user.role,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
