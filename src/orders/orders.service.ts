import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import log from '../debugging/debug'
@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

  async createOrder(userId: string, email: string, items: { productId: string; quantity: number }[], totalPrice: number, shippingAddress: string) {
    const newOrder = new this.orderModel({ userId, email, items, totalPrice, shippingAddress });
    await newOrder.save();
    return newOrder.populate("items.productId");
  }

  async getAllOrders(userId: string) {
    const orders = await this.orderModel.find({ userId }).populate("items.productId");
    log("Fetched Orders:", JSON.stringify(orders, null, 2)); // Pretty print for readability
    return orders;
}

  async getOrdersByUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
  }
}
