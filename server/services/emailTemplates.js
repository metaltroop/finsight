const styles = {
    container: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-2xl; margin: 0 auto; padding: 20px; color: #333;`,
    header: `background: linear-gradient(to right, #14b8a6, #2563eb); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;`,
    logo: `color: white; font-size: 28px; font-weight: bold; text-decoration: none;`,
    content: `background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;`,
    heading: `color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px;`,
    text: `color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;`,
    otpBox: `background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;`,
    otpCode: `font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f766e;`,
    button: `display: inline-block; background: #0f766e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;`,
    footer: `margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af;`
};

exports.otpTemplate = (otp) => ({
    subject: 'Your Finsight Verification Code',
    html: `
        <div style="${styles.container}">
            <div style="${styles.header}">
                <div style="${styles.logo}">Finsight</div>
            </div>
            <div style="${styles.content}">
                <h1 style="${styles.heading}">Verify Your Email</h1>
                <p style="${styles.text}">Hello,</p>
                <p style="${styles.text}">Thank you for registering with Finsight. Please use the verification code below to complete your registration:</p>
                
                <div style="${styles.otpBox}">
                    <div style="${styles.otpCode}">${otp}</div>
                </div>
                
                <p style="${styles.text}">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                
                <p style="${styles.text}">Best regards,<br/>The Finsight Team</p>
            </div>
            <div style="${styles.footer}">
                &copy; ${new Date().getFullYear()} Finsight. All rights reserved.
            </div>
        </div>
    `
});

exports.welcomeTemplate = (name) => ({
    subject: 'Welcome into the World of Financial Clarity! 🚀',
    html: `
        <div style="${styles.container}">
            <div style="${styles.header}">
                <div style="${styles.logo}">Finsight</div>
            </div>
            <div style="${styles.content}">
                <h1 style="${styles.heading}">Welcome aboard, ${name}!</h1>
                <p style="${styles.text}">We're thrilled to have you join us. Finsight is your new partner in mastering personal finance.</p>
                
                <p style="${styles.text}">Here's what you can do next:</p>
                <ul style="color: #4b5563; line-height: 1.6;">
                    <li>Explore our <strong>Calculators</strong> to plan your loans and investments.</li>
                    <li>Read our expert <strong>Guides</strong> on financial planning.</li>
                    <li>Update your <strong>Profile</strong> to get personalized recommendations.</li>
                </ul>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="${styles.button}">Go to Dashboard</a>
                </div>
                
                <p style="${styles.text}" style="margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
            </div>
            <div style="${styles.footer}">
                &copy; ${new Date().getFullYear()} Finsight. All rights reserved.
            </div>
        </div>
    `
});
