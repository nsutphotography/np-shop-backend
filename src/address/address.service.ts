import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import debug from 'debug'; // Import debug
const dbgr = debug('app:address-service');
@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) { }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return await this.addressModel.create(createAddressDto);
  }

  async findByUserId(userId): Promise<Address[]> {
    dbgr('find by user id function 1 ', userId); // Log user ID during address fetch
    const addresses = await this.addressModel.find({ userId }).exec(); // Store the result
    dbgr('addresses', addresses); // Log the stored result
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
