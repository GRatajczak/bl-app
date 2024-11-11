"use client";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
    const { toast } = useToast();

    const supabase = createClient();

    return <div className="flex flex-col full-size w-full">d</div>;
}
