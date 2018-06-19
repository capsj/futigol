import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FuseConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector   : 'autocompleter',
    templateUrl: './autocompleter.component.html',
    styleUrls  : ['./autocompleter.component.scss']
})
export class AutocompleterComponent implements OnInit
{
    collapsed: boolean;
    toolbarColor: string;
    @Input() placeholder: string;
    @Input() suggestions: any[];
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Output() onSuggestionClick: EventEmitter<any> = new EventEmitter();
    onSettingsChanged: Subscription;
    searchBar: string;

    constructor(
        private fuseConfig: FuseConfigService
    )
    {
        this.collapsed = false;
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.toolbarColor = newSettings.colorClasses.toolbar;
                    }
                );
    }

    ngOnInit()
    {
    }

    collapse()
    {
        this.collapsed = true;
    }

    expand()
    {
        this.collapsed = false;
    }

    onClick(index) {
        this.onSuggestionClick.emit(index);
    }

    onSelectionChange(event, index){
        if(event.isUserInput){
            this.onSuggestionClick.emit(index);
        }
    }

    onInputChange(event)
    {
        this.searchBar = event;
        if (event || event === '')
            this.onChange.emit(this.searchBar);
    }

    clearSearch(){
        this.searchBar = "";
        this.onChange.emit(this.searchBar);
    }
}
