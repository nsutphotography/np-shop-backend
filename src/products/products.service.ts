import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(data: any) {
    const product = new this.productModel(data);
    return product.save();
  }

  async findAll() {
    return this.productModel.find();
  }
  async searchProducts(query: string): Promise<Product[]> {
    const regex = new RegExp(query, 'i'); // Case-insensitive regex
  
    return this.productModel.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    }).exec();
  }
  
  

  async findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, data: any) {
    return this.productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
