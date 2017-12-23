import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from "app/team/team.component";
import { HomeComponent } from "app/home/home.component";
import { ReportComponent } from "app/report/report.component";
import { ProtocolComponent } from "app/protocol/protocol.component";
import { OncallScheduleComponent } from "app/oncall-schedule/oncall-schedule.component";



const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
      path : 'team-member',
      component: TeamComponent
    },
      {
      path : 'home',
      component: HomeComponent
    },
     {
      path : 'report',
      component: ReportComponent
    },
    {
      path: 'protocol',
      component: ProtocolComponent
    },
    {
      path: 'Oncall-shedule',
      component: OncallScheduleComponent
    },
    {
      path: 'member',  
      loadChildren: './member/member.module#MemberModule'
  },
  
//   { path: '**', component: HomeComponent } 
];

@NgModule({
    imports:[ RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule { }
