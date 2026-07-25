export type Role = 'WORKER' | 'EMPLOYER' | 'ADMIN' | 'SUPPORT' | 'OPS';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
export type Availability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
export type JobStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'FILLED' | 'COMPLETED' | 'CANCELLED';
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type PaymentStatus = 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface JwtPayload {
  sub: string;
  phone: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    role: Role;
    isVerified: boolean;
  };
  isNewUser: boolean;
}

export interface SendOtpDto {
  phone: string;
  purpose?: 'LOGIN' | 'REGISTRATION';
}

export interface VerifyOtpDto {
  phone: string;
  otp: string;
  role?: Role;
}

export interface WorkerProfileDto {
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
  skills?: Array<{ category: string; skill: string; level?: SkillLevel }>;
}

export interface CreateJobDto {
  title: string;
  description?: string;
  category: string;
  requiredSkill: string;
  workersNeeded?: number;
  dailyRate: number;
  startDate: string;
  durationDays?: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  urgency?: Urgency;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface SocketJobAlertEvent {
  jobId: string;
  title: string;
  category: string;
  requiredSkill: string;
  dailyRate: number;
  distanceKm: number;
  address: string;
  urgency: Urgency;
}
