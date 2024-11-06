import JudgeDashboard from "@/components/sections/JudeDashboard";

export default async function Judge({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    return <JudgeDashboard id={id} />;
}
