'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import StatCard from '@/components/admin/StatCard'
import { vendorSchema } from '@/lib/validation/schemas'
import { logger } from '@/lib/error-logger'
import { validateFile } from '@/lib/file-validation'

type VendorItem = {
  id: string
  name: string
  website: string | null
  vendor_category_key: string | null
  tags: string[] | null
  about: string | null
  logo_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
}

type LocalOfferItem = {
  id: string
  vendor_id: string
  title: string
  start_date: string | null
  end_date: string | null
  terms_conditions: string | null
  featured: boolean
  created_at: string
}

type VendorImageItem = {
  id: string
  vendor_id: string
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export default function AdminLocalOffersBuilder() {
  async function validateCoverImageClient(file: File): Promise<{ valid: boolean; error?: string }> {
    return new Promise(resolve => {
      const url = URL.createObjectURL(file)
      const img = new window.Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        const width = img.naturalWidth
        const height = img.naturalHeight

        const minWidth = 1120
        const minHeight = 640
        const targetAspect = 7 / 4
        const tolerance = 0.05

        if (width < minWidth || height < minHeight) {
          resolve({
            valid: false,
            error: `Image is too small. Minimum size is ${minWidth}x${minHeight}px.`,
          })
          return
        }

        const aspect = width / height
        const diff = Math.abs(aspect - targetAspect)
        if (diff > tolerance) {
          resolve({
            valid: false,
            error:
              'Image must be a landscape cover in approximately 7:4 (≈16:9) aspect ratio and at least 1120x640px.',
          })
          return
        }

        resolve({ valid: true })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({
          valid: false,
          error: 'Unable to read image dimensions. Please upload a standard JPEG, PNG, or WebP file.',
        })
      }
      img.src = url
    })
  }

  function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift()
    }
    return undefined
  }
  const [vendors, setVendors] = useState<VendorItem[]>([])
  const [loadingVendors, setLoadingVendors] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Derived map reserved for future use (e.g., quick lookups)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vendorIdToName = useMemo(() => Object.fromEntries(vendors.map(v => [v.id, v.name])), [vendors])
  const [categories, setCategories] = useState<Array<{ key: string; label: string }>>([])

  // Vendor form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    website: '',
    address: '',
    phone: '',
    email: '',
    about: '',
    tags: '',
    category: '',
    latitude: '',
    longitude: '',
  })
  const [vendorErrors, setVendorErrors] = useState<{
    name?: string
    website?: string
    address?: string
    phone?: string
    email?: string
    about?: string
    tags?: string
    category?: string
    latitude?: string
    longitude?: string
  }>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFiles, setCoverFiles] = useState<File[]>([])
  const [vendorMsg, setVendorMsg] = useState<string | null>(null)
  const [submittingVendor, setSubmittingVendor] = useState<boolean>(false)
  const vendorDisabled = useMemo(() => vendorForm.name.trim().length === 0 || submittingVendor, [vendorForm.name, submittingVendor])

  // List toolbar & UX state
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortKey, setSortKey] = useState<'created_at' | 'name'>('created_at')
  const [sortDirDesc, setSortDirDesc] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 20
  const [totalVendors, setTotalVendors] = useState(0)

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: number; type: 'success' | 'error'; text: string }>>([])
  function pushToast(type: 'success' | 'error', text: string) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, text }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // total pages derived
  const totalPages = Math.max(1, Math.ceil(totalVendors / pageSize))

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    vendor_id: '',
    title: '',
    start_date: '',
    end_date: '',
    terms_conditions: '',
    featured: false,
  })
  const [offerMsg, setOfferMsg] = useState<string | null>(null)
  const [submittingOffer, setSubmittingOffer] = useState(false)
  const offerDisabled = useMemo(
    () => !offerForm.vendor_id || !offerForm.title.trim() || !offerForm.start_date || submittingOffer,
    [offerForm.vendor_id, offerForm.title, offerForm.start_date, submittingOffer]
  )

  // Listings (read/write)
  const [offers, setOffers] = useState<LocalOfferItem[]>([])
  const [loadingOffers, setLoadingOffers] = useState<boolean>(true)

  // Cover images for vendors in the current page
  const [vendorCoverImagesMap, setVendorCoverImagesMap] = useState<Record<string, VendorImageItem[]>>({})
  const [loadingVendorCoverImages, setLoadingVendorCoverImages] = useState<boolean>(false)

  // Right-side edit drawer & confirm modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerKind, setDrawerKind] = useState<null | 'vendor' | 'offer'>(null)
  const [drawerVendorId, setDrawerVendorId] = useState<string | null>(null)
  const [drawerOfferId, setDrawerOfferId] = useState<string | null>(null)
  const [drawerVendorDraft, setDrawerVendorDraft] = useState<Partial<VendorItem> & { tagsCsv?: string; latitude?: number | null; longitude?: number | null; newLogoFile?: File | null; removeLogo?: boolean; newCoverFiles?: File[] }>({})
  const [vendorImages, setVendorImages] = useState<VendorImageItem[]>([])
  const [loadingVendorImages, setLoadingVendorImages] = useState<boolean>(false)
  const [drawerOfferDraft, setDrawerOfferDraft] = useState<Partial<LocalOfferItem>>({})
  const [savingDrawer, setSavingDrawer] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<null | (() => void | Promise<void>)>(null)

  // Image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Address autocomplete state
  type AddressSuggestion = {
    place_id: string
    display_name: string
    display_place: string
    display_address: string
    latitude: number
    longitude: number
  }
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressDropdown, setShowAddressDropdown] = useState(false)
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function loadVendors() {
      setLoadingVendors(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          search,
          filterCategory,
          sortKey,
          sortDir: sortDirDesc ? 'desc' : 'asc',
          page: String(page),
          pageSize: String(pageSize),
        })
        const resp = await fetch(`/api/admin/vendors?${params.toString()}`)
        const json = await resp.json().catch(() => ({}))

        if (!resp.ok || !json?.success) {
          const msg = json?.error || 'Failed to load vendors'
          setError(msg)
          setVendors([])
          setTotalVendors(0)
          return
        }

        setVendors(json.data || [])
        setTotalVendors(json.total || 0)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load vendors'
        setError(msg)
        setVendors([])
        setTotalVendors(0)
      } finally {
        setLoadingVendors(false)
      }
    }
    loadVendors()
  }, [search, filterCategory, sortKey, sortDirDesc, page])

  // Load categories once – they rarely change
  useEffect(() => {
    async function loadCategories() {
      try {
        const resp = await fetch('/api/admin/offer-categories')
        const json = await resp.json().catch(() => ({}))
        if (resp.ok && json?.success) {
          setCategories(json.data || [])
        } else {
          setCategories([])
        }
      } catch {
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  // Load offers only for vendors visible on the current page
  useEffect(() => {
    async function loadOffersForVisibleVendors() {
      if (!vendors.length) {
        setOffers([])
        return
      }

      setLoadingOffers(true)
      const vendorIds = vendors.map(v => v.id)
      try {
        const resp = await fetch(
          '/api/admin/vendor-offers/list?vendorIds=' + encodeURIComponent(vendorIds.join(','))
        )
        const json = await resp.json().catch(() => ({}))
        if (resp.ok && json?.success) {
          setOffers(json.data || [])
        } else {
          setOffers([])
        }
      } catch {
        setOffers([])
      } finally {
        setLoadingOffers(false)
      }
    }

    loadOffersForVisibleVendors()
  }, [vendors])

  // Load cover images only for vendors visible on the current page
  useEffect(() => {
    async function loadCoverImagesForVisibleVendors() {
      if (!vendors.length) {
        setVendorCoverImagesMap({})
        return
      }

      setLoadingVendorCoverImages(true)
      const vendorIds = vendors.map(v => v.id)
      try {
        const resp = await fetch(
          '/api/admin/vendor-images/list?vendorIds=' + encodeURIComponent(vendorIds.join(','))
        )
        const json = await resp.json().catch(() => ({}))
        if (resp.ok && json?.success) {
          const incoming: VendorImageItem[] = json.data || []
          const map: Record<string, VendorImageItem[]> = {}
          for (const img of incoming) {
            const vid = img.vendor_id
            if (!map[vid]) map[vid] = []
            map[vid].push(img)
          }
          setVendorCoverImagesMap(map)
        } else {
          setVendorCoverImagesMap({})
        }
      } catch {
        setVendorCoverImagesMap({})
      } finally {
        setLoadingVendorCoverImages(false)
      }
    }

    loadCoverImagesForVisibleVendors()
  }, [vendors])

  async function submitVendor(e: React.FormEvent) {
    e.preventDefault()
    setVendorMsg(null)
    setSubmittingVendor(true)
  setVendorErrors({})
    
    try {
      // Validate input
      const validationResult = vendorSchema.safeParse({
        name: vendorForm.name,
        website: vendorForm.website,
        address: vendorForm.address,
        phone: vendorForm.phone,
        email: vendorForm.email,
        about: vendorForm.about,
        tags: vendorForm.tags,
        category: vendorForm.category,
        latitude: vendorForm.latitude,
        longitude: vendorForm.longitude
      })

      if (!validationResult.success) {
        const fieldErrors: typeof vendorErrors = {}
        for (const issue of validationResult.error.issues) {
          const field = issue.path?.[0] as keyof typeof vendorForm | undefined
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message
          }
        }
        setVendorErrors(fieldErrors)

        const firstError = validationResult.error.issues[0]
        const fieldName = firstError?.path?.[0]
          ? String(firstError.path[0]).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : 'Field'
        const errorMessage = firstError?.message
          ? `${fieldName}: ${firstError.message}`
          : 'Validation failed'
        setVendorMsg(errorMessage)
        pushToast('error', errorMessage)
        logger.warn('Vendor form validation failed', validationResult.error, { form: vendorForm })
        setSubmittingVendor(false)
        return
      }

      // Validate logo file if provided
      if (!logoFile) {
        setVendorMsg('Logo image is required')
        pushToast('error', 'Logo image is required')
        setSubmittingVendor(false)
        return
      }
      const logoValidation = await validateFile(logoFile)
      if (!logoValidation.valid) {
        setVendorMsg(logoValidation.error || 'Invalid logo file')
        pushToast('error', logoValidation.error || 'Invalid logo file')
        setSubmittingVendor(false)
        return
      }

      // Validate cover files (at least one required)
      if (coverFiles.length === 0) {
        setVendorMsg('At least one cover image is required')
        pushToast('error', 'At least one cover image is required')
        setSubmittingVendor(false)
        return
      }
      for (const file of coverFiles) {
        const fileValidation = await validateFile(file)
        if (!fileValidation.valid) {
          setVendorMsg(fileValidation.error || `Invalid file: ${file.name}`)
          pushToast('error', fileValidation.error || `Invalid file: ${file.name}`)
          setSubmittingVendor(false)
          return
        }
      }

      const validated = validationResult.data
      
      // Create vendor via API route (bypasses RLS)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      let response: Response
      try {
        const csrfToken = getCookie('csrf-token')
        response = await fetch('/api/admin/vendors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          },
          body: JSON.stringify({
            formData: {
              name: validated.name,
              website: validated.website,
              address: validated.address,
              phone: validated.phone,
              email: validated.email,
              about: validated.about,
              tags: validated.tags,
              category: validated.category,
              latitude: validated.latitude,
              longitude: validated.longitude
            }
          }),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          setVendorMsg('Request timed out. Please try again.')
          pushToast('error', 'Request timed out. Please try again.')
          setSubmittingVendor(false)
          return
        }
        throw fetchError
      }

      type CreateVendorResponse = {
        success?: boolean
        data?: { id: string; name: string } | null
        error?: string
      }

      let result: CreateVendorResponse
      try {
        result = await response.json()
      } catch {
        setVendorMsg('Invalid response from server')
        pushToast('error', 'Invalid response from server')
        setSubmittingVendor(false)
        return
      }

      if (!response.ok || !result?.success || !result.data?.id) {
        const errorMsg = result?.error || 'Failed to create vendor'
        setVendorMsg(errorMsg)
        pushToast('error', errorMsg)
        logger.error('Failed to create vendor via API', result)
        setSubmittingVendor(false)
        return
      }

      const created = result.data

      // Upload logo via admin API (uses authenticated admin session)
      if (logoFile) {
        try {
          const csrfToken = getCookie('csrf-token')
          const form = new FormData()
          form.append('vendor_id', created.id)
          form.append('type', 'logo')
          form.append('file', logoFile, logoFile.name)
          const resp = await fetch('/api/admin/vendor-images', {
            method: 'POST',
            headers: {
              ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
            },
            body: form
          })
          if (!resp.ok) {
            const data = await resp.json().catch(() => ({}))
            throw new Error(data.error || 'Failed to upload logo')
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to upload logo'
          setVendorMsg(message)
          pushToast('error', message)
          logger.error('Failed to upload vendor logo via API', err, { vendorId: created.id })
          setSubmittingVendor(false)
          return
        }
      }

      // Upload cover images via admin API if provided
      if (coverFiles.length > 0) {
        try {
          const csrfToken = getCookie('csrf-token')
          for (const file of coverFiles) {
            const form = new FormData()
            form.append('vendor_id', created.id)
            form.append('type', 'cover')
            form.append('file', file, file.name)
            const resp = await fetch('/api/admin/vendor-images', {
              method: 'POST',
              headers: {
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: form
            })
            if (!resp.ok) {
              const data = await resp.json().catch(() => ({}))
              throw new Error(data.error || 'Failed to upload cover image')
            }
          }
        } catch (err) {
          const message = err instanceof Error ? `Failed to upload cover images: ${err.message}` : 'Failed to upload cover images'
          setVendorMsg(message)
          pushToast('error', message)
          logger.error('Failed to upload vendor cover images via API', err, { vendorId: created.id })
          setSubmittingVendor(false)
          return
        }
      }

      setVendorMsg(`Created vendor: ${created.name}`)
      pushToast('success', `Created vendor: ${created.name}`)
      setVendorForm({ name: '', website: '', address: '', phone: '', email: '', about: '', tags: '', category: '', latitude: '', longitude: '' })
      setLogoFile(null)
      setCoverFiles([])
      // Reload first page of vendors via server-side listing API
      try {
        const params = new URLSearchParams({
          search: '',
          filterCategory: '',
          sortKey: 'created_at',
          sortDir: 'desc',
          page: '0',
          pageSize: String(pageSize),
        })
        const resp = await fetch(`/api/admin/vendors?${params.toString()}`)
        const json = await resp.json().catch(() => ({}))
        if (resp.ok && json?.success) {
          setVendors(json.data || [])
          setTotalVendors(json.total || 0)
          setPage(0)
        }
      } catch {
        // leave existing list if refresh fails
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setVendorMsg(message)
      pushToast('error', message)
      logger.error('Unexpected error in submitVendor', err, { form: vendorForm })
    } finally {
      setSubmittingVendor(false)
    }
  }

  // Address autocomplete helpers
  const searchAddressSuggestions = async (query: string) => {
    if (query.trim().length < 3) {
      setAddressSuggestions([])
      setShowAddressDropdown(false)
      return
    }

    setAddressLoading(true)
    try {
      const resp = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=5`)
      if (!resp.ok) {
        throw new Error(`API error: ${resp.status}`)
      }
      const data = await resp.json()
      if (data?.success && Array.isArray(data.suggestions)) {
        setAddressSuggestions(data.suggestions)
        setShowAddressDropdown(data.suggestions.length > 0)
      } else {
        setAddressSuggestions([])
        setShowAddressDropdown(false)
      }
    } catch {
      setAddressSuggestions([])
      setShowAddressDropdown(false)
    } finally {
      setAddressLoading(false)
    }
  }

  const handleAddressChange = (value: string) => {
    setVendorForm(prev => ({ ...prev, address: value }))
    if (addressDebounceRef.current) {
      clearTimeout(addressDebounceRef.current)
    }
    addressDebounceRef.current = setTimeout(() => {
      searchAddressSuggestions(value)
    }, 300)
  }

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setVendorForm(prev => ({
      ...prev,
      address: suggestion.display_name,
      latitude: suggestion.latitude ? String(suggestion.latitude) : '',
      longitude: suggestion.longitude ? String(suggestion.longitude) : '',
    }))
    setAddressSuggestions([])
    setShowAddressDropdown(false)
  }

  useEffect(() => {
    return () => {
      if (addressDebounceRef.current) {
        clearTimeout(addressDebounceRef.current)
      }
    }
  }, [])

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault()
    setOfferMsg(null)
    setSubmittingOffer(true)
    try {
      const csrfToken = getCookie('csrf-token')
      const resp = await fetch('/api/admin/vendor-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          vendor_id: offerForm.vendor_id,
          title: offerForm.title.trim(),
          start_date: offerForm.start_date.trim() || '',
          end_date: offerForm.end_date.trim() || '',
          terms_conditions: offerForm.terms_conditions.trim() || '',
          featured: offerForm.featured,
        })
      })
      const createData = await resp.json().catch(() => ({}))
      if (!resp.ok || !createData?.success) {
        const msg = createData?.error || 'Failed to create offer'
        setOfferMsg(msg)
        pushToast('error', msg)
        return
      }

      setOfferMsg(`Created offer: ${createData?.data?.title}`)
      pushToast('success', `Created offer: ${createData?.data?.title}`)
      setOfferForm({ vendor_id: '', title: '', start_date: '', end_date: '', terms_conditions: '', featured: false })
      // Reload offers for visible vendors via server-side offers listing API
      if (vendors.length) {
        const vendorIds = vendors.map(v => v.id)
        try {
          const resp = await fetch(
            '/api/admin/vendor-offers/list?vendorIds=' + encodeURIComponent(vendorIds.join(','))
          )
          const json = await resp.json().catch(() => ({}))
          if (resp.ok && json?.success) {
            setOffers(json.data || [])
          }
        } catch {
          // keep existing offers if refresh fails
        }
      }
    } finally {
      setSubmittingOffer(false)
    }
  }


  async function openVendorDrawer(v: VendorItem) {
    setDrawerKind('vendor')
    setDrawerVendorId(v.id)
    setDrawerOfferId(null)
    setDrawerVendorDraft({
      name: v.name,
      address: v.address || '',
      phone: v.phone || '',
      email: v.email || '',
      website: v.website || '',
      vendor_category_key: v.vendor_category_key || '',
      tagsCsv: (v.tags || []).join(', '),
      about: v.about || '',
      latitude: v.latitude,
      longitude: v.longitude,
      newLogoFile: null,
      removeLogo: false,
      newCoverFiles: [],
    })
    setIsDrawerOpen(true)
    
    // Load vendor images
    setLoadingVendorImages(true)
    try {
      const resp = await fetch(
        '/api/admin/vendor-images/list?vendorIds=' + encodeURIComponent(v.id)
      )
      const json = await resp.json().catch(() => ({}))
      if (resp.ok && json?.success) {
        setVendorImages((json.data || []) as VendorImageItem[])
      } else {
        setVendorImages([])
      }
    } catch {
      setVendorImages([])
    } finally {
      setLoadingVendorImages(false)
    }
  }
  function openOfferDrawer(o: LocalOfferItem) {
    setDrawerKind('offer')
    setDrawerOfferId(o.id)
    setDrawerVendorId(null)
    setDrawerOfferDraft({
      title: o.title,
      start_date: o.start_date ? new Date(o.start_date).toISOString().split('T')[0] : '',
      end_date: o.end_date ? new Date(o.end_date).toISOString().split('T')[0] : '',
      terms_conditions: o.terms_conditions || '',
      featured: o.featured,
      vendor_id: o.vendor_id,
    })
    setIsDrawerOpen(true)
  }
  function closeDrawer() {
    setIsDrawerOpen(false)
    setDrawerKind(null)
    setDrawerVendorId(null)
    setDrawerOfferId(null)
    setDrawerVendorDraft({})
    setDrawerOfferDraft({})
    setVendorImages([])
  }
  async function saveDrawer() {
    try {
      setSavingDrawer(true)
      if (drawerKind === 'vendor' && drawerVendorId) {
        const update: Partial<VendorItem> & { logo_url?: string | null } = {
          name: (drawerVendorDraft.name || '').toString().trim(),
          address: (drawerVendorDraft.address || '') || null,
          phone: (drawerVendorDraft.phone || '') || null,
          email: (drawerVendorDraft.email || '') || null,
          website: (drawerVendorDraft.website || '') || null,
          vendor_category_key: (drawerVendorDraft.vendor_category_key || '') || null,
          tags: drawerVendorDraft.tagsCsv ? drawerVendorDraft.tagsCsv.split(',').map(s => s.trim()).filter(Boolean) : null,
          about: (drawerVendorDraft.about || '') || null,
          latitude: drawerVendorDraft.latitude !== undefined ? drawerVendorDraft.latitude : undefined,
          longitude: drawerVendorDraft.longitude !== undefined ? drawerVendorDraft.longitude : undefined,
        }

        // Handle logo image replacement/removal
        const current = vendors.find(x => x.id === drawerVendorId)
        try {
          if (drawerVendorDraft.newLogoFile) {
            const csrfToken = getCookie('csrf-token')
            const form = new FormData()
            form.append('vendor_id', drawerVendorId)
            form.append('type', 'logo')
            form.append('file', drawerVendorDraft.newLogoFile, drawerVendorDraft.newLogoFile.name)
            const resp = await fetch('/api/admin/vendor-images', {
              method: 'POST',
              headers: {
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: form
            })
            if (!resp.ok) {
              const data = await resp.json().catch(() => ({}))
              throw new Error(data.error || 'Failed to upload logo')
            }
            // Remove old logo via admin API (if any)
            if (current?.logo_url) {
              const delResp = await fetch('/api/admin/vendor-images', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
                },
                body: JSON.stringify({ vendor_id: drawerVendorId, type: 'logo', image_url: current.logo_url })
              })
              const delResult = await delResp.json().catch(() => ({}))
              if (!delResp.ok || !delResult?.success) {
                throw new Error(delResult?.error || 'Failed to remove old logo')
              }
            }
          } else if (drawerVendorDraft.removeLogo) {
            const csrfToken = getCookie('csrf-token')
            const delResp = await fetch('/api/admin/vendor-images', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
              },
              body: JSON.stringify({ vendor_id: drawerVendorId, type: 'logo' })
            })
            const delResult = await delResp.json().catch(() => ({}))
            if (!delResp.ok || !delResult?.success) {
              throw new Error(delResult?.error || 'Failed to remove logo')
            }
            update.logo_url = null
          }
        } catch {
          pushToast('error', 'Failed to update logo')
          return
        }

        // Handle cover images upload
            if (drawerVendorDraft.newCoverFiles && drawerVendorDraft.newCoverFiles.length > 0) {
          try {
            for (const file of drawerVendorDraft.newCoverFiles) {
              const csrfToken = getCookie('csrf-token')
              const form = new FormData()
              form.append('vendor_id', drawerVendorId)
              form.append('type', 'cover')
              form.append('file', file, file.name)
              const resp = await fetch('/api/admin/vendor-images', {
                method: 'POST',
                headers: {
                  ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
                },
                body: form
              })
              if (!resp.ok) {
                const data = await resp.json().catch(() => ({}))
                throw new Error(data.error || 'Failed to upload cover image')
              }
            }
            // Reload vendor images
            const resp = await fetch(
              '/api/admin/vendor-images/list?vendorIds=' + encodeURIComponent(drawerVendorId)
            )
            const json = await resp.json().catch(() => ({}))
            if (resp.ok && json?.success) {
              setVendorImages((json.data || []) as VendorImageItem[])
            }
            // Clear new cover files after upload
            setDrawerVendorDraft(s => ({ ...s, newCoverFiles: [] }))
          } catch (err) {
            const message = err instanceof Error ? `Failed to upload cover images: ${err.message}` : 'Failed to upload cover images'
            pushToast('error', message)
            return
          }
        }

        const csrfToken = getCookie('csrf-token')
        const resp = await fetch('/api/admin/vendors', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          },
          body: JSON.stringify({ id: drawerVendorId, ...update }),
        })
        const result = await resp.json().catch(() => ({}))
        if (!resp.ok || !result?.success) {
          throw new Error(result?.error || 'Failed to save vendor')
        }
        setVendors(prev =>
          prev.map(x => (x.id === drawerVendorId ? (result.data as VendorItem) : x))
        )
        
        // Reload vendor images after save
        try {
          const imgResp = await fetch(
            '/api/admin/vendor-images/list?vendorIds=' + encodeURIComponent(drawerVendorId)
          )
          const imgJson = await imgResp.json().catch(() => ({}))
          if (imgResp.ok && imgJson?.success) {
            const refreshedImages: VendorImageItem[] = imgJson.data || []
            setVendorImages(refreshedImages)
            setVendorCoverImagesMap(prev => ({
              ...prev,
              [drawerVendorId]: refreshedImages,
            }))
          }
        } catch {
          // ignore refresh errors
        }
        
        pushToast('success', 'Vendor saved')
        // Don't close drawer automatically - let user see the updated images
        // closeDrawer()
        return
      }
      if (drawerKind === 'offer' && drawerOfferId) {
        const update: Partial<LocalOfferItem> = {
          title: (drawerOfferDraft.title || '').toString().trim(),
          start_date: (drawerOfferDraft.start_date as string | undefined)?.trim() || '',
          end_date: (drawerOfferDraft.end_date as string | undefined)?.trim() || '',
          terms_conditions: (drawerOfferDraft.terms_conditions as string | undefined)?.trim() || '',
          featured: drawerOfferDraft.featured ?? false,
        }
        const csrfToken = getCookie('csrf-token')
        const resp = await fetch('/api/admin/vendor-offers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          },
          body: JSON.stringify({ id: drawerOfferId, ...update })
        })
        const result = await resp.json().catch(() => ({}))
        if (!resp.ok || !result?.success) throw new Error(result?.error || 'Failed to save offer')
        setOffers(prev => prev.map(x => x.id === drawerOfferId ? (result.data as LocalOfferItem) : x))
        pushToast('success', 'Offer saved')
        closeDrawer()
        return
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      pushToast('error', message)
    } finally {
      setSavingDrawer(false)
    }
  }

  const openConfirm = (title: string, message: string, action: () => void | Promise<void>) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setConfirmOpen(true)
  }
  const closeConfirm = () => {
    setConfirmOpen(false)
    setConfirmTitle('')
    setConfirmMessage('')
    setConfirmAction(null)
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Local Offers Builder</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage local vendor offers</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Vendors" icon="🛍️" value={totalVendors} loading={loadingVendors} />
        <StatCard title="Categories" icon="🗂️" value={categories.length} />
      </div>

      {/* Vendor Creator */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <h2 className="text-xl font-semibold mb-4">Create Vendor</h2>
        <form onSubmit={submitVendor} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor name <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. Local Coffee Shop" value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} required />
              {vendorErrors.name ? (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.name}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Public display name</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="https://example.com" value={vendorForm.website} onChange={e => setVendorForm({ ...vendorForm, website: e.target.value })} />
              {vendorErrors.website ? (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.website}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Optional website URL</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="123 Main St, City, State"
                  value={vendorForm.address}
                  onChange={e => handleAddressChange(e.target.value)}
                  required
                />
                {addressLoading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400" />
                  </div>
                )}
                {showAddressDropdown && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {addressSuggestions.map(suggestion => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        <div className="font-medium text-gray-900">{suggestion.display_place}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{suggestion.display_address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {vendorErrors.address && (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="(555) 123-4567" value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} required />
              {vendorErrors.phone && (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="border rounded-lg px-3 py-2 w-full" placeholder="contact@example.com" value={vendorForm.email} onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })} />
              {vendorErrors.email && (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo image <span className="text-red-600">*</span>
              </label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                <span>Click to upload logo</span>
              </label>
              {logoFile && (
                // eslint-disable-next-line @next/next/no-img-element
                <div className="mt-2"><img src={URL.createObjectURL(logoFile)} alt="logo preview" className="h-14 w-14 object-cover rounded border" /></div>
              )}
              <p className="text-xs text-gray-500 mt-1">Square logo works best (PNG/SVG)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover images <span className="text-red-600">*</span>
              </label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async e => {
                    const files = Array.from(e.target.files || [])
                    const validFiles: File[] = []

                    for (const file of files) {
                      const validation = await validateCoverImageClient(file)
                      if (!validation.valid) {
                        pushToast('error', validation.error || `Invalid cover image: ${file.name}`)
                      } else {
                        validFiles.push(file)
                      }
                    }

                    if (validFiles.length > 0) {
                      setCoverFiles(prev => [...prev, ...validFiles])
                    }
                    e.target.value = ''
                  }}
                />
                <span>Click to upload cover images</span>
              </label>
              {coverFiles.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {coverFiles.map((file, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`cover preview ${idx + 1}`} className="h-20 w-full object-cover rounded border" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">Primary</span>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 bg-red-600 text-white rounded"
                        onClick={() => setCoverFiles(prev => prev.filter((_, i) => i !== idx))}
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images. First image will be primary. Suggested landscape 7:4 (≈16:9) at least 1120x640px (JPG/PNG/WebP).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
              <select className="border rounded-lg px-3 py-2 w-full" value={vendorForm.category} onChange={e => setVendorForm({ ...vendorForm, category: e.target.value })} required>
                <option value="">—</option>
                {categories.map(c => (<option key={c.key} value={c.key}>{c.label}</option>))}
              </select>
              {vendorErrors.category && (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. coffee, local, student-friendly" value={vendorForm.tags} onChange={e => setVendorForm({ ...vendorForm, tags: e.target.value })} required />
              {vendorErrors.tags ? (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.tags}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude <span className="text-red-600">*</span></label>
              <input 
                type="number" 
                step="any" 
                min="-90" 
                max="90" 
                className="border rounded-lg px-3 py-2 w-full" 
                placeholder="40.7128" 
                value={vendorForm.latitude} 
                onChange={e => setVendorForm({ ...vendorForm, latitude: e.target.value })} 
                required
              />
              {vendorErrors.latitude ? (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.latitude}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude <span className="text-red-600">*</span></label>
              <input 
                type="number" 
                step="any" 
                min="-180" 
                max="180" 
                className="border rounded-lg px-3 py-2 w-full" 
                placeholder="-74.0060" 
                value={vendorForm.longitude} 
                onChange={e => setVendorForm({ ...vendorForm, longitude: e.target.value })} 
                required
              />
              {vendorErrors.longitude ? (
                <p className="text-xs text-red-600 mt-1">{vendorErrors.longitude}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About <span className="text-red-600">*</span>
            </label>
            <textarea
              className="border rounded-lg px-3 py-2 w-full"
              rows={4}
              placeholder="Short vendor description"
              value={vendorForm.about}
              onChange={e => setVendorForm({ ...vendorForm, about: e.target.value })}
              required
            />
            {vendorErrors.about && (
              <p className="text-xs text-red-600 mt-1">{vendorErrors.about}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={vendorDisabled}>
              {submittingVendor ? 'Creating...' : 'Create Vendor'}
            </button>
            {vendorMsg && <div className="text-sm text-gray-700">{vendorMsg}</div>}
          </div>
        </form>
      </section>

      {/* Offer Creator */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <h2 className="text-xl font-semibold mb-4">Create Local Offer</h2>
        <form onSubmit={submitOffer} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor <span className="text-red-600">*</span></label>
              <select className="border rounded-lg px-3 py-2 w-full" value={offerForm.vendor_id} onChange={e => setOfferForm({ ...offerForm, vendor_id: e.target.value })} required>
                <option value="">{loadingVendors ? 'Loading…' : 'Select a vendor'}</option>
                {vendors.map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}
              </select>
              {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. 20% off for students" value={offerForm.title} onChange={e => setOfferForm({ ...offerForm, title: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 w-full"
                value={offerForm.start_date}
                onChange={e => setOfferForm({ ...offerForm, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 w-full"
                value={offerForm.end_date}
                onChange={e => setOfferForm({ ...offerForm, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Add any usage instructions or restrictions" value={offerForm.terms_conditions} onChange={e => setOfferForm({ ...offerForm, terms_conditions: e.target.value })} />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={offerForm.featured} onChange={e => setOfferForm({ ...offerForm, featured: e.target.checked })} />
              <span className="text-sm text-gray-700">Feature this offer</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={offerDisabled}>Create Offer</button>
            {offerMsg && <div className="text-sm text-gray-700">{offerMsg}</div>}
          </div>
        </form>
      </section>

      {/* Vendors List */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vendors</h2>
          {loadingVendors && <div className="text-sm text-black/60">Loading…</div>}
        </div>

        {/* Toolbar above list */}
        <div className="mt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Search vendors, addresses, phone" value={search} onChange={e => { setPage(0); setSearch(e.target.value) }} />
            <select className="border rounded-lg px-3 py-2 text-sm" value={filterCategory} onChange={e => { setPage(0); setFilterCategory(e.target.value) }}>
              <option value="">All categories</option>
              {categories.map(c => (<option key={c.key} value={c.key}>{c.label}</option>))}
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm" value={sortKey} onChange={e => { setPage(0); setSortKey(e.target.value as 'created_at' | 'name') }}>
              <option value="created_at">Sort by: Newest</option>
              <option value="name">Sort by: Name</option>
            </select>
            <button className="border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 text-left" onClick={() => { setPage(0); setSortDirDesc(s => !s) }}>
              {sortDirDesc ? 'Direction: Desc' : 'Direction: Asc'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {vendors.map(v => {
            return (
              <div key={v.id} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 hover-lift glass-effect overflow-hidden p-6">
                <div className="grid gap-2">
                  {(v.logo_url || (vendorCoverImagesMap[v.id]?.length ?? 0) > 0) && (
                    <div className="flex flex-col gap-2">
                      {v.logo_url && (
                        <div className="flex gap-3 items-center">
                          <Image 
                            src={v.logo_url} 
                            alt="logo" 
                            width={40} 
                            height={40} 
                            className="h-10 w-10 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => setPreviewImage(v.logo_url!)}
                          />
                        </div>
                      )}
                      {vendorCoverImagesMap[v.id] && vendorCoverImagesMap[v.id].length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {vendorCoverImagesMap[v.id].map(img => (
                            <Image
                              key={img.id}
                              src={img.image_url}
                              alt="cover"
                              width={64}
                              height={40}
                              className="h-10 w-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setPreviewImage(img.image_url)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="font-medium">{v.name}</div>
                  <div className="text-sm text-black/70">{v.address || ''}</div>
                  {v.phone && <div className="text-sm text-black/70">Phone: {v.phone}</div>}
                  {v.email && <div className="text-sm text-black/70">Email: {v.email}</div>}
                  {v.website && <div className="text-sm text-black/70">Website: {v.website}</div>}
                  <div className="text-sm">Category: {categories.find(c => c.key === v.vendor_category_key)?.label || v.vendor_category_key || '-'}</div>
                  <div className="text-sm">Tags: {(v.tags || []).join(', ') || '-'}</div>
                  <div className="text-sm line-clamp-2">{v.about || ''}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="text-sm rounded-xl px-3 py-1.5 border border-gray-300 hover:bg-gray-100 transition-colors"
                      onClick={() => openVendorDrawer(v)}
                    >
                      Edit Vendor
                    </button>
                    <button
                      className="text-sm rounded-xl px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                      onClick={() =>
                        openConfirm(
                          'Delete vendor',
                          `Delete vendor "${v.name}" and all its offers and images?`,
                          async () => {
                            const csrfToken = getCookie('csrf-token')
                            const resp = await fetch('/api/admin/vendors', {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
                              },
                              body: JSON.stringify({ id: v.id }),
                            })
                            const result = await resp.json().catch(() => ({}))
                            if (!resp.ok || !result?.success) {
                              pushToast('error', result?.error || 'Failed to delete vendor')
                              return
                            }
                            setVendors(prev => prev.filter(x => x.id !== v.id))
                            setOffers(prev => prev.filter(o => o.vendor_id !== v.id))
                            pushToast('success', 'Vendor deleted')
                          }
                        )
                      }
                    >
                      Delete Vendor
                    </button>
                  </div>

                  <div className="mt-4 border-t border-black/10 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Local Offers</div>
                      {loadingOffers && <div className="text-xs text-black/60">Loading…</div>}
                    </div>
                    <div className="space-y-3 mt-2">
                      {offers.filter(o => o.vendor_id === v.id).map(o => {
                        return (
                          <div key={o.id} className="border border-black/10 rounded-2xl p-3">
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{o.title}</div>
                                {o.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Featured</span>}
                              </div>
                              <div className="text-xs">{o.start_date ? new Date(o.start_date).toLocaleDateString() : ''} → {o.end_date ? new Date(o.end_date).toLocaleDateString() : ''}</div>
                              {o.terms_conditions && <div className="text-xs text-gray-600 line-clamp-2">{o.terms_conditions}</div>}
                              <div className="flex gap-2 mt-2">
                                <button className="text-xs rounded-lg px-2 py-1 border border-gray-300 hover:bg-gray-100 transition-colors" onClick={() => openOfferDrawer(o)}>Edit</button>
                                <button className="text-xs rounded-lg px-2 py-1 border border-red-300 text-red-700 hover:bg-red-50 transition-colors" onClick={() => openConfirm('Delete offer', `Delete offer "${o.title}"?`, async () => {
                                  const csrfToken = getCookie('csrf-token')
                                  const resp = await fetch('/api/admin/vendor-offers', {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
                                    },
                                    body: JSON.stringify({ id: o.id })
                                  })
                                  const result = await resp.json().catch(() => ({}))
                                  if (!resp.ok || !result?.success) {
                                    pushToast('error', result?.error || 'Failed to delete offer')
                                    return
                                  }
                                  setOffers(prev => prev.filter(x => x.id !== o.id))
                                  pushToast('success', 'Offer deleted')
                                })}>Delete</button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {offers.filter(o => o.vendor_id === v.id).length === 0 && (
                        <div className="text-xs text-black/60">No offers yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {!loadingVendors && vendors.length === 0 && (
            <div className="text-sm text-black/60">No vendors yet.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}{totalVendors ? ` • ${totalVendors} total` : ''}</div>
          <div className="flex items-center gap-2">
            <button className="rounded px-3 py-1 border disabled:opacity-50" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</button>
            <button className="rounded px-3 py-1 border disabled:opacity-50" disabled={page + 1 >= totalPages} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>Next</button>
          </div>
        </div>
      </section>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-6 z-50 space-y-2">
          {toasts.map(t => (
            <div key={t.id} className={`rounded-lg px-4 py-2 shadow border ${t.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {t.text}
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={closeDrawer}></div>
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl border-l border-black/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{drawerKind === 'vendor' ? 'Edit Vendor' : 'Edit Offer'}</h3>
              <button className="text-sm rounded px-3 py-1 border hover:bg-gray-50" onClick={closeDrawer}>Close</button>
            </div>
            {drawerKind === 'vendor' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Vendor name" value={(drawerVendorDraft.name as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Address</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Address" value={(drawerVendorDraft.address as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm mb-1">Latitude</label>
                    <input type="number" step="any" className="border rounded px-3 py-2 w-full" placeholder="Latitude" value={drawerVendorDraft.latitude !== null && drawerVendorDraft.latitude !== undefined ? drawerVendorDraft.latitude : ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, latitude: e.target.value === '' ? null : parseFloat(e.target.value) || null }))} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Longitude</label>
                    <input type="number" step="any" className="border rounded px-3 py-2 w-full" placeholder="Longitude" value={drawerVendorDraft.longitude !== null && drawerVendorDraft.longitude !== undefined ? drawerVendorDraft.longitude : ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, longitude: e.target.value === '' ? null : parseFloat(e.target.value) || null }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Phone" value={(drawerVendorDraft.phone as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input type="email" className="border rounded px-3 py-2 w-full" placeholder="Email" value={(drawerVendorDraft.email as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Website</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Website URL" value={(drawerVendorDraft.website as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, website: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select className="border rounded px-3 py-2 w-full" value={(drawerVendorDraft.vendor_category_key as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, vendor_category_key: e.target.value }))}>
                    <option value="">—</option>
                    {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Tags</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Tags (comma-separated)" value={(drawerVendorDraft.tagsCsv as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, tagsCsv: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">About</label>
                  <textarea className="border rounded px-3 py-2 w-full" placeholder="About" rows={4} value={(drawerVendorDraft.about as string) || ''} onChange={e => setDrawerVendorDraft(s => ({ ...s, about: e.target.value }))} />
                </div>
                <div className="pt-1">
                  <label className="block text-sm mb-1">Logo</label>
                  <div className="space-y-2">
                    {vendors.find(v => v.id === drawerVendorId)?.logo_url && (
                      <div className="flex items-center gap-2">
                        <Image 
                          src={vendors.find(v => v.id === drawerVendorId)!.logo_url!} 
                          alt="Current logo" 
                          width={40} 
                          height={40} 
                          className="h-10 w-10 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                          onClick={() => setPreviewImage(vendors.find(v => v.id === drawerVendorId)!.logo_url!)}
                        />
                        <span className="text-xs text-gray-600">Current logo</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="border rounded px-3 py-2 w-full text-sm" onChange={e => setDrawerVendorDraft(s => ({ ...s, newLogoFile: e.target.files?.[0] || null, removeLogo: false }))} />
                    {vendors.find(v => v.id === drawerVendorId)?.logo_url && (
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={Boolean(drawerVendorDraft.removeLogo)} onChange={e => setDrawerVendorDraft(s => ({ ...s, removeLogo: e.target.checked, newLogoFile: null }))} />
                        <span>Remove current logo</span>
                      </label>
                    )}
                    {drawerVendorDraft.newLogoFile && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-600">New logo preview: </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(drawerVendorDraft.newLogoFile)} alt="New logo preview" className="h-10 w-10 object-cover rounded border inline-block ml-2" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-1">
                  <label className="block text-sm mb-1">Cover Images</label>
                  <div className="space-y-3">
                    {loadingVendorImages ? (
                      <div className="text-xs text-gray-600">Loading images...</div>
                    ) : vendorImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {vendorImages.map(img => (
                          <div key={img.id} className="relative group">
                            <Image 
                              src={img.image_url} 
                              alt="Cover" 
                              width={120} 
                              height={80} 
                              className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                              onClick={() => setPreviewImage(img.image_url)}
                            />
                            {img.is_primary && (
                              <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">Primary</span>
                            )}
                            <button
                              className="absolute top-1 right-1 text-xs px-2 py-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm('Delete this cover image?')) {
                                  const csrfToken = getCookie('csrf-token')
                                  const resp = await fetch('/api/admin/vendor-images', {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
                                    },
                                    body: JSON.stringify({ id: img.id })
                                  })
                                  const result = await resp.json().catch(() => ({}))
                                  if (resp.ok && result?.success) {
                                    try {
                                      const imgResp = await fetch(
                                        '/api/admin/vendor-images/list?vendorIds=' +
                                          encodeURIComponent(drawerVendorId!)
                                      )
                                      const imgJson = await imgResp.json().catch(() => ({}))
                                      if (imgResp.ok && imgJson?.success) {
                                        const refreshedImages: VendorImageItem[] = imgJson.data || []
                                        setVendorImages(refreshedImages || [])
                                        setVendorCoverImagesMap(prev => ({
                                          ...prev,
                                          [drawerVendorId!]: refreshedImages,
                                        }))
                                      }
                                    } catch {
                                      // ignore refresh errors
                                    }
                                    pushToast('success', 'Cover image deleted')
                                  } else {
                                    pushToast('error', result?.error || 'Failed to delete image')
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">No cover images yet</div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="border rounded px-3 py-2 w-full text-sm"
                        onChange={async e => {
                          const files = Array.from(e.target.files || [])
                          const validFiles: File[] = []

                          for (const file of files) {
                            const validation = await validateCoverImageClient(file)
                            if (!validation.valid) {
                              pushToast('error', validation.error || `Invalid cover image: ${file.name}`)
                            } else {
                              validFiles.push(file)
                            }
                          }

                          if (validFiles.length > 0) {
                            setDrawerVendorDraft(s => ({ ...s, newCoverFiles: validFiles }))
                          }
                          e.target.value = ''
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">You can select multiple images</p>
                      {drawerVendorDraft.newCoverFiles && drawerVendorDraft.newCoverFiles.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {drawerVendorDraft.newCoverFiles.map((file, idx) => (
                            <div key={idx} className="relative">
                              {/* Using <img> here is intentional because we're rendering File object previews via URL.createObjectURL */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded border" />
                              <span className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 bg-black/70 text-white rounded">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
                    onClick={saveDrawer}
                    disabled={savingDrawer}
                  >
                    {savingDrawer ? 'Saving...' : 'Save'}
                  </button>
                  <button className="rounded px-4 py-2 border" onClick={closeDrawer}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Vendor</label>
                  <select className="border rounded px-3 py-2 w-full" value={(drawerOfferDraft.vendor_id as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, vendor_id: e.target.value }))} disabled>
                    <option value="">Select vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <input className="border rounded px-3 py-2 w-full" placeholder="Title" value={(drawerOfferDraft.title as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, title: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="date" className="border rounded px-3 py-2 w-full" value={(drawerOfferDraft.start_date as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, start_date: e.target.value }))} />
                  <input type="date" className="border rounded px-3 py-2 w-full" value={(drawerOfferDraft.end_date as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, end_date: e.target.value }))} />
                </div>
                <textarea className="border rounded px-3 py-2 w-full" placeholder="Terms & Conditions" rows={4} value={(drawerOfferDraft.terms_conditions as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, terms_conditions: e.target.value }))} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={Boolean(drawerOfferDraft.featured)} onChange={e => setDrawerOfferDraft(s => ({ ...s, featured: e.target.checked }))} />
                    <span>Featured</span>
                  </label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
                    onClick={saveDrawer}
                    disabled={savingDrawer}
                  >
                    {savingDrawer ? 'Saving...' : 'Save'}
                  </button>
                  <button className="rounded px-4 py-2 border" onClick={closeDrawer}>Cancel</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={closeConfirm}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-black/10 p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">{confirmTitle}</h3>
              <p className="text-sm text-gray-700 mb-4">{confirmMessage}</p>
              <div className="flex items-center justify-end gap-2">
                <button className="rounded px-4 py-2 border" onClick={closeConfirm}>Cancel</button>
                <button className="bg-black text-white rounded px-4 py-2" onClick={async () => { if (confirmAction) await confirmAction(); closeConfirm() }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50" onClick={() => setPreviewImage(null)}>
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

