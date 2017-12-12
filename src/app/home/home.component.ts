import {ViewChild, Component,  OnInit} from '@angular/core';

import { HomeService } from './home.service';
import { TicketsModel } from "app/models/home/create-ticket-.model";
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('childModal') public childModal:ModalDirective;
  
  ticketsData: TicketsModel = new TicketsModel();
  UsernameBadge: string;
  // textStatus: string;
  teamSelected : any;
  description : string;

  teamList : any[];
  textStatus: string='Ticket : SOS000000002612<br>Our on-call will contact you shortly';
  
  constructor(
    private _homeService: HomeService
  ) {

  }

  ngOnInit() {

    // $(".sonar-wave").on("webkitAnimationIteration oanimationiteration animationiteration", function(){
    //   $(this).css("background-color", this.colorize());
    // })
  

    this.UsernameBadge = "Krichpas Khumthanom";

    this.teamList = [
      { name: "Choose team" , id: 0},
      { name: "CRUSO" , id: 1},
      { name: "SDT" , id: 2},
      { name: "ACI" , id: 3},
      { name: "ASR/TDO" , id: 4},
      { name: "Allegro" , id: 5},
      { name: "C/S EDI" , id: 6},
      { name: "Advanced Customer Experience" , id: 7},
      { name: "GEMS OTC Invoicing" , id: 8},
      { name: "GEMS OTC Customer Accounting" , id: 9},
      { name: "GEMS OTC Order Entry" , id: 10},
      { name: "GEMS OTC Order Processing" , id: 11},
      { name: "GEMS OTC Order Processing - Plant Logistic" , id: 12},
      { name: "GEMS OTC Pricing" , id: 13},
      { name: "GEMS OTC Sales" , id: 14},
      { name: "STRIPES AP OTC Sales" , id: 15},
      { name: "STRIPES AS OTC Customer Accounting" , id: 16},
      { name: "STRIPES AS OTC Invoicing" , id: 17},
      { name: "STRIPES AS OTC Order Processing" , id: 18},
      { name: "STRIPES AS OTC Pricing" , id: 19},
      { name: "STRIPES AS OTC Sales" , id: 20},
      { name: "STRIPES EU OTC Customer Accounting" , id: 21},
      { name: "STRIPES EU OTC Invoicing" , id: 22},
      { name: "STRIPES EU OTC Order Processing" , id: 23},
      { name: "STRIPES EU OTC Pricing" , id: 24},
      { name: "STRIPES EU OTC Sales" , id: 25},
      { name: "STRIPES NA OTC Customer Accounting" , id: 26},
      { name: "STRIPES NA OTC Invoicing" , id: 27},
      { name: "STRIPES NA OTC Order Processing" , id: 28},
      { name: "STRIPES NA OTC Pricing" , id: 29},
      { name: "STRIPES NA OTC Sales" , id: 30},
      { name: "STRIPES SEA OTC Customer Accounting" , id: 31},
      { name: "STRIPES SEA OTC Invoicing" , id: 32},
      { name: "STRIPES SEA OTC Order Processing" , id: 33},
      { name: "STRIPES SEA OTC Pricing" , id: 34}
    ];

    this.teamSelected = this.teamList[0];

    this.getUsername();
  }

  // colorize() {
  //   var hue = Math.random() * 360;
  //   return "HSL(" + hue + ",100%,50%)";
  // }

  showText() {
    alert("Thank you for completing a ticket");
  }

  getUsername() {
    this._homeService.getUser().subscribe(
      Response => {
        let username = Response;
        this.UsernameBadge = username.replace("\"", "");
        this.UsernameBadge = this.UsernameBadge.replace("\"", "");

        console.log("Get user success!" + this.UsernameBadge)

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
        // console.log("Post Tickets success!" + Response)
        this.showChildModal();

      },
      err => {
        console.log("Can't Post Tickets")
      }
    );
  }

  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }



}
