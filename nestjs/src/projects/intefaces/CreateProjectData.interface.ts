import { Contract } from "src/contracts/entities/contracts.entity"
import { TreeType } from "../types/treeEnum.types"
import { ProductionType } from "../types/productionEnum.types"

export interface CreateProjectDataType {
    /*
    ** Farmer
    */
	name: string
    message: string
	farmerWishes: string
	/*
	** Parcel
	*/
	production: ProductionType
    treeTypes: TreeType[]
    treeTypeNumber: number
	treeNumberGoal: number
    carbonDyoxid?: number
	acres?: number
	profilePicture: string
	locationPicture: string
	pictures: string[]
	parcelDescription: string
	/*
	** Location
	*/
	city: string
	district: string
	districtNumber: number
    /*
    ** Project
    */
    coast: number
    steps: string[]
}