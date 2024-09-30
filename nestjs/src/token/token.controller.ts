import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Public } from "src/auth/decorators/public.decorator";
import { TokenService } from "./token.service";
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CreateTokenDto } from "./createToken.dto";
import { Token } from "./token.entity";

@ApiTags('tokens')
@Controller('tokens')
export class TokenController {
    constructor(
        private tokenService: TokenService
    ) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all token\'s instances' })
    @ApiOkResponse({ description: 'The tokens has been successfully found.'})
    @ApiSecurity('x-api-secret')
    findAll() {
        return this.tokenService.findAll()
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get a token by id' })
    @ApiOkResponse({ description: 'The token has been successfully retrieved.', type: Token })
    @ApiNotFoundResponse({ description: 'Token not found.' })
    @ApiSecurity('x-api-secret')
    async findOneById(@Param('id') id: string): Promise<Token | null> {
        try {
            const token = await this.tokenService.findOneByValue(id)
            if (!token) {
                return null
            }
            return token
        } catch (error) {
            throw new HttpException(error.response?.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Public()
    @Delete()
    @ApiOperation({ summary: 'Delete all the tokens' })
    @ApiOkResponse({ description: 'All token have been successfully deleted.', type: Token })
    @ApiSecurity('x-api-secret')
    async clear() {
        return await this.tokenService.clear()
    }
}