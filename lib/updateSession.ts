import { cookies } from "next/headers";

export async function updateSession() {
    const cookieStore = await cookies();
    const typeOfuser = cookieStore
        .get("supabase.auth.token")
        ?.value.split("type: ")[1];

    if (cookieStore.get("supabase.auth.token")?.value) {
        return { status: 200, typeOfuser };
    }

    return { status: 401 };
}
