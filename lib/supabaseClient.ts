import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js';
import type { NetInfoState } from '@react-native-community/netinfo';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'set' : 'missing',
        key: supabaseAnonKey ? 'set' : 'missing'
    });
    throw new Error('Supabase environment variables are not configured. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
    // Add retry configuration
    retryConfig: {
        retryDelay: 500,
        maxRetryCount: 3,
    },
});

// Debug configuration
if (__DEV__) {
    console.log('Supabase client initialized in development mode');
    // Only log that URL is configured, not the actual URL
    console.log('Supabase URL is configured:', !!supabaseUrl);
    
    // Add network state listener
    const NetInfo = require('@react-native-community/netinfo');
    NetInfo.addEventListener((state: NetInfoState) => {
        console.log('Connection type:', state.type);
        console.log('Is connected?', state.isConnected);
    });
}