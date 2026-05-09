import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Dhruv Solanki <contact@sodhruv.me>",
      to: ["sodhruv28work@gmail.com"],
      subject: subject || `New Inquiry: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #3b82f6; margin-top: 0;">New Portfolio Message</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || "No Subject Provided"}</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Message</p>
            <p style="white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${message}</p>
          </div>
          <footer style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center;">
            Sent from sodhruv.me portfolio
          </footer>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
