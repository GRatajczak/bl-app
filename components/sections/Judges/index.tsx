"use client";
import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Judges() {
    const supabase = createClient();
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

    return (
        <div>
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
        </div>
    );
}
