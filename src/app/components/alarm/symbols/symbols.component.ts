import { IFontAlarm } from './../../../core/core.module';
import { FontsService } from '../../../services/fonts/fonts.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.scss']
})
export class SymbolsComponent implements OnInit {
  alarmSymbols: IFontAlarm[] = [];
  alarmSymbolSelected: IFontAlarm;

  constructor(private navParams: NavParams, private popoverCtrl: PopoverController, private fontsService: FontsService) {
    // console.log('SymbolsComponent constructor()', this.navParams.data);
    this.alarmSymbols = this.fontsService.getAlarms();
    if (this.navParams.data) {
      this.alarmSymbolSelected = this.navParams.get('select');
    }
  }

  close(data: IFontAlarm) {
    // console.log('SymbolsComponent close()', data);
    this.popoverCtrl.dismiss(data, 'select');
  }

  ngOnInit() {
    // console.log('SymbolsComponent ngOnInit()');
  }
}
