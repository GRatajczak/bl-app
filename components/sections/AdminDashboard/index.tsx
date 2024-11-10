"use client";
import { useEffect, useState } from "react";
import { Judges, columns } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/lib/supabase";

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
            .channel("channel_competitors")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "judges",
                },
                (payload) => {
                    handleFetchJudges();
                    console.log("Change received!", payload);
                }
            )
            .subscribe();

        return () => {
            s.unsubscribe();
        };
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={judges} />
        </div>
    );
}
