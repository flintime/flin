# Address Geocoding Implementation

This document describes the implementation of address geocoding using LocationIQ for the Flin vendor management system.

## Overview

When vendors enter their business address in the vendor dashboard, the system automatically converts the address to latitude and longitude coordinates using the LocationIQ geocoding API. This allows the platform to provide location-based services and helps customers find businesses.

## Implementation Details

### 1. LocationIQ Integration (`src/lib/locationiq.ts`)

- **Provider**: LocationIQ (https://locationiq.com/)
- **Functions**:
  - `geocodeAddress(address)`: Converts address string to coordinates
  - `reverseGeocode(lat, lng)`: Converts coordinates to address
  - `getAddressAutocomplete(query, limit)`: Gets address suggestions as user types
  - `validateAddress(address)`: Checks if address can be geocoded

### 2. Vendor Profile API (`src/app/api/vendor/profile/route.ts`)

- **Automatic Geocoding**: When a vendor updates their address, the system:
  1. Validates the address using LocationIQ
  2. Retrieves latitude and longitude coordinates
  3. Stores coordinates in the database alongside the address
  4. Provides user feedback about the geocoding process

- **Error Handling**:
  - Address not found: Returns user-friendly error
  - API rate limits: Handles gracefully with retry suggestions
  - Network errors: Falls back to saving address without coordinates

### 3. User Interface (`src/app/vendor/dashboard/page.tsx`)

- **Address Autocomplete**: Real-time address suggestions as vendors type
- **User Feedback**: Shows geocoding status messages
- **Coordinate Display**: Shows lat/lng when available
- **Help Text**: Informs users about automatic geocoding

### 4. AddressAutocomplete Component (`src/components/AddressAutocomplete.tsx`)

- **Real-time Suggestions**: Shows address suggestions as user types (300ms debounce)
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close
- **Click Outside**: Closes dropdown when clicking elsewhere
- **Loading States**: Shows spinner while fetching suggestions
- **Responsive Design**: Works on mobile and desktop

### 5. Database Schema

The `vendors` table includes:
- `address` (text): The business address
- `latitude` (double precision): Latitude coordinate
- `longitude` (double precision): Longitude coordinate

## Configuration

### Environment Variables

Add your LocationIQ API key to your `.env.local` file:

```
LOCATIONIQ_API_KEY=your_locationiq_api_key
```

To get your API key:
1. Sign up at https://locationiq.com/
2. Choose a plan (free tier available)
3. Copy your API key from the dashboard

### API Limits

LocationIQ free tier includes:
- 5,000 requests per day
- Rate limit: 2 requests per second

## Testing

### Debug Endpoint

Use the debug endpoint to test geocoding:

```
# Test geocoding
GET /api/vendor/debug?address=123 Main St, City, State

# Test autocomplete
GET /api/vendor/debug?autocomplete=Empire
GET /api/autocomplete?q=Empire&limit=5

# Test multiple addresses
POST /api/vendor/debug
```

### Manual Testing

1. Log into vendor dashboard
2. Edit business details
3. Start typing in the address field
4. Verify autocomplete suggestions appear
5. Select an address from the dropdown
6. Save changes
7. Verify coordinates appear

## Error Handling

The system handles various error scenarios:

1. **Invalid Address**: User-friendly message asking to verify address
2. **API Key Issues**: Generic "temporarily unavailable" message
3. **Rate Limits**: Asks user to try again later
4. **Network Errors**: Saves address without coordinates

## Future Enhancements

Potential improvements:
- ✅ Address autocomplete/suggestions (IMPLEMENTED)
- Map integration for address verification
- Bulk geocoding for existing vendors
- Fallback to other geocoding services
- Caching of geocoding results
- Country/region-specific autocomplete filtering
- Business-specific address suggestions

## Security Considerations

- API key is server-side only (not exposed to frontend)
- Input validation prevents malicious addresses
- Rate limiting protects against abuse
- Error messages don't expose internal details

## Monitoring

Monitor the following:
- LocationIQ API usage and costs
- Geocoding success/failure rates
- User experience with address entry
- Database storage of coordinates

## Support

For LocationIQ API issues:
- Documentation: https://docs.locationiq.com/
- Support: https://locationiq.com/support

For implementation questions, refer to the code comments in:
- `src/lib/locationiq.ts`
- `src/app/api/vendor/profile/route.ts`
