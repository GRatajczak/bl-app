"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { CompetitorData, columnsCompetitors } from "../AdminDashboard/columns";
import { DataTable } from "../AdminDashboard/data-table";

export default function JudgesWithCompetitors({
    hideColumns,
}: {
    hideColumns?: string[];
    judgeView?: boolean;
}) {
    const supabase = createClient();
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
    const [sort, setSort] = useState<{ id: string; desc: boolean }>({
        id: "number",
        desc: false,
    });

    const handleFetchCompetitors = async () => {
        const { data, error } = await supabase
            .from("competitors")
            .select("*")
            .order(sort.id, { ascending: !sort.desc });
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setCompetitors(data);
        }
    };

    useEffect(() => {
        handleFetchCompetitors();
    }, [sort]);

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
                setSort={setSort}
                hideColumns={hideColumns}
            />
        </div>
    );
}
