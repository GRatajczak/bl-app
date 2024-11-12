import JudgesWithCompetitors from "../JudgesWithCompetitors";

export default async function JudgeDashboard() {
    return (
        <JudgesWithCompetitors
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
