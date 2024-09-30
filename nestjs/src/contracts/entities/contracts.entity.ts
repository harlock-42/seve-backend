import { Company } from "src/companies/entities/companies.entity";
import { Project } from "src/projects/entities/projects.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PdfFile } from "./pdfFiles.entity";
import { News } from "./news.entity";

@Entity('contracts')
export class Contract {
	@PrimaryGeneratedColumn('uuid')
	id: string

    @Column()
    amount: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

	@ManyToOne(() => Company, (company) => company.contracts, {
        cascade: true
    })
	company: Company

    @ManyToOne(() => Project, (project) => project.contracts, {
        cascade: true
    })
    project: Project

    @JoinColumn()
    @OneToOne(() => PdfFile, (pdfFile) => pdfFile.contract)
    pdfFiles: PdfFile

    @OneToMany(() => News, (news) => news.contract)
    newsArr: News[]
}