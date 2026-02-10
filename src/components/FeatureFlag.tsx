import React from 'react';
import { featureFlags } from '@/lib/featureFlags';

interface FeatureFlagProps {
  feature: keyof typeof featureFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders based on feature flags
 * 
 * Usage:
 * <FeatureFlag feature="BOOKING_ENABLED">
 *   <BookingButton />
 * </FeatureFlag>
 */
export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  feature,
  children,
  fallback = null,
}) => {
  if (!featureFlags[feature]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default FeatureFlag;
