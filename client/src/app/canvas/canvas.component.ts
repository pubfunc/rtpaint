import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DrawService, DrawEvent } from '../services/draw.service';



@Component({
    selector: 'pf-canvas',
    template: '<canvas #canvas [width]="width" [height]="height" (mousedown)="onMouseDown($event)" (mousemove)="onMouseMove($event)" (mouseup)="onMouseUp($event)"></canvas>',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {

    @ViewChild('canvas', {static: true})
    canvasRef: ElementRef<HTMLCanvasElement>;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    overlayCanvas: HTMLCanvasElement;
    overlayCtx: CanvasRenderingContext2D;

    baseCanvas: HTMLCanvasElement;
    baseCtx: CanvasRenderingContext2D;

    width: number = 400;
    height: number = 300;

    mouseX: number = 0;
    mouseY: number = 0;
    mouseDown: boolean = false;

    private _destroy$ = new Subject<void>();
    private _render$ = new Subject<void>();
    private _enabled = true;

    constructor(private _drawService: DrawService){

    }


    ngOnInit(){

        this.canvas = this.canvasRef.nativeElement;

        this.baseCanvas = document.createElement('canvas');
        this.baseCanvas.width = this.width;
        this.baseCanvas.height = this.height;
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = this.width;
        this.overlayCanvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');
        this.baseCtx = this.baseCanvas.getContext('2d');
        this.overlayCtx = this.overlayCanvas.getContext('2d');

        const render = () => {
            this._render$.next();
            if(this._enabled) window.requestAnimationFrame(render);
        };

        window.requestAnimationFrame(render);

        // render pipeline
        this._render$.pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this.drawOverlay();
                this.drawBase();

                // this.ctx.drawImage(this.baseCanvas, 0, 0);
                this.ctx.drawImage(this.overlayCanvas, 0, 0);
            });

        // this.overlayCtx.fillStyle = '#000000';
        // this.baseCtx.fillStyle = '#FF0000';
        this.baseCtx.fillRect(0,0,this.width, this.height);

        this._drawService.listen()
            .subscribe(event => {
                this.drawPixel(event.args[0], event.args[1]);
            });

    }

    onMouseDown(event: MouseEvent){
        console.log(event);
        this.mouseDown = true;
        this.updateMouseCoords(event);
        this.emitPixel(this.mouseX, this.mouseY);
    }

    onMouseUp(event: MouseEvent){
        console.log(event);
        this.mouseDown = false;
        this.updateMouseCoords(event);
    }

    onMouseMove(event: MouseEvent){
        this.updateMouseCoords(event);

        if(this.mouseDown){
            this.emitPixel(this.mouseX, this.mouseY);
        }
    }

    emitPixel(x: number, y: number){
        this._drawService.draw(new DrawEvent('pixel', [x, y]));
    }

    drawPixel(x: number, y: number){
        this.overlayCtx.fillStyle = '#FF0000';
        this.overlayCtx.fillRect(x, y, 1, 1);
    }

    ngOnDestroy(){
        this._destroy$.next();
        this._destroy$.complete();
        this._enabled = false;
    }

    private drawBase(){

    }

    private drawOverlay(){
        // draw mouse position coords
        this.overlayCtx.fillStyle = '#000000';
        this.overlayCtx.fillRect(0, this.height - 10, 80, 10);
        this.overlayCtx.fillStyle = '#fff';
        this.overlayCtx.fillText(`X ${this.mouseX} Y ${this.mouseY}`, 2, this.height - 2);
        this.overlayCtx.strokeStyle = "#FF0000";
        this.overlayCtx.lineWidth = 2;
        this.overlayCtx.strokeRect(0,0,this.width,this.height);
    }

    private updateMouseCoords(event: MouseEvent){
        this.mouseX = Math.round(event.offsetX / this.canvas.offsetWidth * this.width);
        this.mouseY = Math.round(event.offsetY / this.canvas.offsetHeight * this.height);
    }

}

export interface XY {
    x: number;
    y: number;
}