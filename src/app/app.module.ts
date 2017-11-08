
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule} from  '@angular/router';
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
    OncallScheduleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
        {
          path : 'team-member',
          component: TeamComponent
        },
          {
          path : 'card member',
          component: CardComponent
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
        }
    ])
  ],
  providers: [Title, InfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
