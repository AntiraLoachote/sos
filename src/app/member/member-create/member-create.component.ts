import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OnCallUserModel } from "app/models/member/member.model";
import { MemberService } from "app/member/member.service";

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberCreateComponent implements OnInit {
  textStatus: string;
  IsAcknowledgeResultReceiver: boolean;
  IsEscalationReceiver: boolean;
  IsWorkHourReceiver: boolean;
  IsGroupAdministrator: boolean;
  userAlternativeMail: string;
  userSharedMail: string;
  userLanId: string;
  userDomain: string;

  groupId: any;

  constructor(
    private _memberService: MemberService,
  ) { }

  ngOnInit() {
    this.groupId = this._memberService.GroupId;
    this.clearData();
  }
  clearData(){
    this.userDomain = "";
    this.userLanId = "";
    this.userAlternativeMail = "";
    this.userSharedMail = "";
    this.IsGroupAdministrator = false;
    this.IsWorkHourReceiver  = false;
    this.IsEscalationReceiver  = false;
    this.IsAcknowledgeResultReceiver  = false;
  }

  addUserOnGroup(){
    
    let data = new OnCallUserModel();
    data.Domain =     this.userDomain;
    data.Username =   this.userLanId;
    data.PersonalEmail = this.userAlternativeMail;
    data.SharedEmail =     this.userSharedMail;
    data.IsGroupAdministrator = this.IsGroupAdministrator;
    data.IsWorkHourReceiver = this.IsWorkHourReceiver;
    data.IsEscalationReceiver = this.IsEscalationReceiver;
    data.IsAcknowledgeResultReceiver = this.IsAcknowledgeResultReceiver;
    
    console.log("Create User!!");
    console.log(JSON.stringify(data));

    this._memberService.postAddUser(data).subscribe(
      Response => {
        this.textStatus = Response;
        alert(this.textStatus);
        console.log("Add User success!" + Response)

      },
      err => {
        console.log("Can't Add User" + err)
      }
    );

  }

  back(){
    this._memberService.SelectedIndexMember = 0;
  }
}
