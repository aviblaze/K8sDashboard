import { Component,Inject } from '@angular/core';
import {MatDialogModule,MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-popupdialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './popupdialog.component.html',
  styleUrl: './popupdialog.component.scss'
})
export class PopupdialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
