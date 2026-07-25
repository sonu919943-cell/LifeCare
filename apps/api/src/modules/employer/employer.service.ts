import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EmployerType } from '@prisma/client';

@Injectable()
export class EmployerService {
  constructor(private prisma: PrismaService) {}

  async onboardEmployer(userId: string, data: {
    fullName: string;
    companyName?: string;
    type?: EmployerType;
    gstin?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  }) {
    return this.prisma.employer.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        companyName: data.companyName,
        type: data.type || EmployerType.INDIVIDUAL,
        gstin: data.gstin,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      create: {
        userId,
        fullName: data.fullName,
        companyName: data.companyName,
        type: data.type || EmployerType.INDIVIDUAL,
        gstin: data.gstin,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
  }

  async getMyProfile(userId: string) {
    const employer = await this.prisma.employer.findUnique({
      where: { userId },
      include: {
        jobs: { take: 5, orderBy: { createdAt: 'desc' } },
        bookings: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employer) {
      throw new NotFoundException('Employer profile not found. Please complete onboarding.');
    }

    return employer;
  }
}
