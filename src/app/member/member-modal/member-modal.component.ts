import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { OnCallUserModel } from "app/models/member/member.model";
import { MemberService } from "app/member/member.service";
import { Router } from "@angular/router";

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
    private router: Router
  ) {}


  ngOnInit() {
    console.log("modal");
    
  }

  confirm(): void {
  
    let data = new OnCallUserModel();
    data.Domain =   this.Domain;
    data.Username =  this.Username;
    
    console.log("data remove!!");
    console.log(JSON.stringify(data));


    // window.location.href = "/member/detail/" + this.GroupId;
    this._memberService.postRemoveUser(data).subscribe(
      Response => {
        this.textRemoveStatus = Response;
        //alert(this.textRemoveStatus);
        console.log("Remove User Data success! " + Response)

        this.bsModalRef.hide()
        this.router.navigate(['/member/detail/' + this.GroupId]);

      },
      err => {
        console.log("Can't Remove User")
      }
    );
  }

}
