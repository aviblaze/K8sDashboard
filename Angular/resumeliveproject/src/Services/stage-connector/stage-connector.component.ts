import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage-connector',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './stage-connector.component.html',
  styleUrl: './stage-connector.component.scss'
})
export class StageConnectorComponent implements OnInit {
  @Input() Input!: string;

  status:string="";
  
  ngOnInit(): void {
    this.status=this.Input;
  }
}
