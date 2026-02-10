/**
 * Listing Completeness Utility
 * Calculates completeness score and identifies missing fields
 */

export interface ListingCompletenessResult {
  score: number;
  percentage: number;
  missingFields: string[];
  suggestions: string[];
}

export const calculateListingCompleteness = (listing: any): ListingCompletenessResult => {
  const fields = {
    title: { weight: 10, present: !!listing.title },
    description: { weight: 15, present: !!listing.description && listing.description.length > 50 },
    images: { weight: 20, present: listing.images && listing.images.length > 0 },
    price: { weight: 15, present: !!listing.price_per_unit && listing.price_per_unit > 0 },
    category: { weight: 10, present: !!listing.main_category },
    location: { weight: 15, present: !!listing.county_id && !!listing.ward },
    rules: { weight: 10, present: !!listing.rules && listing.rules.length > 0 },
    availability: { weight: 5, present: !!listing.availability_status },
  };

  let totalScore = 0;
  let totalWeight = 0;
  const missingFields: string[] = [];

  for (const [fieldName, fieldData] of Object.entries(fields)) {
    totalWeight += fieldData.weight;
    if (fieldData.present) {
      totalScore += fieldData.weight;
    } else {
      missingFields.push(fieldName);
    }
  }

  const percentage = Math.round((totalScore / totalWeight) * 100);

  return {
    score: totalScore,
    percentage,
    missingFields,
    suggestions: generateSuggestions(missingFields, listing),
  };
};

const generateSuggestions = (missingFields: string[], listing: any): string[] => {
  const suggestions: string[] = [];

  if (missingFields.includes('images')) {
    suggestions.push('Add high-quality photos of your listing (at least 3)');
  }

  if (missingFields.includes('description')) {
    suggestions.push('Write a detailed description (at least 100 characters)');
  }

  if (missingFields.includes('rules')) {
    suggestions.push('Set clear house rules and guest requirements');
  }

  if (missingFields.includes('price')) {
    suggestions.push('Set a competitive price for your listing');
  }

  if (missingFields.includes('location')) {
    suggestions.push('Select your county and ward');
  }

  if (listing.completeness_score && listing.completeness_score < 50) {
    suggestions.push('Your listing needs more information to attract guests');
  }

  return suggestions;
};

export const getCompletenessLevel = (
  percentage: number
): { level: string; color: string; icon: string } => {
  if (percentage >= 90) {
    return { level: 'Excellent', color: 'text-green-600', icon: '✓' };
  }
  if (percentage >= 75) {
    return { level: 'Good', color: 'text-blue-600', icon: '◐' };
  }
  if (percentage >= 50) {
    return { level: 'Fair', color: 'text-yellow-600', icon: '◑' };
  }
  return { level: 'Poor', color: 'text-red-600', icon: '✕' };
};
