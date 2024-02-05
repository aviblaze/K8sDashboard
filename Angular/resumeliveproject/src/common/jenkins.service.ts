import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JenkinsBuildStatusResponse } from '../Interfaces/apiresponse';
import { Observable, throwError, interval } from 'rxjs';
import { switchMap, takeWhile, catchError, filter,map } from 'rxjs/operators';
import { JenkinsStageDetails } from '../Interfaces/apiresponse';
import { JenkinsJobData } from '../Interfaces/apiresponse';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class JenkinsService {

  // private baseUrl = 'http://your-jenkins-url.com'; // Replace with your Jenkins base URL
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private flaskBaseUrl = environment.falskbaseUrl; // Replace with your Flask app's URL

  constructor(private http: HttpClient) { }

  getBuildStatus(jobName: string, buildNumber: number): Observable<JenkinsBuildStatusResponse> {
    const url = `${this.flaskBaseUrl}/jenkins/build-status?baseUrl=${environment.jenkinsUrl}&jobName=${jobName}&buildNumber=${buildNumber}`;
    return this.http.get<JenkinsBuildStatusResponse>(url);
  }

  getConsoleOutput(jobName: string, buildNumber: number): Observable<string> {
    const url = `${this.flaskBaseUrl}/jenkins/console-output?baseUrl=${environment.jenkinsUrl}&jobName=${jobName}&buildNumber=${buildNumber}`;
    return this.http.get(url, { responseType: 'text' });
  }

  triggerJobWithParameters(jobName: string, parameters?: any): Observable<any> {
    const url = `${this.flaskBaseUrl}/jenkins/trigger-job?baseUrl=${environment.jenkinsUrl}&jobName=${jobName}`;
    return this.http.post(url, parameters || {});
  }

  getBuildNumberFromQueueItem(jobName: string, queueId: string): Observable<number> {
    const flaskEndpoint = `${this.flaskBaseUrl}/jenkins/queue-item-status`;
    return interval(2000) // Poll every 2 seconds; adjust as needed
      .pipe(
        switchMap(() => this.http.get<any>(`${flaskEndpoint}?baseUrl=${encodeURIComponent(environment.jenkinsUrl)}&jobName=${encodeURIComponent(jobName)}&queueId=${queueId}`)),
        switchMap((response) => {
          if (response.number) {
            return [response.number]; // Return as an array to match the Observable<number> type
          }
          // Use throwError to return an observable that emits an error if the build number is not available
          return throwError(() => new Error('Build number not yet available.'));
        }),
        filter((buildNumber): buildNumber is number => buildNumber != null), // Filter out null values
        takeWhile((buildNumber: number) => buildNumber === null, true), // Continue until the build number is not null
        catchError((error: any) => {
          // Return an observable that emits an error for any errors caught during polling
          return throwError(() => new Error(`Error retrieving build number: ${error.message}`));
        })
      );
  }

  getPipelineDetails(jobName: string): Observable<JenkinsStageDetails[]> {
    const url = `${this.flaskBaseUrl}/jenkins/pipeline-details?baseUrl=${environment.jenkinsUrl}&jobName=${jobName}`;
    return this.http.get<JenkinsJobData>(url).pipe(
      map((jobData: JenkinsJobData) => {
        return jobData.stages.map(stage => ({
          id: stage.id,
          name: stage.name,
          execNode: stage.execNode,
          status: stage.status,
          startTimeMillis: stage.startTimeMillis,
          durationMillis: stage.durationMillis,
          pauseDurationMillis: stage.pauseDurationMillis
        }));
      })
    );
  }
  
  getBuildDetails(jobName: string, buildNumber: string): Observable<JenkinsJobData> {
    const url = `${this.flaskBaseUrl}/jenkins/build-details?baseUrl=${environment.jenkinsUrl}&jobName=${jobName}&buildNumber=${buildNumber}`;
    return this.http.get<JenkinsJobData>(url);
  }
  
  
}
