import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

export default function withAuth(Component) {
    return function ProtectedComponent(props) {
        const session = useSession();
        const router = useRouter();

        useEffect(() => {
            if (session === null) {
                router.push('/login');
            }
        }, [session, router]);

        if (session === null) {
            return null;
        }

        return <Component {...props} />;
    };
}