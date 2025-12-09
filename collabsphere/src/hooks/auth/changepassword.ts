const baseUrl = import.meta.env.VITE_SERVER_URL;

export const changepassword = async (password: string, token:string) => {
    try {
        if (!token) return {ok: false, message: "Invalid token."};

        if (!password || password.trim() === "") return { ok: false, message: "Password is required." };
        if (password.length < 8) return {ok: false, message: "Password must be longer than 8 characters."};

        const changepasswordPayload = {
            password: password,
        };

        const req = await fetch(`${baseUrl}/user/reset-password?token=${token}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(changepasswordPayload)
        });

        const res = await req.json();

        if (!res.ok) return { ok: false, message: res.message };

        return { ok: true, message: res.message };
    } catch (err: any) {
        return { ok: false, message: err.message };
    }
}