'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { ROUTE } from '../model/routes';
import useUserStore, { initializeUser } from '../store/useUserStore';

const AutoLogin: React.FC = () => {
    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();
    const pathname = usePathname();

    useLayoutEffect(() => {
        const initialize = async () => {
            const user = await initializeUser();
            if (user) {
                await setUser(user);
                if (pathname === ROUTE.HOME) {
                    router.push(ROUTE.LOBBY);
                }
            }
        };

        initialize();
    }, [pathname, setUser, router]);

    return null;
};

export default AutoLogin;
