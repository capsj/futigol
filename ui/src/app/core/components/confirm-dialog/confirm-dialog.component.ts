import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent implements OnInit
{
    public confirmMessage: string;
    public confirmButton: {
      text: string,
      colour: string
    };
    public rejectButton: {
      text: string,
      colour: string
    };

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FuseConfirmDialogComponent>)
    {
      this.confirmMessage = data.confirmMessage;
      this.confirmButton = data.confirmButton || {text: 'Confirmar', colour: ''};
      this.rejectButton = data.rejectButton || {text: 'Cancelar', colour: ''};
    }

    ngOnInit()
    {
    }

}
