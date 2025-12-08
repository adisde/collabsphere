const baseUrl = import.meta.env.VITE_SERVER_URL;

export const signup = async (email: string, password: string, username: string) => {
    try {
        if (!email || email.trim() === "") return { ok: false, message: "Email is required" };
        if (!password || password.trim() === "") return { ok: false, message: "Password is required" };
        if (password.length <= 8) return { ok: false, message: "Password must be longer than 8 characters." };
        if (!username || username.trim() === "") return { ok: false, message: "Username is required." };

        const loginPayload = {
            email: email,
            password: password,
            username: username
        };

        const req = await fetch(`${baseUrl}/user/register`, {
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