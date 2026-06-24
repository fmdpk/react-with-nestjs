import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Buy groceries' })
  title!: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'in-progress', 'completed'],
  })
  status!: 'pending' | 'in-progress' | 'completed';

  @ApiProperty({ example: '2026-06-24T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-06-24T00:00:00.000Z' })
  updatedAt!: string;

  @ApiProperty({ example: 'user@example.com' })
  createdUser!: string;
}
