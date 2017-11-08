import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { InfoService} from '../card/info.service';
import { Infogroup1} from '../card/Infogroup1';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  username :string
      info : Array<Infogroup1>;

  constructor(private infoService : InfoService){

  }

  ngOnInit() {
 //Call API
    this.username = "Krichpas Khumthanom"
    // this.http.get('http://sos/core/api/Groups').subscribe(data => {
    //   console.log(data);
    //   var temp = JSON.parse(data.text());
    //   console.log(temp);
    //   console.log(temp[0].Name);
    //  });
    this.GetInfo();
  
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
  showCard(){
    alert('OK');
  }
  GetInfo(){
    this.infoService.getInfo().subscribe(
      (Infogroup1) => {
        this.info= Infogroup1
        console.log('Infogroup1',Infogroup1)
      }
      );
  }

}
