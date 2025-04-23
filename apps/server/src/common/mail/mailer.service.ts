import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ISendMailOptions,
  MailerService as NestMailerService,
} from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendEmail(sendEmailOptions: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail(sendEmailOptions);
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string
  ): Promise<void> {
    const maileRes = await this.mailerService
      .sendMail({
        to,
        subject: 'Verify your email',
        template: `verify-email`,
        context: {
          to,
          verificationUrl,
        },
      })
      .catch((err) => {
        throw new BadRequestException('Failed to send verification email');
      });

    if (maileRes.accepted[0] !== to)
      throw new BadRequestException('Failed to send verification email');
  }
}
