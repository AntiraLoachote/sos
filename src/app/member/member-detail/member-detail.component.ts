import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MemberService } from './../member.service'
import { OnCallUserModel } from "app/models/member/member.model";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { MemberModalComponent } from "app/member/member-modal/member-modal.component";
import { UserModel } from "app/models/team/team-list.model";

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
  memberData: any = null;
  sharedMail: string = "";
  alternativeMail: string = "";
  companyMail: string = "";

  userList: any[] = [];
  haveMemberData: boolean = false;
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
    private modalService: BsModalService,
    private router: Router
  ) { }


  ngOnInit() {

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.groupId = this._memberService.GroupId;
      this._memberService.GroupId = this.groupId;
      this.userId = params['userId'];
      // //console.log('userId' + this.userId);
      this.profilePicture = './../assets/img/user1.png';
      // //console.log("22222222222");
      this.haveMemberData = false;

      if (this._memberService.MemberList == undefined || this.userId == 0) {
        // //console.log("!!!undefined");
        this.getMemberList(this.groupId);
      } else {
        // //console.log("!! not undefined");
        this.prepareData();

      }
      // //console.log(this.haveMemberData);

    });
  }


  prepareData() {
    //console.log("prepareData");
    //console.log(this._memberService.MemberList);

    if (this._memberService.MemberList == undefined) {
      return;
    }


    // this.memberData = this._memberService.MemberList[0];
    if (this.userId != undefined && this.userId != 0) {
      //select data 

      for (var i = 0; i < this._memberService.MemberList.length; i++) {
        // console.log(this._memberService.MemberList[i].UserID + ' *** ' + this.userId);
        // console.log('!!! $$$' + JSON.stringify(this._memberService.MemberList[i]));

        if (this._memberService.MemberList[i].UserID == this.userId) {
          this.memberData = this._memberService.MemberList[i];
          //console.log(i + " : " + JSON.stringify(this.memberData));
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

    this.haveMemberData = true;

    // //console.log('Select member!!')
    // //console.log(JSON.stringify(this.memberData));

    this.profilePicture = this.getUserPic(this.memberData.User.LanID);

    //reset value
    this.companyMail = "";
    this.alternativeMail = "";
    this.sharedMail = "";

    this.memberData.User.Emails.forEach(email => {

      if (email.Disabled == false || email.Disabled == null) {
        switch (email.EmailTypeID) {
          case this.EmailTypeID.Company: {
            //console.log("Company");
            // if (this.companyMail == "")
            this.companyMail = email.Address;
            break;
          }

          case this.EmailTypeID.Personal: {
            //console.log("Personal");
            // if (this.alternativeMail == "")
            this.alternativeMail = email.Address;
            break;
          }

          case this.EmailTypeID.Shared: {
            //console.log("Shared");
            // if (this.sharedMail == "")
            this.sharedMail = email.Address;
            break;
          }

          default: {
            //console.log("default");
            break;
          }
        }

      }

    });
  }

  getMemberList(GroupId: number) {
    this._memberService.getMembers(GroupId).subscribe(
      Response => {
        //console.log("Get MemberList success 2!" + JSON.stringify(Response));

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
        console.log("add MemberList detail")
        this._memberService.MemberList = result.GroupUsers;

        this.prepareData();

      }
    );

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

    const newLocal: string | Partial<any> = {
      title: "Delete user",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    };

    swal(newLocal).then((willDelete) => {
      if (willDelete) {

        let data = new OnCallUserModel();
        data.Domain = this.getDomain();
        data.Username = this.getLanId();
    
        console.log("data remove!!");
        console.log(JSON.stringify(data));


        this._memberService.postRemoveUser(data).subscribe(
          Response => {
            this.textRemoveStatus = Response;
            //alert(this.textRemoveStatus);
            console.log("Remove User Data success! " + Response)
    
            this.bsModalRef.hide()
            //get member list
            this.getMemberListAgain(this._memberService.GroupId || 1);
    
    
          },
          err => {
            
            console.log("Can't Remove User")
             swal({
              title: "Cannot remove user",
              text: "Please try again!",
              icon: "error",
            });
          }
        );
      } else {

      }
    });

    //show modal component
    // this.bsModalRef = this.modalService.show(MemberModalComponent, this.configModal);
    // this.bsModalRef.content.Domain = this.getDomain();
    // this.bsModalRef.content.Username = this.getLanId();
    // this.bsModalRef.content.GroupId = this._memberService.GroupId || 1;
  }

  getMemberListAgain(GroupId: number) {
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
        console.log('call again')
        this.router.navigateByUrl('/member/detail/' + GroupId);

        // window.location.href = "/member/detail/" + this.GroupId;
      }
    );

  }


}
