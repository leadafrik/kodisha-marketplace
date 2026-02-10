import { MainCategory, StaysSubcategory, SpacesSubcategory, SportsSubcategory, EquipmentSubcategory } from '@/types';

export interface CategoryConfig {
  id: MainCategory;
  label: string;
  description: string;
  icon: string;
  subcategories: SubcategoryConfig[];
  requiredFields: string[];
  requiredImages: number;
  minPrice: number;
}

export interface SubcategoryConfig {
  id: string;
  label: string;
  description: string;
}

const staysConfig: CategoryConfig = {
  id: MainCategory.STAYS,
  label: 'Stays',
  description: 'Short-term and long-term accommodations',
  icon: 'Home',
  requiredFields: [
    'title',
    'description',
    'price_per_unit',
    'county_id',
    'location_details',
    'amenities',
    'rules',
    'images',
  ],
  requiredImages: 3,
  minPrice: 1000,
  subcategories: [
    {
      id: StaysSubcategory.SHORT_TERM,
      label: 'Short-Term Rental',
      description: 'Days to weeks',
    },
    {
      id: StaysSubcategory.LONG_TERM,
      label: 'Long-Term Rental',
      description: 'Months or more',
    },
    {
      id: StaysSubcategory.SERVICED_APARTMENTS,
      label: 'Serviced Apartments',
      description: 'With amenities and services',
    },
    {
      id: StaysSubcategory.VACATION_HOMES,
      label: 'Vacation Homes',
      description: 'Holiday properties',
    },
    {
      id: StaysSubcategory.BEDSITTERS,
      label: 'Bedsitters & Rooms',
      description: 'Single rooms and shared spaces',
    },
  ],
};

const spacesConfig: CategoryConfig = {
  id: MainCategory.SPACES,
  label: 'Spaces & Venues',
  description: 'Event venues, meeting rooms, parking, and more',
  icon: 'MapPin',
  requiredFields: [
    'title',
    'description',
    'price_per_unit',
    'county_id',
    'location_details',
    'amenities',
    'rules',
    'images',
  ],
  requiredImages: 2,
  minPrice: 500,
  subcategories: [
    {
      id: SpacesSubcategory.EVENT_VENUE,
      label: 'Event Venue',
      description: 'Conferences, weddings, parties',
    },
    {
      id: SpacesSubcategory.MEETING_ROOM,
      label: 'Meeting Room',
      description: 'Business meetings and workshops',
    },
    {
      id: SpacesSubcategory.STUDIO,
      label: 'Studio Space',
      description: 'Photography, art, and creative studios',
    },
    {
      id: SpacesSubcategory.COWORKING,
      label: 'Coworking Space',
      description: 'Professional workspaces',
    },
    {
      id: SpacesSubcategory.CLASSROOM,
      label: 'Classroom',
      description: 'Training and educational spaces',
    },
    {
      id: SpacesSubcategory.KITCHEN_SPACE,
      label: 'Commercial Kitchen',
      description: 'Food prep facilities',
    },
    {
      id: SpacesSubcategory.STORAGE,
      label: 'Storage Space',
      description: 'Warehousing and storage',
    },
    {
      id: SpacesSubcategory.PARKING,
      label: 'Parking Space',
      description: 'Secure parking locations',
    },
  ],
};

const sportsConfig: CategoryConfig = {
  id: MainCategory.SPORTS,
  label: 'Sports',
  description: 'Fields, courts, equipment, and training',
  icon: 'Trophy',
  requiredFields: [
    'title',
    'description',
    'price_per_unit',
    'county_id',
    'location_details',
    'rules',
    'images',
  ],
  requiredImages: 2,
  minPrice: 500,
  subcategories: [
    {
      id: SportsSubcategory.FIELD_COURT,
      label: 'Field & Court',
      description: 'Football fields, tennis courts, basketball courts',
    },
    {
      id: SportsSubcategory.EQUIPMENT,
      label: 'Sports Equipment',
      description: 'Balls, nets, kits, and gear',
    },
    {
      id: SportsSubcategory.GYM_EQUIPMENT,
      label: 'Gym Equipment',
      description: 'Weights, machines, and fitness gear',
    },
    {
      id: SportsSubcategory.TRAINER_SERVICE,
      label: 'Trainer Service',
      description: 'Professional sports coaching',
    },
  ],
};

const equipmentConfig: CategoryConfig = {
  id: MainCategory.EQUIPMENT,
  label: 'Equipment Hire',
  description: 'Cameras, audio, lighting, tools, and more',
  icon: 'Wrench',
  requiredFields: [
    'title',
    'description',
    'price_per_unit',
    'county_id',
    'location_details',
    'images',
  ],
  requiredImages: 2,
  minPrice: 100,
  subcategories: [
    {
      id: EquipmentSubcategory.CAMERA_LENS,
      label: 'Camera & Lenses',
      description: 'DSLRs, mirrorless, lenses, and accessories',
    },
    {
      id: EquipmentSubcategory.AUDIO_SYSTEM,
      label: 'Audio System',
      description: 'Speakers, microphones, mixers, PA systems',
    },
    {
      id: EquipmentSubcategory.LIGHTING,
      label: 'Lighting Equipment',
      description: 'Lights, stands, gels, and modifiers',
    },
    {
      id: EquipmentSubcategory.TENT_FURNITURE,
      label: 'Tents & Furniture',
      description: 'Tents, chairs, tables, decorations',
    },
    {
      id: EquipmentSubcategory.GENERATOR,
      label: 'Generators & Power',
      description: 'Power generators and backup systems',
    },
    {
      id: EquipmentSubcategory.PROJECTOR,
      label: 'Projectors & Screens',
      description: 'Projectors and projection screens',
    },
    {
      id: EquipmentSubcategory.DRONE,
      label: 'Drones',
      description: 'Aerial photography and videography',
    },
    {
      id: EquipmentSubcategory.VEHICLE,
      label: 'Vehicles',
      description: 'Cars, vans, bikes for hire',
    },
    {
      id: EquipmentSubcategory.TOOLS,
      label: 'Tools & Construction',
      description: 'Power tools, hand tools, construction equipment',
    },
    {
      id: EquipmentSubcategory.PARTY_DECOR,
      label: 'Party Decor',
      description: 'Decorations, balloons, and party supplies',
    },
  ],
};

export const categories: CategoryConfig[] = [
  staysConfig,
  spacesConfig,
  sportsConfig,
  equipmentConfig,
];

export function getCategoryConfig(categoryId: MainCategory): CategoryConfig | undefined {
  return categories.find(cat => cat.id === categoryId);
}

export function getSubcategoryConfig(
  categoryId: MainCategory,
  subcategoryId: string
): SubcategoryConfig | undefined {
  const category = getCategoryConfig(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

export function getCategoryLabel(categoryId: MainCategory): string {
  return getCategoryConfig(categoryId)?.label || 'Unknown';
}
