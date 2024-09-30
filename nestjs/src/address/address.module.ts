import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./address.entity";
import { AddressService } from "./address.service";
import { addressControler } from "./address.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Address
        ])
    ],
    providers: [
        AddressService,
    ],
    controllers: [
        addressControler,
    ],
    exports: [
        AddressService,
    ]
})
export default class AddressModule {}