// src/lib/friends.ts

import { supabase } from './supabaseClient';

export type Profile = {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
}

export type Friendship = {
    id: string
    status: 'pending' | 'accepted'
    requester: Profile
    addressee: Profile
}

const PROFILE_COLS = 'id, username, display_name, avatar_url'

export async function getFriendships(): Promise<Friendship[]> {
    const { data, error } = await supabase
        .from('friendships')
        .select(
          `id, status,
                   requester:profiles!requester_id(${PROFILE_COLS}),
                   addressee:profiles!addressee_id(${PROFILE_COLS})`
        )
        .order('created_at', { ascending: false })

    if (error) throw error
    return ( data ?? []) as unknown as Friendship[]
}

export async function sendFriendRequest(addresseeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'Not signed in' }

    const { error } = await supabase
        .from('friendships')
        .insert({ requester_id: user.id, addressee_id: addresseeId })

    if (error?.code === '23505') return { ok: false, error: 'Request already exists!' }
    if (error?.code === '23514') return { ok: false, error: "You can't add yourself" }
    return { ok: !error, error: error?.message ?? null }
}

export async function acceptRequest(friendshipId: string) {
    const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)

    return { ok: !error, error: error?.message ?? null }
}

export async function removeFriendship(friendshipId: string) {
    const {error} = await supabase.from('friendships').delete().eq('id', friendshipId)
    return {ok: !error, error: error?.message ?? null}
}

export async function searchProfiles(term: string): Promise<Profile[]> {
  const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLS)
        .ilike('username', `%${term}%`)
        .limit(10)

  if (error) throw error

  return data ?? []
}

export async function getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLS)
        .eq('id', id)
        .maybeSingle()

    if (error) throw error
    return data
}