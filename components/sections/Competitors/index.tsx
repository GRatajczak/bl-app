"use client";
import { createClient } from "@/lib/supabase";
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define type for competitor data
type CompetitorData = {
    name: string;
    last_name: string;
    sex: string;
};

export default function Competitors() {
    const supabase = createClient();
    const [uploading, setUploading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

    const handleAddCompetitor = async (data: CompetitorData[]) => {
        const formattedData = data
            .filter((e) => e.name)
            .map((d) => ({
                name: d.name,
                last_name: d.last_name,
                sex: d.sex,
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

    return (
        <div>
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
        </div>
    );
}
