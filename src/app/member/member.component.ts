import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MemberDetailComponent } from "app/member/member-detail/member-detail.component";
import { MemberService } from "app/member/member.service";
import { TeamsModel } from "app/models/team/team-list.model";
import { MemberModalComponent } from "app/member/member-modal/member-modal.component";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberComponent implements OnInit {
  selectedIdx: any = 0;
  groupId: any;
  teamList: TeamsModel[] = [];
  showTeam: string;
  Members: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private _memberService: MemberService,
    private router: Router

  ) { }

  ngOnInit() {

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {

      if (params['groupId'] != undefined) {
        this.groupId = params['groupId'];
        this._memberService.GroupId = this.groupId;
      } else {
        this.groupId = this._memberService.GroupId;
      }

      console.log("Member Com Start!! : groupId " + this.groupId)


      //prepare data select
      this.teamList = [];

      // result.forEach(i => {

      //   let data = new TeamsModel();
      //   data.groupID = i.GroupID;
      //   data.name = i.Name;
      //   this.teamList.push(data);

      // });
      if (this._memberService.TeamDataList != undefined) {
        this.teamList = this._memberService.TeamDataList;
      } else {
        this._memberService.GroupId = 0;
        this.router.navigate(['/team-member']);
      }


      //select data 
      this.teamList.forEach(i => {

        if (i.groupID == this.groupId) {
          this.showTeam = i.name;
          return;
        }

      });

      //GET Members
      this.getMemberList(this.groupId, false);
      // this.mockMemberList(this.groupId, false);


    });
  }

  changeTeam(team: any): void {
    this.showTeam = team.name;
    this.groupId = team.groupID;
    this._memberService.GroupId = this.groupId;
    this._memberService.SelectedIndexMember = 0;
    console.log('GroupId: ', team.groupID);

    this.getMemberList(this.groupId, false);
    // this.mockMemberList(this.groupId, true);

  }

  getMemberList(GroupId: number, isChangeTeam: boolean) {
    this._memberService.getMembers(GroupId).subscribe(
      Response => {
        console.log("Get MemberList success!" + JSON.stringify(Response));

        let result = Response;
        this.Members = result.GroupUsers;
        this._memberService.MemberList = this.Members;

        if (isChangeTeam) {
          this.router.navigate(['/member/detail/' + GroupId]);
        }

      }
    );

  }

  mockMemberList(GroupId: number, isChangeTeam: boolean) {
    //mock Members 
    let mockMember = { "GroupID": 1, "Name": "Retail", "Urgency": "2-High ", "GroupUsers": [{ "GroupUserID": 2, "GroupID": 1, "UserID": 3, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 5, "GroupID": 1, "UserID": 6, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 100, "GroupID": 1, "UserID": 298, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 103, "GroupID": 1, "UserID": 303, "IsGroupAdministrator": false, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 133, "GroupID": 1, "UserID": 1369, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1465, "Address": "brendan.f.cumming@exxonmobil.com", "UserID": 1369, "GroupUserID": 133, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1369, "FirstName": "BRENDAN", "LastName": "CUMMING", "LanID": "na\\bfcummi", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1369, "FirstName": "BRENDAN", "LastName": "CUMMING", "LanID": "na\\bfcummi", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1465, "Address": "brendan.f.cumming@exxonmobil.com", "UserID": 1369, "GroupUserID": 133, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 164, "GroupID": 1, "UserID": 1434, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1554, "Address": "petchada.tangtatswas@exxonmobil.com", "UserID": 1434, "GroupUserID": 164, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1434, "FirstName": "PETCHADA", "LastName": "TANGTATSWAS", "LanID": "ap\\pcd", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1434, "FirstName": "PETCHADA", "LastName": "TANGTATSWAS", "LanID": "ap\\pcd", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1554, "Address": "petchada.tangtatswas@exxonmobil.com", "UserID": 1434, "GroupUserID": 164, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 174, "GroupID": 1, "UserID": 2526, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }], "Products": [], "GroupAliases": [] };
    this.Members = mockMember.GroupUsers;
    this._memberService.MemberList = this.Members;

    if (isChangeTeam) {
      this.router.navigate(['/member/detail/' + GroupId]);
    }
  }


  selectMember(index: any) {
    this.selectedIdx = index;
    this._memberService.SelectedIndexMember = this.selectedIdx;
  }


}

