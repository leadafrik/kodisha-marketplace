import { FC } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const VerificationBadge: FC<VerificationBadgeProps> = ({ 
  isVerified, 
  verificationStatus = isVerified ? 'verified' : 'unverified',
  showLabel = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  if (verificationStatus === 'verified') {
    return (
      <div className={`flex items-center ${containerClasses[size]}`}>
        <CheckCircle className={`${sizeClasses[size]} text-green-600 fill-green-100`} />
        {showLabel && <span className="font-medium text-green-700">Verified</span>}
      </div>
    );
  }

  if (verificationStatus === 'pending') {
    return (
      <div className={`flex items-center ${containerClasses[size]}`}>
        <AlertCircle className={`${sizeClasses[size]} text-yellow-600 fill-yellow-100`} />
        {showLabel && <span className="font-medium text-yellow-700">Pending</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${containerClasses[size]}`}>
      <AlertCircle className={`${sizeClasses[size]} text-gray-400`} />
      {showLabel && <span className="font-medium text-gray-600">Unverified</span>}
    </div>
  );
};

export default VerificationBadge;
