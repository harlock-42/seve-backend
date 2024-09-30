import { Module } from "@nestjs/common";
import { CompanyService } from "./companies.service";
import { CompanyController } from "./companies.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "./entities/companies.entity";
import { AuthModule } from "src/auth/auth.module";
import AddressModule from "src/address/address.module";
import { TokenModule } from "src/token/token.module";
import ProjectModule from "src/projects/projects.module";
import { PdfFile } from "../contracts/entities/pdfFiles.entity";
import { ContractModule } from "src/contracts/contracts.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Company,
        ]),
        AddressModule,
        TokenModule,
        ProjectModule,
    ],
    providers: [
        CompanyService
    ],
    controllers: [
        CompanyController
    ],
    exports: [
        CompanyService
    ]
})
export class CompanyModule {}