import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsNumberString, Max, Min } from "class-validator";
import { toNumber } from "src/utils/cast.helper";

export class LimitDto {
	@Transform(({ value }) => toNumber(value))
	@IsInt()
	@Min(1)
	limit: number
}