import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppSocketGateway } from './app.socket-gateway';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        AppSocketGateway
    ],
})
export class AppModule {


}
