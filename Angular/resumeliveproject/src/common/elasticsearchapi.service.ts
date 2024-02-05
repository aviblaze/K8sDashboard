import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  constructor(private http: HttpClient) { }

  queryData(elasticsearchApiUrl: string,query: any): Observable<any> {
    return this.http.post(`${elasticsearchApiUrl}/_search`, query);
  }
}
