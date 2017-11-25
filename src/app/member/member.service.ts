import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Http } from "@angular/http";
import { Configuration } from "app/app.constants";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MemberService {
  sub: any;

  public GroupId: number;
  public MemberList : any;

  constructor(
    private http: Http,
    private Config: Configuration,
  ) { }


  //API GET
  getMembers(groupId: number): Observable<any> {
    const url = this.Config.apiSosUrl + "/api/groups/" + groupId;
    this.sub = this.http.get(url).map(this.extractData);
    return this.sub;
  }

  private extractData(response: Response) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Bad response status: ' + response.status);
    }
    let body = response.json();
    return body || {};
  }


}
