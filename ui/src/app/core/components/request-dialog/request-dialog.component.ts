import {Component, Inject, OnInit} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormGroup} from "@angular/forms";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'request-dialog',
  templateUrl: 'request-dialog.component.html',
    styleUrls: ['request-dialog.component.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
})

export class RequestDialogComponent implements OnInit{

    updateElement: any;
    formInputs: any[] = [];
    labels: any[] = [];
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

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<RequestDialogComponent>, private adapter: DateAdapter<any>) {
      this.title = data.title;
      this.updateElement = data.element;
      this.form = data.form;
      this.formInputs = data.formInputs;
      this.labels = data.labels;
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

    }

    ngOnInit() {
        this.adapter.setLocale('es');
    }

    submitForm() {
        if(this.form.valid){
            this.dialogRef.close(this.form.getRawValue());
        } else {
            this.dialogRef.close();
        }
    }

}
