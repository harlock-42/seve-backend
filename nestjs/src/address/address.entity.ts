import { Company } from "src/companies/entities/companies.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    streetNumber: string

    @Column()
    streetName: string

    @Column()
    zipCode: string

    @Column()
    city: string

    @OneToOne(() => Company, (company) => company.address)
    company: Company
}