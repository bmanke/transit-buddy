import { supabase } from './supabaseClient'

export async function sendFormData(userId: number, meetspot: string, meettime: string, destination: string) {
    const {data, error} = await supabase.auth.getUser()
}