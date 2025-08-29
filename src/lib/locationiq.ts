// LocationIQ API integration for geocoding
// Based on https://docs.locationiq.com/docs/introduction
//
// Required environment variables:
// LOCATIONIQ_API_KEY - Your LocationIQ API key (get one at https://locationiq.com/)

interface LocationIQGeocodingResponse {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [string, string, string, string];
}

interface GeocodingResult {
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

interface LocationIQAutocompleteResponse {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: {
    name?: string;
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
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

/**
 * Geocode an address using LocationIQ API
 * Converts an address string to latitude and longitude coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  
  if (!apiKey) {
    throw new LocationIQError('LocationIQ API key is not configured. Please set LOCATIONIQ_API_KEY environment variable.');
  }

  if (!address || address.trim().length === 0) {
    throw new LocationIQError('Address is required for geocoding');
  }

  const encodedAddress = encodeURIComponent(address.trim());
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodedAddress}&format=json&limit=1&addressdetails=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Flin-Website/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new LocationIQError('Invalid LocationIQ API key', 401, 'UNAUTHORIZED');
      } else if (response.status === 429) {
        throw new LocationIQError('LocationIQ API rate limit exceeded', 429, 'RATE_LIMIT');
      } else if (response.status === 404) {
        throw new LocationIQError('Address not found', 404, 'NOT_FOUND');
      } else {
        throw new LocationIQError(`LocationIQ API error: ${response.status}`, response.status);
      }
    }

    const data: LocationIQGeocodingResponse[] = await response.json();

    if (!data || data.length === 0) {
      throw new LocationIQError('No results found for the provided address', 404, 'NO_RESULTS');
    }

    const result = data[0];
    
    // Parse coordinates
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new LocationIQError('Invalid coordinates returned from LocationIQ');
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      throw new LocationIQError('Invalid latitude value');
    }
    if (longitude < -180 || longitude > 180) {
      throw new LocationIQError('Invalid longitude value');
    }

    return {
      latitude,
      longitude,
      display_name: result.display_name,
      address_components: {
        street_number: result.address.house_number,
        street: result.address.road,
        city: result.address.city || result.address.town || result.address.village,
        state: result.address.state,
        postal_code: result.address.postcode,
        country: result.address.country,
        country_code: result.address.country_code
      }
    };
  } catch (error) {
    if (error instanceof LocationIQError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new LocationIQError('Network error while connecting to LocationIQ API');
    }
    
    throw new LocationIQError(`Unexpected error during geocoding: ${error}`);
  }
}

/**
 * Reverse geocode coordinates using LocationIQ API
 * Converts latitude and longitude to an address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  
  if (!apiKey) {
    throw new LocationIQError('LocationIQ API key is not configured. Please set LOCATIONIQ_API_KEY environment variable.');
  }

  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new LocationIQError('Valid latitude and longitude are required');
  }
  if (latitude < -90 || latitude > 90) {
    throw new LocationIQError('Latitude must be between -90 and 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new LocationIQError('Longitude must be between -180 and 180');
  }

  const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Flin-Website/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new LocationIQError('Invalid LocationIQ API key', 401, 'UNAUTHORIZED');
      } else if (response.status === 429) {
        throw new LocationIQError('LocationIQ API rate limit exceeded', 429, 'RATE_LIMIT');
      } else if (response.status === 404) {
        throw new LocationIQError('Location not found', 404, 'NOT_FOUND');
      } else {
        throw new LocationIQError(`LocationIQ API error: ${response.status}`, response.status);
      }
    }

    const result: LocationIQGeocodingResponse = await response.json();

    return {
      latitude,
      longitude,
      display_name: result.display_name,
      address_components: {
        street_number: result.address.house_number,
        street: result.address.road,
        city: result.address.city || result.address.town || result.address.village,
        state: result.address.state,
        postal_code: result.address.postcode,
        country: result.address.country,
        country_code: result.address.country_code
      }
    };
  } catch (error) {
    if (error instanceof LocationIQError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new LocationIQError('Network error while connecting to LocationIQ API');
    }
    
    throw new LocationIQError(`Unexpected error during reverse geocoding: ${error}`);
  }
}

/**
 * Get autocomplete suggestions for an address as the user types
 * Based on LocationIQ Autocomplete API: https://docs.locationiq.com/docs/autocomplete
 */
export async function getAddressAutocomplete(query: string, limit: number = 5): Promise<AutocompleteResult[]> {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  
  if (!apiKey) {
    throw new LocationIQError('LocationIQ API key is not configured. Please set LOCATIONIQ_API_KEY environment variable.');
  }

  if (!query || query.trim().length < 2) {
    return []; // Don't search for very short queries
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodedQuery}&limit=${Math.min(limit, 10)}&normalizecity=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Flin-Website/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new LocationIQError('Invalid LocationIQ API key', 401, 'UNAUTHORIZED');
      } else if (response.status === 429) {
        throw new LocationIQError('LocationIQ API rate limit exceeded', 429, 'RATE_LIMIT');
      } else {
        throw new LocationIQError(`LocationIQ API error: ${response.status}`, response.status);
      }
    }

    const data: LocationIQAutocompleteResponse[] = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => {
      const latitude = parseFloat(item.lat);
      const longitude = parseFloat(item.lon);

      return {
        place_id: item.place_id,
        display_name: item.display_name,
        display_place: item.display_place,
        display_address: item.display_address,
        latitude: isNaN(latitude) ? 0 : latitude,
        longitude: isNaN(longitude) ? 0 : longitude,
        address_components: {
          name: item.address.name,
          street_number: item.address.house_number,
          street: item.address.road,
          city: item.address.city,
          state: item.address.state,
          postal_code: item.address.postcode,
          country: item.address.country
        }
      };
    });
  } catch (error) {
    if (error instanceof LocationIQError) {
      throw error;
    }
    
    // Handle network errors gracefully for autocomplete
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error during autocomplete, returning empty results');
      return [];
    }
    
    console.warn('Autocomplete error:', error);
    return [];
  }
}

/**
 * Validate if an address can be geocoded (useful for frontend validation)
 */
export async function validateAddress(address: string): Promise<boolean> {
  try {
    await geocodeAddress(address);
    return true;
  } catch {
    return false;
  }
}
