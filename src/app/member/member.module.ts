import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCreateComponent } from './member-create/member-create.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { MemberRoutingModule } from 'app/member/member-routing.module';
import { FormsModule } from '@angular/forms';
import { MemberIndexComponent } from './member-index/member-index.component';
import { MemberService } from "app/member/member.service";

@NgModule({
  imports: [
    MemberRoutingModule,
    CommonModule,
    FormsModule,
    
  ],
  declarations: [MemberCreateComponent, MemberEditComponent, MemberDetailComponent, MemberComponent, MemberIndexComponent],
  providers: [MemberService]
})
export class MemberModule { }
