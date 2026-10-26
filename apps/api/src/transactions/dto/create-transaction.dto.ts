import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateTransactionDto {
  @IsString() @MinLength(1) @MaxLength(100) title!: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(1) @Max(999999999999) amount!: number;
  @IsIn(["income", "expense"]) type!: "income" | "expense";
  @IsString() @MinLength(1) @MaxLength(60) category!: string;
  @IsDateString() date!: string;
  @IsOptional() @IsString() @MaxLength(500) note?: string;
}
