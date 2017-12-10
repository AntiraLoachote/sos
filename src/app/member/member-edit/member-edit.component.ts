import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MemberService } from "app/member/member.service";
import { OnCallUserModel } from "app/models/member/member.model";
import { UserModel } from "app/models/team/team-list.model";

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberEditComponent implements OnInit {

  textStatus: string;

  sharedMail: string;
  alternativeMail: string;
  companyMail: string;

  profilePicture: any;
  memberData: any;
  userId: any;
  groupId: any;

  userList: any[] = [];
  haveMemberData: boolean = false;

  //ENUMs Global Variables
  EmailTypeID: any = {
    Company: 1,
    Personal: 2, //alternative
    Shared: 3,
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    private _memberService: MemberService,
    private router: Router
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.groupId = this._memberService.GroupId;
      this.userId = params['userId'];

      this.profilePicture = './../assets/img/user1.png';

      this.haveMemberData = false;

      if (this._memberService.MemberList == undefined) {
        // console.log("!!!undefined");
        this.getMemberList(this.groupId);
      } else {
        // console.log("!! not undefined");
        this.prepareData();

      }

    });
  }

  prepareData() {
    this.memberData = this._memberService.MemberList[0];
    this._memberService.SelectedIndexMember = 0;

    if (this.userId != undefined && this.userId != 0) {
      //select data 
      for (var i = 0; i < this._memberService.MemberList.length; i++) {
        if (this._memberService.MemberList[i].UserID == this.userId) {
          this.memberData = this._memberService.MemberList[i];
          this._memberService.SelectedIndexMember = i;
          break;
        }
      }
    }

    // console.log('Select member!!')
    // console.log(JSON.stringify(this.memberData));
    this.profilePicture = this.getUserPic(this.memberData.User.LanID);

    //reset value
    this.companyMail = "";
    this.alternativeMail = "";
    this.sharedMail = "";

    this.memberData.User.Emails.forEach(email => {

      if (email.Disabled == false) {
        switch (email.EmailTypeID) {
          case this.EmailTypeID.Company: {
            console.log("Company");
            // if (this.companyMail == "")
            this.companyMail = email.Address;
            break;
          }

          case this.EmailTypeID.Personal: {
            console.log("Personal");
            // if (this.alternativeMail == "")
            this.alternativeMail = email.Address;
            break;
          }

          case this.EmailTypeID.Shared: {
            console.log("Shared");
            // if (this.sharedMail == "")
            this.sharedMail = email.Address;
            break;
          }

          default: {
            console.log("default");
            break;
          }
        }

      }

    });

    this.haveMemberData = true;

  }

  getMemberList(GroupId: number) {
    this._memberService.getMembers(GroupId).subscribe(
      Response => {
        console.log("Get MemberList success 3!" + JSON.stringify(Response));

        let result = Response;

        this.userList = [];
        result.GroupUsers.forEach(i => {

          let data = new UserModel();
          data.groupId = i.GroupID;
          data.userId = i.UserID;
          data.name = i.User.FirstName + ' ' + i.User.LastName;

          this.userList.push(data);

        });

        this._memberService.UserList = this.userList;
        this.memberData = result.GroupUsers;
        this._memberService.MemberList = result.GroupUsers;

        this.prepareData();

      }
    );

  }

  getUserPic(lanId: string) {
    return 'https://mysite.na.xom.com/User%20Photos/Profile%20Pictures/'
      + (lanId.replace('\\', '_')) + '_LThumb.jpg';
  }

  updateUrl() {
    this.profilePicture = './../assets/img/user1.png';
  }

  getDomain() {
    return this.memberData.User.LanID.split('\\')[0];
  }

  getLanId() {
    return this.memberData.User.LanID.split('\\')[1];
  }

  //send update
  updateProfile() {

    let data = new OnCallUserModel();
    data.Domain = this.getDomain();
    data.Username = this.getLanId();
    data.PersonalEmail = this.alternativeMail;
    data.SharedEmail = this.sharedMail;
    data.IsGroupAdministrator = this.memberData.IsGroupAdministrator;
    data.IsWorkHourReceiver = this.memberData.IsWorkHourReceiver;
    data.IsEscalationReceiver = this.memberData.IsEscalationReceiver;
    data.IsAcknowledgeResultReceiver = this.memberData.IsAcknowledgeResultReceiver;

    console.log("Value Update!!");
    console.log(JSON.stringify(data));

    this._memberService.postEditUser(data).subscribe(
      Response => {
        this.textStatus = Response;
        console.log("Post Update User Data success!" + Response)
        this.router.navigate(['/member/detail/' + this.groupId + '/' + this.userId]);
      },
      err => {
        alert("Can't Post Update User")
      }
    );


  }

}
