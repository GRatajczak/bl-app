"use client";
import { createClient } from "@/lib/supabase";
import { CompetitorData, columnsCompetitors } from "../AdminDashboard/columns";

import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "../AdminDashboard/data-table";

// Define type for competitor data

export default function Competitors() {
    const supabase = createClient();
    const [uploading, setUploading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
    const [select, setSelect] = useState<string[]>([]);

    const [sortCompetitors, setSortCompetitors] = useState<{
        id: string;
        desc: boolean;
    }>({
        id: "created_at",
        desc: true,
    });
    const { toast } = useToast();

    const handleFetchCompetitors = async () => {
        const { data, error } = await supabase
            .from("competitors")
            .select("*")
            .order(sortCompetitors.id, { ascending: !sortCompetitors.desc });
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setCompetitors(data);
        }
    };

    const handleDeleteCompetitors = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .delete()
            .in("id", [...select]);

        if (status === 204) {
            setSelect([]);
            handleFetchCompetitors();
            setSelect([]);
            toast({
                title: `Usunięto ${select.length} zawodników`,
            });
        }

        if (error) {
            console.error(error);
            toast({
                title: "Błąd podczas usuwania zawodników",
                variant: "destructive",
            });
            return;
        }
    };

    const handleAddCompetitor = async (data: CompetitorData[]) => {
        const formattedData = data
            .filter((e) => e.name)
            .map((d) => ({
                ...d,
            }));

        const { error, status } = await supabase
            .from("competitors")
            .insert(formattedData);

        if (error) {
            console.error(error);
            toast({
                title: "Błąd podczas dodawania zawodników",
                variant: "destructive",
            });
        } else if (status === 201) {
            toast({
                title: `Wygenerowano ${formattedData.length} zawodników`,
                variant: "default",
            });
            handleFetchCompetitors();
        }

        setUploading(false);
    };

    const handleUploadCSV = () => {
        setUploading(true);
        if (inputRef.current) {
            const reader = new FileReader();
            const [file] = inputRef.current.files || [];

            if (file) {
                reader.onloadend = (event: ProgressEvent<FileReader>) => {
                    const csv = Papa.parse<CompetitorData>(
                        event.target?.result as string,
                        { header: true }
                    );
                    handleAddCompetitor(csv.data);
                };

                reader.readAsText(file);
            } else {
                setUploading(false);
            }
        }
    };

    useEffect(() => {
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

    useEffect(() => {
        handleFetchCompetitors();
    }, [sortCompetitors]);

    return (
        <div>
            <h3 className="text-2xl font-bold pb-5">Zawodnicy</h3>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">CSV z zawodnikami</Label>
                <Input
                    ref={inputRef}
                    disabled={uploading}
                    id="picture"
                    type="file"
                    accept=".csv"
                />
                <Button onClick={handleUploadCSV} disabled={uploading}>
                    {uploading ? "Przesyłanie..." : "Prześlij"}
                </Button>
            </div>
            <div className="container mx-auto py-10 size-full w-full">
                <div className="flex gap-10">
                    <div className="flex gap-2 pb-2">
                        <Button disabled={select.length === 0}>Przypisz</Button>
                        <Button
                            variant="destructive"
                            disabled={select.length === 0}
                            onClick={() => handleDeleteCompetitors()}
                        >
                            Usuń
                        </Button>
                    </div>
                </div>
                <DataTable
                    columns={columnsCompetitors}
                    data={competitors}
                    setSort={setSortCompetitors}
                    setSelect={setSelect}
                />
            </div>
        </div>
    );
}
