import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../utils/jwt.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard) // Ensure only authenticated users access the cart
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Body('userId') userId: string) {
        return this.cartService.getCart(userId);
    }

    @Post('add')
    addItem(
        @Body('userId') userId: string,
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        console.log('userId productid quantity in controler', userId, productId, quantity);

        return this.cartService.addItem(userId, productId, quantity);
    }

    @Delete('remove/:productId')
    removeItem(@Body('userId') userId: string, @Param('productId') productId: string) {
        return this.cartService.removeItem(userId, productId);
    }

    @Patch('clear')
    clearCart(@Body('userId') userId: string) {
        return this.cartService.clearCart(userId);
    }
}
