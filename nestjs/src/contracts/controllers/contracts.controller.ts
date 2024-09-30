import { Body, Controller, Delete, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ContractService } from "../services/contracts.service";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";
import { CreateContractDto } from "../dtos/createContract.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "src/auth/decorators/CurrentUser.decorator";
import PdfFileService from "../services/pdfFiles.service";

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
    constructor(
        private contractService: ContractService,
    ) {}

    @Public()
	@Get('all')
	@ApiOperation({ summary: 'Get all contract\'s intances'})
	@ApiOkResponse({ description: 'Request successfull'})
	@ApiBadRequestResponse({ description: 'Bad request'})
	@ApiSecurity('x-api-secret')
	async getAll() {
		return this.contractService.getAll()
	}

    @Public()
    @Post('one')
    // @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: "Create a new contract's instance"})
    @ApiBody({
        description: "Data to create a contract instance",
        type: CreateContractDto
    })
    @ApiOkResponse({ description: "The contract is created and saved in database successfully"})
	@ApiBadRequestResponse({ description: "Bad request"})
	@ApiSecurity('x-api-secret')
    async createOne(@Body() createContractDto: CreateContractDto) {
        return this.contractService.createOne(createContractDto)
    }

    @Delete()
    @Public()
    @ApiOperation({ summary: 'delete all contract\'s instance'})
	@ApiOkResponse({ description: 'Request successfull'})
	@ApiBadRequestResponse({ description: 'Bad request'})
    async deleteAll() {
        this.contractService.deleteAll()
    }

}