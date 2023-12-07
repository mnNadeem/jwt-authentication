import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'muhammad.nadeem@devsinc.com',
        pass: 'ioebyjnakmkivcul'
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const mailOptions = {
      from: 'a.hassan5451@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
