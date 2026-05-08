import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Asistencia, TipoAsistencia } from './entities/asistencia.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { User } from '../usuarios/entities/usuario.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AsistenciaService {
    constructor(
        @InjectRepository(Asistencia)
        private readonly asistenciaRepository: Repository<Asistencia>,
    ) { }

    async create(createAsistenciaDto: CreateAsistenciaDto, user: User) {
        const asistencia = this.asistenciaRepository.create({
            ...createAsistenciaDto,
            userId: user.id,
        });
        return await this.asistenciaRepository.save(asistencia);
    }


    async getEstadoHoy(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const registros = await this.asistenciaRepository.find({
            where: {
                userId,
                fecha_hora: Between(today, tomorrow),
            },
            order: { fecha_hora: 'ASC' },
        });

        const inicioJornada = registros.find(r => r.tipo === TipoAsistencia.INICIO_JORNADA);
        const finJornada = registros.find(r => r.tipo === TipoAsistencia.FIN_JORNADA);

        // Buscar la última pausa y si tiene un fin_pausa posterior
        const pausas = registros.filter(r => r.tipo === TipoAsistencia.PAUSA);
        const finesPausa = registros.filter(r => r.tipo === TipoAsistencia.FIN_PAUSA);

        const ultimaPausa = pausas.length > 0 ? pausas[pausas.length - 1] : null;
        const ultimoFinPausa = finesPausa.length > 0 ? finesPausa[finesPausa.length - 1] : null;

        const enPausa = ultimaPausa && (!ultimoFinPausa || ultimoFinPausa.fecha_hora < ultimaPausa.fecha_hora);

        return {
            registros,
            inicioJornada: inicioJornada?.fecha_hora || null,
            finJornada: finJornada?.fecha_hora || null,
            ultimaPausa: enPausa ? ultimaPausa : null,
            enPausa: !!enPausa,
            haIniciado: !!inicioJornada,
            haFinalizado: !!finJornada,
        };
    }


    async generarInforme(desde: string, hasta: string): Promise<Buffer> {
        const start = new Date(desde);
        const end = new Date(hasta);
        end.setHours(23, 59, 59, 999);

        const registros = await this.asistenciaRepository.find({
            where: {
                fecha_hora: Between(start, end),
            },
            relations: ['user'],
            order: { fecha_hora: 'ASC' },
        });

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Informe de Asistencia');

        // Título del informe
        ws.mergeCells('A1:D1');
        const titleCell = ws.getCell('A1');
        titleCell.value = `Informe de Asistencia (${desde} - ${hasta})`;
        titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F46E5' } // brand-600
        };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        ws.getRow(1).height = 30;

        // Cabecera de la tabla
        const headerRow = ws.getRow(2);
        headerRow.values = ['Usuario', 'Fecha / Hora', 'Evento', 'Motivo / Observaciones'];
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6366F1' } // brand-500
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Añadir datos
        registros.forEach((r, index) => {
            const row = ws.addRow([
                r.user?.name ?? 'Desconocido',
                r.fecha_hora,
                r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1).toLowerCase().replace('_', ' '),
                r.motivo_pausa ?? '',
            ]);

            // Formato de fecha en Excel
            const dateCell = row.getCell(2);
            dateCell.numFmt = 'dd/mm/yyyy hh:mm';

            // Filas alternas
            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF9FAFB' } // slate-50
                };
            }
        });

        // Ajustar anchos y bordes
        ws.columns = [
            { width: 30 }, // Usuario
            { width: 25 }, // Fecha/Hora
            { width: 20 }, // Evento
            { width: 40 }, // Motivo
        ];

        // Añadir filtros
        ws.autoFilter = 'A2:D2';

        // Bordes finos para todos los datos
        ws.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                    };
                });
            }
        });

        return await wb.xlsx.writeBuffer() as any;
    }
}
