import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Http } from "@angular/http";
import { Configuration } from "app/app.constants";
import { Observable } from "rxjs/Observable";

@Injectable()
export class OncallScheduleService {
  sub: any;

  constructor(
    private http: Http,
    private Config: Configuration,
  ) { }


  
  //API GET TICKETS
  // getTicketGroup(dataFrom:string, dataTo:string, groupId: number): Observable<any> {
  //   const url = this.Config.apiSosUrl + "/api/Tickets/?from=" + dataFrom + '&to=' + dataTo + '&groupid='  + groupId;
  //   this.sub = this.http.get(url).map(this.extractData);
  //   return this.sub;
  // }

  // private extractData(response: Response) {
  //   if (response.status < 200 || response.status >= 300) {
  //     throw new Error('Bad response status: ' + response.status);
  //   }
  //   let body = response.json();
  //   return body || {};
  // }


}
