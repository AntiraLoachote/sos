import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { CalendarComponent } from 'angular2-fullcalendar/src/calendar/calendar';
import { TeamService } from 'app/team/team.service';
import { TeamsModel, AnalystModel } from 'app/models/team/team-list.model';
import { MemberService } from 'app/member/member.service';
import { OncallScheduleService } from 'app/oncall-schedule/oncall-schedule.service';
import * as moment from 'moment';

import { FormControl } from '@angular/forms';
import { error } from 'util';


import * as $ from 'jquery';
import { ScheduleModel } from 'app/models/oncall-schedule/schedule.model';
import { ModalDirective } from "ngx-bootstrap";
import { SelectorModel } from 'app/models/oncall-schedule/selector.model';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-oncall-schedule',
  templateUrl: './oncall-schedule.component.html',
  styleUrls: ['./oncall-schedule.component.css']
})
export class OncallScheduleComponent implements OnInit {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('validateModal') public validateModal: ModalDirective;

  groupIDSelected: number = 0;
  scheduleIdSelected: number = 0;
  groupUserIdSelected: number;
  isSeclectedGroup: boolean = false;
  profilePicture: string;
  lanId: string;
  companyEmail: string;
  defaultDate: string;
  Today: string;
  d: Date;
  offset: number;
  analystSelected: any;
  analystList: any[] = [];
  teamList: any[];
  username: string
  teamSelected: any;
  month: number;
  year: number;
  DateFrom: any;
  DateTo: any;
  TimeFrom: any;
  TimeTo: any;
  DataEvent: any = {};
  AddIsSuccess : boolean = false;
  IsHiddenTemp: boolean = false;
  // calendarOptions: any = {};
  calendarOptions: any = {
        height: 'parent',
        fixedWeekCount: false,
        defaultDate: this.defaultDate,
        editable: false,
        eventLimit: false, // allow "more" link when too many events
        eventColor: '#2EC7C1',
        eventTextColor: 'white',
        timeFormat: 'H:mm:ss',
        displayEventEnd: true,
        events: [] ,
        eventClick: function (calEvent, jsEvent, view) {
        //  console.log(calEvent);

        }
  };

  tempCalendarOptions: any = {
        height: 'parent',
        fixedWeekCount: false,
        defaultDate: this.defaultDate,
        editable: false,
        eventLimit: false, // allow "more" link when too many events
        eventColor: '#2EC7C1',
        eventTextColor: 'white',
        timeFormat: 'H:mm:ss',
        displayEventEnd: true,
        events: [] 
  };

  IsAllDay: boolean = true; //false is Recurrence

  isLoadAnalystSelector: boolean = false;
  AnalystSelector: Array<SelectorModel> = [];
  Analyst: any[] = null;

  showTextHeadr: string = 'Oncall Schedule';

  constructor(
    private _teamService: TeamService,
    private _memberService: MemberService,
    private _oncallScheduleService: OncallScheduleService,
    private elementRef: ElementRef,
  

    
  ) { }

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;

  ngOnInit() {

    let fristData = new TeamsModel();
    fristData.groupID = 0;
    fristData.name = "Choose team";

    this.teamList = [fristData];
    this.teamSelected = this.teamList[0];

    this.d= new Date();
    this.month = (this.d.getMonth() + 1);
    this.year = this.d.getFullYear();
    this.offset = this.d.getTimezoneOffset();
    this.Today = moment(new Date()).format("DD/MM/YYYY");

    this.TimeFrom = new Date(this.d.getFullYear(),
    this.d.getMonth(),this.d.getDate(),0,0,0);
    this.TimeTo = new Date(this.d.getFullYear(),
    this.d.getMonth(),this.d.getDate(),0,0,59);

    //GET Team List
    this.getTeams();

    //this.mockTeam();

  }


  mockGetSchedules(groupId: number, month: number, year: number) {
    let data = [{ "ScheduleID": 3682, "GroupUserID": 2, "StartDate": "2017-10-30T00:00:00", "EndDate": "2017-11-04T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-10-30T18:30:01", "EndAt": "2017-11-04T02:00:00", "GroupUser": { "GroupUserID": 2, "GroupID": 1, "UserID": 3, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3743, "GroupUserID": 2, "StartDate": "2017-11-04T00:00:00", "EndDate": "2017-11-06T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-04T02:00:01", "EndAt": "2017-11-06T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3683, "GroupUserID": 163, "StartDate": "2017-11-18T00:00:00", "EndDate": "2017-11-20T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-18T02:00:01", "EndAt": "2017-11-20T02:00:00", "GroupUser": { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3742, "GroupUserID": 163, "StartDate": "2017-11-13T00:00:00", "EndDate": "2017-11-15T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-13T18:30:01", "EndAt": "2017-11-15T02:00:00" }, { "ScheduleID": 3746, "GroupUserID": 163, "StartDate": "2017-11-16T00:00:00", "EndDate": "2017-11-17T00:00:00", "StartTime": "11:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-16T11:00:01", "EndAt": "2017-11-17T02:00:00" }, { "ScheduleID": 3747, "GroupUserID": 163, "StartDate": "2017-11-17T00:00:00", "EndDate": "2017-11-18T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-17T18:30:01", "EndAt": "2017-11-18T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3733, "GroupUserID": 100, "StartDate": "2017-11-06T00:00:00", "EndDate": "2017-11-11T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-06T18:30:01", "EndAt": "2017-11-11T02:00:00", "GroupUser": { "GroupUserID": 100, "GroupID": 1, "UserID": 298, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3734, "GroupUserID": 100, "StartDate": "2017-11-11T00:00:00", "EndDate": "2017-11-13T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-11T02:00:01", "EndAt": "2017-11-13T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3734, "GroupUserID": 100, "StartDate": "2017-11-11T00:00:00", "EndDate": "2017-11-13T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-11T02:00:01", "EndAt": "2017-11-13T02:00:00", "GroupUser": { "GroupUserID": 100, "GroupID": 1, "UserID": 298, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3733, "GroupUserID": 100, "StartDate": "2017-11-06T00:00:00", "EndDate": "2017-11-11T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-06T18:30:01", "EndAt": "2017-11-11T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3742, "GroupUserID": 163, "StartDate": "2017-11-13T00:00:00", "EndDate": "2017-11-15T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-13T18:30:01", "EndAt": "2017-11-15T02:00:00", "GroupUser": { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3683, "GroupUserID": 163, "StartDate": "2017-11-18T00:00:00", "EndDate": "2017-11-20T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-18T02:00:01", "EndAt": "2017-11-20T02:00:00" }, { "ScheduleID": 3746, "GroupUserID": 163, "StartDate": "2017-11-16T00:00:00", "EndDate": "2017-11-17T00:00:00", "StartTime": "11:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-16T11:00:01", "EndAt": "2017-11-17T02:00:00" }, { "ScheduleID": 3747, "GroupUserID": 163, "StartDate": "2017-11-17T00:00:00", "EndDate": "2017-11-18T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-17T18:30:01", "EndAt": "2017-11-18T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3743, "GroupUserID": 2, "StartDate": "2017-11-04T00:00:00", "EndDate": "2017-11-06T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-04T02:00:01", "EndAt": "2017-11-06T02:00:00", "GroupUser": { "GroupUserID": 2, "GroupID": 1, "UserID": 3, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3682, "GroupUserID": 2, "StartDate": "2017-10-30T00:00:00", "EndDate": "2017-11-04T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-10-30T18:30:01", "EndAt": "2017-11-04T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3746, "GroupUserID": 163, "StartDate": "2017-11-16T00:00:00", "EndDate": "2017-11-17T00:00:00", "StartTime": "11:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-16T11:00:01", "EndAt": "2017-11-17T02:00:00", "GroupUser": { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3683, "GroupUserID": 163, "StartDate": "2017-11-18T00:00:00", "EndDate": "2017-11-20T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-18T02:00:01", "EndAt": "2017-11-20T02:00:00" }, { "ScheduleID": 3742, "GroupUserID": 163, "StartDate": "2017-11-13T00:00:00", "EndDate": "2017-11-15T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-13T18:30:01", "EndAt": "2017-11-15T02:00:00" }, { "ScheduleID": 3747, "GroupUserID": 163, "StartDate": "2017-11-17T00:00:00", "EndDate": "2017-11-18T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-17T18:30:01", "EndAt": "2017-11-18T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3747, "GroupUserID": 163, "StartDate": "2017-11-17T00:00:00", "EndDate": "2017-11-18T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-17T18:30:01", "EndAt": "2017-11-18T02:00:00", "GroupUser": { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [{ "ScheduleID": 3683, "GroupUserID": 163, "StartDate": "2017-11-18T00:00:00", "EndDate": "2017-11-20T00:00:00", "StartTime": "02:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-18T02:00:01", "EndAt": "2017-11-20T02:00:00" }, { "ScheduleID": 3742, "GroupUserID": 163, "StartDate": "2017-11-13T00:00:00", "EndDate": "2017-11-15T00:00:00", "StartTime": "18:30:01", "EndTime": "02:00:00", "StartAt": "2017-11-13T18:30:01", "EndAt": "2017-11-15T02:00:00" }, { "ScheduleID": 3746, "GroupUserID": 163, "StartDate": "2017-11-16T00:00:00", "EndDate": "2017-11-17T00:00:00", "StartTime": "11:00:01", "EndTime": "02:00:00", "StartAt": "2017-11-16T11:00:01", "EndAt": "2017-11-17T02:00:00" }], "Tickets": [] } }, { "ScheduleID": 3749, "GroupUserID": 5, "StartDate": "2017-11-20T00:00:00", "EndDate": "2017-11-27T00:00:00", "StartTime": "02:00:01", "EndTime": "01:59:59", "StartAt": "2017-11-20T02:00:01", "EndAt": "2017-11-27T01:59:59", "GroupUser": { "GroupUserID": 5, "GroupID": 1, "UserID": 6, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [], "Group": null, "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] } }];

    var dataEvents = [];
    var offset = this.d.getTimezoneOffset();
    var timezone = moment(defaultDate).format('Z');

    var defaultDate = new Date();
    var timezone = moment(defaultDate).format('Z');

    if (defaultDate.getMonth() != month) {
      defaultDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    }

    this.defaultDate = moment(defaultDate).format('YYYY-MM-DD');
    let j = 0;
    for (var i = 0; i < data.length; i++) {
      //convert to local time
      var utcStartDate = new Date(data[i].StartAt);
      var localStartDate = new Date(utcStartDate.getTime() - this.offset * 60 * 1000);
      var utcEndDate = new Date(data[i].EndAt);
      var localEndDate = new Date(utcEndDate.getTime() - this.offset * 60 * 1000);

      let color = ['#2EC7C1', '#F8F138', '#49CC75'];

      if (j > 2) {
        j = 0;
      }


      dataEvents.push({
        id: data[i].ScheduleID,
        title: "(" + timezone + ") " + data[i].GroupUser.User.LastName + ", " + data[i].GroupUser.User.FirstName,
        start: localStartDate,
        end: localEndDate,
        color: color[j],
        groupUserID: data[i].GroupUser.GroupUserID
      });

      j++;

      // console.log(JSON.stringify(dataEvents));
    }
    //load calendar
    this.loadCalendarOptions(dataEvents);

  };

  getSchedules(groupId: number, month: number, year: number) {
    this._oncallScheduleService.getSchedules(groupId, month, year).subscribe(
      Response => {
        var data = Response;
        var dataEvents = [];
        var offset = this.d.getTimezoneOffset();
        var timezone = moment(defaultDate).format('Z');

        var defaultDate = new Date();
        var timezone = moment(defaultDate).format('Z');

        if (defaultDate.getMonth() + 1 != month) {
          defaultDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        }

        this.defaultDate = moment(defaultDate).format('YYYY-MM-DD');
        console.log('defaultDate => ' + defaultDate)
        let j = 0;
        for (var i = 0; i < data.length; i++) {
          //convert to local time
          var utcStartDate = new Date(data[i].StartAt);
          var localStartDate = new Date(utcStartDate.getTime() - this.offset * 60 * 1000);
          var utcEndDate = new Date(data[i].EndAt);
          var localEndDate = new Date(utcEndDate.getTime() - this.offset * 60 * 1000);
          var timeStart = moment(localStartDate).format('HH:mm:ss');
          var timeEnd = moment(localEndDate).format('HH:mm:ss');
          let color = ['#2EC7C1', '#f4ad72', '#49CC75' ];

          if (j > 2) {
            j = 0;
          }

          // var a = '<span class="fc-timeend">T(' + timeEnd + ')/span>';
          // var htmlObject = $(a);
          //htmlObject.prop('outerHTML')

          dataEvents.push({
            id: data[i].ScheduleID,
            // title: "S("+ timeStart + ")  " + "(" + timezone + ") " + data[i].GroupUser.User.LastName + ", " + data[i].GroupUser.User.FirstName + "  T("+ timeEnd + ")",
            title: "(" + timezone + ") " + data[i].GroupUser.User.LastName + ", " + data[i].GroupUser.User.FirstName,
            start: localStartDate,
            end: localEndDate,
            color: color[j],
            
            groupUserID: data[i].GroupUser.GroupUserID
          });

          j++;

         
        }
        // console.log(JSON.stringify(dataEvents));
        //load calendar
        this.loadCalendarOptions(dataEvents);
      });
  };


  loadCalendarOptions(dataEvents: any) {
    console.log('dataEvents' + JSON.stringify(dataEvents))
    this.calendarOptions = {
      height: 'parent',
      fixedWeekCount: false,
      defaultDate: this.defaultDate,
      editable: false,
      eventLimit: false, // allow "more" link when too many events
      eventColor: '#2EC7C1',
      eventTextColor: 'white',
      timeFormat: 'H:mm:ss',
      displayEventEnd: true,
      events: dataEvents,
      eventClick:
        //   function(calEvent, jsEvent, view) {

        //     alert('Event: ' + calEvent.title);

        //     // change the border color just for fun
        //     $(this).css('border-color', '#444');

        // },

        (calEvent, jsEvent, view) => {
          this.selctedEvent(calEvent, jsEvent, view);
        }


    };


    this.isSeclectedGroup = true;

    this.IsHiddenTemp = false;

    setTimeout(function(){
      this.IsHiddenTemp = true;
    }.bind(this),200)
  }

  public selctedEvent(calEvent: any, jsEvent: any, view: any) {

    this.showTextHeadr = 'Modify On-call schedule';

    this.scheduleIdSelected = calEvent.id;
    console.log(calEvent.title + ' ' + calEvent.id);
    this.DataEvent = {
            scheduleId: calEvent.id,
            title: calEvent.title,
            startDate: calEvent.start,
            startTime:calEvent.start,
            endDate: calEvent.end,
            endTime: calEvent.end,
            groupUserID: calEvent.groupUserID
          };

    // console.log(this.DataEvent.startDate.year() +',' + this.DataEvent.startDate.month() +',' + this.DataEvent.startDate.date())

    this.DateFrom = new Date(this.DataEvent.startDate.year(), this.DataEvent.startDate.month(), this.DataEvent.startDate.date());

    this.DateTo = new Date(this.DataEvent.endDate.year(), this.DataEvent.endDate.month(), this.DataEvent.endDate.date());

    // console.log(this.DataEvent.startDate.hour() +',' + this.DataEvent.startDate.minute() +',' + this.DataEvent.startDate.second())

    this.DateTo = new Date(this.DataEvent.endDate.year(), this.DataEvent.endDate.month(), this.DataEvent.endDate.date());

      this.TimeFrom = new Date(
        this.DataEvent.startDate.year(), 
        this.DataEvent.startDate.month(), 
        this.DataEvent.startDate.date(),
        this.DataEvent.startDate.hour(),
        this.DataEvent.startDate.minute(),
        this.DataEvent.startDate.second()
        );

      this.TimeTo = new Date(
        this.DataEvent.endDate.year(), 
        this.DataEvent.endDate.month(), 
        this.DataEvent.endDate.date(),
        this.DataEvent.endDate.hour(),
        this.DataEvent.endDate.minute(),
        this.DataEvent.endDate.second()
        );

        //select Analyst
        console.log(JSON.stringify(this.analystList))
        for(var i=0; i < this.analystList.length ; i++){
           console.log(this.DataEvent.groupUserID + ' : ' + this.analystList[i].groupUserID)
         if(this.DataEvent.groupUserID == this.analystList[i].groupUserID){
             this.analystSelected = this.analystList[i];
             this.selectAnalyst(this.analystSelected);
             break;
         } 
        }

    //select Analyst Filter
    this.analystList.forEach(i => {
      if (i.groupUserID == this.DataEvent.groupUserID) {
        this.selectAnalyst(i);
        this.analystSelected = i;
        console.log('analystSelected : ' + JSON.stringify(this.analystSelected))

        this.AnalystSelector.forEach(j => {
          if (j.id == this.DataEvent.groupUserID) {
            this.Analyst = [j];
          }
        });

      }

    });

    this.AddIsSuccess = false;

  }

  clearInputData(){
    this.DateFrom = undefined;
    this.DateTo = undefined;
    this.TimeFrom = new Date(this.d.getFullYear(),
    this.d.getMonth(),this.d.getDate(),0,0,0);
    this.TimeTo = new Date(this.d.getFullYear(),
    this.d.getMonth(),this.d.getDate(),0,0,59);

    if(this.analystList != [] && this.analystList != undefined){
        this.analystSelected = this.analystList[0];
    }

    this.lanId = null;
    this.username = "";
    this.companyEmail = "";
    this.AddIsSuccess = false;
    this.scheduleIdSelected = 0;

    this.Analyst = null;
    this.showTextHeadr = 'Oncall Schedule';

    // reset
    this.isLoadAnalystSelector = false;
    setTimeout(() => { this.isLoadAnalystSelector = true; })

  };

  backToSelectTeam() {
    this.teamList.forEach(i => {

      if (i.groupID == this.groupIDSelected) {
        this.selectTeam(i);
        return;
      }

    });
  };

  selectTeam(teamSelected: TeamsModel) {
    console.log(teamSelected);

    this.groupIDSelected = teamSelected.groupID;

    //reset
    this.scheduleIdSelected = 0;

    this.month = (this.d.getMonth() + 1);
    this.year = this.d.getFullYear();

    this.clearInputData();

    this.AnalystSelector = [];
    this.isLoadAnalystSelector = false;

    this.isSeclectedGroup = false;
    this.getSchedules(this.groupIDSelected, this.month, this.year);
    this.getMemberList(teamSelected.groupID);

    //mock up
    // this.mockMemberList(teamSelected.groupID);
    // this.mockGetSchedules(teamSelected.groupID, this.month, this.year);

    //mock
    // let tempData2 = new AnalystModel();
    // tempData2.groupId = 1;
    // tempData2.name = "Test Analyst";
    // tempData2.userId = 1;
    // tempData2.groupUserID = 1;
    // tempData2.lanId = 'AAAA';
    // tempData2.comEmail = 'AAAA@sssss.com'

    // this.analystList.push(tempData2)

    // let tempData3 = new AnalystModel();
    // tempData3.groupId = 3;
    // tempData3.name = "Antira 5555";
    // tempData3.userId = 3;
    // tempData3.groupUserID = 3;
    // tempData3.lanId = 'BBBB';
    // tempData3.comEmail = 'BBBB@sssss.com'

    // this.analystList.push(tempData3)

    // this.AnalystSelector = [];
    // this.analystList.forEach(i => {

    //     let data = new SelectorModel();
    //     data.id = i.groupUserID;
    //     data.text = i.name;

    //     this.AnalystSelector.push(data);

    // });

    // this.isLoadAnalystSelector = true;
    // console.log(JSON.stringify(this.AnalystSelector))

    //end mock

  }


  selectAnalyst(data: AnalystModel) {
    this.username = data.name;
    this.companyEmail = data.comEmail;
    this.lanId = data.lanId;
    this.groupUserIdSelected = data.groupUserID;
    this.getUserPic();
  }

  public refreshValue(value: any): void {
    if (value.id != undefined) {
      //value.id  is groupUserID
      console.log('ID : ' + value.id)

      this.analystList.forEach(i => {
        if (i.groupUserID == value.id) {
          this.selectAnalyst(i);
          this.analystSelected = i;
          console.log('analystSelected : ' + JSON.stringify(this.analystSelected))
          return;
        }

      });
    }
  }

  updateUrl() {
    this.profilePicture = './../assets/img/user1.png';
  }

  getUserPic() {
    this.profilePicture = 'https://mysite.na.xom.com/User%20Photos/Profile%20Pictures/' + (this.lanId.replace('\\', '_')) + '_LThumb.jpg';
  }

  mockTeam() {
    //mock test
    let result = [{ "GroupID": 1, "Name": "Retail", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 2, "Name": "OTC", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 3, "Name": "Siebel Technical Services", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 5, "Name": "GPM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 6, "Name": "EDI CS and XCOM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 7, "Name": "S.W.I.F.T. - Society for Worldwide Interbank Financial Telecommunication", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 8, "Name": "M&S Secondary Distribution", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 9, "Name": "Basis Output and Archiving", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }];

    //prepare data select
    result.forEach(i => {

      let data = new TeamsModel();
      data.groupID = i.GroupID;
      data.name = i.Name;

      this.teamList.push(data);

    });
  }

  getTeams() {

    this._teamService.getTeams().subscribe(
      Response => {
        // console.log("Get Teams success!" + JSON.stringify(Response));

        let result = Response;


        //this.teamList = [];

        //prepare data select
        result.forEach(i => {

          let data = new TeamsModel();
          data.groupID = i.GroupID;
          data.name = i.Name;

          this.teamList.push(data);

        });

        // console.log("Teams = " + JSON.stringify(this.teamList));

      },
      err => {
        console.log("Can't get Teams")
      }
    );
  }


  getMemberList(GroupId: number) {
    this._memberService.getMembers(GroupId).subscribe(
      Response => {
        // console.log("Get MemberList success!" + JSON.stringify(Response));

        let result = Response;

        this.analystList = [];

        let tempData = new AnalystModel();
        tempData.groupId = 0;
        tempData.name = "Choose Analyst";
        tempData.userId = 0;
        tempData.groupUserID = 0;

        this.analystList = [tempData];
        this.analystSelected = this.analystList[0];

        result.GroupUsers.forEach(i => {

          let data = new AnalystModel();
          data.groupId = i.GroupID;
          data.userId = i.UserID;
          data.name = i.User.FirstName + ' ' + i.User.LastName;
          data.lanId = i.User.LanID;
          data.groupUserID = i.GroupUserID

          i.Emails.forEach(email => {
            if (email.Disabled == false || email.Disabled == null) {
              if (email.EmailTypeID == 1) {
                //companyMail
                data.comEmail = email.Address;
              }
            }

          });

          this.analystList.push(data);


        });

        this.AnalystSelector = [];
        this.analystList.forEach(i => {

          if (i.groupId != 0) {
            let data = new SelectorModel();
            data.id = i.groupUserID;
            data.text = i.name;

            this.AnalystSelector.push(data);
          }

        });

        this.isLoadAnalystSelector = true;
        // reset
        this.isLoadAnalystSelector = false;
        setTimeout(() => { this.isLoadAnalystSelector = true; })

      }
    );

  }

  getToday(){
     this.clearInputData();
     this.month = this.d.getMonth() + 1;
     this.year = this.d.getFullYear();

    this.isSeclectedGroup = false;
    this.getSchedules(this.groupIDSelected, this.month, this.year);
  }
  prevMonth(){
    this.clearInputData();

    var tempDate = new Date(this.year,this.month,2);
    tempDate.setMonth(tempDate.getMonth() - 1);

    this.month = tempDate.getMonth();
    this.year = tempDate.getFullYear();

    // console.log(this.month + ' <=> ' + this.year)

    if(this.month == 0){
      this.month = 12;
      this.year = this.year-1;
    }

    // console.log(this.month + ' : ' + this.year)

    this.isSeclectedGroup = false;
    this.getSchedules(this.groupIDSelected,this.month, this.year);
  }

  nextMonth(){
    this.clearInputData();

    var tempDate = new Date(this.year,this.month,2);
    tempDate.setMonth(tempDate.getMonth() + 1);

    this.month = tempDate.getMonth();
    this.year = tempDate.getFullYear();
    
      // console.log(this.month + ' <== Next => ' + this.year)

    if(this.month == 0){
      this.month = 12;
      this.year = this.year -1;
    }

    // console.log(this.month + ' : ' + this.year)

    this.isSeclectedGroup = false;
    this.getSchedules(this.groupIDSelected,this.month, this.year);
  }


  addSchedule() {
    if (this.checkValidateDateTime()) {

      let utcStartAndEndDateTime = this.getEndAndStartDateTimeUTC();

      let data = new ScheduleModel();
      data.GroupUserID = this.analystSelected.groupUserID;
      data.StartAt = utcStartAndEndDateTime[0];
      data.EndAt = utcStartAndEndDateTime[1];
      data.StartDate = utcStartAndEndDateTime[2];
      data.EndDate = utcStartAndEndDateTime[3];
      data.StartTime = utcStartAndEndDateTime[4];
      data.EndTime = utcStartAndEndDateTime[5];

      console.log(JSON.stringify(data))

      this.month = + (moment(data.StartDate).format('MM'));
      this.year = + (moment(data.StartDate).format('YYYY'));

      // console.log(this.month + " < Add > " + this.year)

      this._oncallScheduleService.addSchedule(data).subscribe(
        Response => {
          //getSchedules
          console.log("Add Schedule Succes!!");
          this.scheduleIdSelected = 0;
          this.isSeclectedGroup = false;
          this.getSchedules(this.groupIDSelected, this.month, this.year)

        },
        error => {
          console.log("Can't addSchedule" + error);
          swal({
            title: "Cannot add new schedule",
            text: "Please try again!",
            icon: "error",
          });
        });
    } else {
      this.validateModal.show();
    }


  }

  checkValidateDateTime(): boolean {
    ///// start  data time 
    var yFrom = this.DateFrom.getFullYear();
    var mFrom = this.DateFrom.getMonth();
    var dFrom = this.DateFrom.getDate();

    var yTo = this.DateTo.getFullYear();
    var mTo = this.DateTo.getMonth();
    var dTo = this.DateTo.getDate();

    var sameDate = false;

    var isValidateDate = false;
    if (yFrom < yTo) {
      isValidateDate = true;
    } else if (yFrom == yTo && mFrom < mTo) {
      isValidateDate = true;
    } else if (yFrom == yTo && mFrom == mTo && dFrom < dTo) {
      isValidateDate = true;
    } else if (yFrom == yTo && mFrom == mTo && dFrom == dTo) {
      isValidateDate = true;
      sameDate = true;
    } else {
      isValidateDate = false;
    }

    var timeFromHour = this.TimeFrom.getHours();
    var timeFromMinute = this.TimeFrom.getMinutes();
    var timeFromSec = this.TimeFrom.getSeconds();

    ///// end data time 
    var timeToHour = this.TimeTo.getHours();
    var timeToMinute = this.TimeTo.getMinutes();
    var timeToSec = this.TimeTo.getSeconds();

    var isValidateTime = false;

    if (timeFromHour < timeToHour) {
      isValidateTime = true;
    } else if (timeFromHour == timeToHour && timeFromMinute < timeToMinute) {
      isValidateTime = true;
    }
    else if (timeFromHour == timeToHour && timeFromMinute == timeToMinute && timeFromSec < timeToSec) {
      isValidateTime = true;
    }
    else {
      if (!sameDate) {
        isValidateTime = true;
      } else {
        isValidateTime = false;
      }

    }


    if (isValidateDate && isValidateTime) {
      return true;
    } else {
      return false;
    }

  }

  getEndAndStartDateTimeUTC(): any {

    var EndAndStartDateTimeUTC = new Array(6);

    ///// start  data time 
    var timeFromHour = this.TimeFrom.getHours();
    var timeFromMinute = this.TimeFrom.getMinutes();
    var timeFromSec = this.TimeFrom.getSeconds();
    let startDateTime = moment(this.DateFrom).set({ hour: timeFromHour, minute: timeFromMinute , second: timeFromSec}).format('YYYY-MM-DD HH:mm:ss');

    var utcStartDateTime = moment(startDateTime).utc();

    ///// end data time 
    var timeToHour = this.TimeTo.getHours();
    var timeToMinute = this.TimeTo.getMinutes();
    var timeToSec = this.TimeTo.getSeconds();
    let endDateTime = moment(this.DateTo).set({ hour: timeToHour, minute: timeToMinute, second: timeToSec }).format('YYYY-MM-DD HH:mm:ss');

    var utcEndDateTime = moment(endDateTime).utc();

    EndAndStartDateTimeUTC[0] = moment(utcStartDateTime).format('YYYY-MM-DD HH:mm:ss');
    EndAndStartDateTimeUTC[1] = moment(utcEndDateTime).format('YYYY-MM-DD HH:mm:ss');
    EndAndStartDateTimeUTC[2] = moment(utcStartDateTime).format('YYYY-MM-DD');
    EndAndStartDateTimeUTC[3] = moment(utcEndDateTime).format('YYYY-MM-DD');
    EndAndStartDateTimeUTC[4] = moment(utcStartDateTime).format('HH:mm:ss');
    EndAndStartDateTimeUTC[5] = moment(utcEndDateTime).format('HH:mm:ss');
    return EndAndStartDateTimeUTC;
  }

  updateSchedule() {

    if (this.checkValidateDateTime()) {
      let utcStartAndEndDateTime = this.getEndAndStartDateTimeUTC();

      let data = new ScheduleModel();
      data.ScheduleID = this.DataEvent.scheduleId;
      data.GroupUserID = this.analystSelected.groupUserID;
      data.StartAt = utcStartAndEndDateTime[0];
      data.EndAt = utcStartAndEndDateTime[1];
      data.StartDate = utcStartAndEndDateTime[2];
      data.EndDate = utcStartAndEndDateTime[3];
      data.StartTime = utcStartAndEndDateTime[4];
      data.EndTime = utcStartAndEndDateTime[5];

      console.log(JSON.stringify(data))

      this.month = + (moment(data.StartDate).format('MM'));
      this.year = + (moment(data.StartDate).format('YYYY'));

      // console.log(this.month + " < Update > " + this.year)

      this._oncallScheduleService.updateSchedule(data).subscribe(
        Response => {
          //getSchedules
          console.log("Update Schedule Succes!!");
          this.isSeclectedGroup = false;
          this.getSchedules(this.groupIDSelected, this.month, this.year)

        },
        error => {
          console.log("Can't Update Schedule" + error);
          swal({
            title: "Cannot update schedule",
            text: "Please try again!",
            icon: "error",
          });
        });

    } else {
      this.validateModal.show();
    }

  }

  removeSchedule() {
    //hide modal
    this.childModal.hide();

    // console.log('Remove => ID ' + this.DataEvent.scheduleId)

    this.month = + (moment(this.DataEvent.startDate).format('MM'));
    this.year = + (moment(this.DataEvent.startDate).format('YYYY'));

    // console.log(this.month + " < Delete > " + this.year)

    this._oncallScheduleService.deleteSchedule(this.DataEvent.scheduleId).subscribe(
      Response => {
        
        console.log("Delete Schedule Succes!!");

        //clearInputData
        this.clearInputData();
        //getSchedules
        this.isSeclectedGroup = false;
        this.getSchedules(this.groupIDSelected, this.month, this.year)

      },
      error => {
        console.log("Can't Delete Schedule" + error);
        swal({
          title: "Cannot delete schedule",
          text: "Please try again!",
          icon: "error",
        });
      });

  }

  public showChildModal(): void {
    // this.childModal.show();

    const newLocal: string | Partial<any> = {
      title: "Delete schedule",
      text: "Are you sure you want to delete this schedule?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    };

    swal(newLocal).then((willDelete) => {
      if (willDelete) {
        this.removeSchedule();
      } else {

      }
    });
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  mockMemberList(GroupId: number) {

    //mock Members 
    let mockMember = {
      "GroupID": 1, "Name": "Retail", "Urgency": "2-High ", "GroupUsers": [{ "GroupUserID": 2, "GroupID": 1, "UserID": 3, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 3, "FirstName": "Thanyathorn", "LastName": "Patanaanunwong", "LanID": "ap\\tpatana", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2, "Address": "thanyathorn.patanaanunwong@exxonmobil.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 19, "Address": "wetstocksystem@gmail.com", "UserID": 3, "GroupUserID": 2, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 5, "GroupID": 1, "UserID": 6, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 6, "FirstName": "Douglas", "LastName": "Kreitlov", "LanID": "sa\\dekrei1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 5, "Address": "douglas.e.kreitlov@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 34, "Address": "wetstocksupport@exxonmobil.com", "UserID": 6, "GroupUserID": 5, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 100, "GroupID": 1, "UserID": 298, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 298, "FirstName": "TAWATCHAI", "LastName": "SONGPATTANASILP", "LanID": "ap\\twc", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 367, "Address": "tawatchai.songpattanasilp@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1467, "Address": "wetstocksupport@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1567, "Address": "iossdsm01@exxonmobil.com", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2627, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 298, "GroupUserID": 100, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, {
        "GroupUserID": 103, "GroupID": 1, "UserID": 303, "IsGroupAdministrator": false, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{
          "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": {
            "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{
              "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303,
              "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": []
            }], "GroupUsers": [], "Tickets": [], "UserType": null
          }, "OutboundEmails": [], "OutboundEmailCCs": []
        }, { "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 303, "FirstName": "iOSSDSM01", "LastName": "", "LanID": "na\\iossdsm01", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 384, "Address": "iOSSDSM01@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1466, "Address": "wetstocksupport@exxonmobil.com", "UserID": 303, "GroupUserID": 103, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": []
      }, { "GroupUserID": 133, "GroupID": 1, "UserID": 1369, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1465, "Address": "brendan.f.cumming@exxonmobil.com", "UserID": 1369, "GroupUserID": 133, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1369, "FirstName": "BRENDAN", "LastName": "CUMMING", "LanID": "na\\bfcummi", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1369, "FirstName": "BRENDAN", "LastName": "CUMMING", "LanID": "na\\bfcummi", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1465, "Address": "brendan.f.cumming@exxonmobil.com", "UserID": 1369, "GroupUserID": 133, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 163, "GroupID": 1, "UserID": 1430, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1430, "FirstName": "Madhuri", "LastName": "Patil-Dasur", "LanID": "ap\\mpatild", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1550, "Address": "madhuri.patil-dasur@exxonmobil.com", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2606, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 1430, "GroupUserID": 163, "EmailTypeID": 2, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 164, "GroupID": 1, "UserID": 1434, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1554, "Address": "petchada.tangtatswas@exxonmobil.com", "UserID": 1434, "GroupUserID": 164, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1434, "FirstName": "PETCHADA", "LastName": "TANGTATSWAS", "LanID": "ap\\pcd", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1434, "FirstName": "PETCHADA", "LastName": "TANGTATSWAS", "LanID": "ap\\pcd", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1554, "Address": "petchada.tangtatswas@exxonmobil.com", "UserID": 1434, "GroupUserID": 164, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 174, "GroupID": 1, "UserID": 2526, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2526, "FirstName": "Sathapana", "LastName": "Sakhet", "LanID": "AP\\SRSAKHE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2655, "Address": "sathapana.r.sakhet@exxonmobil.com", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2689, "Address": "CRUSO2@SINGTEL.AP.BLACKBERRY.NET", "UserID": 2526, "GroupUserID": 174, "EmailTypeID": 2, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }], "Products": [], "GroupAliases": []
    };

    if (GroupId == 2) {
      mockMember = {
        "GroupID": 2, "Name": "OTC", "Urgency": "2-High", "GroupUsers": [{ "GroupUserID": 4, "GroupID": 2, "UserID": 5, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 4, "Address": "leandro.bail@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 5, "FirstName": "Leandro", "LastName": "Bail", "LanID": "sa\\lbail", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 35, "Address": "wetstocksupport@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2600, "Address": "sm-oncall-otc@outlook.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 35, "Address": "wetstocksupport@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "User": { "UserID": 5, "FirstName": "Leandro", "LastName": "Bail", "LanID": "sa\\lbail", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 4, "Address": "leandro.bail@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2600, "Address": "sm-oncall-otc@outlook.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2600, "Address": "sm-oncall-otc@outlook.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "User": { "UserID": 5, "FirstName": "Leandro", "LastName": "Bail", "LanID": "sa\\lbail", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 4, "Address": "leandro.bail@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 35, "Address": "wetstocksupport@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 5, "FirstName": "Leandro", "LastName": "Bail", "LanID": "sa\\lbail", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 4, "Address": "leandro.bail@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 35, "Address": "wetstocksupport@exxonmobil.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2600, "Address": "sm-oncall-otc@outlook.com", "UserID": 5, "GroupUserID": 4, "EmailTypeID": 3, "Disabled": true, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 13, "GroupID": 2, "UserID": 24, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 26, "Address": "kamonchanok.saengmekhin@exxonmobil.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 24, "FirstName": "Kamonchanok", "LastName": "Saengmekhin", "LanID": "ap\\ksa", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 292, "Address": "sm-oncall-otc@outlook.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 292, "Address": "sm-oncall-otc@outlook.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 24, "FirstName": "Kamonchanok", "LastName": "Saengmekhin", "LanID": "ap\\ksa", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 26, "Address": "kamonchanok.saengmekhin@exxonmobil.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 24, "FirstName": "Kamonchanok", "LastName": "Saengmekhin", "LanID": "ap\\ksa", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 26, "Address": "kamonchanok.saengmekhin@exxonmobil.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 292, "Address": "sm-oncall-otc@outlook.com", "UserID": 24, "GroupUserID": 13, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 17, "GroupID": 2, "UserID": 44, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 46, "Address": "passorn.sangiampong@exxonmobil.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 44, "FirstName": "Passorn", "LastName": "Sangiampong", "LanID": "ap\\PIO", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 59, "Address": "sm-oncall-otc@outlook.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 59, "Address": "sm-oncall-otc@outlook.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 44, "FirstName": "Passorn", "LastName": "Sangiampong", "LanID": "ap\\PIO", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 46, "Address": "passorn.sangiampong@exxonmobil.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 44, "FirstName": "Passorn", "LastName": "Sangiampong", "LanID": "ap\\PIO", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 46, "Address": "passorn.sangiampong@exxonmobil.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 59, "Address": "sm-oncall-otc@outlook.com", "UserID": 44, "GroupUserID": 17, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, {
          "GroupUserID": 18, "GroupID": 2, "UserID": 45, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 47, "Address": "diogo.pigatto@exxonmobil.com", "UserID": 45, "GroupUserID": 18, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 45, "FirstName": "Diogo", "LastName": "Pigatto", "LanID": "sa\\DPIGATT", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 60, "Address": "sm-oncall-otc@outlook.com", "UserID": 45, "GroupUserID": 18, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 60, "Address": "sm-oncall-otc@outlook.com", "UserID": 45, "GroupUserID": 18, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 45, "FirstName": "Diogo", "LastName": "Pigatto", "LanID": "sa\\DPIGATT", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 47, "Address": "diogo.pigatto@exxonmobil.com", "UserID": 45, "GroupUserID": 18, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": {
            "UserID": 45, "FirstName": "Diogo", "LastName": "Pigatto",
            "LanID": "sa\\DPIGATT", "TelNumber": null, "UserTypeID": 1,
            "Emails": [{
              "EmailID": 47, "Address": "diogo.pigatto@exxonmobil.com",
              "UserID": 45, "GroupUserID": 18, "EmailTypeID": 1, "Disabled": false,
              "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": []
            }, { "EmailID": 60, "Address": "sm-oncall-otc@outlook.com", "UserID": 45, "GroupUserID": 18, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null
          }, "Schedules": [], "Tickets": []
        }, { "GroupUserID": 19, "GroupID": 2, "UserID": 46, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 48, "Address": "cristiane.rodrigues@exxonmobil.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 46, "FirstName": "Cris", "LastName": "Rodrigues", "LanID": "sa\\CRODRI3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 61, "Address": "sm-oncall-otc@outlook.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 61, "Address": "sm-oncall-otc@outlook.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 46, "FirstName": "Cris", "LastName": "Rodrigues", "LanID": "sa\\CRODRI3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 48, "Address": "cristiane.rodrigues@exxonmobil.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 46, "FirstName": "Cris", "LastName": "Rodrigues", "LanID": "sa\\CRODRI3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 48, "Address": "cristiane.rodrigues@exxonmobil.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 61, "Address": "sm-oncall-otc@outlook.com", "UserID": 46, "GroupUserID": 19, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 20, "GroupID": 2, "UserID": 47, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 49, "Address": "chotika.angsurit@exxonmobil.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 47, "FirstName": "Chotika", "LastName": "Angsurit", "LanID": "ap\\CNU", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 62, "Address": "sm-oncall-otc@outlook.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 62, "Address": "sm-oncall-otc@outlook.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 47, "FirstName": "Chotika", "LastName": "Angsurit", "LanID": "ap\\CNU", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 49, "Address": "chotika.angsurit@exxonmobil.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 47, "FirstName": "Chotika", "LastName": "Angsurit", "LanID": "ap\\CNU", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 49, "Address": "chotika.angsurit@exxonmobil.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 62, "Address": "sm-oncall-otc@outlook.com", "UserID": 47, "GroupUserID": 20, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, {
          "GroupUserID": 22, "GroupID": 2, "UserID": 49, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 51, "Address": "angelita.s.vidal@exxonmobil.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 49, "FirstName": "Angelita", "LastName": "Vidal", "LanID": "sa\\aomsvid", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 64, "Address": "sm-oncall-otc@outlook.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, {
            "EmailID": 64, "Address": "sm-oncall-otc@outlook.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 49, "FirstName": "Angelita", "LastName": "Vidal", "LanID": "sa\\aomsvid", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 51, "Address": "angelita.s.vidal@exxonmobil.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [],
            "OutboundEmailCCs": []
          }], "User": { "UserID": 49, "FirstName": "Angelita", "LastName": "Vidal", "LanID": "sa\\aomsvid", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 51, "Address": "angelita.s.vidal@exxonmobil.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 64, "Address": "sm-oncall-otc@outlook.com", "UserID": 49, "GroupUserID": 22, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": []
        }, { "GroupUserID": 23, "GroupID": 2, "UserID": 50, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 52, "Address": "andre.s.wrobel@exxonmobil.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 50, "FirstName": "Andre", "LastName": "Wrobel", "LanID": "sa\\ASWROBE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 65, "Address": "sm-oncall-otc@outlook.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 65, "Address": "sm-oncall-otc@outlook.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 50, "FirstName": "Andre", "LastName": "Wrobel", "LanID": "sa\\ASWROBE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 52, "Address": "andre.s.wrobel@exxonmobil.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 50, "FirstName": "Andre", "LastName": "Wrobel", "LanID": "sa\\ASWROBE", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 52, "Address": "andre.s.wrobel@exxonmobil.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 65, "Address": "sm-oncall-otc@outlook.com", "UserID": 50, "GroupUserID": 23, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, {
          "GroupUserID": 27, "GroupID": 2, "UserID": 54, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{
            "EmailID": 56, "Address": "nipat.leelapanya@exxonmobil.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 1, "Disabled": false, "EmailType": null,
            "User": { "UserID": 54, "FirstName": "Nipat", "LastName": "Leelapanya", "LanID": "ap\\NLL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 69, "Address": "sm-oncall-otc@outlook.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": []
          }, { "EmailID": 69, "Address": "sm-oncall-otc@outlook.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 54, "FirstName": "Nipat", "LastName": "Leelapanya", "LanID": "ap\\NLL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 56, "Address": "nipat.leelapanya@exxonmobil.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 54, "FirstName": "Nipat", "LastName": "Leelapanya", "LanID": "ap\\NLL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 56, "Address": "nipat.leelapanya@exxonmobil.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 69, "Address": "sm-oncall-otc@outlook.com", "UserID": 54, "GroupUserID": 27, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": []
        }, {
          "GroupUserID": 36, "GroupID": 2, "UserID": 81, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 98, "Address": "mario.j.rapozo@exxonmobil.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 81, "FirstName": "MARIO JOSE GAMO", "LastName": "RAPOZO", "LanID": "sa\\mjrapoz", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 99, "Address": "sm-oncall-otc@outlook.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, {
            "EmailID": 99, "Address": "sm-oncall-otc@outlook.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": {
              "UserID": 81, "FirstName": "MARIO JOSE GAMO", "LastName": "RAPOZO", "LanID": "sa\\mjrapoz", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 98, "Address": "mario.j.rapozo@exxonmobil.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [],
              "UserType": null
            }, "OutboundEmails": [], "OutboundEmailCCs": []
          }],
          "User": { "UserID": 81, "FirstName": "MARIO JOSE GAMO", "LastName": "RAPOZO", "LanID": "sa\\mjrapoz", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 98, "Address": "mario.j.rapozo@exxonmobil.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 99, "Address": "sm-oncall-otc@outlook.com", "UserID": 81, "GroupUserID": 36, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": []
        }
          , {
          "GroupUserID": 37, "GroupID": 2, "UserID": 82, "IsGroupAdministrator": true,
          "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false,
          "Emails": [{
            "EmailID": 100, "Address": "cesar.souza@exxonmobil.com", "UserID": 82,
            "GroupUserID": 37, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User":
              { "UserID": 82, "FirstName": "CESAR AUGUSTO DE", "LastName": "SOUZA", "LanID": "sa\\CASOUZ3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 101, "Address": "sm-oncall-otc@outlook.com", "UserID": 82, "GroupUserID": 37, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": []
          }, { "EmailID": 101, "Address": "sm-oncall-otc@outlook.com", "UserID": 82, "GroupUserID": 37, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 82, "FirstName": "CESAR AUGUSTO DE", "LastName": "SOUZA", "LanID": "sa\\CASOUZ3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 100, "Address": "cesar.souza@exxonmobil.com", "UserID": 82, "GroupUserID": 37, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 82, "FirstName": "CESAR AUGUSTO DE", "LastName": "SOUZA", "LanID": "sa\\CASOUZ3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 100, "Address": "cesar.souza@exxonmobil.com", "UserID": 82, "GroupUserID": 37, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 101, "Address": "sm-oncall-otc@outlook.com", "UserID": 82, "GroupUserID": 37, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": []
        }, { "GroupUserID": 38, "GroupID": 2, "UserID": 83, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 102, "Address": "carolina.a.carani@exxonmobil.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 83, "FirstName": "CAROLINA ANGELICA", "LastName": "CARANI", "LanID": "sa\\CACARAN", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 103, "Address": "sm-oncall-otc@outlook.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 103, "Address": "sm-oncall-otc@outlook.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 83, "FirstName": "CAROLINA ANGELICA", "LastName": "CARANI", "LanID": "sa\\CACARAN", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 102, "Address": "carolina.a.carani@exxonmobil.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 83, "FirstName": "CAROLINA ANGELICA", "LastName": "CARANI", "LanID": "sa\\CACARAN", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 102, "Address": "carolina.a.carani@exxonmobil.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 103, "Address": "sm-oncall-otc@outlook.com", "UserID": 83, "GroupUserID": 38, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 39, "GroupID": 2, "UserID": 84, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 104, "Address": "fabio.r.zanatta@exxonmobil.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 84, "FirstName": "FABIO REINALDO", "LastName": "ZANATTA", "LanID": "sa\\FRZANAT", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 105, "Address": "sm-oncall-otc@outlook.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 105, "Address": "sm-oncall-otc@outlook.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 84, "FirstName": "FABIO REINALDO", "LastName": "ZANATTA", "LanID": "sa\\FRZANAT", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 104, "Address": "fabio.r.zanatta@exxonmobil.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 84, "FirstName": "FABIO REINALDO", "LastName": "ZANATTA", "LanID": "sa\\FRZANAT", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 104, "Address": "fabio.r.zanatta@exxonmobil.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 105, "Address": "sm-oncall-otc@outlook.com", "UserID": 84, "GroupUserID": 39, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 42, "GroupID": 2, "UserID": 95, "IsGroupAdministrator": false, "IsEscalationReceiver": false, "IsWorkHourReceiver": false, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 117, "Address": "patricia.luppi@exxonmobil.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 95, "FirstName": "PATRICIA LOPES DUTRA", "LastName": "LUPPI", "LanID": "sa\\PLUPPI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 293, "Address": "sm-oncall-otc@outlook.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 293, "Address": "sm-oncall-otc@outlook.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 95, "FirstName": "PATRICIA LOPES DUTRA", "LastName": "LUPPI", "LanID": "sa\\PLUPPI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 117, "Address": "patricia.luppi@exxonmobil.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 95, "FirstName": "PATRICIA LOPES DUTRA", "LastName": "LUPPI", "LanID": "sa\\PLUPPI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 117, "Address": "patricia.luppi@exxonmobil.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 293, "Address": "sm-oncall-otc@outlook.com", "UserID": 95, "GroupUserID": 42, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 43, "GroupID": 2, "UserID": 96, "IsGroupAdministrator": false, "IsEscalationReceiver": false, "IsWorkHourReceiver": false, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 118, "Address": "barbara.a.shuman@exxonmobil.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 96, "FirstName": "BARBARA", "LastName": "SHUMAN", "LanID": "na\\bashuman", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 294, "Address": "sm-oncall-otc@outlook.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 294, "Address": "sm-oncall-otc@outlook.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 96, "FirstName": "BARBARA", "LastName": "SHUMAN", "LanID": "na\\bashuman", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 118, "Address": "barbara.a.shuman@exxonmobil.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 96, "FirstName": "BARBARA", "LastName": "SHUMAN", "LanID": "na\\bashuman", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 118, "Address": "barbara.a.shuman@exxonmobil.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 294, "Address": "sm-oncall-otc@outlook.com", "UserID": 96, "GroupUserID": 43, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 44, "GroupID": 2, "UserID": 97, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 120, "Address": "danielle.nascimento@exxonmobil.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 97, "FirstName": "DANIELLE OLIVEIRA DO", "LastName": "NASCIMENTO", "LanID": "sa\\DONASCI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 121, "Address": "sm-oncall-otc@outlook.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 121, "Address": "sm-oncall-otc@outlook.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 97, "FirstName": "DANIELLE OLIVEIRA DO", "LastName": "NASCIMENTO", "LanID": "sa\\DONASCI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 120, "Address": "danielle.nascimento@exxonmobil.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 97, "FirstName": "DANIELLE OLIVEIRA DO", "LastName": "NASCIMENTO", "LanID": "sa\\DONASCI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 120, "Address": "danielle.nascimento@exxonmobil.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 121, "Address": "sm-oncall-otc@outlook.com", "UserID": 97, "GroupUserID": 44, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 48, "GroupID": 2, "UserID": 159, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 185, "Address": "henrique.bezerra@exxonmobil.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 159, "FirstName": "HENRIQUE MUNHOZ", "LastName": "BEZERRA", "LanID": "sa\\HBEZERR", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 295, "Address": "sm-oncall-otc@outlook.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 295, "Address": "sm-oncall-otc@outlook.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 159, "FirstName": "HENRIQUE MUNHOZ", "LastName": "BEZERRA", "LanID": "sa\\HBEZERR", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 185, "Address": "henrique.bezerra@exxonmobil.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 159, "FirstName": "HENRIQUE MUNHOZ", "LastName": "BEZERRA", "LanID": "sa\\HBEZERR", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 185, "Address": "henrique.bezerra@exxonmobil.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 295, "Address": "sm-oncall-otc@outlook.com", "UserID": 159, "GroupUserID": 48, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 63, "GroupID": 2, "UserID": 200, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 226, "Address": "ana.c.basilio@exxonmobil.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 200, "FirstName": "ANA CAROLINA CORREA", "LastName": "BASILIO", "LanID": "SA\\ACBASIL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 296, "Address": "sm-oncall-otc@outlook.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 296, "Address": "sm-oncall-otc@outlook.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 200, "FirstName": "ANA CAROLINA CORREA", "LastName": "BASILIO", "LanID": "SA\\ACBASIL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 226, "Address": "ana.c.basilio@exxonmobil.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 200, "FirstName": "ANA CAROLINA CORREA", "LastName": "BASILIO", "LanID": "SA\\ACBASIL", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 226, "Address": "ana.c.basilio@exxonmobil.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 296, "Address": "sm-oncall-otc@outlook.com", "UserID": 200, "GroupUserID": 63, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 64, "GroupID": 2, "UserID": 201, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 227, "Address": "paulo.s.biezuner@exxonmobil.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 201, "FirstName": "PAULO SERGIO", "LastName": "BIEZUNER", "LanID": "SA\\psbiezu", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 297, "Address": "sm-oncall-otc@outlook.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 297, "Address": "sm-oncall-otc@outlook.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 201, "FirstName": "PAULO SERGIO", "LastName": "BIEZUNER", "LanID": "SA\\psbiezu", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 227, "Address": "paulo.s.biezuner@exxonmobil.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 201, "FirstName": "PAULO SERGIO", "LastName": "BIEZUNER", "LanID": "SA\\psbiezu", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 227, "Address": "paulo.s.biezuner@exxonmobil.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 297, "Address": "sm-oncall-otc@outlook.com", "UserID": 201, "GroupUserID": 64, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 65, "GroupID": 2, "UserID": 202, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 228, "Address": "ronaldo.scottini@exxonmobil.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 202, "FirstName": "RONALDO", "LastName": "SCOTTINI", "LanID": "SA\\RSCOTTI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 298, "Address": "sm-oncall-otc@outlook.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 298, "Address": "sm-oncall-otc@outlook.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 202, "FirstName": "RONALDO", "LastName": "SCOTTINI", "LanID": "SA\\RSCOTTI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 228, "Address": "ronaldo.scottini@exxonmobil.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 202, "FirstName": "RONALDO", "LastName": "SCOTTINI", "LanID": "SA\\RSCOTTI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 228, "Address": "ronaldo.scottini@exxonmobil.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 298, "Address": "sm-oncall-otc@outlook.com", "UserID": 202, "GroupUserID": 65, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 67, "GroupID": 2, "UserID": 241, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 267, "Address": "charmornrut.hovichitr@exxonmobil.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 241, "FirstName": "CHARMORNRUT HOVICHITR", "LastName": "SETHI", "LanID": "AP\\CHV", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 300, "Address": "sm-oncall-otc@outlook.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 300, "Address": "sm-oncall-otc@outlook.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 241, "FirstName": "CHARMORNRUT HOVICHITR", "LastName": "SETHI", "LanID": "AP\\CHV", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 267, "Address": "charmornrut.hovichitr@exxonmobil.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 241, "FirstName": "CHARMORNRUT HOVICHITR", "LastName": "SETHI", "LanID": "AP\\CHV", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 267, "Address": "charmornrut.hovichitr@exxonmobil.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 300, "Address": "sm-oncall-otc@outlook.com", "UserID": 241, "GroupUserID": 67, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 68, "GroupID": 2, "UserID": 242, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 268, "Address": "thitiwadee.akkarapongpun@exxonmobil.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 242, "FirstName": "THITIWADEE", "LastName": "AKKARAPONGPUN", "LanID": "AP\\TKP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 301, "Address": "sm-oncall-otc@outlook.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 301, "Address": "sm-oncall-otc@outlook.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 242, "FirstName": "THITIWADEE", "LastName": "AKKARAPONGPUN", "LanID": "AP\\TKP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 268, "Address": "thitiwadee.akkarapongpun@exxonmobil.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 242, "FirstName": "THITIWADEE", "LastName": "AKKARAPONGPUN", "LanID": "AP\\TKP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 268, "Address": "thitiwadee.akkarapongpun@exxonmobil.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 301, "Address": "sm-oncall-otc@outlook.com", "UserID": 242, "GroupUserID": 68, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 69, "GroupID": 2, "UserID": 243, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 269, "Address": "jirachai.chaijaroen@exxonmobil.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 243, "FirstName": "JIRACHAI", "LastName": "CHAIJAROEN", "LanID": "AP\\JCHAIJA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 302, "Address": "sm-oncall-otc@outlook.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 302, "Address": "sm-oncall-otc@outlook.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 243, "FirstName": "JIRACHAI", "LastName": "CHAIJAROEN", "LanID": "AP\\JCHAIJA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 269, "Address": "jirachai.chaijaroen@exxonmobil.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 243, "FirstName": "JIRACHAI", "LastName": "CHAIJAROEN", "LanID": "AP\\JCHAIJA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 269, "Address": "jirachai.chaijaroen@exxonmobil.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 302, "Address": "sm-oncall-otc@outlook.com", "UserID": 243, "GroupUserID": 69, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 70, "GroupID": 2, "UserID": 244, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 270, "Address": "nuttakul.amnutkittikul@exxonmobil.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 244, "FirstName": "NUTTAKUL", "LastName": "AMNUTKITTIKUL", "LanID": "AP\\namnutk", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 303, "Address": "sm-oncall-otc@outlook.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 303, "Address": "sm-oncall-otc@outlook.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 244, "FirstName": "NUTTAKUL", "LastName": "AMNUTKITTIKUL", "LanID": "AP\\namnutk", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 270, "Address": "nuttakul.amnutkittikul@exxonmobil.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 244, "FirstName": "NUTTAKUL", "LastName": "AMNUTKITTIKUL", "LanID": "AP\\namnutk", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 270, "Address": "nuttakul.amnutkittikul@exxonmobil.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 303, "Address": "sm-oncall-otc@outlook.com", "UserID": 244, "GroupUserID": 70, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 71, "GroupID": 2, "UserID": 245, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 271, "Address": "nakin.korkijrattanakul@exxonmobil.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 245, "FirstName": "NAKIN", "LastName": "KORKIJRATTANAKUL", "LanID": "AP\\nkorkij", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 304, "Address": "sm-oncall-otc@outlook.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 304, "Address": "sm-oncall-otc@outlook.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 245, "FirstName": "NAKIN", "LastName": "KORKIJRATTANAKUL", "LanID": "AP\\nkorkij", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 271, "Address": "nakin.korkijrattanakul@exxonmobil.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 245, "FirstName": "NAKIN", "LastName": "KORKIJRATTANAKUL", "LanID": "AP\\nkorkij", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 271, "Address": "nakin.korkijrattanakul@exxonmobil.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 304, "Address": "sm-oncall-otc@outlook.com", "UserID": 245, "GroupUserID": 71, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 72, "GroupID": 2, "UserID": 246, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 272, "Address": "weeraporn.rattanaket@exxonmobil.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 246, "FirstName": "WEERAPORN", "LastName": "RATTANAKET", "LanID": "AP\\WRG", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 305, "Address": "sm-oncall-otc@outlook.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 305, "Address": "sm-oncall-otc@outlook.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 246, "FirstName": "WEERAPORN", "LastName": "RATTANAKET", "LanID": "AP\\WRG", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 272, "Address": "weeraporn.rattanaket@exxonmobil.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 246, "FirstName": "WEERAPORN", "LastName": "RATTANAKET", "LanID": "AP\\WRG", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 272, "Address": "weeraporn.rattanaket@exxonmobil.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 305, "Address": "sm-oncall-otc@outlook.com", "UserID": 246, "GroupUserID": 72, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 73, "GroupID": 2, "UserID": 247, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 273, "Address": "hathaiphat.pongsayaporn@exxonmobil.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 247, "FirstName": "HATHAIPHAT", "LastName": "PONGSAYAPORN", "LanID": "AP\\HYP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 306, "Address": "sm-oncall-otc@outlook.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 306, "Address": "sm-oncall-otc@outlook.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 247, "FirstName": "HATHAIPHAT", "LastName": "PONGSAYAPORN", "LanID": "AP\\HYP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 273, "Address": "hathaiphat.pongsayaporn@exxonmobil.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 247, "FirstName": "HATHAIPHAT", "LastName": "PONGSAYAPORN", "LanID": "AP\\HYP", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 273, "Address": "hathaiphat.pongsayaporn@exxonmobil.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 306, "Address": "sm-oncall-otc@outlook.com", "UserID": 247, "GroupUserID": 73, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 74, "GroupID": 2, "UserID": 248, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 274, "Address": "oranuch.jirawatchara@exxonmobil.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 248, "FirstName": "ORANUCH", "LastName": "JIRAWATCHARA", "LanID": "AP\\OJI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 307, "Address": "sm-oncall-otc@outlook.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 307, "Address": "sm-oncall-otc@outlook.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 248, "FirstName": "ORANUCH", "LastName": "JIRAWATCHARA", "LanID": "AP\\OJI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 274, "Address": "oranuch.jirawatchara@exxonmobil.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 248, "FirstName": "ORANUCH", "LastName": "JIRAWATCHARA", "LanID": "AP\\OJI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 274, "Address": "oranuch.jirawatchara@exxonmobil.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 307, "Address": "sm-oncall-otc@outlook.com", "UserID": 248, "GroupUserID": 74, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 75, "GroupID": 2, "UserID": 249, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 275, "Address": "pattarin.vanessche@exxonmobil.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 249, "FirstName": "PATTARIN", "LastName": "VAN ESSCHE", "LanID": "AP\\PRA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 308, "Address": "sm-oncall-otc@outlook.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 308, "Address": "sm-oncall-otc@outlook.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 249, "FirstName": "PATTARIN", "LastName": "VAN ESSCHE", "LanID": "AP\\PRA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 275, "Address": "pattarin.vanessche@exxonmobil.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 249, "FirstName": "PATTARIN", "LastName": "VAN ESSCHE", "LanID": "AP\\PRA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 275, "Address": "pattarin.vanessche@exxonmobil.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 308, "Address": "sm-oncall-otc@outlook.com", "UserID": 249, "GroupUserID": 75, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 99, "GroupID": 2, "UserID": 296, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 365, "Address": "ramiro.c.montana@exxonmobil.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 296, "FirstName": "RAMIRO GASPAR CHAS", "LastName": "MONTANA", "LanID": "sa\\rcmonta", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1476, "Address": "sm-oncall-otc@outlook.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1476, "Address": "sm-oncall-otc@outlook.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 296, "FirstName": "RAMIRO GASPAR CHAS", "LastName": "MONTANA", "LanID": "sa\\rcmonta", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 365, "Address": "ramiro.c.montana@exxonmobil.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 296, "FirstName": "RAMIRO GASPAR CHAS", "LastName": "MONTANA", "LanID": "sa\\rcmonta", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 365, "Address": "ramiro.c.montana@exxonmobil.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1476, "Address": "sm-oncall-otc@outlook.com", "UserID": 296, "GroupUserID": 99, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 101, "GroupID": 2, "UserID": 299, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 368, "Address": "rodrigo.r.vera@exxonmobil.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 299, "FirstName": "RODRIGO RENE VILLALBA", "LastName": "VERA", "LanID": "SA\\rrvera1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 369, "Address": "sm-oncall-otc@outlook.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 369, "Address": "sm-oncall-otc@outlook.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 299, "FirstName": "RODRIGO RENE VILLALBA", "LastName": "VERA", "LanID": "SA\\rrvera1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 368, "Address": "rodrigo.r.vera@exxonmobil.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 299, "FirstName": "RODRIGO RENE VILLALBA", "LastName": "VERA", "LanID": "SA\\rrvera1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 368, "Address": "rodrigo.r.vera@exxonmobil.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 369, "Address": "sm-oncall-otc@outlook.com", "UserID": 299, "GroupUserID": 101, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 113, "GroupID": 2, "UserID": 336, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 425, "Address": "sarun.wongtanakarn1@exxonmobil.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 336, "FirstName": "Sarun", "LastName": "Wongtanakarn", "LanID": "ap\\SWONGT2", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 429, "Address": "sm-oncall-otc@outlook.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 429, "Address": "sm-oncall-otc@outlook.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 336, "FirstName": "Sarun", "LastName": "Wongtanakarn", "LanID": "ap\\SWONGT2", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 425, "Address": "sarun.wongtanakarn1@exxonmobil.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 336, "FirstName": "Sarun", "LastName": "Wongtanakarn", "LanID": "ap\\SWONGT2", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 425, "Address": "sarun.wongtanakarn1@exxonmobil.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 429, "Address": "sm-oncall-otc@outlook.com", "UserID": 336, "GroupUserID": 113, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 115, "GroupID": 2, "UserID": 346, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 436, "Address": "debora.b.adams@exxonmobil.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 346, "FirstName": "DEBORA BUENO", "LastName": "ADAMS", "LanID": "sa\\dbadams", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 452, "Address": "sm-oncall-otc@outlook.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 452, "Address": "sm-oncall-otc@outlook.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 346, "FirstName": "DEBORA BUENO", "LastName": "ADAMS", "LanID": "sa\\dbadams", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 436, "Address": "debora.b.adams@exxonmobil.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 346, "FirstName": "DEBORA BUENO", "LastName": "ADAMS", "LanID": "sa\\dbadams", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 436, "Address": "debora.b.adams@exxonmobil.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 452, "Address": "sm-oncall-otc@outlook.com", "UserID": 346, "GroupUserID": 115, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 116, "GroupID": 2, "UserID": 347, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 437, "Address": "viviane.b.pequeno@exxonmobil.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 347, "FirstName": "VIVIANE BASTOS", "LastName": "PEQUENO", "LanID": "sa\\vbpeque", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 453, "Address": "sm-oncall-otc@outlook.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 453, "Address": "sm-oncall-otc@outlook.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 347, "FirstName": "VIVIANE BASTOS", "LastName": "PEQUENO", "LanID": "sa\\vbpeque", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 437, "Address": "viviane.b.pequeno@exxonmobil.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 347, "FirstName": "VIVIANE BASTOS", "LastName": "PEQUENO", "LanID": "sa\\vbpeque", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 437, "Address": "viviane.b.pequeno@exxonmobil.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 453, "Address": "sm-oncall-otc@outlook.com", "UserID": 347, "GroupUserID": 116, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 117, "GroupID": 2, "UserID": 348, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 438, "Address": "luis.h.kulka@exxonmobil.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 348, "FirstName": "LUIS HENRIQUE", "LastName": "KULKA", "LanID": "sa\\lhkulka", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 454, "Address": "sm-oncall-otc@outlook.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 454, "Address": "sm-oncall-otc@outlook.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 348, "FirstName": "LUIS HENRIQUE", "LastName": "KULKA", "LanID": "sa\\lhkulka", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 438, "Address": "luis.h.kulka@exxonmobil.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 348, "FirstName": "LUIS HENRIQUE", "LastName": "KULKA", "LanID": "sa\\lhkulka", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 438, "Address": "luis.h.kulka@exxonmobil.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 454, "Address": "sm-oncall-otc@outlook.com", "UserID": 348, "GroupUserID": 117, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 118, "GroupID": 2, "UserID": 349, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 439, "Address": "eduardo.m.costa@exxonmobil.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 349, "FirstName": "EDUARDO MIARA", "LastName": "COSTA", "LanID": "sa\\ecosta4", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1478, "Address": "sm-oncall-otc@outlook.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1478, "Address": "sm-oncall-otc@outlook.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 349, "FirstName": "EDUARDO MIARA", "LastName": "COSTA", "LanID": "sa\\ecosta4", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 439, "Address": "eduardo.m.costa@exxonmobil.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 349, "FirstName": "EDUARDO MIARA", "LastName": "COSTA", "LanID": "sa\\ecosta4", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 439, "Address": "eduardo.m.costa@exxonmobil.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1478, "Address": "sm-oncall-otc@outlook.com", "UserID": 349, "GroupUserID": 118, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 121, "GroupID": 2, "UserID": 352, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 441, "Address": "danielle.f.liberato@exxonmobil.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 352, "FirstName": "DANIELLE", "LastName": "FOGACA LIBERATO CAMACHO RIZENTAL", "LanID": "sa\\dflibe1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1477, "Address": "sm-oncall-otc@outlook.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1477, "Address": "sm-oncall-otc@outlook.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 352, "FirstName": "DANIELLE", "LastName": "FOGACA LIBERATO CAMACHO RIZENTAL", "LanID": "sa\\dflibe1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 441, "Address": "danielle.f.liberato@exxonmobil.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 352, "FirstName": "DANIELLE", "LastName": "FOGACA LIBERATO CAMACHO RIZENTAL", "LanID": "sa\\dflibe1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 441, "Address": "danielle.f.liberato@exxonmobil.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1477, "Address": "sm-oncall-otc@outlook.com", "UserID": 352, "GroupUserID": 121, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 122, "GroupID": 2, "UserID": 353, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 442, "Address": "felipe.mollica@exxonmobil.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 353, "FirstName": "FELIPE", "LastName": "MOLLICA", "LanID": "sa\\mfmolli", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1480, "Address": "sm-oncall-otc@outlook.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1480, "Address": "sm-oncall-otc@outlook.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 353, "FirstName": "FELIPE", "LastName": "MOLLICA", "LanID": "sa\\mfmolli", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 442, "Address": "felipe.mollica@exxonmobil.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 353, "FirstName": "FELIPE", "LastName": "MOLLICA", "LanID": "sa\\mfmolli", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 442, "Address": "felipe.mollica@exxonmobil.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1480, "Address": "sm-oncall-otc@outlook.com", "UserID": 353, "GroupUserID": 122, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 123, "GroupID": 2, "UserID": 354, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 443, "Address": "william.brepohl@exxonmobil.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 354, "FirstName": "WILLIAM", "LastName": "BREPOHL", "LanID": "sa\\wbrepoh", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1482, "Address": "sm-oncall-otc@outlook.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1482, "Address": "sm-oncall-otc@outlook.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 354, "FirstName": "WILLIAM", "LastName": "BREPOHL", "LanID": "sa\\wbrepoh", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 443, "Address": "william.brepohl@exxonmobil.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 354, "FirstName": "WILLIAM", "LastName": "BREPOHL", "LanID": "sa\\wbrepoh", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 443, "Address": "william.brepohl@exxonmobil.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1482, "Address": "sm-oncall-otc@outlook.com", "UserID": 354, "GroupUserID": 123, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 124, "GroupID": 2, "UserID": 355, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 444, "Address": "fernanda.f.moreno@exxonmobil.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 355, "FirstName": "Fernanda", "LastName": "Moreno", "LanID": "sa\\ffmoren", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 455, "Address": "sm-oncall-otc@outlook.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 455, "Address": "sm-oncall-otc@outlook.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 355, "FirstName": "Fernanda", "LastName": "Moreno", "LanID": "sa\\ffmoren", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 444, "Address": "fernanda.f.moreno@exxonmobil.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 355, "FirstName": "Fernanda", "LastName": "Moreno", "LanID": "sa\\ffmoren", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 444, "Address": "fernanda.f.moreno@exxonmobil.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 455, "Address": "sm-oncall-otc@outlook.com", "UserID": 355, "GroupUserID": 124, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 125, "GroupID": 2, "UserID": 356, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 445, "Address": "fabio.dinnies@exxonmobil.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 356, "FirstName": "Fabio Dinnies", "LastName": "Santos", "LanID": "sa\\fdinnie", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1483, "Address": "sm-oncall-otc@outlook.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1483, "Address": "sm-oncall-otc@outlook.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 356, "FirstName": "Fabio Dinnies", "LastName": "Santos", "LanID": "sa\\fdinnie", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 445, "Address": "fabio.dinnies@exxonmobil.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 356, "FirstName": "Fabio Dinnies", "LastName": "Santos", "LanID": "sa\\fdinnie", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 445, "Address": "fabio.dinnies@exxonmobil.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1483, "Address": "sm-oncall-otc@outlook.com", "UserID": 356, "GroupUserID": 125, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 126, "GroupID": 2, "UserID": 357, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 446, "Address": "guilherme.s.fascetti@exxonmobil.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 357, "FirstName": "Guilherme", "LastName": "Fascetti", "LanID": "sa\\gsfasce", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1479, "Address": "sm-oncall-otc@outlook.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1479, "Address": "sm-oncall-otc@outlook.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 357, "FirstName": "Guilherme", "LastName": "Fascetti", "LanID": "sa\\gsfasce", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 446, "Address": "guilherme.s.fascetti@exxonmobil.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 357, "FirstName": "Guilherme", "LastName": "Fascetti", "LanID": "sa\\gsfasce", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 446, "Address": "guilherme.s.fascetti@exxonmobil.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1479, "Address": "sm-oncall-otc@outlook.com", "UserID": 357, "GroupUserID": 126, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 128, "GroupID": 2, "UserID": 359, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 448, "Address": "andre.c.lima@exxonmobil.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 359, "FirstName": "Andre", "LastName": "Lima", "LanID": "sa\\aclima1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1481, "Address": "sm-oncall-otc@outlook.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1481, "Address": "sm-oncall-otc@outlook.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 359, "FirstName": "Andre", "LastName": "Lima", "LanID": "sa\\aclima1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 448, "Address": "andre.c.lima@exxonmobil.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 359, "FirstName": "Andre", "LastName": "Lima", "LanID": "sa\\aclima1", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 448, "Address": "andre.c.lima@exxonmobil.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1481, "Address": "sm-oncall-otc@outlook.com", "UserID": 359, "GroupUserID": 128, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 131, "GroupID": 2, "UserID": 362, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 451, "Address": "eduardo.tabatschnic@exxonmobil.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 362, "FirstName": "Eduardo", "LastName": "Tabatschnic", "LanID": "sa\\etabats", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 456, "Address": "sm-oncall-otc@outlook.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 456, "Address": "sm-oncall-otc@outlook.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 362, "FirstName": "Eduardo", "LastName": "Tabatschnic", "LanID": "sa\\etabats", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 451, "Address": "eduardo.tabatschnic@exxonmobil.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 362, "FirstName": "Eduardo", "LastName": "Tabatschnic", "LanID": "sa\\etabats", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 451, "Address": "eduardo.tabatschnic@exxonmobil.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 456, "Address": "sm-oncall-otc@outlook.com", "UserID": 362, "GroupUserID": 131, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 132, "GroupID": 2, "UserID": 363, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 458, "Address": "leticia.l.brito@exxonmobil.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 363, "FirstName": "LETICIA", "LastName": "LAKUS DE BRITO OTTO", "LanID": "sa\\llbrito", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 459, "Address": "sm-oncall-otc@outlook.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 459, "Address": "sm-oncall-otc@outlook.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 363, "FirstName": "LETICIA", "LastName": "LAKUS DE BRITO OTTO", "LanID": "sa\\llbrito", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 458, "Address": "leticia.l.brito@exxonmobil.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 363, "FirstName": "LETICIA", "LastName": "LAKUS DE BRITO OTTO", "LanID": "sa\\llbrito", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 458, "Address": "leticia.l.brito@exxonmobil.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 459, "Address": "sm-oncall-otc@outlook.com", "UserID": 363, "GroupUserID": 132, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 136, "GroupID": 2, "UserID": 1378, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1487, "Address": "sivaporn.homvanish@exxonmobil.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1378, "FirstName": "SIVAPORN", "LastName": "HOMVANISH", "LanID": "AP\\shomvan", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1488, "Address": "sm-oncall-otc@outlook.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1488, "Address": "sm-oncall-otc@outlook.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1378, "FirstName": "SIVAPORN", "LastName": "HOMVANISH", "LanID": "AP\\shomvan", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1487, "Address": "sivaporn.homvanish@exxonmobil.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1378, "FirstName": "SIVAPORN", "LastName": "HOMVANISH", "LanID": "AP\\shomvan", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1487, "Address": "sivaporn.homvanish@exxonmobil.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1488, "Address": "sm-oncall-otc@outlook.com", "UserID": 1378, "GroupUserID": 136, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 137, "GroupID": 2, "UserID": 1379, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1489, "Address": "patthamawan.montasereewong@exxonmobil.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1379, "FirstName": "Patthamawan", "LastName": "Montasereewong", "LanID": "ap\\pmontas", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1490, "Address": "sm-oncall-otc@outlook.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1490, "Address": "sm-oncall-otc@outlook.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1379, "FirstName": "Patthamawan", "LastName": "Montasereewong", "LanID": "ap\\pmontas", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1489, "Address": "patthamawan.montasereewong@exxonmobil.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1379, "FirstName": "Patthamawan", "LastName": "Montasereewong", "LanID": "ap\\pmontas", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1489, "Address": "patthamawan.montasereewong@exxonmobil.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1490, "Address": "sm-oncall-otc@outlook.com", "UserID": 1379, "GroupUserID": 137, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 144, "GroupID": 2, "UserID": 1394, "IsGroupAdministrator": true, "IsEscalationReceiver": true, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": true, "Emails": [{ "EmailID": 1506, "Address": "porntipa.rochanakee@exxonmobil.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1394, "FirstName": "PORNTIPA", "LastName": "ROCHANAKEE", "LanID": "ap\\pro", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1507, "Address": "sm-oncall-otc@outlook.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1507, "Address": "sm-oncall-otc@outlook.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1394, "FirstName": "PORNTIPA", "LastName": "ROCHANAKEE", "LanID": "ap\\pro", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1506, "Address": "porntipa.rochanakee@exxonmobil.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1394, "FirstName": "PORNTIPA", "LastName": "ROCHANAKEE", "LanID": "ap\\pro", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1506, "Address": "porntipa.rochanakee@exxonmobil.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1507, "Address": "sm-oncall-otc@outlook.com", "UserID": 1394, "GroupUserID": 144, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 160, "GroupID": 2, "UserID": 1413, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1528, "Address": "natthakun.kitthaworn@exxonmobil.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1413, "FirstName": "Natthakun", "LastName": "Kitthaworn", "LanID": "ap\\nkittha", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1529, "Address": "sm-oncall-otc@outlook.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1529, "Address": "sm-oncall-otc@outlook.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1413, "FirstName": "Natthakun", "LastName": "Kitthaworn", "LanID": "ap\\nkittha", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1528, "Address": "natthakun.kitthaworn@exxonmobil.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1413, "FirstName": "Natthakun", "LastName": "Kitthaworn", "LanID": "ap\\nkittha", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1528, "Address": "natthakun.kitthaworn@exxonmobil.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1529, "Address": "sm-oncall-otc@outlook.com", "UserID": 1413, "GroupUserID": 160, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 161, "GroupID": 2, "UserID": 1414, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1530, "Address": "jinda.wijaivorakij@exxonmobil.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1414, "FirstName": "JINDA", "LastName": "WIJAIVORAKIJ", "LanID": "ap\\jdw", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1531, "Address": "sm-oncall-otc@outlook.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1531, "Address": "sm-oncall-otc@outlook.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1414, "FirstName": "JINDA", "LastName": "WIJAIVORAKIJ", "LanID": "ap\\jdw", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1530, "Address": "jinda.wijaivorakij@exxonmobil.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1414, "FirstName": "JINDA", "LastName": "WIJAIVORAKIJ", "LanID": "ap\\jdw", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1530, "Address": "jinda.wijaivorakij@exxonmobil.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 1531, "Address": "sm-oncall-otc@outlook.com", "UserID": 1414, "GroupUserID": 161, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 165, "GroupID": 2, "UserID": 1437, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1557, "Address": "aris.hertel@exxonmobil.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1437, "FirstName": "ARIS CRISTIAN", "LastName": "HERTEL", "LanID": "sa\\ahertel", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2603, "Address": "sm-oncall-otc@outlook.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2603, "Address": "sm-oncall-otc@outlook.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1437, "FirstName": "ARIS CRISTIAN", "LastName": "HERTEL", "LanID": "sa\\ahertel", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1557, "Address": "aris.hertel@exxonmobil.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1437, "FirstName": "ARIS CRISTIAN", "LastName": "HERTEL", "LanID": "sa\\ahertel", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1557, "Address": "aris.hertel@exxonmobil.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2603, "Address": "sm-oncall-otc@outlook.com", "UserID": 1437, "GroupUserID": 165, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 166, "GroupID": 2, "UserID": 1438, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 1558, "Address": "reinaldo.camargo@exxonmobil.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 1438, "FirstName": "REINALDO BUENO DE", "LastName": "CAMARGO", "LanID": "sa\\rcamarg", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2602, "Address": "sm-oncall-otc@outlook.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2602, "Address": "sm-oncall-otc@outlook.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 1438, "FirstName": "REINALDO BUENO DE", "LastName": "CAMARGO", "LanID": "sa\\rcamarg", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1558, "Address": "reinaldo.camargo@exxonmobil.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 1438, "FirstName": "REINALDO BUENO DE", "LastName": "CAMARGO", "LanID": "sa\\rcamarg", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 1558, "Address": "reinaldo.camargo@exxonmobil.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2602, "Address": "sm-oncall-otc@outlook.com", "UserID": 1438, "GroupUserID": 166, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 167, "GroupID": 2, "UserID": 2471, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2592, "Address": "icaro.picolo@exxonmobil.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2471, "FirstName": "Icaro", "LastName": "Picolo", "LanID": "sa\\ipicolo", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2593, "Address": "sm-oncall-otc@outlook.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2593, "Address": "sm-oncall-otc@outlook.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 2471, "FirstName": "Icaro", "LastName": "Picolo", "LanID": "sa\\ipicolo", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2592, "Address": "icaro.picolo@exxonmobil.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2471, "FirstName": "Icaro", "LastName": "Picolo", "LanID": "sa\\ipicolo", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2592, "Address": "icaro.picolo@exxonmobil.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2593, "Address": "sm-oncall-otc@outlook.com", "UserID": 2471, "GroupUserID": 167, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 168, "GroupID": 2, "UserID": 2472, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2594, "Address": "lilian.j.souza@exxonmobil.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2472, "FirstName": "LILIAN JOYCE MONTI", "LastName": "SOUZA", "LanID": "sa\\lsouza3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2595, "Address": "sm-oncall-otc@outlook.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2595, "Address": "sm-oncall-otc@outlook.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 2472, "FirstName": "LILIAN JOYCE MONTI", "LastName": "SOUZA", "LanID": "sa\\lsouza3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2594, "Address": "lilian.j.souza@exxonmobil.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2472, "FirstName": "LILIAN JOYCE MONTI", "LastName": "SOUZA", "LanID": "sa\\lsouza3", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2594, "Address": "lilian.j.souza@exxonmobil.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2595, "Address": "sm-oncall-otc@outlook.com", "UserID": 2472, "GroupUserID": 168, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 169, "GroupID": 2, "UserID": 2473, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2596, "Address": "marta.silva@exxonmobil.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2473, "FirstName": "MARTA", "LastName": "Silva", "LanID": "sa\\mrfdsil", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2597, "Address": "sm-oncall-otc@outlook.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2597, "Address": "sm-oncall-otc@outlook.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "User": { "UserID": 2473, "FirstName": "MARTA", "LastName": "Silva", "LanID": "sa\\mrfdsil", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2596, "Address": "marta.silva@exxonmobil.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2473, "FirstName": "MARTA", "LastName": "Silva", "LanID": "sa\\mrfdsil", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2596, "Address": "marta.silva@exxonmobil.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }, { "EmailID": 2597, "Address": "sm-oncall-otc@outlook.com", "UserID": 2473, "GroupUserID": 169, "EmailTypeID": 3, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 173, "GroupID": 2, "UserID": 2515, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2644, "Address": "anusorn.sirisombatyuenyong@exxonmobil.com", "UserID": 2515, "GroupUserID": 173, "EmailTypeID": 1, "Disabled": null, "EmailType": null, "User": { "UserID": 2515, "FirstName": "Anusorn", "LastName": "Sirisombatyuenyong", "LanID": "ap\\ASIRISO", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2515, "FirstName": "Anusorn", "LastName": "Sirisombatyuenyong", "LanID": "ap\\ASIRISO", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2644, "Address": "anusorn.sirisombatyuenyong@exxonmobil.com", "UserID": 2515, "GroupUserID": 173, "EmailTypeID": 1, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 175, "GroupID": 2, "UserID": 2537, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2666, "Address": "jean.p.machado@exxonmobil.com", "UserID": 2537, "GroupUserID": 175, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2537, "FirstName": "JEAN PAULO", "LastName": "MACHADO", "LanID": "SA\\JPMACHA", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2537, "FirstName": "JEAN PAULO", "LastName": "MACHADO", "LanID": "SA\\JPMACHA", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2666, "Address": "jean.p.machado@exxonmobil.com", "UserID": 2537, "GroupUserID": 175, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 176, "GroupID": 2, "UserID": 2538, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2667, "Address": "patricia.saboya@exxonmobil.com", "UserID": 2538, "GroupUserID": 176, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "User": { "UserID": 2538, "FirstName": "PATRICIA SOUZA DE SABOYA", "LastName": "BARBOSA", "LanID": "SA\\PSBARBO", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2538, "FirstName": "PATRICIA SOUZA DE SABOYA", "LastName": "BARBOSA", "LanID": "SA\\PSBARBO", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2667, "Address": "patricia.saboya@exxonmobil.com", "UserID": 2538, "GroupUserID": 176, "EmailTypeID": 1, "Disabled": false, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }, { "GroupUserID": 178, "GroupID": 2, "UserID": 2539, "IsGroupAdministrator": true, "IsEscalationReceiver": false, "IsWorkHourReceiver": true, "IsAcknowledgeResultReceiver": false, "Emails": [{ "EmailID": 2669, "Address": "tiago.m.migliari@exxonmobil.com", "UserID": 2539, "GroupUserID": 178, "EmailTypeID": 1, "Disabled": null, "EmailType": null, "User": { "UserID": 2539, "FirstName": "TIAGO MADUREIRA", "LastName": "MIGLIARI", "LanID": "SA\\TMMIGLI", "TelNumber": null, "UserTypeID": 1, "Emails": [], "GroupUsers": [], "Tickets": [], "UserType": null }, "OutboundEmails": [], "OutboundEmailCCs": [] }], "User": { "UserID": 2539, "FirstName": "TIAGO MADUREIRA", "LastName": "MIGLIARI", "LanID": "SA\\TMMIGLI", "TelNumber": null, "UserTypeID": 1, "Emails": [{ "EmailID": 2669, "Address": "tiago.m.migliari@exxonmobil.com", "UserID": 2539, "GroupUserID": 178, "EmailTypeID": 1, "Disabled": null, "EmailType": null, "OutboundEmails": [], "OutboundEmailCCs": [] }], "GroupUsers": [], "Tickets": [], "UserType": null }, "Schedules": [], "Tickets": [] }], "Products": [], "GroupAliases": []
      };
    }

    this.analystList = [];

    let tempData = new AnalystModel();
    tempData.groupId = 0;
    tempData.name = "Choose Analyst";
    tempData.userId = 0;

    this.analystList = [tempData];
    this.analystSelected = this.analystList[0];

    mockMember.GroupUsers.forEach(i => {

      let data = new AnalystModel();
      data.groupId = i.GroupID;
      data.userId = i.UserID;
      data.name = i.User.FirstName + ' ' + i.User.LastName;
      data.lanId = i.User.LanID;
      data.groupUserID = i.GroupUserID

      i.Emails.forEach(email => {
        if (email.Disabled == false || email.Disabled == null) {
          if (email.EmailTypeID == 1) {
            //companyMail
            data.comEmail = email.Address;
          }
        }

      });

      this.analystList.push(data);

    });

    this.AnalystSelector = [];
    this.analystList.forEach(i => {

      if (i.groupId != 0) {
        let data = new SelectorModel();
        data.id = i.groupUserID;
        data.text = i.name;

        this.AnalystSelector.push(data);
      }
    });

    // console.log('this.AnalystSelector[0]' + JSON.stringify(this.AnalystSelector[0]));
    //init data
    // this.Analyst = [this.AnalystSelector[0]];

    this.isLoadAnalystSelector = true;

    // reset
    this.isLoadAnalystSelector = false;
    setTimeout(() => { this.isLoadAnalystSelector = true; })



    // console.log('analystList' + JSON.stringify(this.analystList));

  }



}
