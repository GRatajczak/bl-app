"use client";
import { createClient } from "@/lib/supabase";
import { Judges } from "./columns";
import { useEffect, useState } from "react";
import JudgesWithCompetitors from "../JudgesWithCompetitors";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
    const [judges, setJudges] = useState<Judges[]>([]);
    const supabase = createClient();

    const handleFetchJudges = async () => {
        const { data, error } = await supabase.from("judges").select("*");
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setJudges(data);
        }
    };

    useEffect(() => {
        handleFetchJudges();

        const s = supabase
            .channel("channel_judges")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "judges",
                },
                () => {
                    handleFetchJudges();
                }
            )
            .subscribe();

        return () => {
            s.unsubscribe();
        };
    }, []);

    return (
        <div className="flex flex-col full-size w-full">
            {judges.length ? (
                <JudgesWithCompetitors hideColumns={["select"]} />
            ) : (
                <div>
                    <h3 className="text-2xl font-bold pb-5">Brak sędziów</h3>
                    <Link href="/admin/judges">
                        <Button>Dodaj sędziów</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
