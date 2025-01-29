import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { debug } from 'debug';
const log = debug('app:controller:stripe');

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('create-payment-intent')
async createPaymentIntent(
  @Body('amount') amount: number,
  @Body('cart') cart: any,
  @Body('deliveryAddress') deliveryAddress: any,
) {
  try {
    log('Products:', cart);
    log('Delivery Address:', deliveryAddress);

    // Extract only necessary details: product name, product ID, and quantity
    const simplifiedCart = cart.items.map((item: any) => ({
      name: item.productId.name, // Store product name
      productId: item.productId.productId, // Store product ID
      quantity: item.quantity, // Store quantity
    }));

    // Convert data to strings while keeping it within the 500-character limit
    const metadata = {
      cart: JSON.stringify(simplifiedCart), // Only essential data
      totalPrice: cart.totalPrice.toString(), // Convert price to string
      address: `${deliveryAddress.street}, ${deliveryAddress.city}`, // Shortened address
    };

    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount,
      currency: 'usd',
      metadata,
    });

    log('Payment Intent Response:', paymentIntent);

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    log('Error creating payment intent:', error.message);
    return { error: error.message };
  }
}
}
