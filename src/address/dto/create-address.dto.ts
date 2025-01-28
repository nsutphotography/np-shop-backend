import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsNotEmpty()
  @IsString() // Allows any string value
  label: string;
}
