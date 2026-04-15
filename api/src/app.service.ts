import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    
    constructor(private configSrvc: ConfigService){
    }

    /** */
    getHello() {
        const mensaje: string = "Servicio Activo";
        const version = this.configSrvc.get('VERSION');

        return {
            mensaje,
            version
        };
    }

}
