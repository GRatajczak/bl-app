import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase";
import { CompetitorData } from "./columns";
import { useState } from "react";

export default function DeleteModal({
    competitor,
}: {
    competitor: CompetitorData;
}) {
    const supabase = createClient();
    const [open, setOpen] = useState<boolean>(false);
    const handleDeleteCompetitor = async () => {
        const { status } = await supabase
            .from("competitors")
            .delete()
            .eq("id", competitor.id);

        if (status === 204) {
            setOpen(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" onClick={() => setOpen(true)}>
                    Usuń
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>
                    Usuwanie {competitor.name} {competitor.last_name}
                </DialogTitle>
                <DialogDescription>
                    Jesteś pewien, że chcesz usunąć tego zawodnika?
                </DialogDescription>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button onClick={() => handleDeleteCompetitor()}>
                        Usuń
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
