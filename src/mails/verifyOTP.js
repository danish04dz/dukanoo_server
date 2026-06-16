exports.verifyOTPEmailTemplate = (name, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
            <tr>
                <td align="center">
                    
                    <table width="600" cellpadding="0" cellspacing="0" 
                        style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" 
                                style="background:#2563eb; padding:30px; color:#ffffff;">
                                <h1 style="margin:0; font-size:28px;">
                                    Verify Your Account
                                </h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding:40px 30px; color:#333333;">
                                
                                <h2 style="margin-top:0;">
                                    Hello ${name},
                                </h2>

                                <p style="font-size:16px; line-height:1.6;">
                                    Thank you for signing up. Please use the OTP below
                                    to verify your email address.
                                </p>

                                <!-- OTP Box -->
                                <div style="text-align:center; margin:35px 0;">
                                    <span style="
                                        display:inline-block;
                                        background:#f3f4f6;
                                        color:#111827;
                                        padding:15px 35px;
                                        font-size:32px;
                                        font-weight:bold;
                                        letter-spacing:8px;
                                        border-radius:10px;
                                        border:2px dashed #2563eb;
                                    ">
                                        ${otp}
                                    </span>
                                </div>

                                <p style="font-size:15px; color:#555;">
                                    This OTP is valid for 
                                    <strong>10 minutes</strong>.
                                </p>

                                <p style="font-size:15px; color:#555;">
                                    If you did not request this verification, you can safely ignore this email.
                                </p>

                                <p style="margin-top:30px;">
                                    Regards,<br/>
                                    <strong>Dukanoo | Support Team </strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" 
                                style="background:#f9fafb; padding:20px; font-size:13px; color:#888;">
                                © ${new Date().getFullYear()} Dukanoo | smart POS & QR ordering. All rights reserved.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};