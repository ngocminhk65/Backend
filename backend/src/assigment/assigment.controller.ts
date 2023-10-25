import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssigmentService } from './assigment.service';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';

@Controller('assigment')
export class AssigmentController {
  constructor(private readonly assigmentService: AssigmentService) {}

  @Post()
  create(@Body() createAssigmentDto: CreateAssigmentDto) {
    return this.assigmentService.create(createAssigmentDto);
  }

  @Get()
  findAll() {
    return this.assigmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssigmentDto: UpdateAssigmentDto) {
    return this.assigmentService.update(+id, updateAssigmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentService.remove(+id);
  }
}
