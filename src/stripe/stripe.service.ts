import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { debug } from 'debug';

const log = debug('app:service:stripe');

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // apiVersion: '2022-11-15',
    });
  }

  async createPaymentIntent({ amount, currency = 'usd', metadata }: { amount: number; currency: string; metadata: any }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
      });

      // Log the payment intent response before returning
      log('Created Payment Intent:', paymentIntent);
      log('clint secret :', paymentIntent.client_secret);

      return paymentIntent;
    } catch (error) {
      log('Error creating payment intent:', error.message);
      throw error;
    }
  }
}
