import { Contract } from "src/contracts/entities/contracts.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Address } from "src/address/address.entity";
import { Token } from "src/token/token.entity";
import { PdfFile } from "../../contracts/entities/pdfFiles.entity";

@Entity('companies')
export class Company {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	companyName: string

    @Column()
    firstName: string

    @Column()
    lastName: string
        
    @Column()
    email: string
    
    @Column()
    vatNumber: string

    @Column({
        nullable: true
    })
    resetPasswordToken: string

    @Column({
        nullable: true
    })
    resetPasswordExpires: Date

    @Column({
        select: false
    })
	password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date

	@OneToMany(() => Contract, (contract) => contract.company)
	contracts: Contract[]

    @OneToOne(() => Address, (address) => address.company, {
        cascade: true
    })
    @JoinColumn()
    address: Address

    @OneToOne(() => Token, (token) => token.company, {
        nullable: true
    })
    token: Token
}