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
  public getComparationApify(body: any) {
    return this.http.post<any>('https://api.apify.com/v2/actor-tasks/cs_qa~cs-crawl-updater-comparison/runs?token=B2m7mnWcGncqCvez5RusNfZAZ', body)
  }
  public getValidationApifyQA(body: any) {
    return this.http.post<any>('https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=B2m7mnWcGncqCvez5RusNfZAZ', body)
  }

}
