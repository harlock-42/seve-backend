class CompanyDto {
    id: string
    companyName: string
    firstName: string
    lastname: string
    email: string
    vatNumber: string
    createdAt: Date
}

export class TokenDto {
    id: string
    tokenValue: string
    company: CompanyDto
}

export class SetPasswordDto {
    newPassword: string
    token: TokenDto
}