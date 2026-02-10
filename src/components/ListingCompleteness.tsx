import { FC } from 'react';
import { AlertCircle } from 'lucide-react';

interface ListingCompletenessProps {
  score: number;
  showLabel?: boolean;
  showSuggestions?: boolean;
  missingFields?: string[];
}

const ListingCompleteness: FC<ListingCompletenessProps> = ({ 
  score, 
  showLabel = true,
  showSuggestions = false,
  missingFields = []
}) => {
  const getCompletenessLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', progress: 'bg-green-600' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 'bg-blue-600' };
    if (score >= 50) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 'bg-yellow-600' };
    return { label: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-100', progress: 'bg-red-600' };
  };

  const level = getCompletenessLevel(score);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">Listing Completeness</span>
        )}
        <span className={`text-sm font-semibold ${level.color}`}>{score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${level.progress} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${level.bgColor} ${level.color}`}>
        {level.label}
      </div>

      {/* Suggestions */}
      {showSuggestions && missingFields.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Improve Your Listing</p>
              <ul className="mt-2 space-y-1">
                {missingFields.slice(0, 3).map((field, idx) => (
                  <li key={idx} className="text-sm text-blue-800">
                    • Add or improve your {field.toLowerCase()}
                  </li>
                ))}
              </ul>
              {missingFields.length > 3 && (
                <p className="text-sm text-blue-800 mt-2">
                  + {missingFields.length - 3} more suggestions
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingCompleteness;
