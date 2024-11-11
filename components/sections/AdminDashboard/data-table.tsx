/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSort?: ({ id, desc }: { id: string; desc: boolean }) => void;
    setSelect?: (selected: string[]) => void;
    columnVisibility?: VisibilityState;
    hideColumns?: string[];
    getTable?: any;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSort,
    setSelect,
    hideColumns,
    getTable,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});
    console.log(rowSelection);

    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        if (setSort && sorting[0]?.id) {
            setSort({
                id: sorting[0]?.id,
                desc: sorting[0]?.desc,
            });
        }
    }, [sorting]);

    useEffect(() => {
        if (setSelect) {
            const rows = table
                .getRowModel()
                .rows.filter((row) => row.getIsSelected());
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setSelect(rows.map((row) => row.original.id));
        }
    }, [rowSelection]);

    const removeNumberPrefix = (input: string) => {
        return input.replace(/^\d+_/, "");
    };

    useEffect(() => {
        if (getTable) getTable(table);
    }, [table]);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers
                                .filter((e) => {
                                    return !hideColumns?.includes(e.id);
                                })
                                .map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row
                                    .getVisibleCells()
                                    .filter((e) => {
                                        return !hideColumns?.includes(
                                            removeNumberPrefix(e.id)
                                        );
                                    })
                                    .map((cell) => {
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
