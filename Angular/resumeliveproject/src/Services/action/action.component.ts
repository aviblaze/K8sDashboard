import { Component,OnInit,Input,Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; 
import {MatDialog  } from '@angular/material/dialog';
import { PopupdialogComponent } from '../popupdialog/popupdialog.component';
@Component({
  selector: 'app-action',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})

export class ActionComponent implements OnInit{
  @Input() inputs!: any[];
  @Output() dynamicEvent = new EventEmitter<any>();

  title:String="";
  status:String="";
  isDisabled=false;
  
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.title = this.inputs[0].title;
    this.status = this.inputs[0].status;
    this.isDisabled = this.inputs[0].isDisabled;
  }

  onClick(){
    this.dynamicEvent.emit({title:this.title,componentName:"ActionComponent"});
  }

  getIconName(): string {
    switch (this.status) {
      case 'success':
        return 'play_arrow'; // Example icon for success
      case 'failure':
        return 'error'; // Example icon for failure
      case 'not started':
        return 'play_arrow'; // Default or not started icon
      default:
        return 'play_arrow'; // Default icon
    }
  }

  openPopup() {
    this.dialog.open(PopupdialogComponent, {
        width: 'auto',
        data: { status: "Jenkins build for another feature is running. Please wait for it to complete." },
        panelClass: 'custom-dialog-container'
    });
  }
}
