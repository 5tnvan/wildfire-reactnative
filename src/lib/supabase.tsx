import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://poalybuqvwrnukxylhad.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYWx5YnVxdndybnVreHlsaGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzNzcxNjAsImV4cCI6MjAyMzk1MzE2MH0.zTpwEb-6mX7h2VmRMkgshVcUvT0zF5TP0zdjDoZIAAo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})