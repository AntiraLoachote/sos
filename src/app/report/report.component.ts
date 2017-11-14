import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor() { 
  }

  options: Object;
  
  ngOnInit() {
    //init bar chart 
    this.options = 
    {
      chart: {
        type: 'bar',
        backgroundColor:'rgba(255, 255, 255, 0.0)'
      },
      title: {
          text: null
      },
      credits: {
          enabled: false
      },
      colors: [
        '#EA675A','#F6DC71','#62D894'
        ],
      xAxis: {
          categories: ['17-23 Sep 2017', '24-30 Sep 2017']
      },
      yAxis: {
          min: 0,
          title: {
              text: null
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true,
                  align: 'center',
                  color: 'black',
                  y: -80

              },
              pointWidth: 130,
              marginLeft: 0,
          }
      },
      series: [{
          name: 'Escalateed',
          data: [7, 2]
      }, {
          name: 'Normal acknowledge',
          data: [5, 1]
      }, {
          name: 'Within 5 minutes',
          data: [2, 1]
      }]
      
    };
  }

}
