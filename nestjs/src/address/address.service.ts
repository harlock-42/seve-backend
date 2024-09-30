import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./address.entity";
import { Repository } from "typeorm";
import { CreateAddressDto } from "./dtos/createAddress.dto";

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    ) {}

    async findAll(): Promise<Address[]> {
        return this.addressRepository.find()
    }

    create(createAddressDto: CreateAddressDto): Address {
        return this.addressRepository.create(createAddressDto)
    }
    
    async save(addressToSave: Address): Promise<Address> {
        return this.addressRepository.save(addressToSave)
    }

    async delete(addressIds) {
        return this.addressRepository.delete(addressIds)
    }
}