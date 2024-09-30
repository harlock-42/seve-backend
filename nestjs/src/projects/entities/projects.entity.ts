import { Contract } from "src/contracts/entities/contracts.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TreeType } from "../types/treeEnum.types";
import { ProductionType } from "../types/productionEnum.types";

@Entity('projects')
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string

	/*
	** Farmer
	*/

	@Column()
	name: string

	@Column({
		nullable: true
	})
	message: string

	@Column({
		nullable: true
	})
	farmerWishes: string
	
	/*
	** Location
	*/
	
	@Column({
		nullable: true
	})
	city: string
	
	@Column()
	district: string
	
	@Column()
	districtNumber: number
	
	/*
	** Parcel
	*/
	
	@Column({
		type: 'enum',
		enum: ProductionType
	})
	production: ProductionType

	@Column({
		nullable: true
	})
	parcelDescription: string
	
	@Column({
		type: 'enum',
		enum: TreeType,
		array: true
	})
	treeTypes: TreeType[]
	
	@Column({
        type: 'smallint'
    })
    treeTypeNumber: number
	
	@Column({
		type: 'int',
		default: 0
    })
    treeNumber: number

	@Column()
	treeNumberGoal: number
	
    @Column({
		type: 'numeric',
        precision: 12,
        scale: 6,
        nullable: true
    })
    carbonDyoxid: number
	
	@Column({
		nullable: true
	})
	acres?: number

	@Column()	
	profilePicture: string
	
	@Column()
	locationPicture: string

	@Column('text', {
		array: true,
		nullable: true,
		default: () => 'ARRAY[]::text[]'
	})
	pictures: string[]
	
	/*
	** Project
	*/

	@Column()
	coast: number

	@Column({
		type: 'text',
		array: true,
		default: () => 'ARRAY[]::text[]'
	})
	steps: string[]

	/*
	** relations
	*/

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date

    @OneToMany(() => Contract, (contract) => contract.project)
    contracts: Contract[]
}