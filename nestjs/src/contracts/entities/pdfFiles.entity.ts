import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "../../companies/entities/companies.entity";
import { Contract } from "./contracts.entity";

@Entity('pdfFiles')
export class PdfFile {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        nullable: true,
    })
    sponsorshipAgreement: string

    @Column({
        nullable: true,
    })    
    commitmentCertificate: string

    @Column({
        nullable: true,
    })
    plantingReport: string
    
    @Column({
        nullable: true,
    })
    financialReport: string

    @Column({
        nullable: true,
    })
    projectSummary: string

    @OneToOne(() => Contract, (contract) => contract.pdfFiles)
    contract: Contract
}