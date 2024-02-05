import { Component,OnInit,ChangeDetectorRef} from '@angular/core';
import { screendetails,numericalmetricinput,componentdetails } from '../Interfaces/screensplitter';
import { PipelineComponent } from '../Services/pipeline/pipeline.component';
import { environment } from '../environments/environment';
import { KubernetesService } from '../common/kubernetsapi.service';
import { NumericalmetricComponent } from '../Services/numericalmetric/numericalmetric.component';
import { CommonModule } from '@angular/common';
import { SplitscreenComponent } from '../Services/splitscreencomponent/splitscreen.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionComponent } from '../Services/action/action.component'; 
import {NodeListResponse,PodListResponse} from '../Interfaces/apiresponse';
import { JenkinsService } from '../common/jenkins.service';
import { KubernetesPod,Container } from '../Interfaces/apiresponse';
import { interval, Subscription } from 'rxjs';
import { takeWhile,map } from 'rxjs/operators';
import { stagedetails,ActionStatus } from '../Interfaces/pipeline';
import { jenkinsJobresult,JenkinsJobData } from '../Interfaces/apiresponse';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule,SplitscreenComponent,MatProgressSpinnerModule,ActionComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})

export class PlaygroundComponent implements OnInit{
  config !: screendetails;

  isLoading = true;
  isDefaultDataLoaded=false;
  workerNodeCount: number = 0;
  appPodCount: number = 0;
  private isJobRunning:string = 'false';
  private currentActionName!:string;
  private currentBuildNumber:any;

  constructor(
    private jenkinsService: JenkinsService,
    private kubernetesService: KubernetesService,
    private changeDetectorRef: ChangeDetectorRef,private httpClient: HttpClient) { }

    private jobMappingDetails= environment.jobNameActionMapping;
    private appPodLabelToFilterWith= environment.applicationPodLabel;
    private trafficSimulationStartUrl=environment.trafficSimulationStartUrl;
    private trafficSimulationStopUrl=environment.trafficSimulationStopUrl;
    private trafficSimulationTargetUrl=environment.trafficSimulationTargetUrl;
    private totalMemoryAvailable: number = 0;
    private totalMemoryInUse: number = 0;
    private apiRequestsPerSecond = 0;
    private appUpgradeStageDetails: stagedetails[] = [];
    private disasterRecoveryStageDetails: stagedetails[] = [];
  
  ngOnInit(): void {

    this.loadAutoScalingPipelineStageDetails();
    this.loadAppUpgradePipelineStageDetails();
    this.loadDisasterRecoveryPipelineStageDetails(); 

    this.config = {
      split: 'horizontal',
      splitratio: [30, 70],
      overrideflexdirection:[false,false],
      data: {
        1: [
          {
            split: 'horizontal',
            splitratio: [34, 33,33],
            overrideflexdirection:[false,false,false],
            data: {
              0: [
                {
                  split: 'vertical',
                  splitratio: [10, 90],
                  overrideflexdirection:[false,true],
                  data: {
                    0: [
                      {
                        name: ActionComponent,
                        inputs: [{ title: 'Auto-Scaling',status:'not started',isDisabled:false }]
                      }
                    ],
                    1: []
                  }
                }
              ],
              1: [
                {
                  split: 'vertical',
                  splitratio: [10, 90],
                  overrideflexdirection:[false,true],
                  data: {
                    0: [
                      {
                        name: ActionComponent,
                        inputs: [{title: 'Application Upgrade',status:'not started',isDisabled:false}]
                      }
                    ],
                    1: [
                      {
                        name: PipelineComponent,
                        inputs: []
                      }
                    ]
                  }
                }
              ],
              2: [
                {
                  split: 'vertical',
                  splitratio: [10, 90],
                  overrideflexdirection:[false,true],
                  data: {
                    0: [
                      {
                        name: ActionComponent,
                        inputs: [{ title: 'Disaster Recovery',status:'not started',isDisabled:false }]
                      }
                    ],
                    1: [
                      {
                        name: PipelineComponent,
                        inputs: []
                      }
                    ]
                  }
                }
            ]
            }
          }
        ],
        0: [
          {
            name: NumericalmetricComponent,
            inputs: [{ metricname: 'Worker Nodes', metricvalue: 1 }]
          },
          {
            name: NumericalmetricComponent,
            inputs: [{ metricname: 'Application Pods', metricvalue: 2 }]
          }
        ]
      }
    };

    
    this.isJobRunning = sessionStorage.getItem('isJobRunning') || this.isJobRunning;
    this.currentActionName= sessionStorage.getItem('currentJobName') || '';
    this.currentBuildNumber = sessionStorage.getItem('currentBuildNumber') || -1;
    if(this.isJobRunning === 'true'){
      this.checkJobProgress(this.currentActionName,this.currentBuildNumber);
    }else{
      sessionStorage.setItem('isJobRunning',this.isJobRunning);
      sessionStorage.setItem('currentJobName',this.currentActionName);
      sessionStorage.setItem('currentJobDetails',this.currentBuildNumber);
    }
    this.getClusterDetails();

  }

  private convertStatus(originalStatus: string): 'not started' | 'success' | 'failure' | 'in_progress' {
    switch (originalStatus) {
      case 'SUCCESS':
        return 'success';
      case 'FAILURE':
        return 'failure';
      case 'IN_PROGRESS':
        return 'in_progress';
      default:
        return 'not started';
    }
  }

  private loadAutoScalingPipelineStageDetails() {
    this.getAutoScalingPipelineStageValues().then(componentDetails => {
      const autoScalingSection = this.config.data[1][0];
      if ('data' in autoScalingSection) {
        const autoScalingData = autoScalingSection.data[0][0] as screendetails;
        if ('data' in autoScalingData) {
          autoScalingData.data[1]=componentDetails;
          this.changeDetectorRef.detectChanges();
        }
      }
    }).catch(error => {
      console.error('Error fetching auto-scaling stage details:', error);
    });
  }

  private loadAppUpgradePipelineStageDetails() {
    this.getAppUpgradePipelineStageValues('Application Upgrade').then(componentDetails => {
      this.appUpgradeStageDetails=componentDetails;
      const appUpgradeSection = this.config.data[1][0];
      if ('data' in appUpgradeSection) {
        const appUpgradeData = appUpgradeSection.data[1][0] as screendetails;
        if ('data' in appUpgradeData) {
          const appUpgradeInputs= appUpgradeData.data[1] as componentdetails[];
          appUpgradeInputs[0]={name: PipelineComponent,inputs:componentDetails};
          this.changeDetectorRef.detectChanges();
        }
      }
    }).catch(error => {
      console.error('Error fetching auto-scaling stage details:', error);
    });
  }

  private loadDisasterRecoveryPipelineStageDetails() {
    this.getDisasterRecoveryPipelineStageValues('Disaster Recovery').then(componentDetails => {
      this.disasterRecoveryStageDetails=componentDetails;
      const disasterRecoverySection = this.config.data[1][0];
      if ('data' in disasterRecoverySection) {
        const disasterRecoveryData = disasterRecoverySection.data[2][0] as screendetails;
        if ('data' in disasterRecoveryData) {
          const disasterRecoveryInputs= disasterRecoveryData.data[1] as componentdetails[];
          disasterRecoveryInputs[0]={name: PipelineComponent,inputs:componentDetails};
          this.changeDetectorRef.detectChanges();
        }
      }
    }).catch(error => {
      console.error('Error fetching auto-scaling stage details:', error);
    });
  }

  private getPodMemoryUsage(
    labelFilter: { [key: string]: string },
    callback: (result: { totalMemoryAvailable: number, totalMemoryInUse: number }) => void
  ): void {
    this.kubernetesService.getPods().pipe(
      map(podsData => {
        let totalMemoryAvailable = 0;
        let totalMemoryInUse = 0;
  
        // Filter pods with the specified label and aggregate memory usage
        const filteredPods = podsData.items.filter((pod: KubernetesPod) =>
          Object.entries(labelFilter).every(([key, value]) =>
            pod.metadata.labels && pod.metadata.labels[key] === value
          )
        );
        filteredPods.forEach((pod: KubernetesPod) => {
          const memoryRequests = this.extractMemoryValue(pod, 'requests');
          const memoryLimits = this.extractMemoryValue(pod, 'limits');
  
          totalMemoryAvailable += memoryLimits;
          totalMemoryInUse += memoryRequests;
        });
        return { totalMemoryAvailable, totalMemoryInUse };
      })
    ).subscribe({
      next: result => callback(result),
      error: error => console.error('Error fetching pod memory usage:', error)
    });
  }
  
  private extractMemoryValue(pod: any, type: 'requests' | 'limits'): number {
    let memoryValue = 0;
    pod.spec.containers.forEach((container: Container) => {
      if (container.resources?.[type]?.memory) {
        const memory = container.resources?.[type]?.memory ?? '0';
        memoryValue += this.convertMemoryToBytes(memory);
      }
    });
    return memoryValue;
  }

  private convertMemoryToBytes(memory: string): number {
    const memoryRegex = /^(\d+)([EPTGMK])i?$/;
    const match = memory.match(memoryRegex);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'E': // Exbibyte
          return value * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 / (1024 * 1024 * 1024);
        case 'P': // Pebibyte
          return value * 1024 * 1024 * 1024 * 1024 * 1024 / (1024 * 1024 * 1024);
        case 'T': // Tebibyte
          return value * 1024 * 1024 * 1024 * 1024 / (1024 * 1024 * 1024);
        case 'G': // Gibibyte
          return value;
        case 'M': // Mebibyte
          return value / 1024;
        case 'K': // Kibibyte
          return value / (1024 * 1024);
        default:
          return 0;
      }
    }
  
    return 0; // If the input format doesn't match
  }

  private async getAutoScalingPipelineStageValues(): Promise<componentdetails[]> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.getPodMemoryUsage(this.appPodLabelToFilterWith, (result) => {
          this.totalMemoryAvailable = result.totalMemoryAvailable;
          this.totalMemoryInUse = result.totalMemoryInUse;
          resolve();
          reject();
        });
      });
      
      return [
        {
          name: NumericalmetricComponent,
          inputs: [{ metricname: 'API requests/sec', metricvalue: this.apiRequestsPerSecond }]
        },
        {
          name: NumericalmetricComponent,
          inputs: [{ metricname: 'Memory Usage (GB)', metricvalue: this.totalMemoryInUse }]
        },
        {
          name: NumericalmetricComponent,
          inputs: [{ metricname: 'Total memory available (GB)', metricvalue: this.totalMemoryAvailable }]
        }
      ];
    } catch (error) {
      console.error('Error fetching pod memory usage:', error);
      return []; // or return a default value
    }
  }
  
  private async getAppUpgradePipelineStageValues(jobName: string): Promise<stagedetails[]> {
    return new Promise((resolve, reject) => {
      this.jenkinsService.getPipelineDetails(jobName).subscribe({
        next: (stageDetails) => {
          const convertedStageDetails = stageDetails.map(stage => ({
            name: stage.name,
            status: this.convertStatus(stage.status)
          }));
          resolve(convertedStageDetails);
        },
        error: (error) => reject(error)
      });
    });
  }
  
  private async getDisasterRecoveryPipelineStageValues(jobName: string): Promise<stagedetails[]> {
    return new Promise((resolve, reject) => {
      this.jenkinsService.getPipelineDetails(jobName).subscribe({
        next: (stageDetails) => {
          const convertedStageDetails = stageDetails.map(stage => ({
            name: stage.name,
            status: this.convertStatus(stage.status)
          }));
          resolve(convertedStageDetails);
        },
        error: (error) => reject(error)
      });
    });
  }

  private updateActionComponentStatus(buildStatus: jenkinsJobresult) {
    const pipelineActionComponents = this.config.data[1][0] as screendetails;
    let statusToUpdate:ActionStatus = 'not started';
    switch(buildStatus){
      case 'SUCCESS':{
        statusToUpdate='success';
        break;
      }
      case 'FAILURE':{
        statusToUpdate='failure';
        break;
      }
      case 'UNSTABLE':{
        statusToUpdate='failure';
        break;
      }
      case 'ABORTED':{
        statusToUpdate='failure';
        break;
      }
      case 'BUILDING':{
        statusToUpdate='in_progress';
        break;
      }
      default:{
        statusToUpdate='in_progress';
        break;
      }
    }

    const autoScalingActionPipelineComponent=pipelineActionComponents.data[0][0] as screendetails;
    const appUpgradeActionPipelineComponent=pipelineActionComponents.data[1][0] as screendetails;
    const disasterRecActionPipelineComponent=pipelineActionComponents.data[2][0] as screendetails;
    const isDisabled = this.isJobRunning === 'true';
    if(this.currentActionName === 'Auto-Scaling'){
      console.log("Auto Scaling update")
      autoScalingActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Auto-Scaling',status:statusToUpdate,isDisabled:isDisabled }]}]
      appUpgradeActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Application Upgrade',status:'not started',isDisabled:isDisabled }]}];
      disasterRecActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Disaster Recovery',status:'not started',isDisabled:isDisabled }]}];

    }else if(this.currentActionName === 'Application Upgrade'){
      console.log("Application Upgrade update")
      autoScalingActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Auto-Scaling',status:'not started',isDisabled:isDisabled }]}]
      appUpgradeActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Application Upgrade',status:statusToUpdate,isDisabled:isDisabled }]}];
      disasterRecActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Disaster Recovery',status:'not started',isDisabled:isDisabled }]}];
    }else if(this.currentActionName === 'Disaster Recovery'){
      console.log("Disaster Recovery update")
      autoScalingActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Auto-Scaling',status:'not started',isDisabled:isDisabled }]}]
      appUpgradeActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Application Upgrade',status:'not started',isDisabled:isDisabled }]}];
      disasterRecActionPipelineComponent.data[0] = [{ name: ActionComponent,inputs: [{ title: 'Disaster Recovery',status:statusToUpdate,isDisabled:isDisabled }]}];
    }

    this.changeDetectorRef.detectChanges();
  }

  private updatePipelineStatus(jobName: string, jobStatus: JenkinsJobData) {
    console.log(jobStatus)
    let currentStageDetails:stagedetails[] = [];
    if(jobName === 'Application Upgrade'){
      currentStageDetails = this.appUpgradeStageDetails;
    }else if(jobName === 'Disaster Recovery'){
      currentStageDetails = this.disasterRecoveryStageDetails;
    }


    jobStatus.stages.forEach(stage => {
      const stageDetail: stagedetails = {
        name: stage.name,
        status: stage.status.toLocaleLowerCase() as "not started" | "success" | "failure" | "in_progress"
      };
      currentStageDetails.forEach((currentStageDetail,idx) =>{
        if(currentStageDetail.name === stageDetail.name){
          currentStageDetails[idx].status = stageDetail.status;
        }
      });
    });

    console.log("Updating pipeline status for "+jobName);
    console.log(currentStageDetails);
    const pipelineActionComponents = this.config.data[1][0] as screendetails;

    const appUpgradeActionPipelineComponent=pipelineActionComponents.data[1][0] as screendetails;
    const appUpgradePipelineComponent=appUpgradeActionPipelineComponent.data[1] as componentdetails[];

    const disasterRecActionPipelineComponent=pipelineActionComponents.data[2][0] as screendetails;
    const disasterRecPipelineComponent=disasterRecActionPipelineComponent.data[1] as componentdetails[];
    if(jobName === 'Auto-Scaling'){
      this.loadAutoScalingPipelineStageDetails();
    }else if(jobName === 'Application Upgrade'){
      console.log("Application Upgrade update")
      appUpgradePipelineComponent[0] = {name: PipelineComponent,inputs:currentStageDetails};
    }else if(jobName === 'Disaster Recovery'){  
      disasterRecPipelineComponent[0] = {name: PipelineComponent,inputs:currentStageDetails};
    }
    this.changeDetectorRef.detectChanges();
  }

  private checkJobProgress(jobName: string, buildNumber: number) {
    const polling: Subscription = interval(3000) // Change to 3000 for 3 seconds
      .pipe(
        takeWhile(() => (this.isJobRunning === 'true')) // Assuming isJobRunning is a condition to stop polling
      )
      .subscribe({
        next: () => {
          this.jenkinsService.getBuildStatus(jobName, buildNumber).subscribe({
            next: (response) => {
              this.jenkinsService.getBuildDetails(jobName, response.id).subscribe({
                next: (detailedResponse:JenkinsJobData) => {
                  this.updatePipelineStatus(jobName, detailedResponse); // Updated to use detailedResponse
                },
                error: (error) => console.error('Error fetching build details:', error)
              });
              let buildResult = response.inProgress ? 'BUILDING': response.result as jenkinsJobresult;
              if (!response.building) {
                this.isJobRunning = 'false';
                sessionStorage.setItem('isJobRunning', this.isJobRunning);
                polling.unsubscribe();
              }
              this.updateActionComponentStatus(buildResult);
            },
            error: (error) => {
              console.error(error);
              polling.unsubscribe(); // Stop polling on error
            }
          });
        },
        error: (error) => console.error('Polling error:', error)
      });
  }

  private triggerAndFollowJob(jobName: string,parameters?: any) {
    this.currentActionName=jobName;
    this.updateActionComponentStatus("BUILDING");
    this.jenkinsService.triggerJobWithParameters(jobName, parameters)
      .subscribe({
        next: (response) => {
          const queueLocation = response.headers['Location'];
          const queueId = queueLocation?.split('queue/item/')[1].replace('/', '');
          this.isJobRunning = 'true';
          sessionStorage.setItem('isJobRunning', this.isJobRunning);
          sessionStorage.setItem('currentJobName', jobName);
          if (queueLocation && queueId) {
            this.jenkinsService.getBuildNumberFromQueueItem( jobName, queueId)
              .subscribe({
                next: (buildNumber) => {
                  sessionStorage.setItem('buildNumber', buildNumber.toString());
                  this.checkJobProgress(jobName, buildNumber);
                  // Now you can use the build number to query for job status, etc.
                },
                error: (err) => console.error('Error retrieving build number:', err)
              });
          }
        },
        error: (err) => console.error('Error triggering job:', err)
      });
  }

  // Method to start traffic generation
  private triggerTrafficFlow() {
    const checkInterval = 60000; // Interval to check pod count (60000ms = 1 minute)
    const initialPodCount = this.appPodCount;

    // Call Flask endpoint to start traffic generation
    const startTrafficEndpoint = this.trafficSimulationStartUrl;
    this.httpClient.post(startTrafficEndpoint, { targetUrl: this.trafficSimulationTargetUrl}).subscribe({
      next: (response) => {
        console.log('Traffic generation started', response);
      },
      error: (error) => {
        console.error('Error starting traffic generation:', error);
      }
    });

    // Check pod count every minute
    const checkPodCountInterval = setInterval(() => {
      this.getClusterDetails();
      if (this.appPodCount > initialPodCount) {
        // Stop the traffic flow if pod count has increased
        this.stopTrafficFlow();
        clearInterval(checkPodCountInterval);
      }
    }, checkInterval);
  }

  // Method to stop traffic generation
  private stopTrafficFlow() {
    // Call Flask endpoint to stop traffic generation
    const stopTrafficEndpoint = this.trafficSimulationStopUrl;
    this.httpClient.post(stopTrafficEndpoint, {}).subscribe({
      next: (response) => {
        console.log('Traffic generation stopped', response);
      },
      error: (error) => {
        console.error('Error stopping traffic generation:', error);
      }
    });
  }


  handleSplitscreenEvent(receivedData: { title: any, componentName: any }) {

    if(this.isJobRunning !== 'true'){
      if(receivedData.componentName === 'ActionComponent'){
          let parameters={};
          if(receivedData.title === 'Auto-Scaling'){
            this.triggerTrafficFlow();
            this.currentActionName='Auto-Scaling';
          }else if(receivedData.title === 'Application Upgrade'){
              console.log("Sending Application Upgrade")
              parameters={'Username':'Avinash'}
              this.triggerAndFollowJob(this.jobMappingDetails.appupgradeJobName,parameters);
              this.currentActionName='Application Upgrade';
          }else if(receivedData.title === 'Disaster Recovery'){
              this.triggerAndFollowJob(this.jobMappingDetails.disasterRecoveryJobName,parameters);
              this.currentActionName='Disaster Recovery';
          }
        }
    }else{
      alert("A Job for "+ sessionStorage.getItem("currentJobName") +" is in progress. Please wait until the current job is completed.");
    }
  }

  private updateLoadingState() {
 
    if (this.workerNodeCount && this.appPodCount) {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private loadDefaultData() {
    if(! this.isDefaultDataLoaded){
      this.workerNodeCount=2;
      this.appPodCount=4;
      this.isDefaultDataLoaded=true;
      this.updateWorkerNodeCount(this.workerNodeCount);
      this.updatePodCount(this.appPodCount);
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

  private handleFetchError(error: any) {
    console.error('error while fetching data', error);
    this.loadDefaultData();
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  private getClusterDetails() {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.kubernetesService.getNodes().subscribe({
      next: (nodes:NodeListResponse) => {
        this.workerNodeCount = nodes.items.filter(node => !('node-role.kubernetes.io/master' in node.metadata.labels)).length;
        this.updateWorkerNodeCount(this.workerNodeCount);
        this.updateLoadingState();
      },
      error: (error) => {
        this.handleFetchError(error);
        this.loadDefaultData();
      }
    });

    this.kubernetesService.getPods().subscribe({
      next: (response: PodListResponse) => {
        this.appPodCount = response.items.length;
        this.updatePodCount(this.appPodCount);
        this.updateLoadingState();
      },
      error: (error) => {
        this.handleFetchError(error);
        this.loadDefaultData();
      }
    });
  }

}
