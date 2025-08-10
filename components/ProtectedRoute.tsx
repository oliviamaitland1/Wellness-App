'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function withAuth<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
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
