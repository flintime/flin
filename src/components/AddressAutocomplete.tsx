'use client';

import { useState, useEffect, useRef } from 'react';

interface AutocompleteResult {
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

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelect?: (result: AutocompleteResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  rows?: number;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter your business address",
  className = "",
  disabled = false,
  name = "address",
  rows = 3
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function - uses our API endpoint instead of direct import
  const searchAddresses = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=5`);
      
      if (!response.ok) {
        // Handle 404 (no results) gracefully - just show no suggestions
        if (response.status === 404) {
          setSuggestions([]);
          setShowDropdown(false);
          setIsLoading(false);
          return;
        }
        // For other errors, log but don't break the UI
        console.warn(`Autocomplete API error: ${response.status}`);
        setSuggestions([]);
        setShowDropdown(false);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
        setShowDropdown(data.suggestions.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      // Only log network errors, don't break the UI
      console.warn('Autocomplete network error:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous debounce
    if (debounceRef.current) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300); // 300ms debounce
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AutocompleteResult) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(suggestion);
    }
    
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${className}`}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.place_id}-${index}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="font-medium text-gray-900 text-sm">
                  {suggestion.display_place}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {suggestion.display_address}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
