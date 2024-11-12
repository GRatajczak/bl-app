"use client";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompetitorData } from "./columns";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

export default function EditModal({
    competitor,
}: {
    competitor: CompetitorData;
}) {
    const supabase = createClient();
    const [open, setOpen] = useState<boolean>(false);
    const { id } = useParams();
    console.log(id);

    const [competitorData, setCompetitorData] = useState<
        Omit<CompetitorData, "id" | "judges" | "created_at">
    >({
        name: "",
        last_name: "",
        number: 0,
        number_of_tries: 0,
        points: 0,
        sex: "",
        flash: 0,
        top: 0,
        bonus: 0,
        spalona: 0,
    });

    const handleGetCompetitorData = async () => {
        const { data, error } = await supabase
            .from("competitors")
            .select("*")
            .eq("id", competitor.id)
            .select();
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            setCompetitorData(data[0]);
        }
    };

    useEffect(() => {
        handleGetCompetitorData();
    }, []);

    useEffect(() => {
        if (open) handleGetCompetitorData();
    }, [open]);

    const flash = !!localStorage.getItem(`flash-${competitor.id}-${id}`);
    const top = !!localStorage.getItem(`top-${competitor.id}-${id}`);
    const bonus = !!localStorage.getItem(`bonus-${competitor.id}-${id}`);
    const spalona = !!localStorage.getItem(`spalona-${competitor.id}-${id}`);

    const type = Cookies.get("supabase.auth.token")?.split("type: ")[1];
    const { toast } = useToast();
    const [judges, setJudges] = useState<number>(0);

    const handleGetJudges = async () => {
        const { count, error } = await supabase
            .from("judges")
            .select("*", { count: "exact", head: true });
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }

        if (count) {
            setJudges(count);
        }
    };

    useEffect(() => {
        handleGetJudges();
    }, []);

    const handleEditCompetitor = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .update({
                name: competitorData.name,
                last_name: competitorData.last_name,
                number: competitorData.number,
                number_of_tries: competitorData.number_of_tries,
                points: competitorData.points,
                flash: competitorData.flash,
                top: competitorData.top,
                bonus: competitorData.bonus,
                spalona: competitorData.spalona,
            })
            .eq("id", competitor.id);
        if (status === 204) {
            setOpen(false);
            toast({
                title: "Pomyślnie edytowano dane",
            });
        }
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }
    };

    const handleFlash = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .update({
                flash: competitorData.flash + 1,
                number_of_tries: competitorData.number_of_tries + 1,
                points: competitorData.points + 4,
            })
            .eq("id", competitor.id);
        if (status === 204) {
            setOpen(false);
            localStorage.setItem(`flash-${competitor.id}-${id}`, "true");
            toast({
                title: "Pomyślnie dodano Flash",
            });
        }
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }
    };

    const handleTop = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .update({
                top: competitorData.top + 1,
                number_of_tries: competitorData.number_of_tries + 1,
                points: competitorData.points + 2,
            })
            .eq("id", competitor.id);
        if (status === 204) {
            setOpen(false);
            localStorage.setItem(`top-${competitor.id}-${id}`, "true");
            toast({
                title: "Pomyślnie dodano Flash",
            });
        }
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }
    };

    const handleBonus = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .update({
                bonus: competitorData.bonus + 1,
                number_of_tries: competitorData.number_of_tries + 1,
                points: competitorData.points + 1,
            })
            .eq("id", competitor.id);
        if (status === 204) {
            setOpen(false);
            localStorage.setItem(`bonus-${competitor.id}-${id}`, "true");
            toast({
                title: "Pomyślnie dodano Flash",
            });
        }
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }
    };

    const handleSpalona = async () => {
        const { error, status } = await supabase
            .from("competitors")
            .update({
                spalona: competitorData.spalona + 1,
                number_of_tries: competitorData.number_of_tries + 1,
            })
            .eq("id", competitor.id);
        if (status === 204) {
            setOpen(false);
            localStorage.setItem(`spalona-${competitor.id}-${id}`, "true");
            toast({
                title: "Pomyślnie dodano Flash",
            });
        }
        if (error) {
            toast({
                title: "Wystąpił błąd",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edytuj</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>
                    Edycja {competitor.name} {competitor.last_name}
                </DialogTitle>
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
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Flash</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            flash: +e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.flash}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Top</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            top: +e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.top}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Bonus</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            bonus: +e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.bonus}
                                />
                            </div>
                            <div className="flex flex-col pb-2">
                                <Label className="pb-1">Spalona</Label>
                                <Input
                                    onChange={(e) =>
                                        setCompetitorData({
                                            ...competitor,
                                            spalona: +e.target.value,
                                        })
                                    }
                                    defaultValue={competitor.spalona}
                                />
                            </div>
                        </>
                    )}

                    {type === "judge" && (
                        <div className="flex flex-col gap-5">
                            {flash && (
                                <p className="text-green-500 font-bold text-xl">
                                    Zawodnik zrobił flash!
                                </p>
                            )}
                            {competitor.flash !== judges &&
                                !flash &&
                                !(top || bonus || spalona) && (
                                    <Button
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={() => handleFlash()}
                                    >
                                        Flash
                                    </Button>
                                )}
                            {!flash && (
                                <>
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => handleTop()}
                                    >
                                        Top
                                    </Button>
                                    <Button
                                        className="bg-orange-500 hover:bg-orange-600"
                                        onClick={() => handleBonus()}
                                    >
                                        Bonus
                                    </Button>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => handleSpalona()}
                                    >
                                        Spalony
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
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
