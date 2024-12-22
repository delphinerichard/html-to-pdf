import { IsNumber, IsOptional } from 'class-validator';
import { IPageFormat } from '../convert.interface';
import { Type } from 'class-transformer';

export class FormatDto implements IPageFormat {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;
}
