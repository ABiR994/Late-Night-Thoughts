import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { supabase } from '../utils/db';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Sign in anonymously if no session exists
        const { error } = await supabase.auth.signInAnonymously();
        if (error) console.error('Error signing in anonymously:', error.message);
      }
    };

    initAuth();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
