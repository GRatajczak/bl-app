"use client";
import { createClient } from "@/lib/supabase";
// import { useToast } from "@/hooks/use-toast";
import { Judges } from "./columns";
import { useEffect, useState } from "react";
import JudgesWithCompetitors from "../JudgesWithCompetitors";

export default function AdminDashboard() {
    // const { toast } = useToast();

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
            {judges.map((judge) => (
                <div key={judge.id}>
                    <h3 className="text-2xl font-bold pb-5">{judge.name}</h3>
                    <JudgesWithCompetitors id={judge.id} />
                </div>
            ))}
        </div>
    );
}
