import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "./entities/companies.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "../auth/dtos/signUp.dto";
import { JwtService } from "@nestjs/jwt";
import { AddressService } from "src/address/address.service";
import { Address } from "src/address/address.entity";
import { TokenService } from "src/token/token.service";
import { Token } from "src/token/token.entity";
import { CompanyRelationsType } from "./types/compagnies.interfaces";
import { TokenDto } from "./dtos/setPassword.dto";
import { Project } from "src/projects/entities/projects.entity";
import { PdfFile } from "../contracts/entities/pdfFiles.entity";
import { Contract } from "src/contracts/entities/contracts.entity";
import { SetReferentDataDto } from "./dtos/setReferentData.dto";
import { SetCompanyDataDto } from "./dtos/SetCompanyData.dto";
import { SetAddressDataDto } from "./dtos/setAddressData.dto";

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        private addressService: AddressService,
        private tokenService: TokenService
    ) {}

    /*
    ** Save a Company's instance
    */

    async save(company: Company): Promise<Company> {
        return this.companyRepository.save(company)
    }

    /*
    ** Create a new Company's instance
    */
    async create(company: SignUpDto): Promise<Company> {
        const newAddress: Address = await this.addressService.create(company.address)
        await this.addressService.save(newAddress)
        const newCompany: Company = this.companyRepository.create({
            companyName: company.companyName,
            firstName: company.firstName,
            lastName: company.lastName,
            vatNumber: company.vatNumber,
            email: company.email,
            password: company.password,
            address: newAddress
        })
        return this.save(newCompany)
    }

    /*
    ** Find all companies
    */
    async findAll(): Promise<Company[] | undefined> {
        return await this.companyRepository.find({
            relations: [
                "address",
                "token",
                "contracts"
            ]
        })
    }

    /*
    ** Find all projects of a company
    */

    async findAllProjects(id: string) {
        const contracts = await  this.findById(id, false, {
            contracts: {
                company: true
            }
        })
            .then((resolve) => {
                return resolve.contracts
            })
    }

    /*
    ** Find one company by his id
    */
    async findById(
            id: string,
            selectPassword: boolean = false,
            relations: CompanyRelationsType = {}
        ): Promise<Company> {
        let select: (keyof Company)[] = ["id", "companyName", "firstName", "lastName", "vatNumber", "email", "createdAt"]
        if (selectPassword == true) {
            select.push("password")
        }
        try {
            return await this.companyRepository.findOne({
                select: select,
                relations,
                where: {
                    id
                }
            })
        } catch (error) {
            throw new HttpException("Company not found", HttpStatus.NOT_FOUND)
        }
    }

    /*
    ** Find one company by his email
    */
    async findByEmail(email: string, selectPassword: boolean = false): Promise<Company> {
        let select: (keyof Company)[] = ["id", "companyName", "firstName", "lastName", "vatNumber", "email", "createdAt"]
        if (selectPassword == true) {
            select.push("password")
        }
        const company: Company | null = await this.companyRepository.findOne({
            select: select,
            where: {
                email
            }
        })
        return company
    }

    /*
    ** set company's referent data
    */
    async setReferent(userId: string, referentData: SetReferentDataDto): Promise<Company> {
        const company: Company = await this.findById(userId)
        company.firstName = referentData.firstName
        company.lastName = referentData.lastName
        company.email = referentData.email
        return this.save(company)
    }
    /*
    ** set company's main data
    */
    async setCompany(userId: string, companyData: SetCompanyDataDto): Promise<Company> {
        const company: Company = await this.findById(userId)
        company.companyName = companyData.companyName
        company.vatNumber = companyData.vatNumber
        return this.save(company)
    }

    /*
    ** set company's address
    */
   async setAddress(userId: string, addressData: SetAddressDataDto): Promise<Company> {
    const company: Company = await this.findById(userId, false, {
        address: true
    })
    company.address.streetName = addressData.streetName
    company.address.streetNumber = addressData.streetNumber
    company.address.zipCode = addressData.zipCode
    company.address.city = addressData.city
    return this.save(company)
   }

    /*
    ** Clear all Company's instances
    */
    async clear() {
        const companies = await this.findAll()

        const companyIds = []
        const addressIds = []

        for (const company of companies) {
            this.companyRepository.delete(company.id)
            if (company.address) {
                addressIds.push(company.address.id)
            }
            companyIds.push(company.id)
        }
        if (companyIds.length > 0) {
            await this.companyRepository.delete(companyIds)
        }
        if (addressIds.length > 0) {
            await this.addressService.delete(addressIds)
        }
    }
    
    /*
    ** Create and assign a token to a company's instance
    */
    async addToken(companyId: string): Promise<string> {
        const company = await this.findById(companyId, false, { token: true })
        const token: Token | void = await this.tokenService.create()
        if (company.token) {
            await this.tokenService.removeOne(company.token.id)
        }
        if (token) {
            company.token = token
            await this.companyRepository.save(company)
            return token.value
        }
        return undefined
    }


}