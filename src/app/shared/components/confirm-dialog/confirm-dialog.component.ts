import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  id:string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
      // Update view with given values
      this.title = data.title;
      this.message = data.message;
      this.id = data.id;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({status:true, id: this.id});
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({status:false, id: this.id});
  }

}

export class ConfirmDialogModel {

  constructor(public id:string, public title: string, public message: string) {
  }
}
