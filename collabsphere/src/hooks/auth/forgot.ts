const baseUrl = import.meta.env.VITE_SERVER_URL;

export const forgot = async (email: string) => {
    try {
        if (!email || email.trim() === "") return { ok: false, message: "Email is required." };

        const forgotPayload = {
            email: email,
        };

        const req = await fetch(`${baseUrl}/user/reset-email`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(forgotPayload)
        });

        const res = await req.json();

        if (!res.ok) return { ok: false, message: res.message };
        return { ok: true, message: res.message };

    } catch (err: any) {
        return { ok: false, message: err.message };
    }
}