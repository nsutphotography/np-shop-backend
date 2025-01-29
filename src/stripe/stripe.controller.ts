import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body('amount') amount: number) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(amount);
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      return { error: error.message };
    }
  }
}
