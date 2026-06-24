import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiProperty({ example: 'Buy groceries and snacks' })
  title!: string;

  @ApiProperty({
    example: 'in-progress',
    enum: ['pending', 'in-progress', 'completed'],
  })
  status!: 'pending' | 'in-progress' | 'completed';
}
