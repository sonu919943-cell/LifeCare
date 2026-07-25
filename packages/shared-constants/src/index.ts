export const SKILL_CATEGORIES = {
  CONSTRUCTION: 'Construction & Civil Work',
  DOMESTIC: 'Domestic & Household',
  DRIVING: 'Driving & Logistics',
  WAREHOUSE: 'Warehouse & Loading',
  FACTORY: 'Factory & Industrial',
  AGRICULTURE: 'Agriculture & Farming',
  HOSPITALITY: 'Hotels & Catering',
  SECURITY: 'Security Guard',
  EVENT: 'Event & Setup Staff',
  HEALTHCARE: 'Hospital Helper & Caretaker',
  OTHER: 'General Skilled Worker',
} as const;

export const WORKER_SKILLS_LIST = [
  // Construction
  { category: 'CONSTRUCTION', name: 'Mason (Rajmistri)', avgDailyRate: 850 },
  { category: 'CONSTRUCTION', name: 'Construction Helper', avgDailyRate: 600 },
  { category: 'CONSTRUCTION', name: 'Painter', avgDailyRate: 750 },
  { category: 'CONSTRUCTION', name: 'Electrician', avgDailyRate: 900 },
  { category: 'CONSTRUCTION', name: 'Plumber', avgDailyRate: 850 },
  { category: 'CONSTRUCTION', name: 'Welder', avgDailyRate: 950 },
  { category: 'CONSTRUCTION', name: 'Carpenter', avgDailyRate: 900 },
  { category: 'CONSTRUCTION', name: 'Steel Fixer (Bar Bender)', avgDailyRate: 800 },
  { category: 'CONSTRUCTION', name: 'Tiles & Marble Worker', avgDailyRate: 900 },

  // Domestic
  { category: 'DOMESTIC', name: 'Housemaid', avgDailyRate: 500 },
  { category: 'DOMESTIC', name: 'Cook / Chef', avgDailyRate: 700 },
  { category: 'DOMESTIC', name: 'House Cleaner', avgDailyRate: 500 },

  // Driving & Logistics
  { category: 'DRIVING', name: 'Commercial Driver (LMV)', avgDailyRate: 800 },
  { category: 'DRIVING', name: 'Heavy Driver (HMV / Truck)', avgDailyRate: 1100 },
  { category: 'DRIVING', name: 'Auto / E-Rickshaw Driver', avgDailyRate: 600 },

  // Warehouse & Loading
  { category: 'WAREHOUSE', name: 'Loader / Unloader (Palledar)', avgDailyRate: 650 },
  { category: 'WAREHOUSE', name: 'Warehouse Packer', avgDailyRate: 600 },
  { category: 'WAREHOUSE', name: 'Forklift Operator', avgDailyRate: 1000 },

  // Factory
  { category: 'FACTORY', name: 'Factory Helper', avgDailyRate: 550 },
  { category: 'FACTORY', name: 'Machine Operator', avgDailyRate: 850 },

  // Agriculture
  { category: 'AGRICULTURE', name: 'Farm Labour / Crop Harvester', avgDailyRate: 500 },

  // Hospitality & Security
  { category: 'HOSPITALITY', name: 'Hotel Waiter / Steward', avgDailyRate: 550 },
  { category: 'SECURITY', name: 'Security Guard', avgDailyRate: 700 },
  { category: 'EVENT', name: 'Event Setup Helper', avgDailyRate: 600 },
  { category: 'HEALTHCARE', name: 'Hospital Patient Helper', avgDailyRate: 700 },
] as const;

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 5,
  RESEND_COOLDOWN_SECONDS: 60,
};

export const MATCHING_CONFIG = {
  MAX_RADIUS_KM: 25,
  DEFAULT_RADIUS_KM: 10,
  SCORE_WEIGHT_DISTANCE: 0.4,
  SCORE_WEIGHT_RATING: 0.3,
  SCORE_WEIGHT_EXPERIENCE: 0.3,
};
