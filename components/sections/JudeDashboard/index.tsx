import JudgesWithCompetitors from "../JudgesWithCompetitors";

export default async function JudgeDashboard({ id }: { id: string }) {
    return (
        <JudgesWithCompetitors
            id={id}
            hideColumns={[
                "judges",
                "select",
                "actions",
                "number_of_tries",
                "points",
                "flash",
                "top",
                "bonus",
                "spalona",
                "sex",
            ]}
        />
    );
}
