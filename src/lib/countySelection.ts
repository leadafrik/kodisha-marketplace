/**
 * County & Ward Selection Utilities
 * ==================================
 * Provides simplified interface for county and ward selection
 * Abstracts away the underlying data structure
 */

/**
 * Get all county names from the kenya counties data
 * This is a simplified wrapper that works with the existing data structure
 */
export function getAvailableCounties(): string[] {
  return [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Kajiado',
    'Machakos',
    'Kiambu',
    'Nyeri',
    'Muranga',
    'Makueni',
    'Laikipia',
    'Isiolo',
    'Meru',
    'Tharaka-Nithi',
    'Embu',
    'Kisii',
    'Nyamira',
    'Narok',
    'Bomet',
    'Kericho',
    'Kakamega',
    'Bungoma',
    'Trans Nzoia',
    'Uasin Gishu',
    'West Pokot',
    'Samburu',
    'Turkana',
    'Mandera',
    'Wajir',
    'Garissa',
    'Tana River',
    'Lamu',
    'Kilifi',
    'Kwale',
    'Siaya',
    'Homa Bay',
    'Migori',
    'Vihiga',
  ].sort();
}

/**
 * Get wards for a specific county
 * Returns array of ward names for the given county
 */
export function getWardsForCounty(county: string): string[] {
  const wardsMap: Record<string, string[]> = {
    Nairobi: [
      'Westlands', 'Karura', 'Kitisuru', 'Parklands', 'Nairobi West',
      'Kilimani', 'Karen', 'Langata', 'South C', 'Ngong', 'Kasarani',
      'Ruai', 'Matopeni', 'Kahawa', 'Mathare', 'Kariobangi', 'Dandora',
      'Embakasi', 'Mombasa Road', 'Industrial Area', 'CBD', 'Upper Hill',
      'Riverside', 'Muthaiga', 'Runda',
    ],
    Mombasa: [
      'Mombasa Island', 'Makadara', 'Majengo', 'Nyali', 'Kongowea',
      'Bamburi', 'Likoni', 'Shelly', 'Changamwe', 'Jomvu', 'Kisauni',
      'Mwakirunge',
    ],
    Kisumu: [
      'Kisumu Central', 'Kisumu East', 'Kisumu West', 'Nyakach',
      'Muhoroni', 'Ahero', 'Chemelil', 'Winam',
    ],
    Nakuru: [
      'Nakuru Town East', 'Nakuru Town West', 'Flamingo', 'Menengai',
      'Bahati', 'Biashara', 'London', 'Naivasha', 'Gilgil', 'Njoro', 'Elburgon',
    ],
    Eldoret: [
      'Eldoret East', 'Eldoret West', 'Eldoret North', 'Kapseret', 'Wareng', 'Iten',
    ],
    Kajiado: [
      'Kajiado Central', 'Kajiado North', 'Kajiado East', 'Kajiado West',
      'Loitoktok', 'Ngong',
    ],
    Machakos: [
      'Machakos Town', 'Mbooni', 'Kangundo', 'Matungulu', 'Mavindrani', 'Athi River',
    ],
    Kiambu: [
      'Thika Town', 'Murang\'a', 'Kihara', 'Juja', 'Ruiru', 'Karuri', 'Limuru',
      'Githunguri', 'Muguga', 'Kinangop',
    ],
    Nyeri: [
      'Nyeri Town', 'Tetu', 'Nyeri Central', 'Kieni', 'Mathira', 'Mwea',
    ],
    Muranga: [
      'Murang\'a Central', 'Murang\'a South', 'Murang\'a North', 'Kangema',
      'Mathioya', 'Kenol',
    ],
    Makueni: [
      'Makueni Town', 'Mbooni', 'Kilome', 'Kaiti', 'Kibwezi',
    ],
    Laikipia: [
      'Nanyuki', 'Nyahururu', 'Rumuruti', 'Ngobit',
    ],
    Isiolo: [
      'Isiolo Town', 'Isiolo East', 'Isiolo West', 'Kinna',
    ],
    Meru: [
      'Meru Town', 'Meru Central', 'Meru East', 'Meru North', 'Tharaka', 'Tigania',
    ],
    'Tharaka-Nithi': [
      'Tharaka', 'Chuka', 'Marimanti', 'Kathwene',
    ],
    Embu: [
      'Embu Town', 'Embu East', 'Embu North', 'Mbeere', 'Runyenjes',
    ],
    Kisii: [
      'Kisii Town', 'Kisii Central', 'Kisii North', 'Kisii East', 'Kisii West', 'Kericho',
    ],
    Nyamira: [
      'Nyamira Town', 'Nyamira North', 'Nyamira South', 'Manga',
    ],
    Narok: [
      'Narok Town', 'Narok East', 'Narok North', 'Narok South', 'Narok West', 'Transmara',
    ],
    Bomet: [
      'Bomet Town', 'Bomet Central', 'Bomet East', 'Bomet North', 'Sotik',
    ],
    Kericho: [
      'Kericho Town', 'Kericho Central', 'Kericho East', 'Kericho North',
    ],
    Kakamega: [
      'Kakamega Town', 'Kakamega Central', 'Kakamega East', 'Kakamega North', 'Kakamega West',
    ],
    Bungoma: [
      'Bungoma Town', 'Bungoma Central', 'Bungoma East', 'Bungoma North', 'Bungoma South',
    ],
    'Trans Nzoia': [
      'Trans Nzoia Central', 'Kitale', 'Kiminini',
    ],
    'Uasin Gishu': [
      'Uasin Gishu Central', 'Kapseret', 'Turbo',
    ],
    'West Pokot': [
      'Kapenguria', 'Sigor', 'Ortum',
    ],
    Samburu: [
      'Samburu Central', 'Samburu North', 'Samburu East',
    ],
    Turkana: [
      'Lodwar', 'Turkana Central', 'Turkana East', 'Turkana North', 'Turkana West',
    ],
    Mandera: [
      'Mandera Town', 'Mandera Central', 'Mandera East', 'Mandera North', 'Mandera South',
    ],
    Wajir: [
      'Wajir Town', 'Wajir Central', 'Wajir East', 'Wajir North', 'Wajir South',
    ],
    Garissa: [
      'Garissa Town', 'Garissa Central', 'Garissa East', 'Garissa North',
    ],
    'Tana River': [
      'Tana River Central', 'Tana North', 'Tana South',
    ],
    Lamu: [
      'Lamu Town', 'Lamu Central', 'Lamu North',
    ],
    Kilifi: [
      'Kilifi Town', 'Kilifi Central', 'Kilifi North', 'Kilifi South', 'Malindi',
    ],
    Kwale: [
      'Kwale Town', 'Kwale Central', 'Kwale North', 'Kwale South', 'Lunga Lunga',
    ],
    Siaya: [
      'Siaya Town', 'Siaya Central', 'Siaya North', 'Rarieda',
    ],
    'Homa Bay': [
      'Homa Bay Town', 'Homa Bay Central', 'Homa Bay North', 'Homa Bay South',
    ],
    Migori: [
      'Migori Town', 'Migori Central', 'Suna', 'Kuria',
    ],
    Vihiga: [
      'Vihiga Central', 'Vihiga North', 'Vihiga South',
    ],
  };

  return wardsMap[county] || [];
}
