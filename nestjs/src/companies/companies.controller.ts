import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CompanyService } from "./companies.service";
import { ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SignUpDto } from "src/auth/dtos/signUp.dto";
import { Company } from "./entities/companies.entity";
import { Public } from "src/auth/decorators/public.decorator";
import { CurrentUser } from "src/auth/decorators/CurrentUser.decorator";
import { SetPasswordDto } from "./dtos/setPassword.dto";
import { TokenService } from "src/token/token.service";
import { Token } from "src/token/token.entity";
import * as bcrypt from 'bcrypt'
import { Project } from "src/projects/entities/projects.entity";
import ProjectsService from "src/projects/projects.service";
import { SetReferentDataDto } from "./dtos/setReferentData.dto";
import { SetCompanyDataDto } from "./dtos/SetCompanyData.dto";
import { SetAddressDataDto } from "./dtos/setAddressData.dto";


@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private projectService: ProjectsService,
    private tokenService: TokenService
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ description: 'The company has been successfully created.', type: Company })
  @ApiSecurity('x-api-secret')
  async create(@Body() signUpDto: SignUpDto): Promise<Company> {
    return await this.companyService.create(signUpDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({ description: 'The companies have been successfully retrieved.', type: [Company] })
  @ApiSecurity('x-api-secret')
  async findAll(): Promise<Company[]> {
    return await this.companyService.findAll();
  }

  @Public()
  @Get('projects')
  @ApiOperation({ summary: 'Get all projects of a company' })
  @ApiQuery({
		name: 'id',
		required: true,
		type: 'string',
		description: 'Instance\'s id'
	})
  @ApiOkResponse({ description: 'The projects have been successfully retrieved.', type: [Company] })
  @ApiSecurity('x-api-secret')
  async findAllProjects(@Query('id') id: string) {
    return await this.companyService.findAllProjects(id);
  }
  
  @Get('oneByJwtToken')  @ApiOperation({ summary: 'Get a company by his access token' })
  @ApiOkResponse({ description: 'The company has been successfully retrieved.', type: Company })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  @ApiSecurity('x-api-secret')
  async findByToken(@CurrentUser() userId): Promise<Company> {
    return await this.companyService.findById(userId, false, {
      address: true,
      contracts: {
        project: true
      }
    });
  }

  @Get('project/:id')
  @ApiOkResponse({ description: 'The project has been successfully retrieved.', type: Project })
  @ApiNotFoundResponse({ description: 'Project not found.'})
  @ApiSecurity('x-api-secret')
  async findOneProject(@CurrentUser() userId, @Param('id') id: string) {
    return this.projectService.getOne(id)
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a company by id' })
  @ApiOkResponse({ description: 'The company has been successfully retrieved.', type: Company })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  @ApiSecurity('x-api-secret')
  async findById(@Param('id') id: string): Promise<Company> {
    return this.companyService.findById(id)
  }

  @Public()
  @Get('/email/:email')
  @ApiOperation({ summary: 'Get a company by email' })
  @ApiOkResponse({ description: 'The company has been successfully retrieved.', type: Company })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  @ApiSecurity('x-api-secret')
  async findByEmail(@Param('email') email: string): Promise<Company> {
    const company = await this.companyService.findByEmail(email)
    if (company) {
      return company
    } else {
      throw new NotFoundException(`Can\'t find companye with ${email} email`)
    }
  }

  @Public()
  @Post('/set/password')
  @ApiOperation({ summary: 'Set the password of a company\'s instance' })
  @ApiBody({ type: SetPasswordDto })
  @ApiOkResponse({ description: 'The company\'s password has been successfully modyfied.', type: Company })
  @ApiNotFoundResponse({ description: 'Something went wrong.' })
  @ApiSecurity('x-api-secret')
  async setPassword(@Body() setPassword: SetPasswordDto): Promise<Company | null> {
    try {
      const token: Token = await this.tokenService.findOneByValue(setPassword.token.tokenValue)
      if (token.id !== setPassword.token.id) {
        throw new ForbiddenException("The token'ids mismatch")
      } else if (token.company.id !== setPassword.token.company.id) {
        throw new ForbiddenException("The company doesn\'t match with the token")
      } else if (token.isExpired()) {
        throw new ForbiddenException("The token is expired")
      }
      const company = await this.companyService.findById(token.company.id)
      company.password = await bcrypt.hash(setPassword.newPassword, 10)
      this.tokenService.removeOne(token.id)
      return this.companyService.save(company)
    } catch (error) {
      if (error.response.statusCode === HttpStatus.FORBIDDEN) {
        throw error
      }
    }
  }

  @Put('set/referentData')
  async setReferentData(@CurrentUser() userId, @Body() referentData: SetReferentDataDto) {
    return this.companyService.setReferent(userId, referentData)
  }

  @Put('set/companyData')
  async setCompanyData(@CurrentUser() userId, @Body() companyData: SetCompanyDataDto) {
    return this.companyService.setCompany(userId, companyData)
  }

  @Put('set/addressData')
  async setAddressData(@CurrentUser() userId, @Body() addressData: SetAddressDataDto) {
    return this.companyService.setAddress(userId, addressData)
  }

  @Public()
  @Delete()
  @ApiOperation({ summary: 'Get a company by email' })
  @ApiOkResponse({ description: 'All companies have been successfully deleted.', type: Company })
  @ApiSecurity('x-api-secret')
  async clear() {
    return await this.companyService.clear()
  }
}