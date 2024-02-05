import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { screendetails,componentdetails,graphdatainput,numericalmetricinput, tabulardatainput } from '../Interfaces/screensplitter';
import { NumericalmetricComponent } from '../Services/numericalmetric/numericalmetric.component';
import { DisplaygraphComponent } from '../Services/displaygraph/displaygraph.component';
import { DisplaytabulardataComponent } from '../Services/displaytabulardata/displaytabulardata.component';
import { SplitscreenComponent } from '../Services/splitscreencomponent/splitscreen.component';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { KubernetesService } from '../common/kubernetsapi.service';
import { ElasticsearchService } from '../common/elasticsearchapi.service';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {NodeListResponse,KubernetesNode,PodListResponse,KubernetesPod} from '../Interfaces/apiresponse';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NumericalmetricComponent, DisplaygraphComponent, DisplaytabulardataComponent, SplitscreenComponent,
    MatFormFieldModule, MatSelectModule, CommonModule, MatProgressSpinnerModule,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

  isLoading = true;
  isDefaultDataLoaded=false;
  masterNodes!: KubernetesNode[];
  workerNodes!: KubernetesNode[];
  pods: KubernetesPod[] = [];
  name:string = "";

  selectedMasterNode!: string;
  selectedWorkerNode!: string;
  selectedPod!: string;
  status: boolean = true;
  queryStatus: boolean=false;
  selectedOption!: string;
  config !: screendetails;
  private elasticsearchApiUrl = environment.elasticsearchApiUrl;
  private kubernetesApiUrl = environment.kubernetesApiUrl;

  constructor(
    private kubernetesService: KubernetesService,
    private elasticsearchService: ElasticsearchService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
   
    this.config = {
      split: 'horizontal',
      splitratio: [70, 30],
      overrideflexdirection:[false,false],
      data: {
        0: [
          {
            split: 'vertical',
            splitratio: [80, 20],
            overrideflexdirection:[true,false],
            data: {
              0: [
                {
                  name: DisplaygraphComponent,
                  inputs: [{
                    data: {
                      "aggregations": {
                        "cpu_usage_over_time": {
                          "buckets": [
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "cpu_usage": { "value": 4 } },
                            { "key_as_string": "2024-01-01T12:01:00.000Z", "key": 1577880060000, "cpu_usage": { "value": 83 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 23 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 51 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 40 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 89 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 51 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 21 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 94 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 95 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 52 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "cpu_usage": { "value": 15 } },
                            { "key_as_string": "2024-01-01T12:29:00.000Z", "key": 1577881740000, "cpu_usage": { "value": 82 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "cpu_usage": { "value": 73 } }
                          ]
                        }
                      }
                    }, graph: 'cpu'
                  }]
                },
                {
                  name: DisplaygraphComponent,
                  inputs: [{
                    data: {
                      "aggregations": {
                        "memory_usage_over_time": {
                          "buckets": [
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "memory_usage": { "value": 45 } },
                            { "key_as_string": "2024-01-01T12:01:00.000Z", "key": 1577880060000, "memory_usage": { "value": 47 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:02:00.000Z", "key": 1577880120000, "memory_usage": { "value": 50 } },
                            { "key_as_string": "2024-01-01T12:29:00.000Z", "key": 1577881740000, "memory_usage": { "value": 55 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "memory_usage": { "value": 53 } }
                          ]
                        }
                      }
                    }, graph: 'memory'
                  }]
                },
                {
                  name: DisplaygraphComponent,
                  inputs: [{
                    data: {
                      "aggregations": {
                        "network_throughput_over_time": {
                          "buckets": [
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:00:00.000Z", "key": 1577880000000, "network_in": { "value": 120 }, "network_out": { "value": 150 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 140 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 200 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 200 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 200 } },
                            { "key_as_string": "2024-01-01T12:30:00.000Z", "key": 1577881800000, "network_in": { "value": 130 }, "network_out": { "value": 200 } }
                          ]
                        }
                      }
                    }, graph: 'networkio'
                  }]
                }
              ],
              1: [
                  {
                      name: NumericalmetricComponent,
                      inputs: [{ metricname: 'Elasticsearch', metricvalue: true }]
                    },
                    {
                      name: NumericalmetricComponent,
                      inputs: [{ metricname: 'Application pod count', metricvalue: 4 }]
                    },
                    {
                      name: NumericalmetricComponent,
                      inputs: [{ metricname: 'Worker node count', metricvalue: 1 }]
                    }
              ]
            }
          }
        ],
        1: [
          {
              name: DisplaytabulardataComponent,
              inputs: [{
                tabledata: "Forgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\nForgive me for asking a stupid question but I can't seem to find anywhere in the Kubernetes API reference how to query logs via the REST API if there's more than one container running inside the pod?\n",
                status: true, name: 'Hola'
              }]
            }
        ]
      }
    };
    this.getClusterDetails();
  }

  
  private updateLoadingState() {
 
    if (this.masterNodes && this.pods && this.queryStatus) {
      this.isLoading = false;
      this.name= this.selectedOption;
      this.changeDetectorRef.detectChanges();
    }
  }

  private prepareElasticsearchQuery(filter:string): Object {
    const query = { /* define your query here */ };
    return query;
  }

  private queryElasticsearchAndProcessResults(query: Object, componentDetail: componentdetails): Observable<any> {
    return this.elasticsearchService.queryData(this.elasticsearchApiUrl, query).pipe(
      tap({
        next: result => {
          console.log(result);
          if (componentDetail.inputs.length > 0 && 'data' in componentDetail.inputs[0]) {
            (componentDetail.inputs[0] as graphdatainput).data = result;
          } else if (componentDetail.inputs.length > 0 && 'tabledata' in componentDetail.inputs[0]) {
            (componentDetail.inputs[0] as tabulardatainput).tabledata = result;
          }
        },
        error: error => {
          console.error('Error while fetching Elasticsearch query results.', error);
        }
      }),
      catchError(error => of(`Error: ${error}`)) // Catch and replace the error
    );
  }
  
  private onNodeSelectionChange(selected: string) {
    
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
  
    const cpuQuery = this.prepareElasticsearchQuery(selected);
    const memQuery = this.prepareElasticsearchQuery(selected);
    const nwioQuery = this.prepareElasticsearchQuery(selected);
    const logQuery = this.prepareElasticsearchQuery(selected);
  
    let observables: Observable<any>[] = [];
  
    if ('split' in this.config.data[0][0]) {
      const screenDetail = this.config.data[0][0] as screendetails;
      
      if ('name' in screenDetail.data[0][0]) {
        const cpuComponentDetail = screenDetail.data[0][0] as componentdetails;
        const memComponentDetail = screenDetail.data[0][1] as componentdetails;
        const nwioComponentDetail = screenDetail.data[0][2] as componentdetails;
  
        observables.push(this.queryElasticsearchAndProcessResults(cpuQuery, cpuComponentDetail));
        observables.push(this.queryElasticsearchAndProcessResults(memQuery, memComponentDetail));
        observables.push(this.queryElasticsearchAndProcessResults(nwioQuery, nwioComponentDetail));
      }
  
      if('inputs' in screenDetail.data[0][1]){
        const tabularComponentDetail = screenDetail.data[0][1] as componentdetails;
        observables.push(this.queryElasticsearchAndProcessResults(logQuery, tabularComponentDetail));
      }
    }
  
    forkJoin(observables).subscribe({
      next: results => {
        console.log('All queries completed', results);
      },
      error: error => {
        console.error('Error in one of the queries', error);
      },
      complete: () => {
        this.queryStatus = true;
        this.updateLoadingState();
        console.log('All Elasticsearch query executions completed');
      }
    });
  }
  
  // Update the individual selection change methods to use the refactored method
  onMasterNodeSelectionChange() {
    this.name='';
    this.selectedWorkerNode = '';
    this.selectedPod = '';
    this.selectedOption=this.selectedMasterNode;
    sessionStorage.setItem('selectedDropdownValue', this.selectedMasterNode);
    sessionStorage.setItem('selectedEntityType', 'master');
    this.onNodeSelectionChange(this.selectedMasterNode);
  }
  
  onWorkerNodeSelectionChange() {
    this.name='';
    this.selectedMasterNode = '';
    this.selectedPod = '';
    this.selectedOption=this.selectedWorkerNode;
    sessionStorage.setItem('selectedDropdownValue', this.selectedWorkerNode);
    sessionStorage.setItem('selectedEntityType', 'worker');
    this.onNodeSelectionChange(this.selectedWorkerNode);
  }
  
  onPodSelectionChange() {
    this.name='';
    this.selectedMasterNode = '';
    this.selectedWorkerNode = '';
    this.selectedOption=this.selectedPod;
    sessionStorage.setItem('selectedDropdownValue', this.selectedPod);
    sessionStorage.setItem('selectedEntityType', 'pod');
    this.onNodeSelectionChange(this.selectedPod);
  }
  
  
  private handleFetchError(error: any) {
    console.error('error while fetching data', error);
    this.loadDefaultData();
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }
  
  private loadDefaultData() {
    if(! this.isDefaultDataLoaded){
      this.masterNodes = [
        { metadata: { name: "master-josh" } },
        { metadata: { name: "master-sally" } },
        { metadata: { name: "master-fred" } }
      ].map(node => node as KubernetesNode); // Casting to KubernetesNode for type consistency
    
      // Create dummy worker nodes
      this.workerNodes = [
        { metadata: { name: "worker-bob" } },
        { metadata: { name: "worker-joe" } },
        { metadata: { name: "worker-anne" } }
      ].map(node => node as KubernetesNode); // Casting to KubernetesNode for type consistency
    
      // Create dummy pods
      this.pods = [
        { metadata: { name: "pod1" } },
        { metadata: { name: "pod2" } },
        { metadata: { name: "pod3" } }
      ].map(pod => pod as KubernetesPod); // Casting to KubernetesPod for type consistency
      
      this.isDefaultDataLoaded=true;
      this.selectedMasterNode='';
      this.selectedWorkerNode='';
      this.selectedPod='';
      const savedSelection = sessionStorage.getItem('selectedDropdownValue');
      const savedEntityType = sessionStorage.getItem('selectedEntityType');
      if(savedSelection && savedEntityType){
        if(savedEntityType === 'master'){
          console.log("loaded master :: "+savedSelection)
          this.selectedMasterNode = savedSelection
          this.selectedOption=this.selectedMasterNode;
          sessionStorage.setItem('selectedDropdownValue', this.selectedMasterNode);
          sessionStorage.setItem('selectedEntityType', 'master');
          this.onMasterNodeSelectionChange();
        }else if(savedEntityType === 'worker'){
          console.log("loaded worker :: "+savedSelection)
          this.selectedWorkerNode = savedSelection
          this.selectedOption=this.selectedWorkerNode;
          sessionStorage.setItem('selectedDropdownValue', this.selectedWorkerNode);
          sessionStorage.setItem('selectedEntityType', 'worker');
          this.onWorkerNodeSelectionChange();
        }else{
          console.log("loaded pod :: "+savedSelection)
          this.selectedPod = savedSelection
          this.selectedOption=this.selectedPod;
          sessionStorage.setItem('selectedDropdownValue', this.selectedPod);
          sessionStorage.setItem('selectedEntityType', 'pod');
          this.onPodSelectionChange();
        }
      }else{
        this.selectedMasterNode = this.masterNodes[0].metadata.name;
        this.selectedOption=this.selectedMasterNode;
        sessionStorage.setItem('selectedDropdownValue', this.selectedMasterNode);
        sessionStorage.setItem('selectedEntityType', 'master');
        this.onMasterNodeSelectionChange();
      }
      this.updateWorkerNodeCount(this.workerNodes.length);
      this.updatePodCount(this.pods.length);
      //console.log("from default func");
      this.updateLoadingState();
    }
  }

  private updateWorkerNodeCount(count:number){
    if('split' in this.config.data[0][0] ){
      const screenDetail = this.config.data[0][0] as screendetails;
      if(screenDetail && 'inputs' in screenDetail.data[1][1]){
        const workerNodeInputs = screenDetail.data[1][1].inputs as numericalmetricinput[];
        workerNodeInputs[0].metricvalue = count
      }
    }
  }

  private updatePodCount(count:number){
    if('split' in this.config.data[0][0] ){
      const screenDetail = this.config.data[0][0] as screendetails;
      if(screenDetail && 'inputs' in screenDetail.data[1][2]){
        const podInputs = screenDetail.data[1][2].inputs as numericalmetricinput[];
        podInputs[0].metricvalue = count
      }
    }
  }

  private getClusterDetails() {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.kubernetesService.getNodes().subscribe({
      next: (nodes:NodeListResponse) => {
        console.log(nodes);
        this.masterNodes = nodes.items.filter(node => 'node-role.kubernetes.io/master' in node.metadata.labels);
        this.workerNodes = nodes.items.filter(node => !('node-role.kubernetes.io/master' in node.metadata.labels));
        this.selectedMasterNode='';
        this.selectedWorkerNode='';
        this.selectedPod='';
        const savedSelection = sessionStorage.getItem('selectedDropdownValue');
        const savedEntityType = sessionStorage.getItem('selectedEntityType');
        if(savedSelection && savedEntityType){
          if(savedEntityType === 'master'){
            this.selectedMasterNode = savedSelection
            this.selectedOption=this.selectedMasterNode;
            sessionStorage.setItem('selectedDropdownValue', this.selectedMasterNode);
            sessionStorage.setItem('selectedEntityType', 'master');
            this.onMasterNodeSelectionChange();
          }else if(savedEntityType === 'worker'){
            this.selectedWorkerNode = savedSelection
            this.selectedOption=this.selectedWorkerNode;
            sessionStorage.setItem('selectedDropdownValue', this.selectedWorkerNode);
            sessionStorage.setItem('selectedEntityType', 'worker');
            this.onWorkerNodeSelectionChange();
          }else{
            this.selectedPod = savedSelection
            this.selectedOption=this.selectedPod;
            sessionStorage.setItem('selectedDropdownValue', this.selectedPod);
            sessionStorage.setItem('selectedEntityType', 'pod');
            this.onPodSelectionChange();
          }
        }else{
          this.selectedMasterNode = this.masterNodes[0].metadata.name;
          this.selectedOption=this.selectedMasterNode;
          sessionStorage.setItem('selectedDropdownValue', this.selectedMasterNode);
          sessionStorage.setItem('selectedEntityType', 'master');
          this.onMasterNodeSelectionChange();
        }
        this.updateWorkerNodeCount(this.workerNodes.length);
        this.updatePodCount(this.pods.length);
        //console.log("from default func");
        this.updateLoadingState();
      },
      error: (error) => {
        this.handleFetchError(error);
        this.loadDefaultData();
      }
    });

    this.kubernetesService.getPods().subscribe({
      next: (response: PodListResponse) => {
        this.pods = response.items;
        this.updatePodCount(this.pods.length);
        this.updateLoadingState();
      },
      error: (error) => {
        this.handleFetchError(error);
        this.loadDefaultData();
      }
    });
  }
}
