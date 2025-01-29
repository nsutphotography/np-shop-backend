import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { debug } from 'debug';
const log = debug('app:controller:stripe');

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
async createPaymentIntent(
  @Body('amount') amount: number,
  @Body('cart') cart: any, // Accepting cart as any to ensure flexibility
  @Body('deliveryAddress') deliveryAddress: any,
) {
  try {
    // Log received products and delivery address for debugging
    log('Products:', cart);
    log('Delivery Address:', deliveryAddress);

    // Convert cart & deliveryAddress to JSON strings for metadata
    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount,
      currency: 'usd',
      metadata: {
        cart: JSON.stringify(cart), // Convert cart object to a JSON string
        deliveryAddress: JSON.stringify(deliveryAddress), // Convert address as well
      },
    });

    // Log the response before returning
    log('Payment Intent Response:', paymentIntent);

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    log('Error creating payment intent:', error.message);
    return { error: error.message };
  }
}
}
