import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../utils/jwt.guard';
import { CartService } from './cart.service';
import log from "../debugging/debug"
@Controller('cart')
@UseGuards(JwtAuthGuard) // Ensure only authenticated users access the cart
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get('get-all')
    getCart(@Req() req: any) {
        const userId = req.user.userId; // Extract userId from JWT payload
        return this.cartService.getCart(userId);
    }

    @Post('add')
    addItem(
        @Req() req: any, // Access request object to get userId from JWT
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        const userId = req.user.userId; // Extract userId from JWT payload
        const userEmail = req.user.email
        log("user in the request",req.user)
        return this.cartService.addItem(userId,userEmail, productId, quantity);
    }


    @Delete('remove/:productId')
    removeItem(@Req() req: any, @Param('productId') productId: string) {
        const userId = req.user.userId; // Extract userId from JWT payload
        console.log('userId productId in controller', userId, productId);
        return this.cartService.removeItem(userId, productId);
    }
    @Patch('decrease/:productId') // Match the frontend route
    decreaseQuantity(
        @Req() req: any, // Access request object to get userId from JWT
        @Param('productId') productId: string, // Extract productId from route
        @Body('quantity') quantity: number, // Get new quantity from body
    ) {
        const userId = req.user.userId; // Extract userId from JWT payload
        console.log('userId productId quantity in controller', userId, productId, quantity);
        return this.cartService.decreaseQuantity(userId, productId, quantity);
    }
    

    @Patch('clear')
    clearCart(@Body('userId') userId: string) {
        return this.cartService.clearCart(userId);
    }
}
