import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberComponent } from 'app/member/member.component';
import { MemberCreateComponent } from 'app/member/member-create/member-create.component';
import { MemberEditComponent } from 'app/member/member-edit/member-edit.component';
import { MemberDetailComponent } from 'app/member/member-detail/member-detail.component';
import { MemberModalComponent } from 'app/member/member-modal/member-modal.component';

const memberRoutes: Routes = [
  {
    path: '', component: MemberComponent,
    children: [
      {
        path: 'member/create',
        component: MemberCreateComponent
      }
    ]
  },

  {
    path: 'member/detail/:groupId', component: MemberComponent,
    children: [
      {
        path: ':userId',
        component: MemberDetailComponent
      },
      {
        path: '',
        component: MemberDetailComponent
      }
    ]
  },
  {
    path: 'member/edit/:groupId', component: MemberComponent,
    children: [
      {
        path: ':userId',
        component: MemberEditComponent
      }
    ]
  }



];

@NgModule({
  imports: [
    RouterModule.forChild(memberRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MemberRoutingModule { }