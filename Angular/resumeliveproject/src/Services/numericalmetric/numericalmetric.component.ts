import { Component,Input,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-numericalmetric',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './numericalmetric.component.html',
  styleUrl: './numericalmetric.component.scss'
})
export class NumericalmetricComponent implements OnInit{
  @Input() inputs!: any[];

  metricdata:number=0;
  metricname:String="";
  showIcon:boolean=false;

  ngOnInit() {
    if(typeof(this.inputs[0].metricvalue) === "boolean" ){
      this.showIcon=true;
    }
    this.metricdata = this.inputs[0].metricvalue;
    this.metricname = this.inputs[0].metricname;
  }
}
