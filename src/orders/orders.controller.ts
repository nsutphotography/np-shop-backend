import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../utils/jwt.guard'; // Assuming you have authentication
import log from '../debugging/debug'
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    async createOrder(
        @Body() body: { userId: string; email: string; items: { productId: string; quantity: number }[]; totalPrice: number; shippingAddress: string },
        @Req() req: any
    ) {
        const userId = req.user.userId; // Extract userId from JWT payload
        const userEmail = req.user.email;
        log("orders add", body.userId, body.items, body.totalPrice, body.shippingAddress)

        return this.ordersService.createOrder(userId, userEmail, body.items, body.totalPrice, body.shippingAddress);
    }
    @UseGuards(JwtAuthGuard)
    @Get('get-all')
    async getAllOrders(@Req() req: any) {
        const userId = req.user.userId; // Extract userId from JWT payload
        log("reques for all orders for user",userId)
        console.log("reques for all orders for user",userId)
        return this.ordersService.getAllOrders(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getOrders(@Param('userId') userId: string) {
        return this.ordersService.getOrdersByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':orderId/status')
    async updateOrderStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
        return this.ordersService.updateOrderStatus(orderId, body.status);
    }
}
