import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Http } from "@angular/http";
import { Configuration } from "app/app.constants";
import { Observable } from "rxjs/Observable";
import { OnCallUserModel } from "app/models/member/member.model";

@Injectable()
export class MemberService {
  sub: any;

  public GroupId: number;
  public MemberList: any;
  public TeamDataList: any;
  public SelectedIndexMember: number = 0;

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


  //API POST EDIT USER
  postEditUser(dataModel: OnCallUserModel): Observable<string> {
    const url = this.Config.apiSosUrl + 'api/groups/' + this.GroupId + '/users';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.sub = this.http.post(url, dataModel, options).map(this.extractStringData);
    return this.sub;
  }

  private extractStringData(response: Response) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Bad response status: ' + response.status);
    }
    let body = response.text();
    return body || {};
  }

    //API POST ADD USER
    postAddUser(dataModel: OnCallUserModel,groupId : number): Observable<string> {
      const url = this.Config.apiSosUrl + 'api/groups/' + groupId + '/users';
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.sub = this.http.post(url, dataModel, options).map(this.extractStringData);
      return this.sub;
    }

    //API POST RemoveUser
    postRemoveUser(dataModel: OnCallUserModel): Observable<string> {
      const url = this.Config.apiSosUrl + 'api/groups/' + this.GroupId + '/removeuser';
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.sub = this.http.post(url, dataModel, options).map(this.extractStringData);
      return this.sub;
    }

}
