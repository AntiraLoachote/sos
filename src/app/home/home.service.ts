import { Injectable } from '@angular/core';
import { Configuration } from "app/app.constants";
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { TicketsModel } from "app/models/home/create-ticket-.model";
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  sub: any;


  constructor(
    private http: Http,
    private Config: Configuration,
  ) { }


  //API GET
  getUser(): Observable<string> {
    const url = this.Config.apiSosUrl + "api/itsm/user";
    this.sub = this.http.get(url).map(this.extractStringData);
    return this.sub;
  }

  //API POST
  postSosTickets(ticketsData: TicketsModel): Observable<string> {
    const url = this.Config.apiSosUrl + "api/sostickets";
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.sub = this.http.post(url, ticketsData, options).map(this.extractStringData);
    return this.sub;
  }

  private extractStringData(response: Response) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Bad response status: ' + response.status);
    }
    let body = response.text();
    return body || {};
  }


}
