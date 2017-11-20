import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { CalendarComponent } from 'angular2-fullcalendar/src/calendar/calendar';

@Component({
  selector: 'app-oncall-schedule',
  templateUrl: './oncall-schedule.component.html',
  styleUrls: ['./oncall-schedule.component.css']
})
export class OncallScheduleComponent implements OnInit {
  username :string
  constructor() { }

 @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
 

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

  calendarOptions:Object = {
    height: 'parent',
    fixedWeekCount : false,
    defaultDate: '2017-09-12',
    editable: false,
    eventLimit: true, // allow "more" link when too many events
    eventColor: '#2EC7C1',
    eventTextColor : 'white',
    events: [
      {
        title: 'All Day Event',
        start: '2017-09-01',
        color  : '#2EC7C1'
     
      },
      {
        title: 'Long Event',
        start: '2017-09-07',
        end: '2017-09-10',
        color  : '#F8F138'

      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2017-09-09T16:00:00',
        color  : '#49CC75'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2017-09-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2017-09-11',
        end: '2017-09-13'
      },
      {
        title: 'Meeting',
        start: '2017-09-12T10:30:00',
        end: '2017-09-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2017-09-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2017-09-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2017-09-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2017-09-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2017-09-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2017-09-28'
      }
    ]
  };

  changeCalendarView(view) {
    this.myCalendar.fullCalendar('changeView', view);
  }

}
