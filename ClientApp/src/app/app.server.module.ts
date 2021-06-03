import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
    imports: [AppModule, ServerModule, ModuleMapLoaderModule, BrowserAnimationsModule, NoopAnimationsModule],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
