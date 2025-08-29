'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Vendor, Offer, OfferFormData } from '@/lib/supabase';
import { BUSINESS_TYPES } from '@/lib/supabase';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface VendorSession {
  user: {
    id: string;
    email: string;
  };
  vendor: Vendor;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [session, setSession] = useState<VendorSession | null>(null);
  const router = useRouter();

  // Helper function to refresh token if needed
  const refreshTokenIfNeeded = async () => {
    if (!session) return null;

    const now = Math.floor(Date.now() / 1000);
    const tokenExpiry = session.session.expires_at;

    // If token expires in less than 5 minutes, refresh it
    if (tokenExpiry - now < 300) {
      try {
        const response = await fetch('/api/vendor/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: session.session.refresh_token,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const updatedSession = {
            ...session,
            session: {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_at: data.expires_at,
            },
          };
          setSession(updatedSession);
          localStorage.setItem('vendor_session', JSON.stringify(updatedSession));
          return data.access_token;
        } else {
          // Refresh failed, redirect to login
          localStorage.removeItem('vendor_session');
          router.push('/vendor/login');
          return null;
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        localStorage.removeItem('vendor_session');
        router.push('/vendor/login');
        return null;
      }
    }

    return session.session.access_token;
  };

  // Form data for editing
  const [formData, setFormData] = useState<Partial<Vendor>>({});
  
  // Image upload states
  const [coverImages, setCoverImages] = useState<Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    vendor_id: string;
    sort_order: number;
    created_at: string;
  }>>([]);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Tags management
  const [tagInput, setTagInput] = useState('');

  // Offer management
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerFormData, setOfferFormData] = useState<OfferFormData>({
    title: '',
    start_date: '',
    end_date: '',
    discount_type: 'percentage',
    discount_value: '',
    terms_conditions: ''
  });
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const sessionData = localStorage.getItem('vendor_session');
    if (!sessionData) {
      router.push('/vendor/login');
      return;
    }

    try {
      const parsedSession: VendorSession = JSON.parse(sessionData);
      setSession(parsedSession);
      loadVendorProfile(parsedSession.session.access_token);
    } catch (error) {
      console.error('Invalid session data:', error);
      localStorage.removeItem('vendor_session');
      router.push('/vendor/login');
    }
  }, [router]);

  // Load cover images when session is ready
  useEffect(() => {
    if (session) {
      loadCoverImages();
    }
  }, [session]);

  const loadVendorProfile = async (token: string) => {
    try {
      const response = await fetch('/api/vendor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setVendor(data.data);
        setFormData(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load profile' });
        if (response.status === 401) {
          localStorage.removeItem('vendor_session');
          router.push('/vendor/login');
        }
      }
    } catch (error) {
      console.error('Profile load error:', error);
      setMessage({ type: 'error', text: 'Network error loading profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Only send the fields that are actually editable
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        website: formData.website,
        about: formData.about,
        vendor_type: formData.vendor_type,
        tags: formData.tags,
      };

      console.log('Sending update data:', updateData);

      // Show geocoding message if address is being updated
      const addressChanged = updateData.address !== vendor?.address;
      if (addressChanged && updateData.address && updateData.address.trim().length > 0) {
        setMessage({ type: 'success', text: 'Validating address and getting coordinates...' });
      }

      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const response = await fetch('/api/vendor/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setVendor(data.data);
        setIsEditing(false);
        
        // Show success message with geocoding info if coordinates were updated
        const hasCoordinates = data.data.latitude !== 0 && data.data.longitude !== 0;
        if (addressChanged && hasCoordinates) {
          setMessage({ 
            type: 'success', 
            text: 'Profile updated successfully! Address has been geocoded and your location is now available to customers.' 
          });
        } else {
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        
        // If there are additional details about the error, we can show them
        if (data.details) {
          console.error('Update error details:', data.details);
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Network error updating profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(vendor || {});
    setIsEditing(false);
    setMessage(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('vendor_session');
    router.push('/vendor/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address changes from the autocomplete component
  const handleAddressChange = (address: string) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
  };

  // Handle address selection from autocomplete dropdown
  const handleAddressSelect = (result: { display_name: string; display_place: string }) => {
    setFormData(prev => ({
      ...prev,
      address: result.display_name
    }));
    
    // Show a brief success message about address selection
    setMessage({ 
      type: 'success', 
      text: `Address selected: ${result.display_place}. Coordinates will be saved when you update your profile.` 
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    } else if (tagInput.trim() && !formData.tags) {
      setFormData(prev => ({
        ...prev,
        tags: [tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Handle tag input keypress
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle offer form input changes
  const handleOfferFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOfferFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle offer creation
  const handleCreateOffer = async () => {
    if (!session) return;

    setIsCreatingOffer(true);
    setMessage(null);

    try {
      // Validate form data
      if (!offerFormData.title || !offerFormData.start_date || !offerFormData.end_date || !offerFormData.discount_value) {
        setMessage({ type: 'error', text: 'Please fill in all required fields.' });
        return;
      }

      const discountValue = parseFloat(offerFormData.discount_value as string);
      if (isNaN(discountValue) || discountValue <= 0) {
        setMessage({ type: 'error', text: 'Please enter a valid discount value.' });
        return;
      }

      if (offerFormData.discount_type === 'percentage' && discountValue > 100) {
        setMessage({ type: 'error', text: 'Percentage discount cannot exceed 100%.' });
        return;
      }

      // Validate dates
      const startDate = new Date(offerFormData.start_date);
      const endDate = new Date(offerFormData.end_date);
      
      if (endDate <= startDate) {
        setMessage({ type: 'error', text: 'End date must be after start date.' });
        return;
      }

      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const offerData = {
        ...offerFormData,
        discount_value: discountValue,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      };

      const response = await fetch('/api/vendor/offers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Offer created successfully!' });
        setShowOfferForm(false);
        setOfferFormData({
          title: '',
          start_date: '',
          end_date: '',
          discount_type: 'percentage',
          discount_value: '',
          terms_conditions: ''
        });
        // Reload offers
        loadOffers();
      } else {
        if (response.status === 401) {
          setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
          localStorage.removeItem('vendor_session');
          router.push('/vendor/login');
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to create offer' });
        }
      }
    } catch (error) {
      console.error('Offer creation error:', error);
      setMessage({ type: 'error', text: 'Network error creating offer' });
    } finally {
      setIsCreatingOffer(false);
    }
  };

  // Handle delete offer confirmation
  const handleDeleteOffer = (offerId: string) => {
    setOfferToDelete(offerId);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete offer
  const confirmDeleteOffer = async () => {
    if (!offerToDelete || !session) return;

    setDeletingOfferId(offerToDelete);
    setMessage(null);

    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const response = await fetch('/api/vendor/offers', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offerId: offerToDelete }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Offer deleted successfully!' });
        // Remove the deleted offer from the list
        setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerToDelete));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete offer.' });
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      setMessage({ type: 'error', text: 'An error occurred while deleting the offer.' });
    } finally {
      setDeletingOfferId(null);
      setShowDeleteConfirmation(false);
      setOfferToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setOfferToDelete(null);
  };

  // Load offers
  const loadOffers = async () => {
    if (!session) return;

    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) return;

      const response = await fetch('/api/vendor/offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOffers(data.data || []);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('vendor_session');
          router.push('/vendor/login');
        } else {
          console.error('Failed to load offers:', data.error);
        }
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  // Load offers when session is ready
  useEffect(() => {
    if (session) {
      loadOffers();
    }
  }, [session]);

  // Load cover images
  const loadCoverImages = async () => {
    if (!session) return;

    setIsLoadingImages(true);
    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) return;

      const response = await fetch('/api/vendor/cover-images', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCoverImages(data.data || []);
      } else {
        console.error('Failed to load cover images:', data.error);
      }
    } catch (error) {
      console.error('Error loading cover images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    if (!session) return;

    setIsUploadingLogo(true);
    setMessage(null);

    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/vendor/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setVendor(data.data.vendor);
        setFormData(data.data.vendor);
        setMessage({ type: 'success', text: 'Logo updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload logo' });
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setMessage({ type: 'error', text: 'Network error uploading logo' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (file: File) => {
    if (!session) return;

    setIsUploadingCover(true);
    setMessage(null);

    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const response = await fetch('/api/vendor/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await loadCoverImages(); // Reload cover images
        setMessage({ type: 'success', text: 'Cover image uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload cover image' });
      }
    } catch (error) {
      console.error('Cover image upload error:', error);
      setMessage({ type: 'error', text: 'Network error uploading cover image' });
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Handle cover image delete
  const handleDeleteCoverImage = async (imageId: string) => {
    if (!session) return;

    try {
      // Get fresh token
      const token = await refreshTokenIfNeeded();
      if (!token) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        return;
      }

      const response = await fetch('/api/vendor/cover-images', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadCoverImages(); // Reload cover images
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete image' });
      }
    } catch (error) {
      console.error('Delete image error:', error);
      setMessage({ type: 'error', text: 'Network error deleting image' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">We couldn&apos;t load your vendor profile.</p>
          <button
            onClick={() => router.push('/vendor/login')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Using centralized business types from supabase.ts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/Flinlogo.png"
                alt="Flin"
                width={64}
                height={64}
                className="mr-3"
              />
            </div>
            
            {/* Centered Dashboard Title */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-xl font-semibold text-gray-900">Vendor Dashboard</h1>
            </div>
            
            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:block text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Vendor PIN Display */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8 mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Your Vendor PIN</h2>
          <div className="text-4xl sm:text-6xl font-bold text-black tracking-wider mb-4">
            {vendor.vendor_pin || '------'}
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Use this PIN for business operations and transactions
          </p>
        </div>

        {/* Offers Management */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Special Offers</h2>
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {showOfferForm ? 'Cancel' : 'Create New Offer'}
            </button>
          </div>

          {/* Offer Creation Form */}
          {showOfferForm && (
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Offer</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Offer Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={offerFormData.title}
                    onChange={handleOfferFormChange}
                    placeholder="e.g., 20% Off All Items"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    name="discount_type"
                    value={offerFormData.discount_type}
                    onChange={handleOfferFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discount_value"
                    value={offerFormData.discount_value}
                    onChange={handleOfferFormChange}
                    placeholder={offerFormData.discount_type === 'percentage' ? '20' : '10.00'}
                    min="0"
                    max={offerFormData.discount_type === 'percentage' ? '100' : undefined}
                    step={offerFormData.discount_type === 'percentage' ? '1' : '0.01'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={offerFormData.start_date}
                    onChange={handleOfferFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={offerFormData.end_date}
                    onChange={handleOfferFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  name="terms_conditions"
                  value={offerFormData.terms_conditions}
                  onChange={handleOfferFormChange}
                  rows={3}
                  placeholder="Enter any terms and conditions for this offer..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCreateOffer}
                  disabled={isCreatingOffer}
                  className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOffer ? 'Creating...' : 'Create Offer'}
                </button>
                <button
                  onClick={() => setShowOfferForm(false)}
                  disabled={isCreatingOffer}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Offers List */}
          <div className="space-y-4">
            {offers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No offers created yet.</p>
                <p className="text-sm">Create your first offer to attract customers!</p>
              </div>
            ) : (
              offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{offer.title}</h4>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        offer.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : offer.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.status}
                      </span>
                      <button
                        onClick={() => offer.id && handleDeleteOffer(offer.id)}
                        disabled={deletingOfferId === offer.id}
                        className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete offer"
                      >
                        {deletingOfferId === offer.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Discount:</strong> {offer.discount_value}
                      {offer.discount_type === 'percentage' ? '%' : '$'} off
                    </p>
                    <p>
                      <strong>Valid:</strong> {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
                    </p>
                    {offer.terms_conditions && (
                      <p>
                        <strong>Terms:</strong> {offer.terms_conditions}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Business Details</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Edit Details
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{vendor.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{vendor.email || 'Not provided'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{vendor.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {vendor.website ? (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {vendor.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              {isEditing ? (
                <select
                  name="vendor_type"
                  value={formData.vendor_type || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 py-2 capitalize">
                  {vendor.vendor_type || 'Not specified'}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag (e.g., coffee, fast food, delivery)"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Add tags to help customers find your business (e.g., coffee, fast food, delivery, organic)
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {vendor.tags && vendor.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vendor.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No tags added</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <div className="space-y-2">
                <AddressAutocomplete
                  value={formData.address || ''}
                  onChange={handleAddressChange}
                  onSelect={handleAddressSelect}
                  placeholder="Enter your business address (suggestions will appear as you type)"
                  name="address"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  <span className="font-medium">💡 Tip:</span> Start typing your address and select from the suggestions for accurate geocoding. We&apos;ll automatically get location coordinates when you save.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-900 py-2">
                  {vendor.address || 'Not provided'}
                </p>
                {vendor.address && vendor.latitude !== 0 && vendor.longitude !== 0 && (
                  <p className="text-sm text-gray-500">
                    📍 Coordinates: {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* About */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Your Business
            </label>
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about || ''}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Tell customers about your business..."
              />
            ) : (
              <p className="text-gray-900 py-2">
                {vendor.about || 'No description provided'}
              </p>
            )}
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Business Logo</h2>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Current Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {vendor?.logo_url && vendor.logo_url !== '/placeholder-logo.png' ? (
                  <Image
                    src={vendor.logo_url}
                    alt="Business Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">No Logo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                  className="hidden"
                  disabled={isUploadingLogo}
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors ${
                    isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingLogo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload New Logo'
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Images Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cover Images</h2>
            <span className="text-sm text-gray-500">
              {coverImages.length}/3 images
            </span>
          </div>

          {/* Cover Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {coverImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt={`Cover image ${index + 1}`}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                <button
                  onClick={() => handleDeleteCoverImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add Image Slot */}
            {coverImages.length < 3 && (
              <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverImageUpload(file);
                  }}
                  className="hidden"
                  disabled={isUploadingCover}
                />
                <label
                  htmlFor="cover-upload"
                  className={`cursor-pointer flex flex-col items-center text-gray-500 hover:text-gray-700 ${
                    isUploadingCover ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingCover ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm">Add Image</span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {isLoadingImages && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading images...</p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Upload up to 3 cover images to showcase your business. The first image will be set as primary.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Offer
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={deletingOfferId !== null}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOffer}
                disabled={deletingOfferId !== null}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingOfferId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
