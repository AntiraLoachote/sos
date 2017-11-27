import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCreateComponent } from './member-create/member-create.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { MemberRoutingModule } from 'app/member/member-routing.module';
import { FormsModule } from '@angular/forms';
import { MemberModalComponent } from './member-modal/member-modal.component';
import { MemberService } from "app/member/member.service";
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    MemberRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
    
  ],
  declarations: [MemberCreateComponent, 
    MemberEditComponent, MemberDetailComponent, 
    MemberComponent, MemberModalComponent
  ],
  providers: [MemberService],
  entryComponents: [MemberModalComponent]
})
export class MemberModule { }
