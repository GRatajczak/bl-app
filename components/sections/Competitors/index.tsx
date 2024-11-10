"use client";
import { createClient } from "@/lib/supabase";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Competitors() {
    const supabase = createClient();
    const handleAddCompetitor = async () => {
        const serp = await supabase.from("competitors").insert([
            {
                name: "John1",
                last_name: "Doe1",
                sex: "chłopak",
            },
        ]);
        console.log(serp);
    };

    useEffect(() => {
        handleAddCompetitor();

        // const s = supabase
        //     .channel("channel_competitors")
        //     .on(
        //         "postgres_changes",
        //         {
        //             event: "*",
        //             schema: "public",
        //             table: "competitors",
        //         },
        //         (payload) => {
        //             console.log("Change received!", payload);
        //         }
        //     )
        //     .subscribe();

        // return () => {
        //     s.unsubscribe();
        // };
    }, []);

    return (
        <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">CSV z zawodnikami</Label>
                <Input id="picture" type="file" />
            </div>
        </div>
    );
}
