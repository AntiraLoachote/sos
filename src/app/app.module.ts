
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';


import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule} from  '@angular/router';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';


export function highchartsFactory() {
const hc = require('highcharts/highstock');
const dd = require('highcharts/modules/exporting');
dd(hc);
return hc;
}

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TeamComponent } from './team/team.component';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ReportComponent } from './report/report.component';
import { ProtocolComponent } from './protocol/protocol.component';
import { OncallScheduleComponent } from './oncall-schedule/oncall-schedule.component';

import { MemberModule } from 'app/member/member.module';
import {CalendarComponent} from 'angular2-fullcalendar/src/calendar/calendar';

import { HomeService } from 'app/home/home.service';

//App Configuration
import { Configuration } from './app.constants';
import { TeamService } from "app/team/team.service";
import { AppRoutingModule } from "app/app-routing.module";
import { ReportService } from 'app/report/report.service';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { OncallScheduleService } from 'app/oncall-schedule/oncall-schedule.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TeamComponent,
    HomeComponent,
    ContactusComponent,
    ReportComponent,
    ProtocolComponent,
    OncallScheduleComponent,
    CalendarComponent

  ],

  imports: [
    BrowserModule,
    ChartModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MemberModule,
    BsDatepickerModule.forRoot()
  
  ],

  providers: [
      {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
      }, 
      Title, 
      Configuration,
      HomeService,
      TeamService,
      ReportService,
      OncallScheduleService
    ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
