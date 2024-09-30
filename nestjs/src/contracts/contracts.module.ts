import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contracts.controller";
import { ContractService } from "./services/contracts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "./entities/contracts.entity";
import ProjectModule from "src/projects/projects.module";
import { CompanyModule } from "src/companies/companies.module";
import { PdfFile } from "./entities/pdfFiles.entity";
import PdfFileService from "./services/pdfFiles.service";
import { PdfFileController } from "./controllers/pdfFiles.controller";
import { News } from "./entities/news.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Contract,
            PdfFile,
            News
        ]),
        ProjectModule,
        CompanyModule
    ],
    controllers: [
        ContractController,
        PdfFileController
    ],
    providers: [
        ContractService,
        PdfFileService
    ],
    exports: [
        ContractService
    ]
})
export class ContractModule {}