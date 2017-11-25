import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';
import { TicketsModel } from "app/models/home/create-ticket-.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ticketsData: TicketsModel = new TicketsModel();
  UsernameBadge: string;
  textStatus: string;
  teamSelected : any;
  description : string;

  teamList : any[];
  
  constructor(
    private _homeService: HomeService
  ) {

  }

  ngOnInit() {

    this.UsernameBadge = "Krichpas Khumthanom";

    this.teamList = [
      { name: "Choose team" , id: 0},
      { name: "Retail" , id: 1},
      { name: "OTC" , id: 2},
      { name: "Siebel Technical Service" , id: 3},
      { name: "GPM" , id: 4},
      { name: "EDI CS and XCOM" , id: 5},
      { name: "S.W.I.T.F. - Society for Worldwide Interbank Financial Telecommunication" , id: 6},
      { name: "M&S Secondary Distributions" , id: 7},
      { name: "Basis Output and Archiving" , id: 8},
    ];

    this.teamSelected = this.teamList[0];

    this.getUsername();
  }

  showText() {
    alert("Thank you for completing a ticket");
  }

  getUsername() {
    this._homeService.getUser().subscribe(
      Response => {
        this.UsernameBadge = Response;
        console.log("Get user success!" + Response)

      },
      err => {
        console.log("Can't get user")
      }
    );
  }

  selectTeam(value : any){
    this.ticketsData = new TicketsModel();
    this.ticketsData.optionID = value.id;
  }
  
  postTickets() {

    this.ticketsData.description = this.description;

    this._homeService.postSosTickets(this.ticketsData).subscribe(
      Response => {
        this.textStatus = Response;
        alert(this.textStatus);
        
        console.log("Post Tickets success!" + Response)

      },
      err => {
        console.log("Can't Post Tickets")
      }
    );
  }



}
