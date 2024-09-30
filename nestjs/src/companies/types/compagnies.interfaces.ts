import { contractRelationsType } from "src/contracts/types/contractRealations.interface"

export interface CompanyRelationsType {
    address?: boolean
    token?: boolean
    contracts?: boolean | contractRelationsType
}