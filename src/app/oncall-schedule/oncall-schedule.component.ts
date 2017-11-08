import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oncall-schedule',
  templateUrl: './oncall-schedule.component.html',
  styleUrls: ['./oncall-schedule.component.css']
})
export class OncallScheduleComponent implements OnInit {
  username :string
  constructor() { }

  ngOnInit() {
    this.username="Krichpas Khumthanom";
  }
    getProfileImageURL(lanId):string{
    lanId = "ap_kkhumth"
    let imageURL = './assets/img/user1.png'
      if (lanId){
        // imageURL = 'https://mysite.na.xom.com/User%20Photos/Profile%20Pictures/ap_kkhumth_LThumb.jpg'
         imageURL =  'https://mysite.na.xom.com/User%20Photos/Profile%20Pictures/' + (lanId.replace('\\', '_')) + '_LThumb.jpg';
      }
      else{
    imageURL = "https://vignette.wikia.nocookie.net/doraemon/images/c/c0/Doraemon_%282002%29.png/revision/latest/scale-to-width-down/350?cb=20170327161129&path-prefix=en"
      }
    return imageURL
  }

}
