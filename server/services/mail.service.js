import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: "roman.codempire@gmail.com",
        pass: "roma234567",
      },
    });
  }
  async sendMailActivation(to, link) {
    await this.transporter.sendMail({
      from: "roman.codempire@gmail.com",
      to,
      subject: "First mail nodemailer" + process.env.API_URL,
      text: "lorem ipsum",
      html: `
                <div>
                    <h2>Для регистрации перейди по ссылке</h2>
                    <a href="${link}">${link}<a/>
                </div>`,
    });
  }
}

export default new MailService();
