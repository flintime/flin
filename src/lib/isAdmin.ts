'use client'

import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export async function isAdminByUserId(userId: string): Promise<boolean> {
  if (!userId) return false
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  if (error) return false
  return Boolean(data?.is_admin)
}

export async function sessionIsAdminDb(session: Session | null): Promise<boolean> {
  const userId = session?.user?.id || ''
  return isAdminByUserId(userId)
}


