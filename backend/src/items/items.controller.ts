import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItemsService } from './items.service';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: { title: string; status: 'pending' | 'in-progress' | 'completed' },
    @Req() req: any,
  ) {
    return this.itemsService.create(body.title, body.status, req.user.email);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { title: string; status: 'pending' | 'in-progress' | 'completed' },
  ) {
    return this.itemsService.update(+id, body.title, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
