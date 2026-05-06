import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../usuarios/entities/usuario.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Asistencia')
@ApiBearerAuth()
@Controller('asistencia')
@UseGuards(AuthGuard())
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

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
