import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./contracts.entity";

@Entity('news')
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    text: string

    @Column()
    picture: string

    @Column()
    date: Date

    @ManyToOne(() => Contract, (contract) => contract.newsArr)
    contract: Contract
}