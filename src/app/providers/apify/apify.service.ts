import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApifyService {
  constructor(private http: HttpClient) {}

  getComparation(): Observable<any>{
      let body = {
        "debugLog": false,
        "Environment": "QASAL",
        "CrawlerId": "H7GVrLwigIYwfidZP",
        "UpdaterId": "df5jEkLeoXE6HmXmv",
        "SkipPrice": false,
        "SkipStock": false
      }
    return this.http.post('https://api.apify.com/v2/actor-tasks/cs_qa~cs-crawl-updater-comparison/runs?token=B2m7mnWcGncqCvez5RusNfZAZ',body);
  }
}