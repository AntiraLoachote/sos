import { Component, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';
import { OnCallUserModel } from "app/models/member/member.model";
import { MemberService } from "app/member/member.service";
import { Router } from "@angular/router";
import { UserModel } from "app/models/team/team-list.model";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

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

  public modalRef: BsModalRef;

  constructor(
    private _memberService: MemberService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.groupId = this._memberService.GroupId;
    this.clearData();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  clearData() {
    this.userDomain = "";
    this.userLanId = "";
    this.userAlternativeMail = "";
    this.userSharedMail = "";
    this.IsGroupAdministrator = false;
    this.IsWorkHourReceiver = false;
    this.IsEscalationReceiver = false;
    this.IsAcknowledgeResultReceiver = false;
  }

  addUserOnGroup() {

    let data = new OnCallUserModel();
    data.Domain = this.userDomain;
    data.Username = this.userLanId;
    data.PersonalEmail = this.userAlternativeMail;
    data.SharedEmail = this.userSharedMail;
    data.IsGroupAdministrator = this.IsGroupAdministrator;
    data.IsWorkHourReceiver = this.IsWorkHourReceiver;
    data.IsEscalationReceiver = this.IsEscalationReceiver;
    data.IsAcknowledgeResultReceiver = this.IsAcknowledgeResultReceiver;

    if (this.userDomain == '') {
      //  alert("กรุณากรอก Domain");
      return;
    } else if (this.userLanId == '') {
      // alert("กรุณากรอก LanId");
      return;
    }
    console.log("Create User!!");
    console.log(JSON.stringify(data));

    if (this._memberService.GroupId == undefined) {
      alert("กรุณาเลือก Team ก่อน");
    } else {
      let groupId = this._memberService.GroupId;

      this._memberService.postAddUser(data, groupId).subscribe(
        Response => {
          this.textStatus = Response;
          // alert(this.textStatus);
          console.log("Add User success!" + Response)
          //get member list
          this.getMemberList(this.groupId);
        },
        err => {
          // alert("Can't Add User" + err);
          swal({
            title: "Cannot add user",
            text: "Please try again!",
            icon: "error",
          });
        }
      );

    }


  }

  back() {
    this._memberService.SelectedIndexMember = 0;
  }

  getMemberList(GroupId: number) {
    this._memberService.getMembers(GroupId).subscribe(
      Response => {

        let result = Response;

        let userList = [];
        result.GroupUsers.forEach(i => {

          let data = new UserModel();
          data.groupId = i.GroupID;
          data.userId = i.UserID;
          data.name = i.User.FirstName + ' ' + i.User.LastName;

          userList.push(data);

        });

        this._memberService.UserList = userList;
        this._memberService.MemberList = result.GroupUsers;

        this.router.navigate(['/member/detail/' + this.groupId + '/' + '0']);

      }
    );

  }
}
