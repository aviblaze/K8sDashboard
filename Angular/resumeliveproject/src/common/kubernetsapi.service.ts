import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class KubernetesService {
  private flaskBaseUrl = environment.falskbaseUrl; // Replace with your Flask app's URL

  constructor(private http: HttpClient) { }

  getNodes(): Observable<any> {
    const url = `${this.flaskBaseUrl}/kubernetes/nodes?kubernetesApiUrl=${environment.kubernetesApiUrl}`;
    return this.http.get(url);
  }

  getPods(): Observable<any> {
    const url = `${this.flaskBaseUrl}/kubernetes/pods?kubernetesApiUrl=${environment.kubernetesApiUrl}`;
    return this.http.get(url);
  }
}
