import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import debug from 'debug'; // Import debug
const log = debug('app:address-service');
@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) { }

  async create(userId: string, userEmail: string, createAddressDto: CreateAddressDto): Promise<Address> {
    log("create address - userId:", userId, "userEmail:", userEmail, "createAddressDto:", createAddressDto);
  
    // Check if an address document exists for the user
    let addressDoc = await this.addressModel.findOne({ userId });
    if (!addressDoc) {
      // Create a new address document if none exists for the user
      addressDoc = new this.addressModel({
        userId,
        userEmail,
        addresses: [],
      });
      log("New address document created for user with email:", userEmail);
    }
  
    // Handle `isDefault` logic
    if (createAddressDto.isDefault) {
      // Ensure no other address is marked as default
      addressDoc.addresses.forEach((address) => (address.isDefault = false));
    }
  
    // Add the new address to the array
    addressDoc.addresses.push({
      street: createAddressDto.street,
      city: createAddressDto.city,
      state: createAddressDto.state,
      country: createAddressDto.country,
      postalCode: createAddressDto.postalCode,
      isDefault: createAddressDto.isDefault || false, // Default to false if not specified
    });
  
    // Save the updated document
    await addressDoc.save();
  
    return this.addressModel.findOne({ userId }).exec();
  }
  

  async findByUserId(userId): Promise<Address[]> {
    log('find by user id function 1 ', userId); // Log user ID during address fetch
    const addresses = await this.addressModel.find({ userId }).exec(); // Store the result
    log('addresses', addresses); // Log the stored result
    return addresses; // Return the stored result
  }


  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressModel.findByIdAndUpdate(
      id,
      updateAddressDto,
      { new: true },
    );
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async delete(id: string): Promise<void> {
    const result = await this.addressModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Address not found');
    }
  }
}
