import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { SignUpDto } from "./dtos/signUp.dto";
import { SignInDto } from "./dtos/signIn.dto";
import { Public } from "./decorators/public.decorator";
import { TokenService } from "src/token/token.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) {}

    @Public()
    @Post('signup')
    @ApiOperation({ summary: 'Sign up a new company' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({
        status: 201,
        description: 'The company has been successfully created'
    })
    @ApiUnauthorizedResponse({ description: 'Signup failed'})
    @ApiSecurity('x-api-secret')
    async signUp(@Body() signUpDto: SignUpDto) {
        try {
            return await this.authService.signUp(signUpDto)
        } catch (error) {
            throw new UnauthorizedException(`Signup failed. ${error.response.message}`)
        }
    }

    @Public()
    @Post('signin')
    @ApiOperation({ summary: 'Sign in a company' })
    @ApiBody({ type: SignInDto })
    @ApiResponse({
        status: 200,
        description: 'The company has been succesfully signed in'
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials'})
    @ApiSecurity('x-api-secret')
    async signIn(@Body() signInDto: SignInDto) {
        const { email, password } = signInDto

        try {
            return await this.authService.signIn(email, password)
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials')
        }
    }
}