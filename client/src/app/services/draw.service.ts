import { Injectable } from "@angular/core";
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';



@Injectable()
export class DrawService {
    constructor(private _socket: Socket){}

    draw(event: DrawEvent){
        this._socket.emit("draw", event);
    }

    listen(){
        return this._socket.fromEvent<DrawEvent>("draw")
                    .pipe(
                        tap(event => {
                            console.log("Draw %s", event);
                        })
                    );
    }

}

export class DrawEvent {
    
    constructor(
        public fn: string,
        public args: number[]
    ){}
}