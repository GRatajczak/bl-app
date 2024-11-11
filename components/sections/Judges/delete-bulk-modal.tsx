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
    selectJugdes,
    setSelectJudges,
    handleFetchJudges,
    table,
}: {
    selectJugdes: string[];
    setSelectJudges: (value: string[]) => void;
    handleFetchJudges: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table?: any;
}) {
    const supabase = createClient();
    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const handleDeleteJudges = async () => {
        const { error, status } = await supabase
            .from("judges")
            .delete()
            .in("id", [...selectJugdes]);

        if (status === 204) {
            handleFetchJudges();
            setSelectJudges([]);
            table?.toggleAllPageRowsSelected(false);
            setOpen(false);
            toast({
                title: `Usunięto ${selectJugdes.length} sędziów`,
            });
        }

        if (error) {
            console.error(error);
            toast({
                title: "Błąd podczas usuwania sędziów",
                variant: "destructive",
            });
            return;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    onClick={() => setOpen(true)}
                    disabled={selectJugdes.length === 0}
                >
                    Usuń
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Usuwanie</DialogTitle>
                <DialogDescription>
                    Jesteś pewien, że chcesz usunąć {selectJugdes.length}{" "}
                    sędziów?
                </DialogDescription>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button onClick={() => handleDeleteJudges()}>Usuń</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
