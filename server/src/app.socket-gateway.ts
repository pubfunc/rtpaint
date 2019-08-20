import { WebSocketGateway, SubscribeMessage, WsResponse, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { createCanvas } from 'canvas';

export class DrawEvent {
    
    constructor(
        public fn: string,
        public args: number[]
    ){}
}

@WebSocketGateway(3001, { })
export class AppSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private _subject$ = new BehaviorSubject(null);
    private _canvas = createCanvas(100,100);
    private _ctx = this._canvas.getContext('2d');

    constructor(){
    }

    @SubscribeMessage('draw')
    handleDraw(client: Client, event: DrawEvent): void {
        console.log("Websocket draw: %o", event);

        this._ctx.fillStyle = "#00FF00";
        this._ctx.fillRect(0,0,100,100);

        this._subject$.next(event);

        return;
    }

    afterInit(server: Server) {
        console.log("Websocket init");

        this._subject$.subscribe(data => {
            server.emit("draw", data);
        });
    }

    handleConnection(client: Client, ...args: any[]) {
        console.log("Websocket connect %s", client.id);
    }

    handleDisconnect(client: Client) {
        console.log("Websocket disconnect %s", client.id);
    }


}

