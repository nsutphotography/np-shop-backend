import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import log from '../debugging/debug'


@Controller('addresses')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post('add')
  async create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    const userId = req.user.userId; // Extract userId from JWT payload
    const userEmail = req.user.email; // Extract userId from JWT payload
    log("ADD FUNCTION - req.user:", req.user);
log("ADD FUNCTION - Type of userId:", typeof req.user.userId);

    log("add address - address data", createAddressDto)
    return this.addressService.add(userId, userEmail, { ...createAddressDto });
  }

  @Get('get-all')
  async findByUserId(@Req() req: any) {
    log('Fetching addresses for user ID: %s', req.user.userId); // Log user ID during address fetch
    const userId = req.user.userId; // Extract userId from JWT payload
    return this.addressService.findByUserId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId; // Ensure the user is authorized to update
    console.log('\x1b[33m%s\x1b[0m', 'User ID in Profile of console: %', req.user.userId); // Log the user ID in profile

    log('\x1b[33m%s\x1b[0m', 'User ID in address: 1', userId); // Log the user ID in yellow
    log('User ID in address: 2', userId); // Log the user ID in yellow
    return this.addressService.update(id, { ...updateAddressDto, userId });
  }

  @Patch('update-default/:addressId')
  async updateDefaultAddress(
    @Param('addressId') addressId: string, // Extract addressId from the URL
    @Req() req: any, // Extract user data from the request
  ) {
    const userId = req.user.userId; // Get userId from the JWT payload
  
    log('Request to update default address for userId:', userId, 'addressId:', addressId);
  
    try {
      const updatedAddressDoc = await this.addressService.updateDefault(userId, addressId);
      return { message: 'Default address updated successfully', data: updatedAddressDoc };
    } catch (error) {
      log('Error updating default address:', error.message);
      throw new Error(error.message);
    }
  }
  
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId; // Extract userId from JWT payload
    log("DELETE FUNCTION - req.user:", req.user);
log("DELETE FUNCTION - Type of userId:", typeof req.user.userId);

    return this.addressService.delete( userId,id);
  }
}
