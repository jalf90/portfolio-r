import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type EmailRequestBody = {
  firstname: string;
  lastname: string;
  email: string;
  to?: string;
  from?: string;
  subject: string;
  message: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as EmailRequestBody;
  const { firstname, lastname, email, subject, message }: EmailRequestBody = body;

  if (!email || !firstname || !lastname) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const recipient = process.env.RESEND_TO;
  if (!recipient) {
    return NextResponse.json({ error: 'Server missing RESEND_TO' }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY || '',
      },
    });

    await transporter.sendMail({
      from: process.env.RESEND_FROM,
      to: recipient,
      subject: subject,
      html: `From: ${firstname} ${lastname}, ${email} \n\n${message}`,
    });

    return NextResponse.json({ success: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
