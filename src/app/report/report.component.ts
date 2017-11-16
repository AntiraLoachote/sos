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
          categories: ['8-14 Oct 2017', '15-21 Oct 2017', '22-28 Oct 2017', '29 Oct - 04 Nov 2017']
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
                  y: -50

              },
              pointWidth: 80,
              marginLeft: 0,
          }
      },
      series: [{
          name: 'Escalateed',
          data: [1, 8 ,32,4]
      }, {
          name: 'Normal acknowledge',
          data: [5, 20,10,null]
      }, {
          name: 'Within 5 minutes',
          data: [13, 36,13,null]
      }]
      
    };
  }

}
