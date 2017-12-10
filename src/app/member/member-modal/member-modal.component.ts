import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { OnCallUserModel } from "app/models/member/member.model";
import { MemberService } from "app/member/member.service";
import { Router } from "@angular/router";
import { UserModel } from "app/models/team/team-list.model";


@Component({
  selector: 'modal-delete-user',
  templateUrl: './member-modal.component.html',
  styleUrls: ['./member-modal.component.css']
})
export class MemberModalComponent implements OnInit {
  textRemoveStatus: string;
  public Domain: string;
  public Username: string;
  public GroupId: number;

  constructor(
    public bsModalRef: BsModalRef,
    private _memberService: MemberService,
    private router: Router,
    private ngZone: NgZone
  ) { }


  ngOnInit() {
    console.log("modal");

  }

  confirm(): void {

    let data = new OnCallUserModel();
    data.Domain = this.Domain;
    data.Username = this.Username;

    console.log("data remove!!");
    console.log(JSON.stringify(data));


    // window.location.href = "/member/detail/" + this.GroupId;
    this._memberService.postRemoveUser(data).subscribe(
      Response => {
        this.textRemoveStatus = Response;
        //alert(this.textRemoveStatus);
        console.log("Remove User Data success! " + Response)

        this.bsModalRef.hide()
        //get member list
        this.getMemberList(this.GroupId);


      },
      err => {
        console.log("Can't Remove User")
      }
    );
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
        console.log('call again')
        this.ngZone.run(() => this.router.navigateByUrl('/member/detail/' + this.GroupId));

        // window.location.href = "/member/detail/" + this.GroupId;
      }
    );

  }

}
