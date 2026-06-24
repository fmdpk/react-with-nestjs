import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Buy groceries' })
  title!: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'in-progress', 'completed'],
  })
  status!: 'pending' | 'in-progress' | 'completed';
}
