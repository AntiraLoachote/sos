import { Component, OnInit } from '@angular/core';
import { TeamService } from "app/team/team.service";
import { TeamsModel } from "app/models/team/team-list.model";
import { Router } from "@angular/router";
import { MemberService } from "app/member/member.service";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teamList: TeamsModel[] = [];
  teamSelected : any;

  constructor(
    private _teamService: TeamService,
    private router: Router,
    private _memberService : MemberService
  ) { }

  ngOnInit() {

    let fristData = new TeamsModel();
    fristData.groupID = 0;
    fristData.name = "Choose team";

    this.teamList = [fristData];
    this.teamSelected = this.teamList[0];

    // //mock test
    // let result = [{ "GroupID": 1, "Name": "Retail", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 2, "Name": "OTC", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 3, "Name": "Siebel Technical Services", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 5, "Name": "GPM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 6, "Name": "EDI CS and XCOM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 7, "Name": "S.W.I.F.T. - Society for Worldwide Interbank Financial Telecommunication", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 8, "Name": "M&S Secondary Distribution", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 9, "Name": "Basis Output and Archiving", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }];

    // //prepare data select
    // result.forEach(i => {

    //   let data = new TeamsModel();
    //   data.groupID = i.GroupID;
    //   data.name = i.Name;

    //   this.teamList.push(data);

    // });

    // this._memberService.TeamDataList = this.teamList.slice(1);
    // console.log("Teams = " + JSON.stringify(this.teamList));

    //GET Team List
    this.getTeams();
  }

  getTeams() {
    this._teamService.getTeams().subscribe(
      Response => {
        console.log("Get Teams success!" + JSON.stringify(Response));

        let result = Response;

        //mock test
        // result = [{ "GroupID": 1, "Name": "Retail", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 2, "Name": "OTC", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 3, "Name": "Siebel Technical Services", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 5, "Name": "GPM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 6, "Name": "EDI CS and XCOM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 7, "Name": "S.W.I.F.T. - Society for Worldwide Interbank Financial Telecommunication", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 8, "Name": "M&S Secondary Distribution", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 9, "Name": "Basis Output and Archiving", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }];
        //end mock 

        //prepare data select
        result.forEach(i => {

          let data = new TeamsModel();
          data.groupID = i.GroupID;
          data.name = i.Name;

          this.teamList.push(data);

        });

        console.log("Teams = " + JSON.stringify(this.teamList));

        this._memberService.TeamDataList = this.teamList.slice(1);

      },
      err => {
        console.log("Can't get Teams")
      }
    );
  }

  submitTeam(){

    if(this.teamSelected.groupID != 0){
      //go next page
      this.router.navigate(['/member/detail/' + this.teamSelected.groupID]);
      
    }

  }

}
