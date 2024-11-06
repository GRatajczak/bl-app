import { cookies } from "next/headers";

export async function updateSession() {
    const cookieStore = await cookies();

    if (cookieStore.get("supabase.auth.token")?.value) {
        return { status: 200 };
    }

    return { status: 401 };
}
