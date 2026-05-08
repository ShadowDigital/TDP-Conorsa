import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import express from 'express';
import { AsistenciaService } from './asistencia.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../usuarios/entities/usuario.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GenerarInformeDto } from './dto/generar-informe.dto';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@ApiTags('Asistencia')
@ApiBearerAuth()
@Controller('asistencia')
@UseGuards(AuthGuard())
export class AsistenciaController {
  constructor(
    private readonly asistenciaService: AsistenciaService,
  ) { }

  @Post('informe')
  async generarInforme(@Body() dto: GenerarInformeDto, @Res() res: express.Response) {
    const buffer = await this.asistenciaService.generarInforme(dto.desde, dto.hasta);
    const filename = `informe_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return res.send(buffer);
  }

  @Post()
  create(
    @Body() createAsistenciaDto: CreateAsistenciaDto,
    @GetUser() user: User,
  ) {
    return this.asistenciaService.create(createAsistenciaDto, user);
  }

  @Get('estado-hoy')
  getEstadoHoy(@GetUser() user: User) {
    return this.asistenciaService.getEstadoHoy(user.id);
  }
}
