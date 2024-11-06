"use client";
import { createClient } from "@/lib/supabase";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/ui/loader";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState<boolean>(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    // const supabase = createClient();
    const { toast } = useToast();

    // useEffect(() => {
    //     const s = supabase
    //         .channel("channel_judges")
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "*",
    //                 schema: "public",
    //                 table: "judges",
    //             },
    //             (payload) => {
    //                 console.log("Change received!", payload);
    //             }
    //         )
    //         .subscribe();

    //     return () => {
    //         s.unsubscribe();
    //     };
    // }, []);

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from("judges")
                .select("*")
                .eq("name", login)
                .eq("password", password)
                .single();

            console.log(data);
            if (error) {
                toast({
                    title: "Błędne dane logowania!",
                    variant: "destructive",
                });
                setLoading(false);
            }

            if (data) {
                Cookies.set(
                    "supabase.auth.token",
                    `id: ${data.id}; type: judge`,
                    { expires: 1 }
                );
                router.push(`/judge/${data.id}`);
                toast({
                    title: "Zalogowano!",
                });
            }
        } catch (error) {
            toast({
                title: "Niestety, coś poszło nie tak",
                variant: "destructive",
            });
            console.error("Error logging in", error);
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className="flex flex-col gap-2 max-w-80 mx-auto mt-20"
        >
            <Image
                className="mx-auto mb-5"
                src="/logo.jpg"
                alt="logo"
                width={200}
                height={200}
            />
            <Input
                placeholder="Login"
                onChange={(e) => setLogin(e.target.value)}
            />
            <Input
                placeholder="Hasło"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">{loading ? <Loader /> : "Zaloguj"}</Button>
        </form>
    );
}
