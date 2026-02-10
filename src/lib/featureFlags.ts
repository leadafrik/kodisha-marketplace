// Feature flags configuration
// These can be toggled via environment variables

export const featureFlags = {
  // Booking system
  BOOKING_ENABLED: process.env.NEXT_PUBLIC_FEATURE_BOOKING_ENABLED !== 'false',
  
  // Payment integration
  PAYMENTS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_PAYMENTS_ENABLED !== 'false',
  
  // Messaging system
  MESSAGING_ENABLED: process.env.NEXT_PUBLIC_FEATURE_MESSAGING_ENABLED !== 'false',
  
  // Real-time features
  REALTIME_ENABLED: process.env.NEXT_PUBLIC_FEATURE_REALTIME_ENABLED !== 'false',
  
  // Admin dashboard
  ADMIN_DASHBOARD_ENABLED: process.env.NEXT_PUBLIC_FEATURE_ADMIN_DASHBOARD_ENABLED !== 'false',
  
  // Host tools
  HOST_TOOLS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_HOST_TOOLS_ENABLED !== 'false',
  
  // Reviews and ratings
  REVIEWS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_REVIEWS_ENABLED !== 'false',
  
  // Advanced search filters
  ADVANCED_SEARCH_ENABLED: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_SEARCH_ENABLED !== 'false',
};

// Hook to check if a feature is enabled
export const useFeature = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

// Helper to conditionally render based on feature flag
export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

// Get all enabled features
export const getEnabledFeatures = (): string[] => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);
};

// Get all disabled features
export const getDisabledFeatures = (): string[] => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => !enabled)
    .map(([key]) => key);
};
