import {Component, Inject, OnInit} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormGroup} from "@angular/forms";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.component.html',
    styleUrls: ['dialog-content.component.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
})

export class DialogContentComponent implements OnInit{

    newElement: any;
    formInputs: any[] = [];
    form: FormGroup;
    title: string;
    formErrors: any;
    errorMessages: any;
    selects: any[];
    multipleSelects: any[];
    dates: any[];
    times: any[];
    fileInput: any;
    fileUploaded: boolean;
    buttonLabel: string;
    buttonColor: string;
    textArea: boolean;
    loading: {
        cuit: boolean,
        email: boolean,
        fileNumber: boolean,
        registrationNumber: boolean
    };
    emptyMessageBool: boolean;
    emptyMessage: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogContentComponent>, private adapter: DateAdapter<any>){
        this.title = data.title;
        this.newElement = data.element.empty();
        this.form = data.form;
        this.formInputs = data.formInputs;
        this.formErrors = data.formErrors;
        this.errorMessages = data.errorMessages;
        this.selects = data.selects || [];
        this.multipleSelects = data.multipleSelects || [];
        this.dates = data.dates || [];
        this.times = data.times || [];
        this.fileInput = data.fileInput || undefined;
        this.fileUploaded = false;
        this.buttonLabel = data.buttonLabel != undefined ? data.buttonLabel : "CREAR";
        this.buttonColor = data.buttonColor != undefined ? data.buttonColor : "accent";
        this.textArea = data.textArea != undefined;
        this.loading = {
            cuit: false,
            email: false,
            fileNumber: false,
            registrationNumber: false
        };
        this.emptyMessageBool = data.emptyMessageBool || false;
        this.emptyMessage = data.emptyMessage || '';
    }

    ngOnInit() {
        this.adapter.setLocale('es');
    }

    submitForm() {
        if(this.form.valid){
            this.dialogRef.close(this.newElement);
        } else {
            this.dialogRef.close();
        }
    }

}
