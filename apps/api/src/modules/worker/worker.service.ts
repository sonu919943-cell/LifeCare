import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Availability, SkillCategory, SkillLevel } from '@prisma/client';
import { calculateDistanceKm } from '@kaamorax/shared-utils';

@Injectable()
export class WorkerService {
  constructor(private prisma: PrismaService) {}

  async onboardWorker(userId: string, data: {
    fullName: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth?: string;
    bio?: string;
    experience?: number;
    dailyRate?: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    skills?: Array<{ category: SkillCategory; skill: string; level?: SkillLevel }>;
  }) {
    // Upsert worker profile
    const worker = await this.prisma.worker.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        bio: data.bio,
        experience: data.experience,
        dailyRate: data.dailyRate,
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
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        bio: data.bio,
        experience: data.experience,
        dailyRate: data.dailyRate,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
        availability: Availability.AVAILABLE,
      },
    });

    // Add skills if provided
    if (data.skills && data.skills.length > 0) {
      for (const item of data.skills) {
        await this.prisma.workerSkill.upsert({
          where: {
            workerId_skill: {
              workerId: worker.id,
              skill: item.skill,
            },
          },
          update: {
            category: item.category,
            level: item.level || SkillLevel.INTERMEDIATE,
          },
          create: {
            workerId: worker.id,
            category: item.category,
            skill: item.skill,
            level: item.level || SkillLevel.INTERMEDIATE,
          },
        });
      }
    }

    return this.prisma.worker.findUnique({
      where: { id: worker.id },
      include: { skills: true },
    });
  }

  async getMyProfile(userId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { userId },
      include: {
        skills: true,
        documents: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found. Please complete onboarding.');
    }

    return worker;
  }

  async updateLocation(userId: string, latitude: number, longitude: number) {
    return this.prisma.worker.update({
      where: { userId },
      data: {
        latitude,
        longitude,
        lastSeenAt: new Date(),
        isOnline: true,
      },
    });
  }

  async updateAvailability(userId: string, availability: Availability) {
    return this.prisma.worker.update({
      where: { userId },
      data: { availability },
    });
  }

  async findNearbyWorkers(lat: number, lng: number, radiusKm: number = 10, skill?: string) {
    // Retrieve workers who are available and have GPS coordinates
    const workers = await this.prisma.worker.findMany({
      where: {
        availability: Availability.AVAILABLE,
        latitude: { not: null },
        longitude: { not: null },
        ...(skill ? { skills: { some: { skill } } } : {}),
      },
      include: {
        skills: true,
        user: { select: { phone: true } },
      },
    });

    // Calculate distance and filter by radiusKm
    return workers
      .map((w) => {
        const distance = calculateDistanceKm(lat, lng, w.latitude!, w.longitude!);
        return { ...w, distanceKm: distance };
      })
      .filter((w) => w.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
