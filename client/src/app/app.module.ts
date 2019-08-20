import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DrawService } from './services/draw.service';
import { CanvasComponent } from './canvas/canvas.component';

const config: SocketIoConfig = { url: 'http://localhost:3001' };

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    DrawService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
