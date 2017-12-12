import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Http } from "@angular/http";
import { Configuration } from "app/app.constants";
import { Observable } from "rxjs/Observable";
import { ScheduleModel } from 'app/models/oncall-schedule/schedule.model';

@Injectable()
export class OncallScheduleService {
  sub: any;

  constructor(
    private http: Http,
    private Config: Configuration,
  ) { }


  
  //API GET Schedules
  getSchedules( groupId: number,month: number,year: number): Observable<any> {
    const url = this.Config.apiSosUrl + "/api/schedules?groupID=" + groupId + '&month=' + month + '&year='  + year;
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

    //API POST ADD schedule
    addSchedule(dataModel: ScheduleModel): Observable<string> {
      
      const url = this.Config.apiSosUrl + 'api/schedules';
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.sub = this.http.post(url, dataModel, options).map(this.extractStringData);
      return this.sub;
    }

    //API PUT EDIT schedule
    updateSchedule(dataModel: ScheduleModel): Observable<string> {
      const url = this.Config.apiSosUrl + 'api/schedules';
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.sub = this.http.put(url, dataModel, options).map(this.extractStringData);
      return this.sub;
    }
  
    //API Delte schedule
    deleteSchedule(scheduleId : number): Observable<string> {
      const url = this.Config.apiSosUrl + 'api/schedules/' + scheduleId;
      this.sub = this.http.delete(url).map(this.extractStringData);
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
