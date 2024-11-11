"use client";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "../AdminDashboard/data-table";
import { Judges, columns } from "../AdminDashboard/columns";
import DeleteBulkModal from "./delete-bulk-modal";

export default function JudgesPage() {
    const supabase = createClient();
    const [judges, setJudges] = useState<Judges[]>([]);
    const [selectJugdes, setSelectJudges] = useState<string[]>([]);
    const [numberOfJudges, setNumberOfJudges] = useState<number>(0);
    const { toast } = useToast();

    const handleGenerateJudges = async () => {
        const { error, status } = await supabase.from("judges").insert(
            Array.from(Array(numberOfJudges).keys()).map((i) => ({
                name: `sedzia${i + 1}`,
                password: `test${i + 1}`,
            }))
        );

        if (error) {
            toast({
                title: "Błąd podczas generowania sędziów",
                variant: "destructive",
            });
            return;
        }
        if (status === 201) {
            toast({
                title: `Wygenerowano ${numberOfJudges} sędziów`,
                variant: "default",
            });
            setNumberOfJudges(0);
        }
    };

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
    }, []);

    useEffect(() => {
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
            <h3 className="text-2xl font-bold pb-5">Sędziowe</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Wygeneruj liczbę sędziów</Label>
                <Input
                    id="picture"
                    type="number"
                    onChange={(e) => setNumberOfJudges(+e.target.value)}
                    value={numberOfJudges}
                />
                <Button
                    disabled={!numberOfJudges}
                    type="submit"
                    onClick={() => handleGenerateJudges()}
                >
                    Generuj
                </Button>
            </div>
            <div className="container py-10 size-full w-full">
                <div className="flex gap-10 pb-2">
                    <DeleteBulkModal
                        selectJugdes={selectJugdes}
                        setSelectJudges={setSelectJudges}
                        handleFetchJudges={handleFetchJudges}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={judges}
                    setSelect={setSelectJudges}
                />
            </div>
        </div>
    );
}
