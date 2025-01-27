import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import debug from 'debug'; // Import log

// Create a log instance with 'log' as the namespace
const log = debug('app:address-controller');

@Controller('addresses')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post('add')
  async create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    const userId = req.user.userId; // Extract userId from JWT payload
    const userEmail = req.user.email; // Extract userId from JWT payload
    log('Creating address for user ID: %s', userId); // Log user ID during address creation
    log("add address - address data", createAddressDto)
    return this.addressService.create(userId,userEmail ,{ ...createAddressDto });
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

  // @Delete(':id')
  // async delete(@Param('id') id: string, @Req() req: any) {
  //   const userId = req.user.userId; // Ensure the user is authorized to delete
  //   log('Deleting address with ID: %s for user ID: %s', id, userId); // Log user ID and address ID during delete
  //   return this.addressService.delete(id, userId);
  // }
}
