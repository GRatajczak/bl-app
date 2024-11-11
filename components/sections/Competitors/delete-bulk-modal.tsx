/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteBulkModal({
    select,
    setSelect,
    handleFetchCompetitors,
    table,
}: {
    select: string[];
    setSelect: (value: string[]) => void;
    handleFetchCompetitors: () => void;
    table?: any;
}) {
    const supabase = createClient();
    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const handleDeleteCompetitors = async () => {
        const { status, error } = await supabase
            .from("competitors")
            .delete()
            .in("id", [...select]);

        if (status === 204) {
            setSelect([]);
            handleFetchCompetitors();
            setOpen(false);
            toast({
                title: `Usunięto ${select.length} zawodników`,
            });
            table?.toggleAllPageRowsSelected(false);
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
                <Button
                    variant="destructive"
                    onClick={() => setOpen(true)}
                    disabled={select.length === 0}
                >
                    Usuń
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Usuwanie</DialogTitle>
                <DialogDescription>
                    Jesteś pewien, że chcesz usunąć {select.length} zawodników?
                </DialogDescription>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button onClick={() => handleDeleteCompetitors()}>
                        Usuń
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
