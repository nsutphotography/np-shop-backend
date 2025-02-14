import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Types } from 'mongoose';
import log from "../debugging/debug"
@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    ) { }

    async getCart(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId }).populate('items.productId');
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        console.log("here cart servive")
        log("cart from getCart",cart)
        return cart;
    }

    
    async addItem(userId: string,userEmail:string, productId: string, quantity: number): Promise<Cart> {
        log('userId, productId, quantity in service', userId, productId, quantity);
        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0');
        }
    
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid productId');
        }
    
        const productObjectId = new Types.ObjectId(productId);  // Convert string to ObjectId
    
        let cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            // Create a new cart if none exists for the user
            cart = new this.cartModel({ userId,userEmail, items: [] });
            log('Cart for new user created with email',userEmail);
        }
    
        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productObjectId.toString(),
        );
    
        if (existingItemIndex > -1) {
            // Update quantity if the item exists in the cart
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add the new item if it doesn't exist
            cart.items.push({ productId: productObjectId, quantity });
        }
    
        // Save the cart and return the updated cart
        await cart.save();
        return this.cartModel.findOne({ userId }).populate('items.productId');
    }
    

    async removeItem(userId: string, productId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Remove item from cart
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

        await cart.save();
        return this.cartModel.findOne({ userId }).populate('items.productId');
    }

    async decreaseQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
    
        // Find the product in the cart
        const productIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId,
        );
    
        if (productIndex === -1) {
            throw new NotFoundException('Product not found in cart');
        }
    
        // Decrease the quantity, ensuring it doesn't go below zero
        const currentQuantity = cart.items[productIndex].quantity;
        log('currentQuantity and quantity', currentQuantity ,quantity);
        if (currentQuantity <= quantity) {
            // If the quantity is less than or equal to the requested decrease, remove the item
            log('cart.items[productIndex]', cart.items[productIndex]);
            cart.items.splice(productIndex, 1);
        } else {
            // Otherwise, just decrease the quantity
            log('cart.items[productIndex].quantity', cart.items[productIndex].quantity);
            cart.items[productIndex].quantity -= quantity;
        }
    
        await cart.save();
        return this.cartModel.findOne({ userId }).populate('items.productId');
    }
    async clearCart(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOneAndUpdate(
            { userId },
            { items: [] },
            { new: true },
        );

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    }
}
