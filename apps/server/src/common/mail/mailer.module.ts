import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT, 10) || 465,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAIL_USER || 'your-email@gmail.com',
          pass: process.env.MAIL_PASS || 'your-email-password',
        },
      },
      defaults: {
        from: `"No Reply" ${process.env.MAILER_FROM_EMAIL}`,
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MyMailerModule {}
