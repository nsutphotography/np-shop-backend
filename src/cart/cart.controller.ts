import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../utils/jwt.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard) // Ensure only authenticated users access the cart
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get('get-all')
    getCart(@Body('userId') userId: string) {
        
        return this.cartService.getCart(userId);
    }

    @Post('add')
    addItem(
        @Req() req: any, // Access request object to get userId from JWT
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        const userId = req.user.userId; // Extract userId from JWT payload
        console.log('userId productId quantity in controller', userId, productId, quantity);
    
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
