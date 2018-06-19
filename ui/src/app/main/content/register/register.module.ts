import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RegisterComponent } from './register.component';

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        SharedModule,
    ]
})

export class RegisterModule
{

}
