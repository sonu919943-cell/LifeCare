/**
 * Calculate Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Format Indian Phone Number to standard E.164 (+91XXXXXXXXXX)
 */
export function sanitizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

/**
 * Format Currency to Indian Rupee symbol (₹)
 */
export function formatINR(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num || 0);
}

/**
 * Check if check-in coordinates are within acceptable geofence radius (default 500m)
 */
export function isWithinGeofence(
  jobLat: number,
  jobLng: number,
  checkInLat: number,
  checkInLng: number,
  maxMeters: number = 500
): boolean {
  const distKm = calculateDistanceKm(jobLat, jobLng, checkInLat, checkInLng);
  return distKm * 1000 <= maxMeters;
}
