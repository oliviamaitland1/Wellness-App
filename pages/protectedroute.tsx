import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {supabase} from '../lib/supabaseClient';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.push('/login');
            }
        };

        checkUser();
    }, [router]);
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {isAuthenticated && children}
        </>
    );
};
export default ProtectedRoute;
