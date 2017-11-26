import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MemberService } from "app/member/member.service";
import { OnCallUserModel } from "app/models/member/member.model";


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
      this.groupId = params['groupId'];
      this.userId = params['userId'];
      this.prepareData();
    });
  }

  prepareData() {
    this.memberData = this._memberService.MemberList[0];
    if (this.userId != undefined && this.userId != 0) {
      //select data 
      this._memberService.MemberList.forEach(i => {

        if (i.UserID == this.userId) {
          this.memberData = i;
          return;
        }

      });
    }

    // console.log('Select member!!')
    // console.log(JSON.stringify(this.memberData));
    this.profilePicture = this.getUserPic(this.memberData.User.LanID);

    //reset value
    this.companyMail = "";
    this.alternativeMail = "";
    this.sharedMail = "";

    this.memberData.Emails.forEach(email => {

      switch (email.EmailTypeID) {
        case this.EmailTypeID.Company: {
          console.log("Company");
          if (this.companyMail == "")
            this.companyMail = email.Address;
          break;
        }

        case this.EmailTypeID.Personal: {
          console.log("Personal");
          if (this.alternativeMail == "")
            this.alternativeMail = email.Address;
          break;
        }

        case this.EmailTypeID.Shared: {
          console.log("Shared");
          if (this.sharedMail == "")
            this.sharedMail = email.Address;
          break;
        }

        default: {
          console.log("default");
          break;
        }
      }

    });
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
    // //{"Domain":"ap","Username":"tpatana",
    // "PersonalEmail":"wetstocksystem@gmail.com",
    // "SharedEmail":"KRICHPAS@GMAIL.COM",
    // "IsGroupAdministrator":true,"IsEscalationReceiver":true,
    // "IsWorkHourReceiver":true,"IsAcknowledgeResultReceiver":true}: 
    
    let data = new OnCallUserModel();
    data.Domain =    this.getDomain();
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
        alert(this.textStatus);
        console.log("Post Update User Data success!" + Response)

      },
      err => {
        console.log("Can't Post Update User")
      }
    );

    //  alert("User ap\\tpatana information has been updated.");
    // this.router.navigate['/member/detail/' + this.memberData.GroupID + '/' + 
    // this.memberData.UserID];
    
  }

}
