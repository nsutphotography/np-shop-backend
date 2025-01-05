import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import debug from 'debug'; // Import debug

// Create a debug instance with 'dbgr' as the namespace
const dbgr = debug('app:address-controller');

@Controller('addresses')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    const userId = req.user.userId; // Extract userId from JWT payload
    dbgr('Creating address for user ID: %s', userId); // Log user ID during address creation
    return this.addressService.create({ ...createAddressDto, userId });
  }

  @Get()
  async findByUserId(@Req() req: any) {
    dbgr('Fetching addresses for user ID: %s', req.user.userId); // Log user ID during address fetch
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

    dbgr('\x1b[33m%s\x1b[0m', 'User ID in address: 1', userId); // Log the user ID in yellow
    dbgr('User ID in address: 2', userId); // Log the user ID in yellow
    return this.addressService.update(id, { ...updateAddressDto, userId });
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string, @Req() req: any) {
  //   const userId = req.user.userId; // Ensure the user is authorized to delete
  //   dbgr('Deleting address with ID: %s for user ID: %s', id, userId); // Log user ID and address ID during delete
  //   return this.addressService.delete(id, userId);
  // }
}
