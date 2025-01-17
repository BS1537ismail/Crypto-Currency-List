import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyService } from '../../service/currency.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from "chart.js";
@Component({
  selector: 'app-coin-details',
  standalone: false,
  
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss'
})
export class CoinDetailsComponent implements OnInit{
      coinData:any;
      coinId !: string;
      days : number = 1;
      currency : string = "BDT";
      public lineChartData: ChartConfiguration['data'] = {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Price Trends',
            borderColor: '#009688',
            pointBackgroundColor:'#009688',
            pointBorderColor:'#009688',
            backgroundColor: 'rgba(148,159,177,0.2)',
            pointHoverBackgroundColor:'#009688',
            pointHoverBorderColor:'#009688'
          }
        ]
      };
      public lineChartOptions: ChartConfiguration['options'] = {
        elements:{
          point:{
            radius:1
          }
        },
        plugins:{
          legend:{display:true},
        }
      };
      public lineChartType: ChartType = 'line';
      @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

      constructor(private api : ApiService, private currencyService:CurrencyService, private activateRoute : ActivatedRoute){

      }
      ngOnInit(): void{
        this.activateRoute.params.subscribe(val => {
          this.coinId = val['id'];
        });
        this.getCoinData();
        this.getGraphData(this.days);
        this.currencyService.getCurrency()
        .subscribe(val=>{
          this.currency = val;
          this.getGraphData(this.days);
          this.getCoinData();
        })
      }
      
      getCoinData(){
        this.api.getCurrencyById(this.coinId)
        .subscribe(val=>{
          console.log(val);
          val.market_data.current_price.bdt = val.market_data.current_price.bdt;
          val.market_data.market_cap.bdt = val.market_data.market_cap.bdt;
          if(this.currency === "USD"){
            val.market_data.current_price.bdt = val.market_data.current_price.usd;
            val.market_data.market_cap.bdt = val.market_data.market_cap.usd;
          }
          this.coinData = val;
        })
      };
      getGraphData(days: number){
        this.days = days;
        this.api.getGraphicalCurrencyData(this.coinId,this.currency, this.days)
        .subscribe(val =>{
          setTimeout(()=>{
            this.myLineChart.chart?.update();
          })
          this.lineChartData.datasets[0].data = val.prices.map((a:any)=>{
            return a[1];
          });
          this.lineChartData.labels = val.prices.map((a:any)=>{
            let date = new Date(a[0]);
            let time = date.getHours() > 12 ?
            `${date.getHours() - 12}: ${date.getMinutes()} PM` :
            `${date.getHours()}: ${date.getMinutes()} AM`
            return this.days === 1 ? time : date.toLocaleDateString();
          })
        })
      }
}

