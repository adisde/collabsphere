const baseUrl = import.meta.env.VITE_SERVER_URL;

export const authuser = async (token:string) => {
    try {
        if (!token) return {ok: false, message: "Invalid token."};

        const req = await fetch(`${baseUrl}/user/confirm-email?token=${token}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
        });

        const res = await req.json();

        if (!res.ok) return { ok: false, message: res.message };

        return { ok: true, message: res.message };
    } catch (err: any) {
        return { ok: false, message: err.message };
    }
}