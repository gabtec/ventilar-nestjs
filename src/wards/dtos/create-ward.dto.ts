import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateWardDto {
  @ApiProperty({
    description: 'The ward name, in this form SRC_Name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(8)
  readonly institution: string;
}
