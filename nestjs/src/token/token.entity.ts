import { Company } from "src/companies/entities/companies.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    value: string

    @Column()
    createdAt: Date

    @OneToOne(() => Company, (company) => company.token)
    @JoinColumn()
    company: Company

    isExpired() {
        const now = Date.now();
        const expiryDate = this.createdAt.getTime() + 24 * 60 * 60 * 1000
        return now > expiryDate;
    }
}