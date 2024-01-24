import nodemailer from 'nodemailer';
import config from '../config/config.js';


export default class EmailService {
    static #instance = null
    constructor(){
        this.transport = nodemailer.createTransport({
            service: config.email.emailService,
            port: config.email.emailPort,
            auth: {
                user: config.email.emailUser,
                pass: config.email.emailPassword
            }
        });
    }

    sendEmail (to, subject, html, attachments = []){
        return this.transport.sendMail({
            from: config.email.emailUser,
            to,
            subject,
            html,
            attachments
        });
    }

    static getInstance(){
        if (!EmailService.#instance){
            EmailService.#instance = new EmailService();
        }
        return EmailService.#instance;
    }
}

