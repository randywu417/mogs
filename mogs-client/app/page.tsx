"use client";

import { decodeJwt } from "jose";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import SignInPanel from "./components/SignInPanel";
import SignUpPanel from "./components/SignUpPanel";
import Tabs from "./components/Tabs";
import { ROUTE } from "./model/routes";
import { fetchSignIn, fetchSignUp } from "./service/api";
import useLoadingStore from "./store/useLoadingStroe";
import useSnackStore from "./store/useSnackStore";
import useUserStore from "./store/useUserStore";
import { SignInForm, SignUpForm, UserInfo } from "./types";
import parseErrorResponse from "./utils/parseErrorResponse";

function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState(() => {
        const val = Number(searchParams.get("sign"));
        const invalid = isNaN(val) || val >= 2 || !val;
        return invalid ? 0 : val;
    });
    const { setUser } = useUserStore();
    const { setSnackStatus } = useSnackStore();
    const { setLoading } = useLoadingStore();

    const handleChangeTab = (newValue: number) => {
        setTab(newValue);
        const params = new URLSearchParams(searchParams.toString());
        params.set("sign", newValue.toString());
        router.push(pathname + "?" + params.toString());
    };

    const handleSignIn = async (form: SignInForm): Promise<void> => {
        setLoading(true);

        await fetchSignIn(form)
            .then((result) => {
                const { tk } = result.data;
                setUser(decodeJwt(tk) as UserInfo);
                localStorage.setItem("token", tk);
                router.push(ROUTE.LOBBY);
            })
            .catch(parseErrorResponse());

        setLoading(false);
    };

    const handleSignUp = async (form: SignUpForm): Promise<void> => {
        setLoading(true);

        await fetchSignUp(form)
            .then(() => {
                handleChangeTab(0);
                setSnackStatus({
                    status: "success",
                    message: "Your account is created.",
                });
            })
            .catch(parseErrorResponse());

        setLoading(false);
    };
    return (
        <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
            <div className="w-[376px] fixed top-32 left-1/2 -translate-x-1/2 h-auto shadow-custom rounded-md">
                <Tabs
                    box={{ className: "h-full rounded-md flex flex-col" }}
                    value={tab}
                    onChange={handleChangeTab}
                    options={[
                        {
                            label: "sign in",
                            panel: <SignInPanel onLogin={handleSignIn} />,
                        },
                        {
                            label: "sign up",
                            panel: <SignUpPanel onSubmit={handleSignUp} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense>
            <Page />
        </Suspense>
    );
}
