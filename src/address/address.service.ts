import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import log from '../debugging/debug'
@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) { }

  async add(userId: string, userEmail: string, createAddressDto: CreateAddressDto): Promise<Address> {
    log("create address - userId:", userId, "userEmail:", userEmail, "createAddressDto:", createAddressDto);

    // Check if an address document exists for the user
    log("add FUNCTION - Type of userId:", typeof userId);

    let addressDoc = await this.addressModel.findOne({ userId });
    log("add address doc", addressDoc)
    if (!addressDoc) {
      // Create a new address document if none exists for the user
      addressDoc = new this.addressModel({
        userId,
        userEmail,
        addresses: [],
      });
      log("New address document created for user with email:", userEmail);
    }

    // If this is the first address being added, set isDefault to true
    const isFirstAddress = addressDoc.addresses.length === 0;
    const isDefault = isFirstAddress ? true : createAddressDto.isDefault || false;

    // Handle `isDefault` logic for subsequent addresses
    if (isDefault && !isFirstAddress) {
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
      isDefault,
      label: createAddressDto.label,
    } as any); // Use `as any` to bypass strict typing on `_id`

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

  async delete(userId: string, addressId: string): Promise<Address | null> {
    log("delete address - userId:", userId, "addressId:", addressId);

    // // Find the user's address document
    // log("DELETE FUNCTION - Received userId:", userId);
    // log("DELETE FUNCTION - Type of userId:", typeof userId);
    // const userObjectId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
    // log("DELETE FUNCTION - Type of userId after conversion:", typeof userObjectId);



    let addressDoc = await this.addressModel.findOne({ userId });
    log("delete address",addressDoc)
    if (!addressDoc) {
      throw new Error("User address document not found");
    }

    // Filter out the address to be deleted
    addressDoc.addresses = addressDoc.addresses.filter(
      (address) => address._id.toString() !== addressId
    );

    // If the deleted address was the default, set a new default if any addresses remain
    if (!addressDoc.addresses.some((address) => address.isDefault) && addressDoc.addresses.length > 0) {
      addressDoc.addresses[0].isDefault = true;
    }

    // Save the updated document
    await addressDoc.save();
    return addressDoc;
  }
  async updateDefault(userId: string, addressId: string): Promise<Address> {
    log("Updating default address for userId:", userId, "addressId:", addressId);

    // Fetch the user's address document
    const addressDoc = await this.addressModel.findOne({ userId });
    if (!addressDoc) {
      throw new Error("Address document not found for the user");
    }
    // let a = addressDoc.addresses[0].
    // Ensure the provided address exists in the user's address list
    const addressExists = addressDoc.addresses.some(
      (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
      throw new Error("Address not found");
    }

    // Update `isDefault` for all addresses
    addressDoc.addresses.forEach((address) => {
      address.isDefault = address._id.toString() === addressId;
    });

    // Save the updated document
    await addressDoc.save();

    log("Default address updated for userId:", userId, "new default addressId:", addressId);

    return addressDoc;
  }

}
