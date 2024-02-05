import { Component, Input,OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { stagedetails } from '../../Interfaces/pipeline';
@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})

export class StageComponent implements OnInit{

  @Input() Inputs!:stagedetails;

  name:string = '';
  status:string = '';
  description: string = '';

  ngOnInit(): void {
    this.name = this.Inputs.name;
    this.status = this.Inputs.status;
    this.description = this.Inputs.description || '';
  }
}
