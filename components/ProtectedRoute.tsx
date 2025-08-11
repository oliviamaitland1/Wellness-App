'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/lib/supabaseClient';

export default function withAuth<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkSession = async () => {
        const {data} = await supabase.auth.getSession();
        if (!data?.session) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      };

      checkSession();
    }, [router]);

    if (loading) return <div>Loading...</div>;

    return <Component {...props} />;
  };
}
