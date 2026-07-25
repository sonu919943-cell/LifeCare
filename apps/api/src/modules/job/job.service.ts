import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JobStatus, SkillCategory, Urgency } from '@prisma/client';
import { calculateDistanceKm } from '@kaamorax/shared-utils';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: string, data: {
    title: string;
    description?: string;
    category: SkillCategory;
    requiredSkill: string;
    workersNeeded?: number;
    dailyRate: number;
    startDate: string;
    duration?: number;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    urgency?: Urgency;
  }) {
    const employer = await this.prisma.employer.findUnique({ where: { userId } });
    if (!employer) {
      throw new BadRequestException('Employer profile not found. Please complete onboarding first.');
    }

    const job = await this.prisma.job.create({
      data: {
        employerId: employer.id,
        title: data.title,
        description: data.description,
        category: data.category,
        requiredSkill: data.requiredSkill,
        workersNeeded: data.workersNeeded || 1,
        dailyRate: data.dailyRate,
        startDate: new Date(data.startDate),
        duration: data.duration || 1,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        city: data.city,
        state: data.state || 'State',
        pincode: data.pincode || '000000',
        urgency: data.urgency || Urgency.IMMEDIATE,
        status: JobStatus.OPEN,
      },
      include: {
        employer: true,
      },
    });

    // Trigger instant geo-matching for workers within 15km radius
    await this.generateJobMatches(job.id);

    return job;
  }

  async generateJobMatches(jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return;

    // Find available workers near the job location
    const workers = await this.prisma.worker.findMany({
      where: {
        availability: 'AVAILABLE',
        latitude: { not: null },
        longitude: { not: null },
        skills: {
          some: {
            skill: { contains: job.requiredSkill, mode: 'insensitive' },
          },
        },
      },
      include: { skills: true },
    });

    const matchesToCreate = [];
    for (const worker of workers) {
      const distance = calculateDistanceKm(
        job.latitude,
        job.longitude,
        worker.latitude!,
        worker.longitude!
      );

      if (distance <= 20) { // Within 20km
        // Score calculation out of 100 based on rating, distance, experience
        const ratingScore = Number(worker.rating) * 10;
        const distanceScore = Math.max(0, 50 - distance * 2);
        const expScore = Math.min(30, (worker.experience || 1) * 5);
        const totalScore = Math.round(ratingScore + distanceScore + expScore);

        matchesToCreate.push({
          jobId: job.id,
          workerId: worker.id,
          score: totalScore,
          distance,
          notifiedAt: new Date(),
        });
      }
    }

    if (matchesToCreate.length > 0) {
      await this.prisma.jobMatch.createMany({
        data: matchesToCreate,
        skipDuplicates: true,
      });
    }
  }

  async getNearbyJobsForWorker(userId: string, radiusKm: number = 15) {
    const worker = await this.prisma.worker.findUnique({
      where: { userId },
      include: { skills: true },
    });

    if (!worker || !worker.latitude || !worker.longitude) {
      // Fallback open jobs if worker location not set yet
      return this.prisma.job.findMany({
        where: { status: JobStatus.OPEN },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { employer: true },
      });
    }

    const openJobs = await this.prisma.job.findMany({
      where: { status: JobStatus.OPEN },
      include: { employer: true },
    });

    return openJobs
      .map((job) => {
        const distanceKm = calculateDistanceKm(
          worker.latitude!,
          worker.longitude!,
          job.latitude,
          job.longitude
        );
        return { ...job, distanceKm };
      })
      .filter((j) => j.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: true,
        matches: {
          include: { worker: { include: { skills: true } } },
        },
        bookings: {
          include: { worker: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job posting not found');
    }

    return job;
  }
}
