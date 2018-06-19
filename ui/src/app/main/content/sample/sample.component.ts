import { Component } from '@angular/core';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import {FuseConfigService} from "../../../core/services/config.service";

@Component({
    selector   : 'fuse-sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class FuseSampleComponent
{
    constructor(private fuseConfig: FuseConfigService, private translationLoader: FuseTranslationLoaderService)
    {
      this.fuseConfig.setSettings({
        layout: {
          navigation: 'top',
          toolbar   : 'above',
          footer    : 'none'
        },
        colorClasses    : {
          navbar: 'mat-fuse-dark-50-bg'
        }
      });
        this.translationLoader.loadTranslations(english, turkish);
    }
}
