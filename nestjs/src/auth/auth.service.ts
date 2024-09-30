import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Company } from "src/companies/entities/companies.entity";
import { CompanyService } from "src/companies/companies.service";
import * as bcrypt from 'bcrypt'
import { SignUpDto } from "./dtos/signUp.dto";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthService {
	constructor(
        private companyService: CompanyService,
        private jwtService: JwtService,
    ) {}

    /*
    ** Sign up a new company and send it an access token
    */
    async signUp(signUp: SignUpDto) {
        const check: Company | null = await this.companyService.findByEmail(signUp.email)
        if (check) {
            throw new UnauthorizedException(`The email ${signUp.email} is already sign up`)
        }
        const company: Company = await this.companyService.create(signUp)
        const payload = {
            sub: company.id,
            username: company.email
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
            id: company.id
        }
    }

    /*
    ** Sign in a new company and send it an access token
    */
    async signIn(email: string, pass: string) {
        const company: Company = await this.companyService.findByEmail(email, true)
        if (!company) {
            throw new NotFoundException()
        }
        const match: boolean = await bcrypt.compare(pass, company.password)
        if (!match) {
            throw new UnauthorizedException()
        }
        const payload = {
            sub: company.id,
            username: company.email
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
            id: company.id
        }
    }
}