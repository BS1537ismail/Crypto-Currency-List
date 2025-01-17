import { Component } from '@angular/core';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
    selectedCurrency: string = "BDT";
    constructor(private currencyService : CurrencyService){
      
    }
    sendCurrency(event:string){
      this.currencyService.setCurrency(event);
  }
}
