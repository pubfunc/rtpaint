import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DrawService } from './services/draw.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


    constructor(private _drawService: DrawService){
    }

    ngOnInit(){



    }

    draw(){
    }

}
