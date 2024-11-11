"use client";
import { createClient } from "@/lib/supabase";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompetitorData } from "./columns";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export default function EditModal({
    competitor,
}: {
    competitor: CompetitorData;
}) {
    const supabase = createClient();
    const [open, setOpen] = useState<boolean>(false);
    const [competitorData, setCompetitorData] = useState<
        Omit<CompetitorData, "id" | "judges" | "created_at">
    >({
        name: competitor.name,
        last_name: competitor.last_name,
        number: competitor.number,
        number_of_tries: competitor.number_of_tries,
        points: competitor.points,
        sex: competitor.sex,
    });

    const type = Cookies.get("supabase.auth.token")?.split("type: ")[1];

    const handleEditCompetitor = async () => {
        const { error } = await supabase
            .from("competitors")
            .update({
                name: competitorData.name,
                last_name: competitorData.last_name,
                number: competitorData.number,
                number_of_tries: competitorData.number_of_tries,
                points: competitorData.points,
            })
            .eq("id", competitor.id);

        if (error) {
            return;
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edytuj</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <div className="">
                    {type !== "judge" && (
                        <>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Numer</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            number: +e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.number}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Imię</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            name: e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.name}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Nazwisko</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            last_name: e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.last_name}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Płeć</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            sex: e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.sex}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex flex-col pb-2">
                        <Label className="pb-1">Punkty</Label>
                        <Input
                            onChange={(e) =>
                                setCompetitorData({
                                    ...competitor,
                                    points: +e.target.value,
                                })
                            }
                            defaultValue={competitor.points}
                        />
                    </div>
                    <div className="flex flex-col pb-2">
                        <Label className="pb-1">Liczba prób</Label>
                        <Input
                            onChange={(e) =>
                                setCompetitorData({
                                    ...competitor,
                                    number_of_tries: +e.target.value,
                                })
                            }
                            defaultValue={competitor.number_of_tries}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button onClick={() => handleEditCompetitor()}>
                        Zapisz
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
