import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import {SafePipe} from "./pipe/safe.pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
      SafePipe
    ],
    exports: [
      SafePipe
    ],
    providers: [],
})
export class SharedModule {}
