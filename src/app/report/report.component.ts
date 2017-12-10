import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ReportService } from 'app/report/report.service';
import { TeamsModel } from 'app/models/team/team-list.model';
import { TeamService } from 'app/team/team.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    teamList: any;
    AllTicketsData: any;
    groupIDs: any[] = [];
    defaultEndSQLFormat: string;
    defaultStartSQLFormat: string;
    defaultEnd: any;
    defaultStart: any;
    rangeData: any[];
    sourceCol3: any[];
    sourceCol2: any[];
    sourceCol1: any[];
    startWeek: number;
    endDate: any;
    startDate: any;
    ticketRecords: any[];
    FilterDateTo: Date = null;
    FilterDateFrom: Date = null;

    DateTo: any = null;
    DateFrom: any = null;

    group1: boolean = true;
    group2: boolean = true;
    group3: boolean = true;
    group5: boolean = true;
    group6: boolean = true;
    group7: boolean = true;
    group8: boolean = true;
    group9: boolean = true;

    constructor(
        private _reportService: ReportService,
        private _teamService: TeamService
    ) {
    }

    options: Object;
    Today: string;

    ngOnInit() {
        this.Today = moment(moment().toDate()).format('YYYY-MM-DD');

        //init data
        this.defaultStart = moment().day(-21);
        this.defaultEnd = moment().day(6);
        this.defaultStartSQLFormat = moment(this.defaultStart).format("YYYY-MM-DD");
        this.defaultEndSQLFormat = moment(this.defaultEnd).format("YYYY-MM-DD");

        this.ticketRecords = [];
        this.teamList = [];

       this.getTeams();
        // this.mockTeams();

    }

    mockTeams() {
        //mock test
        let result = [{ "GroupID": 1, "Name": "Retail", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 2, "Name": "OTC", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 3, "Name": "Siebel Technical Services", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 5, "Name": "GPM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 6, "Name": "EDI CS and XCOM", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 7, "Name": "S.W.I.F.T. - Society for Worldwide Interbank Financial Telecommunication", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 8, "Name": "M&S Secondary Distribution", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }, { "GroupID": 9, "Name": "Basis Output and Archiving", "Urgency": "2-High    ", "GroupUsers": [], "Products": [], "GroupAliases": [] }];
        this.teamList = [];
        //prepare data select
        result.forEach(i => {

            let data = new TeamsModel();
            data.groupID = i.GroupID;
            data.name = i.Name;
            data.checked = true;

            this.teamList.push(data);

        });
    }

    getTeams() {
        this._teamService.getTeams().subscribe(
            Response => {
                console.log("Get Teams success!" + JSON.stringify(Response));

                let result = Response;

                this.teamList = [];
                //prepare data select
                result.forEach(i => {

                    let data = new TeamsModel();
                    data.groupID = i.GroupID;
                    data.name = i.Name;
                    data.checked = true;

                    this.teamList.push(data);

                });

                console.log("Teams = " + JSON.stringify(this.teamList));

                this.prepareGroupSelected();
                

            },
            err => {
                console.log("Can't get Teams")
            }
        );
    }

    prepareGroupSelected() {
        this.groupIDs = [];

        this.teamList.forEach(i => {

            if (i.checked) {
                this.groupIDs.push(i.groupID);
            }
        });

        console.log('groupIDs : ' + this.groupIDs);

        this.getTicketsInPeriod();
    }

    changeGroupSelected(index: number, value: boolean) {
        if (index >= 0) {
            this.teamList[index].checked = value;
        }
        // console.log(JSON.stringify(this.teamList));
        // this.prepareGroupSelected();
        // this.getTicketsInPeriod();
    }

    getTicketsInPeriod() {
        this.startWeek = moment(this.defaultStartSQLFormat).week();
        this.startDate = moment(this.defaultStartSQLFormat).day(0);
        this.endDate = moment(this.defaultEndSQLFormat).day(6);
        var ms = moment(this.endDate, "DD/MM/YYYY HH:mm:ss").diff(moment(this.startDate, "DD/MM/YYYY HH:mm:ss"));

        var lengthOfWeek = Math.floor(moment.duration(ms).asMilliseconds() / 604800000);
        var endWeek = this.startWeek + lengthOfWeek;

        this.ticketRecords = [];

        //Looping for writing the annotation(label) for each week in the report
        for (var j = 0; j <= (endWeek - this.startWeek); j++) {
            var weekNumber = j + this.startWeek,
                startWeekDate = moment(this.defaultStartSQLFormat).day(j * 7),
                endWeekDate = moment(this.defaultStartSQLFormat).day(((j + 1) * 7) - 1),
                strDurationDisplay;
            //console.log(startWeekDate);
            if (startWeekDate.year() == endWeekDate.year()) {
                if (startWeekDate.month() == endWeekDate.month()) {
                    strDurationDisplay = startWeekDate.date() + "-" + endWeekDate.date() + startWeekDate.format("MMM YYYY");
                } else {
                    strDurationDisplay = startWeekDate.format("DD MMM") + "-" + endWeekDate.format("DD MMM") + startWeekDate.year();
                }

            }
            else {
                strDurationDisplay = startWeekDate.format("DD MMM YYYY") + "-" + endWeekDate.format("DD MMM YYYY");
            }
            this.ticketRecords.push([strDurationDisplay, 0, 0, 0])
        }

        //Set Text Week
        console.log(JSON.stringify(this.ticketRecords));

        //mock test
        // this.testData();

        console.log(('groupIDs => ' + this.groupIDs));

        this.callTicketsApi(this.defaultStartSQLFormat,this.defaultEndSQLFormat, this.groupIDs);


    }

    callTicketsApi(dataFrom: string, dataTo: string, groupIdList: number[]) {
         console.log('call -> callTicketsApi');
        //Loop Get Api
        let observables = new Array();
        for (let groupId of groupIdList) {
            // console.log('call' + groupId);
            observables.push(this._reportService.getTicketGroup(dataFrom, dataTo, groupId));
        }

        forkJoin(observables).subscribe(results => {
            //[character, characterHomeworld]
            // results[0] is our character
            // results[1] is our character homeworld
            //  console.log(results);
            this.AllTicketsData = [];
            //add results length == groupIdList
            for (var i = 0; i < groupIdList.length; i++) {
                //Set Total of Week : return ticketRecords
                this.prepareDataToChart(results[i]);
            }

            //assign count to chart data
            console.log(this.ticketRecords);

            this.rangeData = [];
            this.sourceCol1 = [];
            this.sourceCol2 = [];
            this.sourceCol3 = [];

            this.ticketRecords.forEach(i => {
                if (i[1] == 0) {
                    i[1] = null;
                }
                if (i[2] == 0) {
                    i[2] = null;
                }
                if (i[3] == 0) {
                    i[3] = null;
                }

                this.rangeData.push(i[0]);
                this.sourceCol1.push(i[1]);
                this.sourceCol2.push(i[2]);
                this.sourceCol3.push(i[3]);
            });

            console.log(this.sourceCol1, this.sourceCol2, this.sourceCol3);

            this.loadChart(this.rangeData, this.sourceCol1, this.sourceCol2, this.sourceCol3);

        });


    };

    prepareDataToChart(data) {
        for (var j = 0; j < data.length; j++) {

            var diff = moment(moment(data[j].SubmittedAt).day(6), "DD/MM/YYYY HH:mm:ss").diff(moment(this.startDate, "DD/MM/YYYY HH:mm:ss"));
            var diffinMS = moment.duration(diff);
            var lengthOfWeek = Math.floor(diffinMS.asMilliseconds() / 604800000);
            var endWeek = this.startWeek + lengthOfWeek;

            var relativeWeekNumber = (endWeek - this.startWeek);
            if (data[j].TimeUsed < 300000) {
                this.ticketRecords[relativeWeekNumber][1] = this.ticketRecords[relativeWeekNumber][1] + 1;
            }
            else if (data[j].TimeUsed < 1800000) {
                this.ticketRecords[relativeWeekNumber][2] = this.ticketRecords[relativeWeekNumber][2] + 1;
            } else {
                this.ticketRecords[relativeWeekNumber][3] = this.ticketRecords[relativeWeekNumber][3] + 1;
            }

            //filter text on table
            let temp = data[j];
            temp.SubmittedAt = moment(temp.SubmittedAt).format('MMMM Do YYYY, h:mm:ss a');

            //change millisec into various unit
            var time = data[j].TimeUsed;
            var x = time / 1000;
            var seconds = x % 60;
            x /= 60;
            var minutes = x % 60;
            x /= 60;
            var hours = x % 24;
            x /= 24;
            var days = x;

            if (time != Infinity) {
                temp.ResponseTime = Math.floor(hours) + " Hrs " + Math.floor(minutes) + " Min " + Math.floor(seconds) + " Sec";
            } else {
                temp.ResponseTime = 'Infinity';
            }

            this.AllTicketsData.push(temp);
        }
    }


    loadChart(yAixName, sourceCol1, sourceCol2, sourceCol3) {
        
        let lengthData = this.sourceCol1.length;
        let heightItem = 65;
        let positionNum = -40;

        if(lengthData == 5){
            heightItem = 50;
            positionNum = -32;
        }
        else if(lengthData == 6){
            heightItem = 37;
            positionNum = -25;
        } 
        else if(lengthData == 7){
            heightItem = 32;
            positionNum = -22;
        } 
        else if(lengthData > 7){
            heightItem = 28;
            positionNum = 0;
        } 
        else if(lengthData > 10){
            heightItem = 12;
            positionNum = 0;
        } 
        else if(lengthData > 13){
            heightItem = 5;
            positionNum = 0;
        } 
        
        
        // if (screen.height > 970) {
        //     heightItem = 65;
        //     positionNum = -40;
        // }
        //init bar chart 
        this.options =
            {
                chart: {
                    type: 'bar',
                    backgroundColor: 'rgba(255, 255, 255, 0.0)'
                },
                title: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                colors: [
                    '#EA675A', '#F6DC71', '#62D894'
                ],
                xAxis: {
                    categories: yAixName,
                    labels: {
                        style: {
                            width: '100px',
                            'min-width': '100px'
                        },
                        useHTML: true
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: null
                    },
                    tickInterval: 20,

                },
                legend: {
                    reversed: true,
                    align: 'left',
                    verticalAlign: 'top',
                    itemMarginBottom: 10,
                    symbolHeight: 20,
                    symbolWidth: 20,
                    symbolRadius: 0,
                    symbolPadding: 10,
                    x: 125,
                    y: 0
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            align: 'center',
                            color: 'black',
                            y: positionNum

                        },
                        pointWidth: heightItem,
                        marginLeft: 0,
                    }
                },
                series: [{
                    name: 'Escalateed',
                    data: sourceCol3 //red
                }, {
                    name: 'Normal acknowledge',
                    data: sourceCol2 //yellow
                }, {
                    name: 'Within 5 minutes',
                    data: sourceCol1 //green
                }]

            };
    }

    testData() {
        //mock
        var a = [{ "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002594", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-10-29T05:46:28.8", "Description": "Impact: Missing data 28 Oct\nRegion: Europe - UK\nDetails: Missing data 28 Oct for", "SubmittedName": "KRIT VICHCHATHORN", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002595", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-10-29T19:18:05.073", "Description": "Impact: NZ CRUSO\nRegion: AP\nDetails: \n\nFile Processing job at 2 am (BKK time) do", "SubmittedName": "PATCHAREE MUANGSUK", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002596", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-10-29T19:41:01.16", "Description": "Impact: AP CRUSO\nRegion: NZ\nDetails: NZ file processing delay after WCM, seems l", "SubmittedName": "CHARIDA PETHYOTHIN", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002597", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-10-30T03:02:30.34", "Description": "Impact: Cannot run OA report for forecast the sales volume to schedule delivery", "SubmittedName": "KRITTIYA LUKCHAROEN", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 243740.0, "IncidentNumber": "SOS000000002599", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-11-05T20:23:03.063", "Description": "Impact: No Cruso file\nRegion: New Zealand\nDetails: NZ Script is not working", "SubmittedName": "VIMIN VAYUMHASUVAN", "SubmittedLName": null, "OncallFName": "Thanyathorn", "OncallLName": "Patanaanunwong" }, { "TimeUsed": 474197.0, "IncidentNumber": "SOS000000002601", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-11-08T19:05:05.503", "Description": "Impact: Cannot run NZ Script_Inv\nRegion: New Zealand\nDetails: Cannot run NZ Scri", "SubmittedName": "VIMIN VAYUMHASUVAN", "SubmittedLName": null, "OncallFName": "TAWATCHAI", "OncallLName": "SONGPATTANASILP" }, { "TimeUsed": 17707.0, "IncidentNumber": "INC000010908974", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-10T16:16:05", "Description": "KULSDT21: The service: \"ExxonMobil Sdt Engine - v1.1.2014.0701\" on KULSDT21.XOMRTL.NET was stopp...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Thanyathorn", "OncallLName": "Patanaanunwong" }, { "TimeUsed": 30263.0, "IncidentNumber": "INC000010908987", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-10T16:36:30", "Description": "KULSDT22: The service: \"ExxonMobil Sdt Engine - v1.1.2014.0701\" on KULSDT22.XOMRTL.NET was stopp...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 1297277.0, "IncidentNumber": "SOS000000002602", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-11T08:09:27.963", "Description": "Impact: NO POS data interfaced into WIM365\nRegion: \nDetails: No data from POS fi", "SubmittedName": "Anunsith Wongkornvanich", "SubmittedLName": null, "OncallFName": "TAWATCHAI", "OncallLName": "SONGPATTANASILP" }, { "TimeUsed": 91030943.0, "IncidentNumber": "INC000010912931", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:39:17", "Description": "HOESDT90B: The service: \"ExxonMobil Ade Service - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 90955910.0, "IncidentNumber": "INC000010912932", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:39:27", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Engine - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was sto...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 90985257.0, "IncidentNumber": "INC000010912952", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:40:07", "Description": "HOESDT90B: The service: \"ExxonMobil Task Runner - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 90979177.0, "IncidentNumber": "INC000010912956", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:40:17", "Description": "HOESDT90B: The service: \"ExxonMobil Thread Balancer Service - v1.1.2014.0701\" on HOESDT90B.NA.XO...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 90971507.0, "IncidentNumber": "INC000010912959", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:40:27", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Data Relay Server - v1.1.2014.0701\" on HOESDT90B.NA.XOM....", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 90959693.0, "IncidentNumber": "INC000010912972", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-12T13:41:07", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Interface Host Service - v1.1.2014.0701\" on HOESDT90B.NA...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 2470360.0, "IncidentNumber": "INC000010915011", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:08", "Description": "HOESDT90A: The service: \"ExxonMobil Sdt Engine - v1.1.2014.0701\" on HOESDT90A.NA.XOM.com was sto...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 2485253.0, "IncidentNumber": "INC000010915010", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:10", "Description": "HOESDT90A: The service: \"ExxonMobil Thread Balancer Service - v1.1.2014.0701\" on HOESDT90A.NA.XO...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 2492673.0, "IncidentNumber": "INC000010915012", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:19", "Description": "HOESDT90A: The service: \"ExxonMobil Ade Service - v1.1.2014.0701\" on HOESDT90A.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 2571580.0, "IncidentNumber": "INC000010915013", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:19", "Description": "HOESDT90A: The service: \"ExxonMobil Sdt Interface Host Service - v1.1.2014.0701\" on HOESDT90A.NA...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Madhuri", "OncallLName": "Patil-Dasur" }, { "TimeUsed": 2631317.0, "IncidentNumber": "INC000010915014", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:23", "Description": "HOESDT90A: The service: \"ExxonMobil Sdt Data Relay Server - v1.1.2014.0701\" on HOESDT90A.NA.XOM....", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": 2627803.0, "IncidentNumber": "INC000010915015", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-13T15:01:33", "Description": "HOESDT90A: The service: \"ExxonMobil Task Runner - v1.1.2014.0701\" on HOESDT90A.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002603", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-11-13T16:31:35.033", "Description": "Impact: \nRegion: \nDetails: Testing SOS. please ignore", "SubmittedName": "Madhuri Patil-Dasur", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934028", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T04:46:54", "Description": "HOESDT90B: The service: \"ExxonMobil Thread Balancer Service - v1.1.2014.0701\" on HOESDT90B.NA.XO...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934029", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T04:49:05", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Data Relay Server - v1.1.2014.0701\" on HOESDT90B.NA.XOM....", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934031", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T04:52:05", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Engine - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was sto...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934032", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T04:54:16", "Description": "HOESDT90B: The service: \"ExxonMobil Sdt Interface Host Service - v1.1.2014.0701\" on HOESDT90B.NA...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934033", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T04:56:16", "Description": "HOESDT90B: The service: \"ExxonMobil Ade Service - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010933921", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T05:03:21", "Description": "HOESDT90B: The service: \"ExxonMobil Task Runner - v1.1.2014.0701\" on HOESDT90B.NA.XOM.com was st...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002608", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-11-19T08:03:23.837", "Description": "Impact: \nRegion: \nDetails: Testing SOS please ignore", "SubmittedName": "Madhuri Patil-Dasur", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002610", "GroupName": "Retail", "ProductName": "Site Data Transfer", "SubmittedAt": "2017-11-19T18:56:15.83", "Description": "Impact: Pricing in Germany Retail due to SDT\nRegion: Retail\nDetails: Need urgent", "SubmittedName": "LOIC GERARD", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 3324313.0, "IncidentNumber": "SOS000000002611", "GroupName": "Retail", "ProductName": "CRUSO", "SubmittedAt": "2017-11-23T08:39:21.567", "Description": "Impact: no sales data in CRUSO\nRegion: UK\nDetails: no relevant data since yester", "SubmittedName": "VIKTOR METZ", "SubmittedLName": null, "OncallFName": "Douglas", "OncallLName": "Kreitlov" }];
        var b = [{ "TimeUsed": "Infinity", "IncidentNumber": "INC000010875796", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Order Processing", "SubmittedAt": "2017-10-29T05:38:12", "Description": "UC4MON - GAPJ3/110 - JSF: 010032 - Identifier: YVOILSHL_OUT - Host Name: DALEPCV1", "SubmittedName": "Johnsi Manohar", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010886013", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Order Processing", "SubmittedAt": "2017-11-01T22:23:39", "Description": "UC4MON - GAPJ3/110 - JSF: 0252749 - Identifier: YVOINVTY - Host Name: EUPA", "SubmittedName": "Depak Ram Ramamoorthy", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 144603.0, "IncidentNumber": "INC000010889689", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Invoicing", "SubmittedAt": "2017-11-03T04:31:31", "Description": "UC4MON - GAPJ3/110 - JSF: 0253170 - Identifier: FIT_TO_SAP - Host Name: DALEPFEU", "SubmittedName": "Vasavi Pathipati", "SubmittedLName": null, "OncallFName": "Nipat", "OncallLName": "Leelapanya" }, { "TimeUsed": 91390.0, "IncidentNumber": "INC000010890075", "GroupName": "OTC", "ProductName": "STRIPES NA OTC Order Processing", "SubmittedAt": "2017-11-03T10:09:11", "Description": "UC4MON - GBPJ3/202 - JSF: 0230734 - Identifier: OF03 TAS - Host Name: DALEPFAM", "SubmittedName": "Ravi K Notam", "SubmittedLName": null, "OncallFName": "Nipat", "OncallLName": "Leelapanya" }, { "TimeUsed": 101273.0, "IncidentNumber": "INC000010890298", "GroupName": "OTC", "ProductName": "STRIPES NA OTC Order Processing", "SubmittedAt": "2017-11-03T12:42:38", "Description": "UC4MON - GBPJ3/202 - JSF: 0230734 - Identifier: OF03 TAS - Host Name: DALEPFAM", "SubmittedName": "Ramakrishna Mallula", "SubmittedLName": null, "OncallFName": "LILIAN JOYCE MONTI", "OncallLName": "SOUZA" }, { "TimeUsed": 1131526.0, "IncidentNumber": "SOS000000002598", "GroupName": "OTC", "ProductName": "Automated Customer Interface", "SubmittedAt": "2017-11-03T15:51:13.567", "Description": "Impact: ACI Down for Customers - Colombia\nRegion: AMS\nDetails: Please your help", "SubmittedName": "Willian Fabiano Benetti Barbosa", "SubmittedLName": null, "OncallFName": "LILIAN JOYCE MONTI", "OncallLName": "SOUZA" }, { "TimeUsed": 170470.0, "IncidentNumber": "INC000010893259", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Order Processing", "SubmittedAt": "2017-11-04T10:17:38", "Description": "UC4MON - GAPJ3/110 - JSF: 0010050 - Identifier: YVOILLDD_SH - Host Name: EUPA", "SubmittedName": "Ravi K Notam", "SubmittedLName": null, "OncallFName": "Nipat", "OncallLName": "Leelapanya" }, { "TimeUsed": 1531423.0, "IncidentNumber": "SOS000000002600", "GroupName": "OTC", "ProductName": "Advanced Customer Experience", "SubmittedAt": "2017-11-07T19:38:28.257", "Description": "Impact: \nRegion: NZ/ Fiji\nDetails: a large number of customer cannot enter the d", "SubmittedName": "CHANANTHORN THIUSATHIEN", "SubmittedLName": null, "OncallFName": "RODRIGO RENE VILLALBA", "OncallLName": "VERA" }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010912694", "GroupName": "OTC", "ProductName": "STRIPES NA OTC Customer Accounting", "SubmittedAt": "2017-11-12T20:53:12", "Description": "UC4MON - GBPJ3/202 - JSF: 0270575 - Identifier: UDR16 sun - Host Name: DALEPFAM", "SubmittedName": "Ranjith Rajendiren", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002604", "GroupName": "OTC", "ProductName": "STRIPES AS OTC Order Processing", "SubmittedAt": "2017-11-14T16:43:08.227", "Description": "Impact: High\nRegion: Curitiba, Brazil \nDetails: Some users can not process order", "SubmittedName": "AUGUSTTINE ARIANE ROLIM CAMPOS", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010919131", "GroupName": "Siebel Technical Services", "ProductName": "Advanced Customer Experience", "SubmittedAt": "2017-11-14T16:58:13", "Description": "DALAPP203: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002605", "GroupName": "OTC", "ProductName": "STRIPES AS OTC Invoicing", "SubmittedAt": "2017-11-15T02:53:37.73", "Description": "Impact: Automatic plants\nRegion: Colombia\nDetails: Unable to print all plants fr", "SubmittedName": "Marcelo De Souza Lopes", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010922102", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Pricing", "SubmittedAt": "2017-11-15T16:54:57", "Description": "UC4MON - GAPJ3/110 - JSF: 0268358 - Identifier: MS01_IRAMPEU - Host Name: DALEPFEU", "SubmittedName": "Satyanarayana  KATTA", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002606", "GroupName": "OTC", "ProductName": "STRIPES AS OTC Order Processing", "SubmittedAt": "2017-11-15T21:08:41.717", "Description": "Impact: 49552 License unable to apply during order creation\nRegion: Fiji 4542\nDe", "SubmittedName": "SKYWAN TANTHITIWAT", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010923778", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Order Processing", "SubmittedAt": "2017-11-16T06:05:24", "Description": "UC4MON - GAPJ3/110 - JSF: 0270250 - Identifier: YVOILLDD_PU - Host Name: EUPA", "SubmittedName": "Suryakala Venkatakrishnan", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002607", "GroupName": "OTC", "ProductName": "Advanced Customer Experience", "SubmittedAt": "2017-11-18T03:22:52.473", "Description": "Impact: Order can't be created via ACE back office\nRegion: AP\nDetails: DCP can't", "SubmittedName": "CHOMNAPHAS SASIRAWUTH", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934817", "GroupName": "OTC", "ProductName": "STRIPES SEA OTC Pricing", "SubmittedAt": "2017-11-19T08:32:57", "Description": "UC4MON - GAPJ3/104 - JSF: 0266655 - Identifier: XK15SIF - Host Name: DALEPFAP", "SubmittedName": "Suryakala Venkatakrishnan", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "SOS000000002609", "GroupName": "OTC", "ProductName": "STRIPES NA OTC Customer Accounting", "SubmittedAt": "2017-11-19T17:22:47.257", "Description": "Impact: Urgent\nRegion: NA\nDetails: FDCS file is not present in \\\\dalepfam\\AMP$\\i", "SubmittedName": "Scott Crossan", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010940072", "GroupName": "OTC", "ProductName": "STRIPES NA OTC Customer Accounting", "SubmittedAt": "2017-11-20T03:35:52", "Description": "Event  EVENT.R3.9100.OC.0233190.I.FB01_FDCS_INTERFACE.MAIN.WEEKEND  blocked andGBPJ3/202", "SubmittedName": "Venkat Mallidi", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010940175", "GroupName": "OTC", "ProductName": "STRIPES EU OTC Invoicing", "SubmittedAt": "2017-11-20T04:33:53", "Description": "UC4MON - GAPJ3/110 - JSF: 0253170 - Identifier: FIT_TO_SAP - Host Name: DALEPFEU", "SubmittedName": "Suryakala Venkatakrishnan", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 755377.0, "IncidentNumber": "INC000010939991", "GroupName": "Siebel Technical Services", "ProductName": "Advanced Customer Experience", "SubmittedAt": "2017-11-22T07:29:30", "Description": "DALAPP188: DALAPP188.NA.XOM.com: Disk C: is over 90.00% of its capacity", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Petra", "OncallLName": "Balog" }, { "TimeUsed": 755750.0, "IncidentNumber": "INC000010933820", "GroupName": "Siebel Technical Services", "ProductName": "Advanced Customer Experience", "SubmittedAt": "2017-11-22T07:29:31", "Description": "DALAPP188: DALAPP188.NA.XOM.com: Disk C: is over 90.00% of its capacity", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Petra", "OncallLName": "Balog" }, { "TimeUsed": 73773.0, "IncidentNumber": "INC000010948694", "GroupName": "OTC", "ProductName": "SAP Suite", "SubmittedAt": "2017-11-22T08:41:36", "Description": "NAG GEMS: OTC: <Enter brief problem description>", "SubmittedName": "Vitor S Salvador", "SubmittedLName": null, "OncallFName": "SIVAPORN", "OncallLName": "HOMVANISH" }, { "TimeUsed": 128580.0, "IncidentNumber": "INC000010949718", "GroupName": "OTC", "ProductName": "STRIPES AS OTC Order Processing", "SubmittedAt": "2017-11-22T16:21:11", "Description": "UC4MON - GBPJ3/207 - JSF: 0040140 - Identifier: ORD_CONT_DWN", "SubmittedName": "Ravi K Notam", "SubmittedLName": null, "OncallFName": "EDUARDO MIARA", "OncallLName": "COSTA" }, { "TimeUsed": 418764.0, "IncidentNumber": "SOS000000002612", "GroupName": "OTC", "ProductName": "STRIPES AS OTC Order Processing", "SubmittedAt": "2017-11-23T13:42:59.773", "Description": "Impact: for testing\nRegion: for testing\nDetails: for testing", "SubmittedName": "Krichpas Khumthanom", "SubmittedLName": null, "OncallFName": "EDUARDO MIARA", "OncallLName": "COSTA" }]
        var c = [{ "TimeUsed": "Infinity", "IncidentNumber": "INC000010875055", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-10-29T00:13:32", "Description": "DALAPP203: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010875057", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-10-29T00:16:33", "Description": "DALAPP202: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010875194", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-10-29T01:54:18", "Description": "DALAPP189: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010879885", "GroupName": "Siebel Technical Services", "ProductName": "Global Marine Business (GMB)", "SubmittedAt": "2017-10-31T01:21:55", "Description": "DALOPAC2B: Service \"siebsrvr_siebelprd_dalopav2\" state STOPPED, disrupted more than 5m, descript...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 1029680.0, "IncidentNumber": "INC000010894803", "GroupName": "Siebel Technical Services", "ProductName": "Downstream Value Chain-Transactional Data Transparency", "SubmittedAt": "2017-11-05T14:38:45", "Description": "CRM data not available for 11/4 in the oracle tables.", "SubmittedName": "Sreepraveena Vogety", "SubmittedLName": null, "OncallFName": "NAPAT", "OncallLName": "AMPHAIPHAN" }, { "TimeUsed": 951180.0, "IncidentNumber": "INC000010897005", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-06T17:38:51", "Description": "DALAPP201: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Roberto", "OncallLName": "Piccoli" }, { "TimeUsed": 967697.0, "IncidentNumber": "INC000010900708", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-07T18:43:35", "Description": "DALAPP203: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Roberto", "OncallLName": "Piccoli" }, { "TimeUsed": 687337.0, "IncidentNumber": "INC000010900710", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-07T18:48:22", "Description": "DALAPP188: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Roberto", "OncallLName": "Piccoli" }, { "TimeUsed": 44320.0, "IncidentNumber": "INC000010902677", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-08T10:44:22", "Description": "DALAPP202: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "NAPAT", "OncallLName": "AMPHAIPHAN" }, { "TimeUsed": 985597.0, "IncidentNumber": "INC000010903622", "GroupName": "EDI CS and XCOM", "ProductName": "N/A", "SubmittedAt": "2017-11-08T18:33:54", "Description": "dalepcc1b:XOM XCOM Xcomdsrv is not running -- Service xcomdsrv is not running on dalepcc1b.NA.X", "SubmittedName": "Automation BAO Service Account", "SubmittedLName": null, "OncallFName": "RAFAEL GOMES", "OncallLName": "FERNANDES" }, { "TimeUsed": 1061173.0, "IncidentNumber": "INC000010905196", "GroupName": "Siebel Technical Services", "ProductName": "Siebel CRM", "SubmittedAt": "2017-11-09T15:48:52", "Description": "HOEAPP462: HOEAPP462.NA.XOM.com: Disk C: is over 90.00% of its capacity", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Roberto", "OncallLName": "Piccoli" }, { "TimeUsed": 171426487.0, "IncidentNumber": "INC000010911342", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:17:59", "Description": "DALGPD81: Service \"siebsrvr_siebelprd_prdsiebd01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171408067.0, "IncidentNumber": "INC000010911343", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:18:19", "Description": "DALGPA89: Service \"siebsrvr_siebelprd_prdsieba09\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171389503.0, "IncidentNumber": "INC000010911344", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:18:39", "Description": "DALGPA81: Service \"siebsrvr_siebelprd_prdsieba01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171370833.0, "IncidentNumber": "INC000010911345", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:18:59", "Description": "DALGPA86: Service \"siebsrvr_siebelprd_prdsieba06\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171362177.0, "IncidentNumber": "INC000010911346", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:19:09", "Description": "DALGPAC80B: Service \"siebsrvr_siebelprd_DALGPAV80\" state STOPPED, disrupted more than 5m, descri...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171363440.0, "IncidentNumber": "INC000010911347", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:19:09", "Description": "DALGPA84: Service \"siebsrvr_siebelprd_prdsieba04\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171355160.0, "IncidentNumber": "INC000010911348", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:19:19", "Description": "DALGPA88: Service \"siebsrvr_siebelprd_prdsieba08\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171346440.0, "IncidentNumber": "INC000010911349", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:19:29", "Description": "DALGPA83: Service \"siebsrvr_siebelprd_prdsieba03\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171337753.0, "IncidentNumber": "INC000010911350", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:19:39", "Description": "DALGPA87: Service \"siebsrvr_siebelprd_prdsieba07\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171229003.0, "IncidentNumber": "INC000010911351", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:21:29", "Description": "DALGPD82: Service \"siebsrvr_siebelprd_prdsiebd02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171229380.0, "IncidentNumber": "INC000010911352", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:21:30", "Description": "DALGPA82: Service \"siebsrvr_siebelprd_prdsieba02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": 171201160.0, "IncidentNumber": "INC000010911353", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-11T15:22:00", "Description": "DALGPA85: Service \"siebsrvr_siebelprd_prdsieba05\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "TAM�S", "OncallLName": "N�METH" }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010919300", "GroupName": "Siebel Technical Services", "ProductName": "VMware Virtual Platform", "SubmittedAt": "2017-11-14T20:27:08", "Description": "DALAPP189: SMS connection failure due to proxy issue", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931233", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T16:05:52", "Description": "DALAPP201: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931235", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T16:08:03", "Description": "DALAPP203: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931236", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T16:08:46", "Description": "DALAPP189: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931237", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T16:09:06", "Description": "DALAPP188: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, {
            "TimeUsed": "Infinity", "IncidentNumber": "INC000010931238", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T16:09:19", "Description": "DALAPP202: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null,
            "OncallFName": null, "OncallLName": null
        },
        {
            "TimeUsed": "Infinity", "IncidentNumber": "INC000010931156", "GroupName": "Siebel Technical Services", "ProductName": "N/A",
            "SubmittedAt": "2017-11-18T17:05:24", "Description": "DALGPA82: Service \"siebsrvr_siebelprd_prdsieba02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null
        }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931157", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:05:24", "Description": "DALGPD82: Service \"siebsrvr_siebelprd_prdsiebd02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931158", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:05:53", "Description": "DALGPA85: Service \"siebsrvr_siebelprd_prdsieba05\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931159", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:06:04", "Description": "DALGPD81: Service \"siebsrvr_siebelprd_prdsiebd01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931160", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:06:44", "Description": "DALGPA84: Service \"siebsrvr_siebelprd_prdsieba04\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931161", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:07:04", "Description": "DALGPAC80B: Service \"siebsrvr_siebelprd_DALGPAV80\" state STOPPED, disrupted more than 5m, descri...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931162", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:07:14", "Description": "DALGPA83: Service \"siebsrvr_siebelprd_prdsieba03\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931163", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:07:24", "Description": "DALGPA88: Service \"siebsrvr_siebelprd_prdsieba08\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931164", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:07:34", "Description": "DALGPA87: Service \"siebsrvr_siebelprd_prdsieba07\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931165", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:10:24", "Description": "DALGPA89: Service \"siebsrvr_siebelprd_prdsieba09\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931166", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:10:45", "Description": "DALGPA81: Service \"siebsrvr_siebelprd_prdsieba01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931167", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T17:10:55", "Description": "DALGPA86: Service \"siebsrvr_siebelprd_prdsieba06\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931112", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T18:44:04", "Description": "DALOPA03: Service \"siebsrvr_siebelprd_dalopa03\" state STOPPED, disrupted more than 5m, descripti...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931292", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T18:53:36", "Description": "DALOPA02: Service \"siebsrvr_siebelprd_dalopa02\" state STOPPED, disrupted more than 5m, descripti...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931294", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T18:54:06", "Description": "DALOPA01: Service \"siebsrvr_siebelprd_dalopa01\" state STOPPED, disrupted more than 5m, descripti...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931297", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T18:59:07", "Description": "DALOPAC2A: Service \"siebsrvr_siebelprd_dalopav2\" state STOPPED, disrupted more than 5m, descript...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931223", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:11:49", "Description": "DALGPA86: Service \"siebsrvr_siebelprd_prdsieba06\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931222", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:11:50", "Description": "DALGPA81: Service \"siebsrvr_siebelprd_prdsieba01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931224", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:12:00", "Description": "DALGPAC80B: Service \"siebsrvr_siebelprd_DALGPAV80\" state STOPPED, disrupted more than 5m, descri...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931225", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:14:32", "Description": "DALGPA82: Service \"siebsrvr_siebelprd_prdsieba02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931226", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:14:42", "Description": "DALGPD82: Service \"siebsrvr_siebelprd_prdsiebd02\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931227", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:14:52", "Description": "DALGPA85: Service \"siebsrvr_siebelprd_prdsieba05\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931728", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:15:02", "Description": "DALGPD81: Service \"siebsrvr_siebelprd_prdsiebd01\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931729", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:15:22", "Description": "DALGPA89: Service \"siebsrvr_siebelprd_prdsieba09\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931730", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:15:52", "Description": "DALGPA84: Service \"siebsrvr_siebelprd_prdsieba04\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931732", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:16:12", "Description": "DALGPA83: Service \"siebsrvr_siebelprd_prdsieba03\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931733", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:16:32", "Description": "DALGPA88: Service \"siebsrvr_siebelprd_prdsieba08\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010931734", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-18T21:16:32", "Description": "DALGPA87: Service \"siebsrvr_siebelprd_prdsieba07\" state STOPPED, disrupted more than 5m, descrip...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934349", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T06:52:18", "Description": "DALAPP202: SMS connection failure due to proxy issue", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010934178", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T07:21:20", "Description": "DALGPAC80A: Service \"siebsrvr_siebelprd_DALGPAV80\" state STOPPED, disrupted more than 5m, descri...", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936270", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T15:09:39", "Description": "DALAPP202: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936278", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T15:11:59", "Description": "DALAPP189: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936279", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T15:13:39", "Description": "DALAPP203: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936283", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T15:18:25", "Description": "DALAPP188: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936284", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T15:18:45", "Description": "DALAPP201: DB time out", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010936820", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-19T17:51:11", "Description": "DALAPP203: SMS connection failure due to proxy issue", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": "Infinity", "IncidentNumber": "INC000010940228", "GroupName": "EDI CS and XCOM", "ProductName": "N/A", "SubmittedAt": "2017-11-20T03:41:49", "Description": "dalepcc1b:XOM XCOM Xcomdsrv is not running -- Service xcomdsrv is not running on dalepcc1b.NA.X", "SubmittedName": "Automation BAO Service Account", "SubmittedLName": null, "OncallFName": null, "OncallLName": null }, { "TimeUsed": 1180257.0, "IncidentNumber": "INC000010947106", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-21T21:03:40", "Description": "DALAPP189: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Gabor", "OncallLName": "Dioszegi" }, { "TimeUsed": 1167710.0, "IncidentNumber": "INC000010947107", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-21T21:03:59", "Description": "DALAPP188: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Gabor", "OncallLName": "Dioszegi" }, { "TimeUsed": 1026037.0, "IncidentNumber": "INC000010947108", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-21T21:05:56", "Description": "DALAPP201: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Gabor", "OncallLName": "Dioszegi" }, { "TimeUsed": 219663.0, "IncidentNumber": "INC000010947363", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-21T21:19:29", "Description": "DALAPP202: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Gabor", "OncallLName": "Dioszegi" }, { "TimeUsed": 801927.0, "IncidentNumber": "INC000010947688", "GroupName": "Siebel Technical Services", "ProductName": "N/A", "SubmittedAt": "2017-11-21T21:48:03", "Description": "DALAPP203: Hybris Service has stop running.", "SubmittedName": "ESM/E2E OPENVIEW", "SubmittedLName": null, "OncallFName": "Gabor", "OncallLName": "Dioszegi" }]

        let LoopData = [];
        LoopData.push(a);
        LoopData.push(b);
        LoopData.push(c);

        this.AllTicketsData = [];

        for (var i = 0; i < LoopData.length; i++) {
            var data = LoopData[i];


            for (var j = 0; j < data.length; j++) {
                //['Week1', 60, 24, '']
                //var weekNumber = moment(data[j].SubmittedAt).week();
                //startDate =  moment(this.defaultStartSQLFormat).day(0)
                // var diff = moment(moment(data[j].SubmittedAt).day(6), "DD/MM/YYYY HH:mm:ss").diff(moment(this.startDate, "DD/MM/YYYY HH:mm:ss"));
                // var diffinMS = moment.duration(diff);
                // var lengthOfWeek = Math.floor(diffinMS.asMilliseconds() / 604800000);
                // var endWeek = this.startWeek + lengthOfWeek;

                // var relativeWeekNumber = (endWeek - this.startWeek) + 1;
                // console.log(relativeWeekNumber);
                // if (data[j].TimeUsed < 300000) {
                //     this.ticketRecords[relativeWeekNumber][1] = this.ticketRecords[relativeWeekNumber][1] + 1;
                // }
                // else if (data[j].TimeUsed < 1800000) {
                //     this.ticketRecords[relativeWeekNumber][2] = this.ticketRecords[relativeWeekNumber][2] + 1;
                // } else {
                //     this.ticketRecords[relativeWeekNumber][3] = this.ticketRecords[relativeWeekNumber][3] + 1;
                // }

                //filter text on table
                let temp = data[j];
                temp.SubmittedAt = moment(temp.SubmittedAt).format('MMMM Do YYYY, h:mm:ss a');

                //change millisec into various unit
                var time = data[j].TimeUsed;
                var x = time / 1000;
                var seconds = x % 60;
                x /= 60;
                var minutes = x % 60;
                x /= 60;
                var hours = x % 24;
                x /= 24;
                var days = x;

                if (time != Infinity) {
                    temp.ResponseTime = Math.floor(hours) + " Hrs " + Math.floor(minutes) + " Min " + Math.floor(seconds) + " Sec";
                } else {
                    temp.ResponseTime = 'Infinity';
                }

                this.AllTicketsData.push(temp);
            }

        }

        console.log(this.ticketRecords);
        console.log(this.AllTicketsData);

        this.rangeData = [];
        this.sourceCol1 = [];
        this.sourceCol2 = [];
        this.sourceCol3 = [];

        //mock up
        this.ticketRecords = [
            ["12-18Nov 2017", 18, 7, 0],
            ["19-25Nov 2017", 13, 6, 1],
            ["26 Nov-02 Dec2017", 36, 20, 8],
            ["3-9Dec 2017", 13, 10, 32]
            // ];
            , ["3-9Dec 2017", 0, 0, 25]];

        this.ticketRecords.forEach(i => {
            if (i[1] == 0) {
                i[1] = null;
            }
            if (i[2] == 0) {
                i[2] = null;
            }
            if (i[3] == 0) {
                i[3] = null;
            }

            this.rangeData.push(i[0]);
            this.sourceCol1.push(i[1]);
            this.sourceCol2.push(i[2]);
            this.sourceCol3.push(i[3]);
        });

        console.log(this.sourceCol1, this.sourceCol2, this.sourceCol3);

        this.loadChart(this.rangeData, this.sourceCol1, this.sourceCol2, this.sourceCol3);
    }

    selectedStartDate() {
        //seleect StartDate
        if (this.FilterDateFrom != null && this.FilterDateTo != null) {
            this.DateFrom = moment(this.FilterDateFrom).format("YYYY-MM-DD");
            this.DateTo = moment(this.FilterDateTo).format("YYYY-MM-DD");

            if (moment(this.DateFrom).isValid() && moment(this.DateFrom).isValid() && this.DateTo >= this.DateFrom) {
                //alert(endDate);

                this.defaultStartSQLFormat = this.DateFrom;
                this.defaultEndSQLFormat = this.DateTo;

                // console.log(this.defaultStartSQLFormat + ':' + this.defaultEndSQLFormat);
                this.getTicketsInPeriod();
            }


        }



    }

    exportDataToExcel() {

        var head = ['IncidentNumber', 'User', 'Oncall', 'Products', 'Group', 'Date Submitted','Response time','Description'];
        var data = [];
        this.AllTicketsData.forEach(item => {
            let dataJson = {
                IncidentNumber: item.IncidentNumber,
                User: item.SubmittedName,
                Oncall: item.OncallFName,
                Products: item.ProductName,
                Group: item.GroupName,
                DateSubmitted: item.SubmittedAt,
                Responsetime: item.ResponseTime,
                Description:item.Description
            };

            data.push(dataJson);
        });

        new Angular2Csv(data, 'sos_ticket_details', { headers: (head) });

    }



}
