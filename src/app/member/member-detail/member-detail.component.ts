import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { MemberService } from './../member.service'
import { OnCallUserModel } from "app/models/member/member.model";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { MemberModalComponent } from "app/member/member-modal/member-modal.component";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberDetailComponent implements OnInit {
  isLoadPic: boolean = false;
  textRemoveStatus: string;
  profilePicture: string = "";
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

  bsModalRef: BsModalRef;
  public configModal = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: "del-dialog modal-md mt-5"
  };


  constructor(
    public activatedRoute: ActivatedRoute,
    private _memberService: MemberService,
    private modalService: BsModalService
  ) { }


  ngOnInit() {
    // console.log("22222222222");
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      // console.log(this.userId);
      this.profilePicture = './../assets/img/user1.png';

      this.prepareData();

    });
  }


  prepareData() {

    this.memberData = this._memberService.MemberList[0];
    if (this.userId != undefined && this.userId != 0) {
      //select data 
      for (var i = 0; i < this._memberService.MemberList.length - 1; ++i) {
        if (this._memberService.MemberList[i].UserID == this.userId) {
          this.memberData = this._memberService.MemberList[i];
          this._memberService.SelectedIndexMember = i;
          break;
        }
      }

    } else if (this.userId == 0 || this.userId == '0') {
      //after create user success
      this.memberData = this._memberService.MemberList[this._memberService.MemberList.length - 1];
      this._memberService.SelectedIndexMember = this._memberService.MemberList.length - 1;
    } else {
      this.memberData = this._memberService.MemberList[0];
      this._memberService.SelectedIndexMember = 0;
    }

    // console.log('Select member!!')
    // console.log(JSON.stringify(this.memberData));

    this.profilePicture = this.getUserPic(this.memberData.User.LanID);

    //reset value
    this.companyMail = "";
    this.alternativeMail = "";
    this.sharedMail = "";

    this.memberData.Emails.forEach(email => {

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
  }


  getUserPic(lanId: string) {
    this.isLoadPic = true;
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

  removeUser() {
    //show modal component
    this.bsModalRef = this.modalService.show(MemberModalComponent , this.configModal);
    this.bsModalRef.content.Domain = this.getDomain();
    this.bsModalRef.content.Username = this.getLanId();
    this.bsModalRef.content.GroupId = this._memberService.GroupId || 1;
  }


}
