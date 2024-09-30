import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Address } from "./address.entity";
import { Public } from "src/auth/decorators/public.decorator";

@ApiTags('addresses')
@Controller('addresses')
export class addressControler {
    constructor(
        private addressService: AddressService
    ) {}

    @Public()
    @Get('')
    @ApiOperation({ summary: 'Retrieve all addresses' })
    @ApiResponse({ status: 200, description: 'Addresses successfully retrieved' })
	@ApiSecurity('x-api-secret')   
    async findAll() {
        return await this.addressService.findAll()
    }
}