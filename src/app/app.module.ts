
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
import { TestComponentComponent } from './test-component/test-component.component';
import { TeamComponent } from './team/team.component';
import { HomeComponent } from './home/home.component';
import { CardComponent } from './card/card.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ReportComponent } from './report/report.component';
import { InfoService} from './card/info.service';
import { ProtocolComponent } from './protocol/protocol.component';
import { OncallScheduleComponent } from './oncall-schedule/oncall-schedule.component';

import { MemberModule } from 'app/member/member.module';
import {CalendarComponent} from 'angular2-fullcalendar/src/calendar/calendar';

import { HomeService } from 'app/home/home.service';

//App Configuration
import { Configuration } from './app.constants';
import { TeamService } from "app/team/team.service";
import { AppRoutingModule } from "app/app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TestComponentComponent,
    TeamComponent,
    HomeComponent,
    CardComponent,
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

    // RouterModule.forRoot([
    //     { path: '', redirectTo: '/home', pathMatch: 'full' },
    //     {
    //       path : 'team-member',
    //       component: TeamComponent
    //     },
    //       {
    //       path : 'card member',
    //       component: CardComponent
    //     },
    //       {
    //       path : 'home',
    //       component: HomeComponent
    //     },
    //      {
    //       path : 'report',
    //       component: ReportComponent
    //     },
    //     {
    //       path: 'protocol',
    //       component: ProtocolComponent
    //     },
    //     {
    //       path: 'Oncall-shedule',
    //       component: OncallScheduleComponent
    //     },
    //     {
    //       path: 'member',  
    //       loadChildren: 'app/member/member.module#MemberModule'
    //   },
      
    //   { path: '**', component: HomeComponent } 
    // ]),
    
  
  ],

  providers: [
      {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
      }, 
      Title, 
      InfoService,
      Configuration,
      HomeService,
      TeamService
    ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
