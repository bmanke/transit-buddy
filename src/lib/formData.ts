import { supabase } from './supabaseClient'

export async function sendFormData(meetspot: string, meettime: string, destination: string) {
    const {data, error} = await supabase.auth.getUser()

    if (data.user === null || error) {
        return { ok: false, error: 'Sign in required.' }
    }
    else 
    {
        const {error: dataError} = await supabase
        .from('meetups')
        .insert({ user_id: data.user.id, meetup_spot: meetspot, meetup_time: meettime, destination: destination})
        return {ok: !dataError, error: dataError?.message ?? null}; 
    }
}