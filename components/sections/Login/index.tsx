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
    const { toast } = useToast();

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

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.signInWithPassword({
                email: login,
                password,
            });

            if (error && userError) {
                toast({
                    title: "Błędne dane logowania!",
                    variant: "destructive",
                });
                setLoading(false);
            }

            if (data) {
                Cookies.set(
                    "supabase.auth.token",
                    `id: ${data.id}; name: ${data.name} ;type: judge`,
                    { expires: 1 }
                );
                router.push(`/judge/${data.id}`);
            }
            if (user) {
                Cookies.set(
                    "supabase.auth.token",
                    `id: ${user.id}; name: ${user.email} ;type: admin`,
                    { expires: 1 }
                );
                router.push(`/admin`);
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
            <Button type="submit" disabled={loading}>
                {loading ? <Loader /> : "Zaloguj"}
            </Button>
        </form>
    );
}
