import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { FabricacionService } from './fabricacion.service';
import { CreateFabricacionDto } from './dto/create-fabricacion.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Fabricacion')
// @ApiBearerAuth()
@Controller('fabricacion')
// @UseGuards(AuthGuard())
export class FabricacionController {
  constructor(private readonly fabricacionService: FabricacionService) { }

  @Post()
  create(@Body() createFabricacionDto: CreateFabricacionDto) {
    return this.fabricacionService.create(createFabricacionDto);
  }

  @Get()
  findAll() {
    return this.fabricacionService.findAll();
  }

  @Get('costes')
  @ApiQuery({ name: 'startDate', type: String, required: true })
  @ApiQuery({ name: 'endDate', type: String, required: true })
  getInformeCostes(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Si la fecha end es solo el dia, sumar 1 dia para incluir todo ese día. 
    // Depende del formato. Asumimos que viene con hora o la forzamos a fin de dia si queremos.
    // Vamos a usar las fechas tal cual.
    return this.fabricacionService.getInformeCostes(start, end);
  }
}
