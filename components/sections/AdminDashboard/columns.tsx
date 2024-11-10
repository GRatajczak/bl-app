"use client";
import { createClient } from "@/lib/supabase";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Judges = {
    id: string;
    name: number;
};

export type CompetitorData = {
    id: string;
    name: string;
    last_name: string;
    sex: string;
};

export const columns: ColumnDef<Judges>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const supabase = createClient();
            const judge = row.original;
            const handleDeleteJudge = async () => {
                const { data } = await supabase
                    .from("judges")
                    .delete()
                    .eq("id", judge.id);
                console.log(data);
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteJudge()}>
                            Usuń
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const columnsCompetitors: ColumnDef<CompetitorData>[] = [
    {
        accessorKey: "name",
        header: "Imie",
    },
    {
        accessorKey: "last_name",
        header: "Nazwisko",
    },
    {
        accessorKey: "sex",
        header: "Płeć",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const supabase = createClient();
            const competitor = row.original;
            const handleDeleteCompetitor = async () => {
                const { data } = await supabase
                    .from("competitors")
                    .delete()
                    .eq("id", competitor.id);
                console.log(data);
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleDeleteCompetitor()}
                        >
                            Usuń
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
