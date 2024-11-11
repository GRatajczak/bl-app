"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { CompetitorData, columnsCompetitors } from "../AdminDashboard/columns";
import { DataTable } from "../AdminDashboard/data-table";

export default function JudgesWithCompetitors({
    id,
    hideColumns,
}: {
    id: string;
    hideColumns?: string[];
    judgeView?: boolean;
}) {
    const supabase = createClient();
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

    const handleFetchCompetitors = async () => {
        const { data, error } = await supabase
            .from("competitors")
            .select("*, judges(name)")
            .eq("judge_id", id)
            .order("number", { ascending: true });
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setCompetitors(
                data.map((e) => ({ ...e, judges: e?.judges?.name || "-" }))
            );
        }
    };

    useEffect(() => {
        handleFetchCompetitors();
        const s1 = supabase
            .channel("channel_competitors")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "competitors",
                },
                () => {
                    handleFetchCompetitors();
                }
            )
            .subscribe();

        return () => {
            s1.unsubscribe();
        };
    }, []);

    return (
        <div className="pb-10">
            <DataTable
                columns={columnsCompetitors}
                data={competitors}
                hideColumns={hideColumns}
            />
        </div>
    );
}
