import { Component,Input,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-displaytabulardata',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './displaytabulardata.component.html',
  styleUrl: './displaytabulardata.component.scss'
})
export class DisplaytabulardataComponent implements OnInit {
  @Input() inputs!: any[];
  data: string = "";
  name: string = "";
  status!:boolean;

  ngOnInit(): void {
      this.data = this.inputs[0].tabledata;
      this.status = this.inputs[0].status;
      this.name = this.inputs[0].name;
  }
}
