export const emailTokenTemplate = (email_url) => {
    if (!email_url) throw new Error("Email url is required");

    return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    </head>

    <body style="margin:0; padding:0; background:#fff; font-family: 'Lato', sans-serif; color:#000;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td align="center" style="padding:40px 0;">
            
            <table width="420" cellpadding="0" cellspacing="0" style="background:#fff; padding:40px; border-radius:12px;">
            
            <tr>
                <td align="center" style="font-size:26px; font-weight:600; padding-bottom:10px;">
                Verify Your Account
                </td>
            </tr>

            <tr>
                <td align="center" style="font-size:14px; color:#777; line-height:1.6; padding-bottom:28px;">
                Hey, please confirm your email to activate your account.  
                This keeps your account secure and ensures it's really you.
                </td>
            </tr>

            <tr>
                <td align="center">
                <a href="${email_url}" 
                style="background:#000; color:#fff; text-decoration:none; 
                        padding:10px 20px; border-radius:8px; font-size:14px; 
                        font-weight:500; display:inline-block;">
                    Verify Email
                </a>
                </td>
            </tr>

            <tr>
                <td style="font-size:15px; color:#777; padding-top:20px; text-align:center; line-height:1.5;">
                If you didn't request this, ignore the email
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
