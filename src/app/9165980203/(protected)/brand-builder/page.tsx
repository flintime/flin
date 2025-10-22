'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import StatCard from '@/components/admin/StatCard'

type BrandItem = {
  id: string
  name: string
  website: string | null
  category: string | null
  tags: string[] | null
  about: string | null
  logo_url: string | null
  cover_url: string | null
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
  function getPathFromPublicUrl(publicUrl?: string | null): string | null {
    if (!publicUrl) return null
    const idx = publicUrl.indexOf('/brand_images/')
    if (idx === -1) return null
    return publicUrl.substring(idx + '/brand_images/'.length)
  }
  const [authChecked, setAuthChecked] = useState<boolean>(false)
  const [sessionUserEmail, setSessionUserEmail] = useState<string | null>(null)
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [loadingBrands, setLoadingBrands] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const brandIdToName = useMemo(() => Object.fromEntries(brands.map(b => [b.id, b.name])), [brands])
  const [categories, setCategories] = useState<Array<{ key: string, label: string }>>([])

  const [brandForm, setBrandForm] = useState({
    name: '',
    website: '',
    about: '',
    tags: '',
    category: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [brandMsg, setBrandMsg] = useState<string | null>(null)
  const brandDisabled = useMemo(() => brandForm.name.trim().length === 0, [brandForm.name])

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortKey, setSortKey] = useState<'created_at' | 'name'>('created_at')
  const [sortDirDesc, setSortDirDesc] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 20
  const [totalBrands, setTotalBrands] = useState(0)

  const [toasts, setToasts] = useState<Array<{ id: number, type: 'success' | 'error', text: string }>>([])
  function pushToast(type: 'success' | 'error', text: string) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, text }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const totalPages = Math.max(1, Math.ceil(totalBrands / pageSize))

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
  const offerDisabled = useMemo(() => !offerForm.brand_id || !offerForm.title || !offerForm.start_date || !offerForm.end_date, [offerForm])

  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loadingOffers, setLoadingOffers] = useState<boolean>(true)
  const [editingBrandId] = useState<string | null>(null)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerKind, setDrawerKind] = useState<null | 'brand' | 'offer'>(null)
  const [drawerBrandId, setDrawerBrandId] = useState<string | null>(null)
  const [drawerOfferId, setDrawerOfferId] = useState<string | null>(null)
  const [drawerBrandDraft, setDrawerBrandDraft] = useState<Partial<BrandItem> & { tagsCsv?: string, newLogoFile?: File | null, removeLogo?: boolean, newCoverFile?: File | null, removeCover?: boolean }>({})
  const [drawerOfferDraft, setDrawerOfferDraft] = useState<Partial<OfferItem>>({})

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void> | void)>(null)

  useEffect(() => {
    async function loadBrands() {
      setLoadingBrands(true)
      setError(null)
      let query = supabase
        .from('brands')
        .select('id, name, website, category, tags, about, logo_url, cover_url, created_at', { count: 'exact' })

      const q = search.trim()
      if (q) {
        const like = `%${q}%`
        query = query.or(`name.ilike.${like},website.ilike.${like}`)
      }
      if (filterCategory) {
        query = query.eq('category', filterCategory)
      }
      query = query.order(sortKey, { ascending: !sortDirDesc })

      const from = page * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) {
        setError(error.message)
        setBrands([])
        setTotalBrands(0)
      } else {
        setBrands(data || [])
        setTotalBrands(count || 0)
      }
      setLoadingBrands(false)
    }
    async function loadOffers() {
      setLoadingOffers(true)
      const query = supabase
        .from('brand_offers')
        .select('id, brand_id, title, start_date, end_date, terms_conditions, featured, discount_type, created_at')
        .order('created_at', { ascending: false })
      const { data, error } = await query
      if (!error) setOffers(data || [])
      setLoadingOffers(false)
    }
    async function loadCategories() {
      const { data } = await supabase.from('brand_offer_categories').select('key, label').order('label')
      setCategories(data || [])
    }
    loadBrands()
    loadOffers()
    loadCategories()
    supabase.auth.getSession().then(({ data }) => {
      setSessionUserEmail(data.session?.user?.email ?? null)
      setAuthChecked(true)
    })
  }, [search, filterCategory, sortKey, sortDirDesc, page])

  async function submitBrand(e: React.FormEvent) {
    e.preventDefault()
    setBrandMsg(null)
    const basePayload: {
      name: string
      website: string | null
      about: string | null
      tags: string[] | null
      category: string | null
    } = {
      name: brandForm.name.trim(),
      website: brandForm.website || null,
      about: brandForm.about || null,
      tags: brandForm.tags ? brandForm.tags.split(',').map(s => s.trim()).filter(Boolean) : null,
      category: brandForm.category || null
    }

    const { data: created, error: createErr } = await supabase
      .from('brands')
      .insert([basePayload])
      .select('id, name')
      .single()

    if (createErr || !created?.id) {
      setBrandMsg(createErr?.message || 'Failed to create brand')
      pushToast('error', createErr?.message || 'Failed to create brand')
      return
    }

    const updateFields: { logo_url?: string; cover_url?: string } = {}
    try {
      if (logoFile) {
        const ext = (logoFile.name.split('.').pop() || 'jpg').toLowerCase()
        const path = `brands/${created.id}/logo-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('brand_images').upload(path, logoFile, { cacheControl: '3600', upsert: false })
        if (uploadErr) throw uploadErr
        const { data: pub } = supabase.storage.from('brand_images').getPublicUrl(path)
        if (pub?.publicUrl) updateFields.logo_url = pub.publicUrl
      }
      if (coverFile) {
        const ext = (coverFile.name.split('.').pop() || 'jpg').toLowerCase()
        const path = `brands/${created.id}/cover-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('brand_images').upload(path, coverFile, { cacheControl: '3600', upsert: false })
        if (uploadErr) throw uploadErr
        const { data: pub } = supabase.storage.from('brand_images').getPublicUrl(path)
        if (pub?.publicUrl) updateFields.cover_url = pub.publicUrl
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload images'
      setBrandMsg(message)
      pushToast('error', message)
      return
    }

    if (Object.keys(updateFields).length > 0) {
      await supabase.from('brands').update(updateFields).eq('id', created.id)
    }

    setBrandMsg(`Created brand: ${created.name}`)
    pushToast('success', `Created brand: ${created.name}`)
    setBrandForm({ name: '', website: '', about: '', tags: '', category: '' })
    setLogoFile(null)
    setCoverFile(null)
    const { data: refreshed } = await supabase.from('brands').select('id, name, website, category, tags, about, logo_url, cover_url, created_at').order('created_at', { ascending: false })
    setBrands(refreshed || [])
  }

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault()
    setOfferMsg(null)
    const { data, error } = await supabase
      .from('brand_offers')
      .insert([{ 
        brand_id: offerForm.brand_id,
        title: offerForm.title,
        start_date: offerForm.start_date,
        end_date: offerForm.end_date,
        terms_conditions: offerForm.terms_conditions || null,
        featured: offerForm.featured,
        discount_type: offerForm.discount_type
      }])
      .select('id, title')
      .single()

    if (error) {
      setOfferMsg(error.message)
      pushToast('error', error.message)
      return
    }

    setOfferMsg(`Created offer: ${data?.title}`)
    pushToast('success', `Created offer: ${data?.title}`)
    setOfferForm({ brand_id: '', title: '', start_date: '', end_date: '', terms_conditions: '', featured: false, discount_type: 'in_store' })
  }

  if (!authChecked) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-sm text-black/60">Checking authentication…</div>
      </div>
    )
  }

  if (authChecked && !sessionUserEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 border border-black/10 rounded-xl p-6 text-center">
          <h1 className="text-xl font-semibold">Admin Access</h1>
          <p className="text-black/70">Please sign in to manage brands and offers.</p>
          <Link href="/9165980203/login" className="inline-block bg-black text-white rounded px-4 py-2">Sign in</Link>
        </div>
      </div>
    )
  }

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
      if (drawerKind === 'brand' && drawerBrandId) {
        const update: Partial<BrandItem> & { tags?: string[] | null; logo_url?: string | null; cover_url?: string | null } = {
          name: (drawerBrandDraft.name || '').toString().trim(),
          website: (drawerBrandDraft.website || '') || null,
          about: (drawerBrandDraft.about || '') || null,
          category: (drawerBrandDraft.category || '') || null,
          tags: drawerBrandDraft.tagsCsv ? drawerBrandDraft.tagsCsv.split(',').map(s => s.trim()).filter(Boolean) : null,
        }

        const current = brands.find(x => x.id === drawerBrandId)
        try {
          if (drawerBrandDraft.newLogoFile) {
            const ext = (drawerBrandDraft.newLogoFile.name.split('.').pop() || 'jpg').toLowerCase()
            const path = `brands/${drawerBrandId}/logo-${Date.now()}.${ext}`
            const { error: uploadErr } = await supabase.storage.from('brand_images').upload(path, drawerBrandDraft.newLogoFile, { cacheControl: '3600', upsert: false })
            if (uploadErr) throw uploadErr
            const { data: pub } = supabase.storage.from('brand_images').getPublicUrl(path)
            if (pub?.publicUrl) update.logo_url = pub.publicUrl
            const old = current?.logo_url ? getPathFromPublicUrl(current.logo_url) : null
            if (old) await supabase.storage.from('brand_images').remove([old])
          } else if (drawerBrandDraft.removeLogo) {
            update.logo_url = null
            const old = current?.logo_url ? getPathFromPublicUrl(current.logo_url) : null
            if (old) await supabase.storage.from('brand_images').remove([old])
          }

          if (drawerBrandDraft.newCoverFile) {
            const ext = (drawerBrandDraft.newCoverFile.name.split('.').pop() || 'jpg').toLowerCase()
            const path = `brands/${drawerBrandId}/cover-${Date.now()}.${ext}`
            const { error: uploadErr } = await supabase.storage.from('brand_images').upload(path, drawerBrandDraft.newCoverFile, { cacheControl: '3600', upsert: false })
            if (uploadErr) throw uploadErr
            const { data: pub } = supabase.storage.from('brand_images').getPublicUrl(path)
            if (pub?.publicUrl) update.cover_url = pub.publicUrl
            const old = current?.cover_url ? getPathFromPublicUrl(current.cover_url) : null
            if (old) await supabase.storage.from('brand_images').remove([old])
          } else if (drawerBrandDraft.removeCover) {
            update.cover_url = null
            const old = current?.cover_url ? getPathFromPublicUrl(current.cover_url) : null
            if (old) await supabase.storage.from('brand_images').remove([old])
          }
        } catch {
          pushToast('error', 'Failed to update images')
          return
        }
        const { data, error } = await supabase
          .from('brands')
          .update(update)
          .eq('id', drawerBrandId)
          .select('id, name, website, category, tags, about, logo_url, cover_url, created_at')
          .single()
        if (error) throw error
        setBrands(prev => prev.map(x => x.id === drawerBrandId ? (data as BrandItem) : x))
        pushToast('success', 'Brand saved')
        closeDrawer()
        return
      }
      if (drawerKind === 'offer' && drawerOfferId) {
        const update: Partial<OfferItem> = {
          title: (drawerOfferDraft.title || '').toString().trim(),
          start_date: drawerOfferDraft.start_date || null,
          end_date: drawerOfferDraft.end_date || null,
          terms_conditions: drawerOfferDraft.terms_conditions || null,
          featured: drawerOfferDraft.featured ?? false,
          discount_type: drawerOfferDraft.discount_type || 'in_store',
        }
        const { data, error } = await supabase
          .from('brand_offers')
          .update(update)
          .eq('id', drawerOfferId)
          .select('id, brand_id, title, start_date, end_date, terms_conditions, featured, discount_type, created_at')
          .single()
        if (error) throw error
        setOffers(prev => prev.map(x => x.id === drawerOfferId ? (data as OfferItem) : x))
        pushToast('success', 'Offer saved')
        closeDrawer()
        return
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      pushToast('error', message)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Brand Builder</h1>
          <p className="text-sm text-gray-600 mt-1">Create brands and add offers</p>
        </div>
        <div className="flex items-center gap-3">
          {sessionUserEmail ? (
            <span className="text-sm text-black/60">{sessionUserEmail}</span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Brands" icon="🏷️" value={brands.length} loading={loadingBrands} />
        <StatCard title="Offers" icon="🎁" value={offers.length} loading={loadingOffers} />
        <StatCard title="Categories" icon="🗂️" value={categories.length} />
      </div>

      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <h2 className="text-xl font-semibold mb-4">Create Brand</h2>
        <form onSubmit={submitBrand} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand name <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. Acme Co" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })} required />
              <p className="text-xs text-gray-500 mt-1">Public display name</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website <span className="text-red-600">*</span></label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="https://example.com" value={brandForm.website} onChange={e => setBrandForm({ ...brandForm, website: e.target.value })} required />
              <p className="text-xs text-gray-500 mt-1">Optional official website</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo image <span className="text-red-600">*</span></label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files?.[0] || null)} required />
                <span>Click to upload logo</span>
              </label>
              {logoFile && (
                <div className="mt-2"><img src={URL.createObjectURL(logoFile)} alt="logo preview" className="h-14 w-14 object-cover rounded border" /></div>
              )}
              <p className="text-xs text-gray-500 mt-1">Square logo works best (PNG/SVG)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover image <span className="text-red-600">*</span></label>
              <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-6 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} required />
                <span>Click to upload cover</span>
              </label>
              {coverFile && (
                <div className="mt-2"><img src={URL.createObjectURL(coverFile)} alt="cover preview" className="h-16 w-28 object-cover rounded border" /></div>
              )}
              <p className="text-xs text-gray-500 mt-1">Suggested 1200×400 (JPG/PNG)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
              <select className="border rounded-lg px-3 py-2 w-full" value={brandForm.category} onChange={e => setBrandForm({ ...brandForm, category: e.target.value })} required>
                <option value="">—</option>
                {categories.map(c => (<option key={c.key} value={c.key}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text sm font-medium text-gray-700 mb-1">Tags</label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. apparel, student, tech" value={brandForm.tags} onChange={e => setBrandForm({ ...brandForm, tags: e.target.value })} />
              <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About <span className="text-red-6 00">*</span></label>
            <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Short brand description" value={brandForm.about} onChange={e => setBrandForm({ ...brandForm, about: e.target.value })} required />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={brandDisabled}>Create Brand</button>
            {brandMsg && <div className="text-sm text-gray-700">{brandMsg}</div>}
          </div>
        </form>
      </section>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
              <input type="date" className="border rounded-lg px-3 py-2 w-full" value={offerForm.start_date} onChange={e => setOfferForm({ ...offerForm, start_date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
              <input type="date" className="border rounded-lg px-3 py-2 w-full" value={offerForm.end_date} onChange={e => setOfferForm({ ...offerForm, end_date: e.target.value })} required />
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
            <button type="submit" className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50" disabled={offerDisabled}>Create Offer</button>
            {offerMsg && <div className="text-sm text-gray-700">{offerMsg}</div>}
          </div>
        </form>
      </section>

      <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Brands</h2>
          {loadingBrands && <div className="text-sm text-black/60">Loading…</div>}
        </div>

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
                          <Image src={b.logo_url} alt="logo" width={40} height={40} className="h-10 w-10 object-cover rounded" />
                        )}
                        {b.cover_url && (
                          <Image src={b.cover_url} alt="cover" width={64} height={40} className="h-10 w-16 object-cover rounded" />
                        )}
                      </div>
                    )}
                    <div className="font-medium">{b.name}</div>
                    <div className="text-sm text-black/70">{b.website || ''}</div>
                    <div className="text-sm">Category: {categories.find(c => c.key === b.category)?.label || b.category || '-'}</div>
                    <div className="text-sm">Tags: {(b.tags || []).join(', ') || '-'}</div>
                    <div className="text-sm line-clamp-2">{b.about || ''}</div>
                    <div className="flex gap-2 mt-2">
                      <button className="text-sm rounded-xl px-3 py-1.5 border border-gray-300 hover:bg-gray-100 transition-colors" onClick={() => openBrandDrawer(b)}>Edit</button>
                      <button className="text-sm rounded-xl px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 transition-colors" onClick={() => openConfirm('Delete brand', `Are you sure you want to delete ${b.name}?`, async () => {
                        await supabase.from('brands').delete().eq('id', b.id)
                        const { data: refreshed } = await supabase.from('brands').select('id, name, website, category, tags, about, logo_url, cover_url, created_at').order('created_at', { ascending: false })
                        setBrands(refreshed || [])
                        pushToast('success', 'Brand deleted')
                      })}>Delete</button>
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
                                    await supabase.from('brand_offers').delete().eq('id', o.id)
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

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}{totalBrands ? ` • ${totalBrands} total` : ''}</div>
          <div className="flex items-center gap-2">
            <button className="rounded px-3 py-1 border disabled:opacity-50" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</button>
            <button className="rounded px-3 py-1 border disabled:opacity-50" disabled={page + 1 >= totalPages} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>Next</button>
          </div>
        </div>
      </section>

      {toasts.length > 0 && (
        <div className="fixed top-20 right-6 z-50 space-y-2">
          {toasts.map(t => (
            <div key={t.id} className={`rounded-lg px-4 py-2 shadow border ${t.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {t.text}
            </div>
          ))}
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={closeDrawer}></div>
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg白e shadow-2xl border-l border-black/10 p-6 overflow-y-auto">
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
                <textarea className="border rounded px-3 py-2 w-full" placeholder="About" value={(drawerBrandDraft.about as string) || ''} onChange={e => setDrawerBrandDraft(s => ({ ...s, about: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-sm mb-1">Replace logo</label>
                    <input type="file" accept="image/*" className="border rounded px-3 py-2 w-full" onChange={e => setDrawerBrandDraft(s => ({ ...s, newLogoFile: e.target.files?.[0] || null, removeLogo: false }))} />
                    <label className="mt-2 inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={Boolean(drawerBrandDraft.removeLogo)} onChange={e => setDrawerBrandDraft(s => ({ ...s, removeLogo: e.target.checked, newLogoFile: null }))} /> Remove current logo
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Replace cover</label>
                    <input type="file" accept="image/*" className="border rounded px-3 py-2 w-full" onChange={e => setDrawerBrandDraft(s => ({ ...s, newCoverFile: e.target.files?.[0] || null, removeCover: false }))} />
                    <label className="mt-2 inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={Boolean(drawerBrandDraft.removeCover)} onChange={e => setDrawerBrandDraft(s => ({ ...s, removeCover: e.target.checked, newCoverFile: null }))} /> Remove current cover
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="bg-black text-white rounded px-4 py-2" onClick={saveDrawer}>Save</button>
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
                  <button className="bg-black text-white rounded px-4 py-2" onClick={saveDrawer}>Save</button>
                  <button className="rounded px-4 py-2 border" onClick={closeDrawer}>Cancel</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
