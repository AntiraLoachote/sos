import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
UsernameBadge:any;
  constructor() { 
    // this.UsernameBadge = ('http://sos/core/api/itsm/user');
    this.UsernameBadge = "Krichpas Khumthanom";
  }

  ngOnInit() {
  }
  showText(){
    alert("Thank you for completing a ticket");
  }
}
