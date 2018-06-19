import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../modules/shared.module';
import { AutocompleterComponent } from './autocompleter.component';

@NgModule({
    declarations: [
        AutocompleterComponent
    ],
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        AutocompleterComponent
    ]
})
export class AutocompleterModule
{
}
