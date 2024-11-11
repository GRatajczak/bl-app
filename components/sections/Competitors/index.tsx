"use client";
import { createClient } from "@/lib/supabase";
import {
    CompetitorData,
    Judges,
    columnsCompetitors,
} from "../AdminDashboard/columns";
import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "../AdminDashboard/data-table";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Competitors() {
    const supabase = createClient();
    const [uploading, setUploading] = useState<boolean>(false);
    const [judgeId, setJudgeId] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
    const [select, setSelect] = useState<string[]>([]);
    const [judges, setJudges] = useState<Judges[]>([]);

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

    const handleAddCompetitorToJudge = async (judgeId: string) => {
        const { error, status } = await supabase
            .from("competitors")
            .update({ judge_id: judgeId })
            .in("id", [...select]);

        if (status === 204) {
            setSelect([]);
            handleFetchCompetitors();
            toast({
                title: `Przypisano ${select.length} zawodników do ${
                    judges.filter((e) => e.id === judgeId)[0].name
                }`,
            });
        }

        if (error) {
            console.error(error);
            toast({
                title: "Błąd podczas przypisywania zawodników",
                variant: "destructive",
            });
            return;
        }
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
        handleFetchJudges();
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
            <Dialog>
                <div className="container mx-auto py-10 size-full w-full">
                    <div className="flex gap-10">
                        <div className="flex gap-2 pb-2">
                            <DialogTrigger asChild>
                                <Button disabled={select.length === 0}>
                                    Przypisz
                                </Button>
                            </DialogTrigger>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Przypisz do sędziego</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Sędzia
                            </Label>
                            <Select
                                onValueChange={(e) => {
                                    console.log(e);
                                    setJudgeId(e);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Wybierz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {judges.map((judge) => (
                                            <SelectItem
                                                key={judge.id}
                                                value={judge.id}
                                            >
                                                {judge.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => handleAddCompetitorToJudge(judgeId)}
                        >
                            Zapisz
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
