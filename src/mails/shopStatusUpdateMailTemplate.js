exports.shopStatusEmailTemplate = (ownerName, shopName, status) => {


const statusConfig = {
    approved: {
        color: "#16a34a",
        title: "Shop Approved",
        message: `Congratulations! Your shop <strong>${shopName}</strong> has been approved by the Dukanoo team. You can now start managing your business and accepting orders.`
    },
    rejected: {
        color: "#dc2626",
        title: "Shop Rejected",
        message: `We regret to inform you that your shop <strong>${shopName}</strong> was not approved after review. Please review your details and submit again.`
    },
    suspended: {
        color: "#ea580c",
        title: "Shop Suspended",
        message: `Your shop <strong>${shopName}</strong> has been suspended by the Dukanoo admin team. Please contact support for further assistance.`
    }
};

const current = statusConfig[status];

return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>${current.title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 20px;">
                
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
                    
                    <tr>
                        <td align="center" style="background:#111827;padding:24px;">
                            <h1 style="margin:0;color:#ffffff;font-size:28px;">
                                Dukanoo
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px;">
                            
                            <h2 style="margin-top:0;color:#111827;">
                                Hello ${ownerName},
                            </h2>

                            <div style="
                                display:inline-block;
                                background:${current.color};
                                color:#ffffff;
                                padding:10px 20px;
                                border-radius:50px;
                                font-weight:bold;
                                margin-bottom:20px;
                            ">
                                ${current.title}
                            </div>

                            <p style="font-size:16px;color:#374151;line-height:1.8;">
                                ${current.message}
                            </p>

                            <div style="
                                background:#f9fafb;
                                border:1px solid #e5e7eb;
                                border-radius:10px;
                                padding:20px;
                                margin:25px 0;
                            ">
                                <p style="margin:0;color:#6b7280;">
                                    <strong>Shop Name:</strong> ${shopName}
                                </p>
                                <p style="margin:10px 0 0;color:#6b7280;">
                                    <strong>Status:</strong> ${status.toUpperCase()}
                                </p>
                            </div>

                            <p style="font-size:15px;color:#4b5563;line-height:1.8;">
                                Thank you for choosing Dukanoo to grow your business digitally.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="background:#f9fafb;padding:20px;">
                            <p style="margin:0;color:#6b7280;font-size:13px;">
                                © ${new Date().getFullYear()} Dukanoo. All Rights Reserved.
                            </p>
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
