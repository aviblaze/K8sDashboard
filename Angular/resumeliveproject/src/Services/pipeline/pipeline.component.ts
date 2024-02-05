import { Component,Input,OnInit } from '@angular/core';
import { StageComponent } from '../stage/stage.component';
import { CommonModule } from '@angular/common';
import { stagedetails } from '../../Interfaces/pipeline';
import { StageConnectorComponent } from '../stage-connector/stage-connector.component';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [StageComponent,CommonModule,StageConnectorComponent],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss'
})
export class PipelineComponent implements OnInit {
  @Input() inputs!: stagedetails[]; // Assuming 'stages' is an array of stage objects

  stages: stagedetails[] = [];

  ngOnInit(): void {
    this.stages = this.inputs;
  }

  getStageWidth(): string {
    if (this.stages && this.stages.length > 0) {
      return `${(100 / this.stages.length).toFixed(2)}%`;
    }
    return '0%';
  }
}
