import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { MemberService } from './../member.service'

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberDetailComponent implements OnInit {
  profilePicture: string;
  userId: any;
  groupId: any;
  memberData: any;
  sharedMail: string = "";
  alternativeMail: string = "";
  companyMail: string = "";

  //ENUMs Global Variables
  EmailTypeID: any = {
    Company: 1,
    Personal: 2, //alternative
    Shared: 3,
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    private _memberService: MemberService
  ) { }


  ngOnInit() {
    // console.log("22222222222");
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      // console.log(this.userId);
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



}
