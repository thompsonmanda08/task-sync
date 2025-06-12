import nodemailer from "nodemailer";

const CONTACT_FORM_FIELDS = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

export async function POST(req, res) {
  if (req.method === "POST") {
    const data = await req.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return Response.json({
        status: 401,
        message: "Bad Request: Invalid Fields!",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:
          process.env.NEXT_PUBLIC_EMAIL_ADDRESS || process.env.EMAIL_ADDRESS,
        pass:
          process.env.NEXT_PUBLIC_EMAIL_PASSWORD || process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from:
          process.env.NEXT_PUBLIC_SENDER_EMAIL_ADDRESS ||
          process.env.EMAIL_ADDRESS,
        to:
          process.env.NEXT_PUBLIC_RECEIVER_EMAIL_ADDRESS ||
          process.env.RECEIVER_EMAIL_ADDRESS,
        subject: `Website Activity | ${subject}`,
        ...generateEmailContent(data),
        // text: `Message from website contact form: \n\n${message}`,
        // html: `<p>${message}</p>`,
      });
      return Response.json({
        status: 200,
        message: "Your message was sent successfully.",
      });
    } catch (error) {
      console.error("Error sending mail: \n\n", error);
    }
  }

  return Response.json({
    status: 500,
    message: "Error occured while trying to send email!",
  });
}

function generateEmailContent(data) {
  const stringData = Object.entries(data).reduce(
    (str, [key, value]) =>
      (str += `${CONTACT_FORM_FIELDS[key]}: \n${data[key]} \n\n`),
    "",
  );

  const html = `<div>${stringData.replace(/\n/g, "<br>")}<div>`;

  return {
    text: stringData,
    html,
  };
}
