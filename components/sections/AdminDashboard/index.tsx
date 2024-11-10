"use client";
import { useEffect, useState } from "react";
import { Judges, columns, CompetitorData, columnsCompetitors } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/lib/supabase";

export default function AdminDashboard() {
    const [judges, setJudges] = useState<Judges[]>([]);
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

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

    const handleFetchCompetitors = async () => {
        const { data, error } = await supabase.from("competitors").select("*");
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setCompetitors(data);
        }
    };

    useEffect(() => {
        handleFetchJudges();
        handleFetchCompetitors();
        const s = supabase
            .channel("channel_judges")
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

        const s1 = supabase
            .channel("channel_competitors")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "competitors",
                },
                (payload) => {
                    handleFetchCompetitors();
                    console.log("Change received!", payload);
                }
            )
            .subscribe();

        return () => {
            s.unsubscribe();
            s1.unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={judges} />
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columnsCompetitors} data={competitors} />
            </div>
        </>
    );
}
