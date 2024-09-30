import { Contract } from "src/contracts/entities/contracts.entity"
import { TreeType } from "../types/treeEnum.types"
import { ProductionType } from "../types/productionEnum.types"

export interface ProjectData {
	id: string
	name: string
	/*
	** Parcel
	*/
	production: ProductionType
    treeTypes: TreeType[]
    treeTypeNumber: number
    carbonDyoxid?: number
    treeNumber: number
	acres?: number
	profilePicture: string
	locationPicture: string
	pictures: string[]
	/*
	** Location
	*/
	city: string
	district: string
	districtNumber: number
	/*
	** Project
	*/
	steps: string[]
	contracts?: Contract[]
}