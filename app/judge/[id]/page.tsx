import JudgeDashboard from "@/components/sections/JudeDashboard";

export default async function Judge({}: { params?: Promise<{ id: string }> }) {
    return <JudgeDashboard />;
}
