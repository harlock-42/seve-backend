export enum PdfType {
    SPONSORSHIP_AGREEMENT = 'convention de mécénat',
    COMMITMENT_CERITFICATE = 'certificat d\'engagement',
    PLANTATION_REPORT = 'rapport de plantation',
    FINANCIAL_REPORT = 'rapport financier',
    PROJECT_SUMMARY = 'Bilan du projet'
}

export class UploadPdfDto {
    projectId: string
    companyId: string
    pdfType: PdfType
}