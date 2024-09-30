import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "./token.entity";
import { Repository } from "typeorm";
import { CreateTokenDto } from "./createToken.dto";
import * as crypto from 'crypto';
import { Company } from "src/companies/entities/companies.entity";


@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>
    ) {}

    async create(): Promise<Token | void> {
        const value: string = crypto.randomBytes(16).toString('hex')
        const createdAt: Date = new Date
        const newToken = this.tokenRepository.create({
            value,
            createdAt
        })
        return this.tokenRepository.save(newToken)
            .then(async (resolve) => {
                return resolve
            })
            .catch((error) => {
            })
    }

    async removeOne(id: string) {
        await this.tokenRepository.delete(id)
    }

    async findAll(): Promise<Token[]> {
        return this.tokenRepository.find()
    }

    async findOneByValue(value: string): Promise<Token> {
        const token: Token = await this.tokenRepository.findOne({
            relations: {
                company: true
            },
            where: {
                value
            }
        })
        if (!token) {
            throw new NotFoundException('The token does\'t exist')
        } else if (token.isExpired()) {
            throw new BadRequestException('The token has expired')
        }
        return token
    }

    async clear() {
        this.tokenRepository.clear()
    }
}