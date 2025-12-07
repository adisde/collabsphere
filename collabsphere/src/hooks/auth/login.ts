const baseUrl = import.meta.env.VITE_SERVER_URL;

export const login = async (email: string, password: string) => {
    try {
        if (!email || email.trim() === "") return { ok: false, message: "Email is required" };
        if (!password || password.trim() === "") return { ok: false, message: "Password is required" };
        if (password.length <= 8) return { ok: false, message: "Password must be longer than 8 characters." };

        const loginPayload = {
            email: email,
            password: password,
        };

        const req = await fetch(`${baseUrl}/user/login`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(loginPayload)
        });

        const res = await req.json();

        if (!res.ok) return { ok: false, message: res.message };

        return { ok: true, message: res.message };
    } catch (err: any) {
        return { ok: false, message: err.message };
    }
}