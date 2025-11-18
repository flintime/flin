'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import StatCard from '@/components/admin/StatCard'
import { brandSchema } from '@/lib/validation/schemas'
import { logger } from '@/lib/error-logger'
import { validateFile } from '@/lib/file-validation'

type BrandItem = {
  id: string
  name: string
  website: string | null
  category: string | null
  tags: string[] | null
  about: string | null
  logo_url: string | null
  cover_url: string | null
  sort_order: number | null
  created_at: string
}

type OfferItem = {
  id: string
  brand_id: string
  title: string
  start_date: string | null
  end_date: string | null
  terms_conditions: string | null
  featured: boolean
  discount_type: 'in_store' | 'online' | 'both'
  created_at: string
}

export default function AdminBrandBuilder() {
  // const router = useRouter()
  
  // slugify removed (unused)

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
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [loadingBrands, setLoadingBrands] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Derived map reserved for future use (e.g., quick lookups)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const brandIdToName = useMemo(() => Object.fromEntries(brands.map(b => [b.id, b.name])), [brands])
  const [categories, setCategories] = useState<Array<{ key: string; label: string }>>([])

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    name: '',
    website: '',
    about: '',
    tags: '',
    category: '',
    sort_order: '',
  })
  const [brandErrors, setBrandErrors] = useState<{
    name?: string
    website?: string
    about?: string
    tags?: string
    category?: string
    sort_order?: string
  }>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [brandMsg, setBrandMsg] = useState<string | null>(null)
  const [submittingBrand, setSubmittingBrand] = useState(false)
  const brandDisabled = useMemo(
    () =>
      brandForm.name.trim().length === 0 ||
      brandForm.sort_order.trim().length === 0 ||
      submittingBrand,
    [brandForm.name, brandForm.sort_order, submittingBrand]
  )

  // List toolbar & UX state
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortKey, setSortKey] = useState<'created_at' | 'name'>('created_at')
  const [sortDirDesc, setSortDirDesc] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 20
  const [totalBrands, setTotalBrands] = useState(0)

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: number; type: 'success' | 'error'; text: string }>>([])
  function pushToast(type: 'success' | 'error', text: string) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, text }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // total pages derived
  const totalPages = Math.max(1, Math.ceil(totalBrands / pageSize))

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    brand_id: '',
    title: '',
    start_date: '',
    end_date: '',
    terms_conditions: '',
    featured: false,
    discount_type: 'in_store' as 'in_store' | 'online' | 'both'
  })
  const [offerMsg, setOfferMsg] = useState<string | null>(null)
  const [submittingOffer, setSubmittingOffer] = useState(false)
  const offerDisabled = useMemo(
    () =>
      !offerForm.brand_id ||
      !offerForm.title.trim() ||
      !offerForm.start_date ||
      submittingOffer,
    [offerForm.brand_id, offerForm.title, offerForm.start_date, submittingOffer]
  )

  // Listings (read/write)
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loadingOffers, setLoadingOffers] = useState<boolean>(true)
  const [editingBrandId] = useState<string | null>(null)

  // Right-side edit drawer & confirm modal state (must be before any conditional returns)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerKind, setDrawerKind] = useState<null | 'brand' | 'offer'>(null)
  const [drawerBrandId, setDrawerBrandId] = useState<string | null>(null)
  const [drawerOfferId, setDrawerOfferId] = useState<string | null>(null)
  const [drawerBrandDraft, setDrawerBrandDraft] = useState<Partial<BrandItem> & { tagsCsv?: string, newLogoFile?: File | null, removeLogo?: boolean, newCoverFile?: File | null, removeCover?: boolean }>({})
  const [drawerOfferDraft, setDrawerOfferDraft] = useState<Partial<OfferItem>>({})
  const [savingDrawer, setSavingDrawer] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<null | (() => void | Promise<void>)>(null)

  // Image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    async function loadBrands() {
      setLoadingBrands(true)
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
        const resp = await fetch(`/api/admin/brands?${params.toString()}`)
        const json = await resp.json().catch(() => ({}))

        if (!resp.ok || !json?.success) {
          const msg = json?.error || 'Failed to load brands'
          setError(msg)
          setBrands([])
          setTotalBrands(0)
          return
        }

        setBrands(json.data || [])
        setTotalBrands(json.total || 0)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load brands'
        setError(msg)
        setBrands([])
        setTotalBrands(0)
      } finally {
        setLoadingBrands(false)
      }
    }
    loadBrands()
  }, [search, filterCategory, sortKey, sortDirDesc, page])

  // Load categories once – they change rarely and don't depend on filters/pagination
  useEffect(() => {
    async function loadCategories() {
      try {
        const resp = await fetch('/api/admin/brand-offer-categories')
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

  // Load offers only for brands visible on the current page
  useEffect(() => {
    async function loadOffersForVisibleBrands() {
      // If there are no brands on this page, clear offers and skip the query
      if (!brands.length) {
        setOffers([])
        return
      }

      setLoadingOffers(true)
      const brandIds = brands.map(b => b.id)
      try {
        const resp = await fetch(
          '/api/admin/brand-offers/list?brandIds=' + encodeURIComponent(brandIds.join(','))
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

    loadOffersForVisibleBrands()
  }, [brands])

  async function submitBrand(e: React.FormEvent) {
    e.preventDefault()
    setBrandMsg(null)
    setBrandErrors({})
    setSubmittingBrand(true)
    
    // Validate input
    const validationResult = brandSchema.safeParse({
      name: brandForm.name,
      website: brandForm.website,
      about: brandForm.about,
      tags: brandForm.tags,
      category: brandForm.category,
      sort_order: brandForm.sort_order,
    })

    if (!validationResult.success) {
      const fieldErrors: typeof brandErrors = {}
      for (const issue of validationResult.error.issues) {
        const field = issue.path?.[0] as keyof typeof brandForm | undefined
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setBrandErrors(fieldErrors)

      const firstError = validationResult.error.issues[0]
      const firstMessage = firstError?.message || 'Validation failed'
      setBrandMsg(firstMessage)
      pushToast('error', firstMessage)
      logger.warn('Brand form validation failed', validationResult.error, { form: brandForm })
      setSubmittingBrand(false)
      return
    }

    // Validate logo file (required)
    if (!logoFile) {
      const msg = 'Logo image is required'
      setBrandMsg(msg)
      pushToast('error', msg)
      setSubmittingBrand(false)
      return
    }
    const logoValidation = await validateFile(logoFile)
    if (!logoValidation.valid) {
      const msg = logoValidation.error || 'Invalid logo file'
      setBrandMsg(msg)
      pushToast('error', msg)
      setSubmittingBrand(false)
      return
    }

    // Validate cover file (required)
    if (!coverFile) {
      const msg = 'Cover image is required'
      setBrandMsg(msg)
      pushToast('error', msg)
      setSubmittingBrand(false)
      return
    }
    const coverValidation = await validateFile(coverFile)
    if (!coverValidation.valid) {
      const msg = coverValidation.error || 'Invalid cover file'
      setBrandMsg(msg)
      pushToast('error', msg)
      setSubmittingBrand(false)
      return
    }

    const validated = validationResult.data

    // Create via admin API (CSRF + server-side validation and logging)
    let created: { id: string; name: string } | null = null
    try {
      const csrfToken = typeof document !== 'undefined'
        ? (document.cookie.split('; ').find(c => c.startsWith('csrf-token='))?.split('=')[1])
        : undefined
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          formData: {
            name: validated.name,
            website: validated.website,
            about: validated.about,
            tags: validated.tags,
            category: validated.category,
            sort_order: validated.sort_order,
          },
        })
      })
      const result = await response.json()
      if (!response.ok || !result?.success || !result?.data?.id) {
        const errorMsg = result?.error || 'Failed to create brand'
        setBrandMsg(errorMsg)
        pushToast('error', errorMsg)
        logger.error('Failed to create brand via API', result)
        return
      }
      created = result.data
    } catch (apiErr) {
      const message = apiErr instanceof Error ? apiErr.message : 'Failed to create brand'
      setBrandMsg(message)
      pushToast('error', message)
      logger.error('Brand create API error', apiErr, { form: validated })
      setSubmittingBrand(false)
      return
    }

    if (!created) {
      setBrandMsg('Failed to create brand')
      pushToast('error', 'Failed to create brand')
      setSubmittingBrand(false)
      return
    }

    // Upload images via admin API
    try {
      const csrfToken = getCookie('csrf-token')
      if (logoFile) {
        const form = new FormData()
        form.append('brand_id', created.id)
        form.append('type', 'logo')
        form.append('file', logoFile, logoFile.name)
        const resp = await fetch('/api/admin/brand-images', {
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
      }
      if (coverFile) {
        const form = new FormData()
        form.append('brand_id', created.id)
        form.append('type', 'cover')
        form.append('file', coverFile, coverFile.name)
        const resp = await fetch('/api/admin/brand-images', {
          method: 'POST',
          headers: {
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
          },
          body: form
        })
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to upload cover')
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload images'
      setBrandMsg(message)
      pushToast('error', message)
      logger.error('Failed to upload brand images (admin API)', err, { brandId: created.id })
      setSubmittingBrand(false)
      return
    }

    setBrandMsg(`Created brand: ${created.name}`)
    pushToast('success', `Created brand: ${created.name}`)
    setBrandForm({ name: '', website: '', about: '', tags: '', category: '', sort_order: '' })
    setLogoFile(null)
    setCoverFile(null)
    // Reload first page using the server-side listing API
    try {
      const params = new URLSearchParams({
        search: '',
        filterCategory: '',
        sortKey: 'created_at',
        sortDir: 'desc',
        page: '0',
        pageSize: String(pageSize),
      })
      const resp = await fetch(`/api/admin/brands?${params.toString()}`)
      const json = await resp.json().catch(() => ({}))
      if (resp.ok && json?.success) {
        setBrands(json.data || [])
        setTotalBrands(json.total || 0)
        setPage(0)
      }
    } catch {
      // leave existing list if refresh fails
    }
    setSubmittingBrand(false)
  }

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault()
    setOfferMsg(null)
    setSubmittingOffer(true)
    try {
      const csrfToken = getCookie('csrf-token')
      const resp = await fetch('/api/admin/brand-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
        },
        body: JSON.stringify({
          brand_id: offerForm.brand_id,
          title: offerForm.title.trim(),
          start_date: offerForm.start_date.trim() || '',
          end_date: offerForm.end_date.trim() || '',
          terms_conditions: offerForm.terms_conditions.trim() || '',
          featured: offerForm.featured,
          discount_type: offerForm.discount_type
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
      setOfferForm({ brand_id: '', title: '', start_date: '', end_date: '', terms_conditions: '', featured: false, discount_type: 'in_store' })
    } finally {
      setSubmittingOffer(false)
    }
  }


  // Right-side edit drawer & confirm modal state

  function openBrandDrawer(b: BrandItem) {
    setDrawerKind('brand')
    setDrawerBrandId(b.id)
    setDrawerOfferId(null)
    setDrawerBrandDraft({
      name: b.name,
      website: b.website || '',
      about: b.about || '',
      category: b.category || '',
      tagsCsv: (b.tags || []).join(', '),
      sort_order: b.sort_order ?? null,
      newLogoFile: null,
      removeLogo: false,
      newCoverFile: null,
      removeCover: false,
    })
    setIsDrawerOpen(true)
  }
  function openOfferDrawer(o: OfferItem) {
    setDrawerKind('offer')
    setDrawerOfferId(o.id)
    setDrawerBrandId(null)
    setDrawerOfferDraft({
      title: o.title,
      start_date: o.start_date || '',
      end_date: o.end_date || '',
      terms_conditions: o.terms_conditions || '',
      featured: o.featured,
      discount_type: o.discount_type,
      brand_id: o.brand_id,
    })
    setIsDrawerOpen(true)
  }
  function closeDrawer() {
    setIsDrawerOpen(false)
    setDrawerKind(null)
    setDrawerBrandId(null)
    setDrawerOfferId(null)
    setDrawerBrandDraft({})
    setDrawerOfferDraft({})
  }
  async function saveDrawer() {
    try {
      setSavingDrawer(true)
      if (drawerKind === 'brand' && drawerBrandId) {
        const update: Partial<BrandItem> & { tags?: string[] | null; logo_url?: string | null; cover_url?: string | null } = {
          name: (drawerBrandDraft.name || '').toString().trim(),
          website: (drawerBrandDraft.website || '') || null,
          about: (drawerBrandDraft.about || '') || null,
          category: (drawerBrandDraft.category || '') || null,
          tags: drawerBrandDraft.tagsCsv ? drawerBrandDraft.tagsCsv.split(',').map(s => s.trim()).filter(Boolean) : null,
        }

        if (drawerBrandDraft.sort_order !== undefined) {
          update.sort_order = drawerBrandDraft.sort_order === null ? null : drawerBrandDraft.sort_order
        }

        // Handle image replacements/removals
        const current = brands.find(x => x.id === drawerBrandId)
        try {
          const csrfToken = getCookie('csrf-token')
          if (drawerBrandDraft.newLogoFile) {
            const form = new FormData()
            form.append('brand_id', drawerBrandId)
            form.append('type', 'logo')
            form.append('file', drawerBrandDraft.newLogoFile, drawerBrandDraft.newLogoFile.name)
            if (current?.logo_url) form.append('old_url', current.logo_url)
            const resp = await fetch('/api/admin/brand-images', {
              method: 'POST',
              headers: {
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: form
            })
            if (!resp.ok) throw new Error('Failed to upload new logo')
          } else if (drawerBrandDraft.removeLogo) {
            const resp = await fetch('/api/admin/brand-images', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: JSON.stringify({ brand_id: drawerBrandId, type: 'logo' })
            })
            if (!resp.ok) throw new Error('Failed to remove logo')
            update.logo_url = null
          }

          if (drawerBrandDraft.newCoverFile) {
            const form = new FormData()
            form.append('brand_id', drawerBrandId)
            form.append('type', 'cover')
            form.append('file', drawerBrandDraft.newCoverFile, drawerBrandDraft.newCoverFile.name)
            if (current?.cover_url) form.append('old_url', current.cover_url)
            const resp = await fetch('/api/admin/brand-images', {
              method: 'POST',
              headers: {
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: form
            })
            if (!resp.ok) throw new Error('Failed to upload new cover')
          } else if (drawerBrandDraft.removeCover) {
            const resp = await fetch('/api/admin/brand-images', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
              },
              body: JSON.stringify({ brand_id: drawerBrandId, type: 'cover' })
            })
            if (!resp.ok) throw new Error('Failed to remove cover')
            update.cover_url = null
          }
        } catch (e) {
          pushToast('error', e instanceof Error ? e.message : 'Failed to update images')
          return
        }
        const csrfToken = getCookie('csrf-token')
        const resp = await fetch('/api/admin/brands', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          },
          body: JSON.stringify({ id: drawerBrandId, ...update }),
        })
        const result = await resp.json().catch(() => ({}))
        if (!resp.ok || !result?.success) {
          throw new Error(result?.error || 'Failed to save brand')
        }
        setBrands(prev =>
          prev.map(x => (x.id === drawerBrandId ? (result.data as BrandItem) : x))
        )
        pushToast('success', 'Brand saved')
        closeDrawer()
        return
      }
      if (drawerKind === 'offer' && drawerOfferId) {
        const update: Partial<OfferItem> = {
          title: (drawerOfferDraft.title || '').toString().trim(),
          start_date: (drawerOfferDraft.start_date as string | undefined)?.trim() || '',
          end_date: (drawerOfferDraft.end_date as string | undefined)?.trim() || '',
          terms_conditions: (drawerOfferDraft.terms_conditions as string | undefined)?.trim() || '',
          featured: drawerOfferDraft.featured ?? false,
          discount_type: drawerOfferDraft.discount_type || 'in_store',
        }
        const csrfToken = getCookie('csrf-token')
        const resp = await fetch('/api/admin/brand-offers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
          },
          body: JSON.stringify({ id: drawerOfferId, ...update })
        })
        const result = await resp.json().catch(() => ({}))
        if (!resp.ok || !result?.success) throw new Error(result?.error || 'Failed to save offer')
        setOffers(prev => prev.map(x => x.id === drawerOfferId ? (result.data as OfferItem) : x))
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
          <h1 className="text-2xl font-semibold text-gray-900">Brand Builder</h1>
          <p className="text-sm text-gray-600 mt-1">Create brands and add offers</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Brands" icon="🏷️" value={brands.length} loading={loadingBrands} />
        <StatCard title="Categories" icon="🗂️" value={categories.length} />
      </div>

      {/* Brand Creator */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <h2 className="text-xl font-semibold mb-4">Create Brand</h2>
        <form onSubmit={submitBrand} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand name <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. Acme Co" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })} required />
              {brandErrors.name ? (
                <p className="text-xs text-red-600 mt-1">{brandErrors.name}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Public display name</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="https://example.com" value={brandForm.website} onChange={e => setBrandForm({ ...brandForm, website: e.target.value })} required />
              {brandErrors.website ? (
                <p className="text-xs text-red-600 mt-1">{brandErrors.website}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Optional official website</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo image <span className="text-red-600">*</span></label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files?.[0] || null)} required />
                <span>{logoFile ? `Selected: ${logoFile.name}` : 'Click to upload logo'}</span>
              </label>
              {logoFile && (
                <div className="mt-2 relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt="Logo preview"
                    className="h-14 w-14 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-red-600 text-white rounded"
                    onClick={() => setLogoFile(null)}
                    aria-label="Remove logo image"
                  >
                    Remove
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Square logo works best (PNG/SVG)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover image <span className="text-red-600">*</span></label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0] || null
                  if (!file) {
                    setCoverFile(null)
                    return
                  }

                  const validation = await validateCoverImageClient(file)
                  if (!validation.valid) {
                    setCoverFile(null)
                    pushToast('error', validation.error || 'Invalid cover image')
                    e.target.value = ''
                    return
                  }

                  setCoverFile(file)
                }}
                required
              />
                <span>{coverFile ? `Selected: ${coverFile.name}` : 'Click to upload cover'}</span>
              </label>
              {coverFile && (
                <div className="mt-2 relative max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover preview"
                    className="h-20 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 bg-red-600 text-white rounded"
                    onClick={() => setCoverFile(null)}
                    aria-label="Remove cover image"
                  >
                    Remove
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Suggested landscape 7:4 (≈16:9) at least 1120x640px (JPG/PNG/WebP).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
              <select className="border rounded-lg px-3 py-2 w-full" value={brandForm.category} onChange={e => setBrandForm({ ...brandForm, category: e.target.value })} required>
                <option value="">—</option>
                {categories.map(c => (<option key={c.key} value={c.key}>{c.label}</option>))}
              </select>
              {brandErrors.category && (
                <p className="text-xs text-red-600 mt-1">{brandErrors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. apparel, student, tech" value={brandForm.tags} onChange={e => setBrandForm({ ...brandForm, tags: e.target.value })} />
              {brandErrors.tags ? (
                <p className="text-xs text-red-600 mt-1">{brandErrors.tags}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort order <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="0"
                value={brandForm.sort_order}
                onChange={e => setBrandForm({ ...brandForm, sort_order: e.target.value })}
                required
              />
              {brandErrors.sort_order ? (
                <p className="text-xs text-red-600 mt-1">{brandErrors.sort_order}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Higher numbers can be shown first. Leave blank to use default.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About <span className="text-red-600">*</span></label>
            <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Short brand description" value={brandForm.about} onChange={e => setBrandForm({ ...brandForm, about: e.target.value })} required />
            {brandErrors.about && (
              <p className="text-xs text-red-600 mt-1">{brandErrors.about}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={brandDisabled}>
              {submittingBrand ? 'Creating...' : 'Create Brand'}
            </button>
            {brandMsg && <div className="text-sm text-gray-700">{brandMsg}</div>}
          </div>
        </form>
      </section>

      {/* Offer Creator */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <h2 className="text-xl font-semibold mb-4">Create Brand Offer</h2>
        <form onSubmit={submitOffer} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand <span className="text-red-600">*</span></label>
              <select className="border rounded-lg px-3 py-2 w-full" value={offerForm.brand_id} onChange={e => setOfferForm({ ...offerForm, brand_id: e.target.value })} required>
                <option value="">{loadingBrands ? 'Loading…' : 'Select a brand'}</option>
                {brands.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={offerForm.featured} onChange={e => setOfferForm({ ...offerForm, featured: e.target.checked })} />
              <span className="text-sm text-gray-700">Feature this offer</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount type</label>
              <select className="border rounded-lg px-3 py-2 w-full" value={offerForm.discount_type} onChange={e => setOfferForm({ ...offerForm, discount_type: e.target.value as 'in_store' | 'online' | 'both' })}>
                <option value="in_store">In store</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={offerDisabled}>
              {submittingOffer ? 'Creating...' : 'Create Offer'}
            </button>
            {offerMsg && <div className="text-sm text-gray-700">{offerMsg}</div>}
          </div>
        </form>
      </section>

      {/* Brands List */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Brands</h2>
          {loadingBrands && <div className="text-sm text-black/60">Loading…</div>}
        </div>

        {/* Toolbar above list */}
        <div className="mt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Search brands, websites, tags" value={search} onChange={e => { setPage(0); setSearch(e.target.value) }} />
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
          {brands.map(b => {
            const isEditing = editingBrandId === b.id
            return (
              <div key={b.id} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 hover-lift glass-effect overflow-hidden p-6">
                {!isEditing ? (
                  <div className="grid gap-2">
                    {(b.logo_url || b.cover_url) && (
                      <div className="flex gap-3 items-center">
                        {b.logo_url && (
                          <Image 
                            src={b.logo_url} 
                            alt="logo" 
                            width={40} 
                            height={40} 
                            className="h-10 w-10 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => setPreviewImage(b.logo_url!)}
                          />
                        )}
                        {b.cover_url && (
                          <Image 
                            src={b.cover_url} 
                            alt="cover" 
                            width={64} 
                            height={40} 
                            className="h-10 w-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => setPreviewImage(b.cover_url!)}
                          />
                        )}
                      </div>
                    )}
                    <div className="font-medium">{b.name}</div>
                    <div className="text-sm text-black/70">{b.website || ''}</div>
                    <div className="text-sm">Category: {categories.find(c => c.key === b.category)?.label || b.category || '-'}</div>
                    <div className="text-sm">Tags: {(b.tags || []).join(', ') || '-'}</div>
                    <div className="text-sm">Sort order: {b.sort_order ?? '-'}</div>
                    <div className="text-sm line-clamp-2">{b.about || ''}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-sm rounded-xl px-3 py-1.5 border border-gray-300 hover:bg-gray-100 transition-colors"
                        onClick={() => openBrandDrawer(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm rounded-xl px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() =>
                          openConfirm(
                            'Delete brand',
                            `Delete brand "${b.name}" and all its offers and images?`,
                            async () => {
                              const csrfToken = getCookie('csrf-token')
                              const resp = await fetch('/api/admin/brands', {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type': 'application/json',
                                  ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
                                },
                                body: JSON.stringify({ id: b.id }),
                              })
                              const result = await resp.json().catch(() => ({}))
                              if (!resp.ok || !result?.success) {
                                pushToast('error', result?.error || 'Failed to delete brand')
                                return
                              }
                              setBrands(prev => prev.filter(x => x.id !== b.id))
                              setOffers(prev => prev.filter(o => o.brand_id !== b.id))
                              pushToast('success', 'Brand deleted')
                            }
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 border-t border-black/10 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Offers</div>
                        {loadingOffers && <div className="text-xs text-black/60">Loading…</div>}
                      </div>
                      <div className="space-y-3 mt-2">
                        {offers.filter(o => o.brand_id === b.id).map(o => {
                          return (
                            <div key={o.id} className="border border-black/10 rounded-2xl p-3">
                              <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{o.title}</div>
                                  {o.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Featured</span>}
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">{o.discount_type}</span>
                                </div>
                                <div className="text-xs">{o.start_date || ''} → {o.end_date || ''}</div>
                                <div className="flex gap-2 mt-2">
                                  <button className="text-xs rounded-lg px-2 py-1 border border-gray-300 hover:bg-gray-100 transition-colors" onClick={() => openOfferDrawer(o)}>Edit</button>
                                  <button className="text-xs rounded-lg px-2 py-1 border border-red-300 text-red-700 hover:bg-red-50 transition-colors" onClick={() => openConfirm('Delete offer', `Delete offer "${o.title}"?`, async () => {
                                    const csrfToken = getCookie('csrf-token')
                                    const resp = await fetch('/api/admin/brand-offers', {
                                      method: 'DELETE',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
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
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
          {!loadingBrands && brands.length === 0 && (
            <div className="text-sm text-black/60">No brands yet.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}{totalBrands ? ` • ${totalBrands} total` : ''}</div>
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
              <h3 className="text-lg font-semibold">{drawerKind === 'brand' ? 'Edit Brand' : 'Edit Offer'}</h3>
              <button className="text-sm rounded px-3 py-1 border hover:bg-gray-50" onClick={closeDrawer}>Close</button>
            </div>
            {drawerKind === 'brand' ? (
              <div className="space-y-3">
                <input className="border rounded px-3 py-2 w-full" placeholder="Name" value={(drawerBrandDraft.name as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, name: e.target.value }))} />
                <input className="border rounded px-3 py-2 w-full" placeholder="Website" value={(drawerBrandDraft.website as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, website: e.target.value }))} />
                <select className="border rounded px-3 py-2 w-full" value={(drawerBrandDraft.category as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, category: e.target.value }))}>
                  <option value="">—</option>
                  {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                <input className="border rounded px-3 py-2 w-full" placeholder="Tags (comma)" value={(drawerBrandDraft.tagsCsv as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, tagsCsv: e.target.value }))} />
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                placeholder="Sort order"
                value={drawerBrandDraft.sort_order !== null && drawerBrandDraft.sort_order !== undefined ? drawerBrandDraft.sort_order : ''}
                onChange={e =>
                  setDrawerBrandDraft(s => ({
                    ...s,
                    sort_order: e.target.value === '' ? null : (Number.isNaN(parseInt(e.target.value, 10)) ? null : parseInt(e.target.value, 10)),
                  }))
                }
              />
                <textarea className="border rounded px-3 py-2 w-full" placeholder="About" value={(drawerBrandDraft.about as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, about: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-sm mb-1">Logo</label>
                    <div className="space-y-2">
                      {brands.find(b => b.id === drawerBrandId)?.logo_url && (
                        <div className="flex items-center gap-2">
                          <Image
                            src={brands.find(b => b.id === drawerBrandId)!.logo_url!}
                            alt="Current logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPreviewImage(brands.find(b => b.id === drawerBrandId)!.logo_url!)}
                          />
                          <span className="text-xs text-gray-600">Current logo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="border rounded px-3 py-2 w-full text-sm"
                        onChange={e => setDrawerBrandDraft(s => ({ ...s, newLogoFile: e.target.files?.[0] || null, removeLogo: false }))}
                      />
                      {brands.find(b => b.id === drawerBrandId)?.logo_url && (
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={Boolean(drawerBrandDraft.removeLogo)}
                            onChange={e => setDrawerBrandDraft(s => ({ ...s, removeLogo: e.target.checked, newLogoFile: null }))}
                          />
                          <span>Remove current logo</span>
                        </label>
                      )}
                      {drawerBrandDraft.newLogoFile && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-600">New logo preview: </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={URL.createObjectURL(drawerBrandDraft.newLogoFile)}
                            alt="New logo preview"
                            className="h-10 w-10 object-cover rounded border inline-block ml-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Cover image</label>
                    <div className="space-y-2">
                      {brands.find(b => b.id === drawerBrandId)?.cover_url && (
                        <div className="inline-block relative">
                          <Image
                            src={brands.find(b => b.id === drawerBrandId)!.cover_url!}
                            alt="Current cover"
                            width={120}
                            height={80}
                            className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPreviewImage(brands.find(b => b.id === drawerBrandId)!.cover_url!)}
                          />
                          <span className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 bg-black/70 text-white rounded">
                            Current
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="border rounded px-3 py-2 w-full text-sm"
                        onChange={async e => {
                          const file = e.target.files?.[0] || null
                          if (!file) {
                            setDrawerBrandDraft(s => ({ ...s, newCoverFile: null }))
                            return
                          }

                          const validation = await validateCoverImageClient(file)
                          if (!validation.valid) {
                            setDrawerBrandDraft(s => ({ ...s, newCoverFile: null }))
                            pushToast('error', validation.error || 'Invalid cover image')
                            e.target.value = ''
                            return
                          }

                          setDrawerBrandDraft(s => ({ ...s, newCoverFile: file, removeCover: false }))
                        }}
                      />
                      {brands.find(b => b.id === drawerBrandId)?.cover_url && (
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={Boolean(drawerBrandDraft.removeCover)}
                            onChange={e => setDrawerBrandDraft(s => ({ ...s, removeCover: e.target.checked, newCoverFile: null }))}
                          />
                          <span>Remove current cover</span>
                        </label>
                      )}
                      {drawerBrandDraft.newCoverFile && (
                        <div className="mt-2 max-w-xs">
                          <span className="text-xs text-gray-600">New cover preview:</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={URL.createObjectURL(drawerBrandDraft.newCoverFile)}
                            alt="New cover preview"
                            className="mt-1 w-full h-20 object-cover rounded border"
                          />
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
                <input className="border rounded px-3 py-2 w-full" placeholder="Title" value={(drawerOfferDraft.title as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, title: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="date" className="border rounded px-3 py-2 w-full" value={(drawerOfferDraft.start_date as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, start_date: e.target.value }))} />
                  <input type="date" className="border rounded px-3 py-2 w-full" value={(drawerOfferDraft.end_date as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, end_date: e.target.value }))} />
                </div>
                <textarea className="border rounded px-3 py-2 w-full" placeholder="Terms & Conditions" value={(drawerOfferDraft.terms_conditions as string) || ''} onChange={e => setDrawerOfferDraft(s => ({ ...s, terms_conditions: e.target.value }))} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={Boolean(drawerOfferDraft.featured)} onChange={e => setDrawerOfferDraft(s => ({ ...s, featured: e.target.checked }))} />
                    <span>Featured</span>
                  </label>
                  <select className="border rounded px-3 py-2" value={(drawerOfferDraft.discount_type as OfferItem['discount_type']) || 'in_store'} onChange={e => setDrawerOfferDraft(s => ({ ...s, discount_type: e.target.value as OfferItem['discount_type'] }))}>
                    <option value="in_store">In store</option>
                    <option value="online">Online</option>
                    <option value="both">Both</option>
                  </select>
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


