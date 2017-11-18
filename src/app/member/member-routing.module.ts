import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { MemberComponent } from 'app/member/member.component';
import { MemberCreateComponent } from 'app/member/member-create/member-create.component';
import { MemberEditComponent } from 'app/member/member-edit/member-edit.component';
import { MemberDetailComponent } from 'app/member/member-detail/member-detail.component';
import { MemberIndexComponent } from 'app/member/member-index/member-index.component';
 
const memberRoutes: Routes = [

  {
    path: '',
    component: MemberComponent,
    children: [
      {
        path : 'member/create',
        component: MemberCreateComponent
      },
        {
        path : 'member/edit/:id',
        component: MemberEditComponent
      },
        {
        path : 'member/detail/:id',
        component: MemberDetailComponent
      }
     
    ]
  },
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