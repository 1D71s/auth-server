import { BadRequestException, Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import * as process from "process";

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GOOGLE_USER_APP, pass: process.env.GOOGLE_PASSWORD_APP, },
        });
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        if (!this.isValidEmail(to)) {
            throw new BadRequestException('Invalid email address');
        }

        const mailOptions = { to, subject, text };
        try {
            this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw error
        }
    }
}