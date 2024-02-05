import { Component,Input,AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ElasticsearchCpuResponse,ElasticsearchMemoryResponse,ElasticsearchNetworkResponse } from '../../Interfaces/apiresponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-displaygraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './displaygraph.component.html',
  styleUrl: './displaygraph.component.scss'
})
export class DisplaygraphComponent implements OnInit,AfterViewInit{
  @Input() inputs!: any[];

  graph:string='';
  private title:string='';
  private data!:ElasticsearchCpuResponse|ElasticsearchMemoryResponse|ElasticsearchNetworkResponse;
  private cpuChart?: Chart;
  private memoryChart?: Chart;
  private networkChart?: Chart;

  ngOnInit(): void {
    this.title = this.inputs[0].title;
    this.data=this.inputs[0].data;
    this.graph=this.inputs[0].graph;
  }

  ngAfterViewInit(): void {
    if(this.graph === 'cpu' && 'cpu_usage_over_time' in this.data.aggregations){
      this.buildCpuGraph(this.data.aggregations.cpu_usage_over_time.buckets);
    }else if(this.graph === 'memory' && 'memory_usage_over_time' in this.data.aggregations){
      this.buildMemoryGraph(this.data.aggregations.memory_usage_over_time.buckets);
    }else if(this.graph === 'networkio' && 'network_throughput_over_time' in this.data.aggregations){
      this.buildNetworkGraph(this.data.aggregations.network_throughput_over_time.buckets);
    }
  }

  private buildCpuGraph(cpuData: any[]) {
    const labels = cpuData.map(item => new Date(item.key_as_string).toLocaleTimeString());
    const cpuUsages = cpuData.map(item => item.cpu_usage.value);
    if (this.cpuChart) {
      this.cpuChart.destroy();
    }
    this.cpuChart= new Chart('cpuusagechart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: this.title? this.title :'CPU Usage (%)',
          data: cpuUsages,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false 
      }
    });

  }
  
  private buildMemoryGraph(memoryData: any[]) {
    const labels = memoryData.map(item => new Date(item.key_as_string).toLocaleTimeString());
    const memoryUsages = memoryData.map(item => item.memory_usage.value);
    if (this.memoryChart) {
      this.memoryChart.destroy();
    }
    this.memoryChart= new Chart('memoryusagechart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: this.title? this.title :'Memory Usage (%)',
          data: memoryUsages,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false 
      }
    });
  }
  
  private buildNetworkGraph(networkData: any[]) {
    const labels = networkData.map(item => new Date(item.key_as_string).toLocaleTimeString());
    const networkIns = networkData.map(item => item.network_in.value);
    const networkOuts = networkData.map(item => item.network_out.value);
    if (this.networkChart) {
      this.networkChart.destroy();
    }
    this.networkChart= new Chart('networkiochart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.title? this.title :'Network In (Mbps) (%)',
            data: networkIns,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: this.title? this.title :'Network Out (Mbps)',
            data: networkOuts,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false 
      }
    });
  }
}
