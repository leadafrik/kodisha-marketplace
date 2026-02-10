'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainCategory, ListingStatus } from '@/types/index';
import { ChevronRight, ChevronLeft, Check, Image as ImageIcon, MapPin, Tag, DollarSign } from 'lucide-react';
import { getAvailableCounties, getWardsForCounty } from '@/lib/countySelection';

type Step = 'category' | 'location' | 'details' | 'pricing' | 'images' | 'review';

const categories = Object.values(MainCategory);

const staySubcategories = ['Studio', 'Apartment', 'House', 'Villa', 'Townhouse'];
const spaceSubcategories = ['Conference Room', 'Meeting Room', 'Co-working Space', 'Warehouse', 'Showroom', 'Kitchen', 'Event Space'];
const sportSubcategories = ['Football Field', 'Tennis Court', 'Basketball Court', 'Gym'];
const equipmentSubcategories = ['Camera', 'Video Equipment', 'Audio Equipment', 'Lighting', 'Tools', 'Sports Equipment'];

const stepLabels: Record<Step, string> = {
  category: 'Category',
  location: 'Location',
  details: 'Details',
  pricing: 'Pricing',
  images: 'Photos',
  review: 'Review',
};

interface FormData {
  category: MainCategory | '';
  subcategory: string;
  title: string;
  description: string;
  county: string;
  ward: string;
  price: string;
  pricePeriod: 'hour' | 'day' | 'night' | 'week' | 'month';
  amenities: string[];
  rules: string[];
  images: File[];
}

const ListingCreatePage: FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    county: '',
    ward: '',
    price: '',
    pricePeriod: 'night',
    amenities: [],
    rules: [],
    images: [],
  });

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const getSubcategories = (category: MainCategory) => {
    switch (category) {
      case MainCategory.STAYS:
        return staySubcategories;
      case MainCategory.SPACES:
        return spaceSubcategories;
      case MainCategory.SPORTS:
        return sportSubcategories;
      case MainCategory.EQUIPMENT:
        return equipmentSubcategories;
      default:
        return [];
    }
  };

  const handleNextStep = () => {
    const steps: Step[] = ['category', 'location', 'details', 'pricing', 'images', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps: Step[] = ['category', 'location', 'details', 'pricing', 'images', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.category || !formData.subcategory) {
        throw new Error('Please select a category');
      }
      if (!formData.title || !formData.description) {
        throw new Error('Please fill in title and description');
      }
      if (!formData.county) {
        throw new Error('Please select a county');
      }
      if (!formData.price) {
        throw new Error('Please set a price');
      }

      // TODO: When Supabase is configured, submit to API
      // const response = await fetch('/api/listings/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      console.log('Creating listing with data:', formData);

      // For now, just show success and redirect
      alert('Listing created successfully! (Demo mode - not saved to database yet)');
      router.push('/host/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
      setIsLoading(false);
    }
  };

  // Step 1: Category Selection
  if (currentStep === 'category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Property</h1>
            <p className="text-gray-600 mb-8">Step 1 of 6: Select Category</p>

            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setFormData({ ...formData, category: category as MainCategory, subcategory: '' });
                    handleNextStep();
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.category === category
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {category === MainCategory.STAYS && '🏠'}
                    {category === MainCategory.SPACES && '🏢'}
                    {category === MainCategory.SPORTS && '⚽'}
                    {category === MainCategory.EQUIPMENT && '📷'}
                  </div>
                  <p className="font-semibold text-gray-900">{category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Subcategory & Location
  if (currentStep === 'location') {
    const subcategories = getSubcategories(formData.category as MainCategory);
    const counties = getAvailableCounties();
    const wards = formData.county ? getWardsForCounty(formData.county) : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Listing</h1>
              <p className="text-gray-600">Step 2 of 6: Location</p>
            </div>

            <div className="space-y-6">
              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* County - Now Dynamic from Kenya data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline mr-2" size={18} />
                  County
                </label>
                <select
                  value={formData.county}
                  onChange={(e) => {
                    // Reset ward when county changes for better UX
                    setFormData({ ...formData, county: e.target.value, ward: '' });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-400"
                >
                  <option value="">Select a county...</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward - Smart Cascading Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline mr-2" size={18} />
                  Ward / Area
                </label>
                {wards.length > 0 ? (
                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-400"
                  >
                    <option value="">Select a ward...</option>
                    {wards.map((ward) => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Please select a county first"
                    disabled={!formData.county}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!formData.subcategory || !formData.county || !formData.ward}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Details
  if (currentStep === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Listing</h1>
              <p className="text-gray-600">Step 3 of 6: Details</p>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Cozy Studio in Westlands"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your property in detail..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Min 50 characters</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!formData.title || formData.description.length < 50}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Pricing
  if (currentStep === 'pricing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Listing</h1>
              <p className="text-gray-600">Step 4 of 6: Pricing</p>
            </div>

            <div className="space-y-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline mr-2" size={18} />
                  Price
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.pricePeriod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePeriod: e.target.value as 'hour' | 'day' | 'night' | 'week' | 'month',
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="night">Per Night</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!formData.price}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Images
  if (currentStep === 'images') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Listing</h1>
              <p className="text-gray-600">Step 5 of 6: Photos</p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-2">Drag and drop images here or click to select</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({ ...formData, images: Array.from(e.target.files) });
                    }
                  }}
                  className="hidden"
                  id="images"
                />
                <label
                  htmlFor="images"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Select Images
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${idx}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Review & Submit
  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Review Listing</h1>
              <p className="text-gray-600">Step 6 of 6: Review</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subcategory</p>
                  <p className="font-semibold text-gray-900">{formData.subcategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">County</p>
                  <p className="font-semibold text-gray-900">{formData.county}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ward</p>
                  <p className="font-semibold text-gray-900">{formData.ward}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-semibold text-gray-900">{formData.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-700">{formData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-gray-900">
                    KES {formData.price} per {formData.pricePeriod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <p className="font-semibold text-gray-900">{formData.images.length} uploaded</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                <Check size={18} />
                {isLoading ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ListingCreatePage;
