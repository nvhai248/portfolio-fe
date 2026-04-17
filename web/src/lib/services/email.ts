import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_OWNER } from '$env/static/private';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL_OWNER,
		pass: EMAIL_PASS
	}
});

interface ContactEmailParams {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export async function sendContactEmail({ name, email, subject, message }: ContactEmailParams) {
	const mailOptions = {
		from: EMAIL_OWNER,
		to: EMAIL_OWNER,
		replyTo: email,
		subject: `[Portfolio Contact] ${subject}`,
		html: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
				<h2 style="color: #0b63b8; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Submission</h2>
				<p><strong>From:</strong> ${name} <${email}></p>
				<p><strong>Subject:</strong> ${subject}</p>
				<div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
					<p style="white-space: pre-wrap;">${message}</p>
				</div>
				<footer style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
					This email was sent from your portfolio contact form.
				</footer>
			</div>
		`
	};

	return transporter.sendMail(mailOptions);
}
