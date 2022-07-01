import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApifyAllService {

  constructor(private http: HttpClient) { }

  public getJson(id: string): Observable<any> {
    return this.http.get<any>('https://api.apify.com/v2/datasets/' + id + '/items');
  }
  public getComparationApify(token: string, body: any) {
    return this.http.post<any>('https://api.apify.com/v2/actor-tasks/cs_qa~cs-crawl-updater-comparison/runs?token='+token, body)
  }
  public getValidationApifyQA(token: string, body: any) {
    return this.http.post<any>('https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token='+token, body)
  }

}
