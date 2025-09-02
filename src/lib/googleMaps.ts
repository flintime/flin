// Google Maps Geocoding/Places integration

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  display_name: string;
  address_components: {
    street_number?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    country_code?: string;
  };
}

export interface AutocompleteResult {
  place_id: string;
  display_name: string;
  display_place: string;
  display_address: string;
  latitude: number;
  longitude: number;
  address_components: {
    name?: string;
    street_number?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

// Google Maps API response types
interface GoogleMapsGeometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

interface GoogleMapsResult {
  geometry: GoogleMapsGeometry;
  place_id: string;
  formatted_address: string;
  types: string[];
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface GoogleMapsResponse {
  status: string;
  results: GoogleMapsResult[];
  error_message?: string;
}

interface GooglePlacesDetailsResponse {
  status: string;
  result?: {
    formatted_address?: string;
    geometry?: GoogleMapsGeometry;
  };
  error_message?: string;
}

interface GooglePlacesAutocompleteResponse {
  status: string;
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
  error_message?: string;
}

export class LocationIQError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'LocationIQError';
  }
}

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new LocationIQError('Google Maps API key is not configured. Set GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
  }
  return apiKey;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  const apiKey = getApiKey();
  if (!address || address.trim().length === 0) throw new LocationIQError('Address is required for geocoding');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.trim())}&key=${apiKey}`;
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new LocationIQError(`Google Geocoding HTTP ${resp.status}`, resp.status);
    const data: GoogleMapsResponse = await resp.json();
    const status: string = data.status;
    if (status === 'ZERO_RESULTS') throw new LocationIQError('Address not found', 404, 'NOT_FOUND');
    if (status === 'OVER_QUERY_LIMIT') throw new LocationIQError('Google API rate limit exceeded', 429, 'RATE_LIMIT');
    if (status === 'REQUEST_DENIED') throw new LocationIQError('Invalid Google Maps API key', 401, 'UNAUTHORIZED');
    if (status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      throw new LocationIQError('No results found for the provided address', 404, 'NO_RESULTS');
    }
    const r = data.results[0];
    const loc = r.geometry?.location;
    const latitude = Number(loc?.lat);
    const longitude = Number(loc?.lng);
    if (isNaN(latitude) || isNaN(longitude)) throw new LocationIQError('Invalid coordinates returned from Google Geocoding');
    const comps: Record<string, string> = {};
    for (const c of r.address_components || []) {
      if (c.types.includes('street_number')) comps.street_number = c.long_name;
      if (c.types.includes('route')) comps.street = c.long_name;
      if (c.types.includes('locality')) comps.city = c.long_name;
      if (c.types.includes('postal_town') && !comps.city) comps.city = c.long_name;
      if (c.types.includes('administrative_area_level_1')) comps.state = c.short_name;
      if (c.types.includes('postal_code')) comps.postal_code = c.long_name;
      if (c.types.includes('country')) { comps.country = c.long_name; comps.country_code = c.short_name; }
    }
    return {
      latitude,
      longitude,
      display_name: r.formatted_address,
      address_components: comps as GeocodingResult['address_components']
    };
  } catch (error) {
    if (error instanceof LocationIQError) throw error;
    throw new LocationIQError(`Unexpected error during geocoding: ${error}`);
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
  const apiKey = getApiKey();
  if (isNaN(latitude) || isNaN(longitude)) throw new LocationIQError('Valid latitude and longitude are required');
  if (latitude < -90 || latitude > 90) throw new LocationIQError('Latitude must be between -90 and 90');
  if (longitude < -180 || longitude > 180) throw new LocationIQError('Longitude must be between -180 and 180');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new LocationIQError(`Google Geocoding HTTP ${resp.status}`, resp.status);
    const data: GoogleMapsResponse = await resp.json();
    const status: string = data.status;
    if (status === 'ZERO_RESULTS') throw new LocationIQError('Location not found', 404, 'NOT_FOUND');
    if (status === 'OVER_QUERY_LIMIT') throw new LocationIQError('Google API rate limit exceeded', 429, 'RATE_LIMIT');
    if (status === 'REQUEST_DENIED') throw new LocationIQError('Invalid Google Maps API key', 401, 'UNAUTHORIZED');
    if (status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      throw new LocationIQError('No results for given coordinates', 404, 'NO_RESULTS');
    }
    const r = data.results[0];
    const comps: Record<string, string> = {};
    for (const c of r.address_components || []) {
      if (c.types.includes('street_number')) comps.street_number = c.long_name;
      if (c.types.includes('route')) comps.street = c.long_name;
      if (c.types.includes('locality')) comps.city = c.long_name;
      if (c.types.includes('postal_town') && !comps.city) comps.city = c.long_name;
      if (c.types.includes('administrative_area_level_1')) comps.state = c.short_name;
      if (c.types.includes('postal_code')) comps.postal_code = c.long_name;
      if (c.types.includes('country')) { comps.country = c.long_name; comps.country_code = c.short_name; }
    }
    return {
      latitude,
      longitude,
      display_name: r.formatted_address,
      address_components: comps as GeocodingResult['address_components']
    };
  } catch (error) {
    if (error instanceof LocationIQError) throw error;
    throw new LocationIQError(`Unexpected error during reverse geocoding: ${error}`);
  }
}

export async function getAddressAutocomplete(query: string, limit: number = 5): Promise<AutocompleteResult[]> {
  const apiKey = getApiKey();
  if (!query || query.trim().length < 2) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query.trim())}&key=${apiKey}&types=geocode&language=en`;
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) return [];
    const data: GooglePlacesAutocompleteResponse = await resp.json();
    if (data.status !== 'OK' || !Array.isArray(data.predictions)) return [];
    const items = data.predictions.slice(0, Math.min(limit, 10));
    // For autocomplete, we need to get place details for coordinates
    const results: AutocompleteResult[] = [];
    for (const item of items) {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=formatted_address,geometry&key=${apiKey}`;
        const detailsResp = await fetch(detailsUrl);
        if (detailsResp.ok) {
          const details: GooglePlacesDetailsResponse = await detailsResp.json();
          if (details.status === 'OK' && details.result) {
            const loc = details.result.geometry?.location;
            const lat = Number(loc?.lat);
            const lng = Number(loc?.lng);
            results.push({
              place_id: item.place_id,
              display_name: item.description,
              display_place: item.structured_formatting?.main_text || item.description,
              display_address: item.structured_formatting?.secondary_text || '',
              latitude: isNaN(lat) ? 0 : lat,
              longitude: isNaN(lng) ? 0 : lng,
              address_components: {},
            });
          }
        }
      } catch (error) {
        console.warn('Error fetching place details:', error);
      }
    }
    return results;
  } catch (error) {
    console.warn('Autocomplete error:', error);
    return [];
  }
}


