import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "../entities/contracts.entity";
import { Repository } from "typeorm";
import ProjectsService from "src/projects/projects.service";
import { CompanyService } from "src/companies/companies.service";
import { CreateContractDto } from "../dtos/createContract.dto";
import { Project } from "src/projects/entities/projects.entity";
import { Company } from "src/companies/entities/companies.entity";
import { PdfFile } from "../entities/pdfFiles.entity";
import PdfFileService from "./pdfFiles.service";

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        private readonly projectService: ProjectsService,
        private readonly companyService: CompanyService,
        private readonly pdfFileService: PdfFileService
    ) {}

    async getAll(): Promise<Contract[] | null> {
        return this.contractRepository.find()
    }

    async createOne(createContractDto: CreateContractDto) {
        try {
            const project: Project | void = await this.projectService.getOne(createContractDto.projectId)
            const company: Company | void = await this.companyService.findById(createContractDto.companyId)
            const pdfFiles: PdfFile = await this.pdfFileService.createOne()
            if (project && company) {
                const newContract = this.contractRepository.create({
                    amount: createContractDto.amount,
                    project,
                    company,
                    pdfFiles
                })
                return this.contractRepository.save(newContract)
            }
        } catch (error) {
            throw new HttpException(error.response, error.status)
        }
    }

    /*
    ** Upload sponsorshipAgreement pdf
    */

    async removeMany(contractIds: Contract[]) {
        contractIds.map((item) => {
            this.contractRepository.remove(item)
        })
    }

    async deleteAll() {
        const contracts = await this.getAll()
        contracts.map((contract: Contract) => {
            contract.company = null
            contract.project = null
            this.contractRepository.delete(contract.id)
                .then()
                .catch((error) => {
                    console.log(error)
                })
        })
    }
}