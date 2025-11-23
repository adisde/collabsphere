export const passwordTokenTemplate = (reset_url) => {
    if (!reset_url) throw new Error("Reset url is required.");
    return `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background:#fff; font-family: 'Lato', sans-serif; color:#000;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center" style="padding:40px 0;">
                
                <table width="420" cellpadding="0" cellspacing="0" style="background:#fff; padding:40px; border-radius:12px;">
                
                <tr>
                    <td align="center" style="font-size:26px; font-weight:600; padding-bottom:10px;">
                    Reset Your Password
                    </td>
                </tr>

                <tr>
                    <td align="center" style="font-size:14px; color:#777; line-height:1.6; padding-bottom:28px;">
                    You requested to reset your password.  
                    Click the button below to continue.
                    </td>
                </tr>

                <tr>
                    <td align="center">
                    <a href="${reset_url}" 
                    style="background:#000; color:#fff; text-decoration:none; 
                            padding:10px 20px; border-radius:8px; font-size:14px; 
                            font-weight:500; display:inline-block;">
                        Reset Password
                    </a>
                    </td>
                </tr>

                <tr>
                    <td style="font-size:15px; color:#777; padding-top:20px; text-align:center; line-height:1.5;">
                    If this wasn't you, secure your account immediately
                    token will expires in <strong>10 minutes</strong>.
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>
        </body>
    </html>`;
};
