import { IFont, IFontGroupedByCategory } from './../../../core/core.module';
import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FontsService } from './../../../services/fonts/fonts.service';

@Component({
  selector: 'app-fonts',
  templateUrl: './fonts.component.html',
  styleUrls: ['./fonts.component.scss']
})
export class FontsComponent implements OnInit {
  fonts: IFontGroupedByCategory[] = [];
  fontSelected: IFont;
  teaserText: string;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private fontService: FontsService
  ) {
    // console.log('VariantsComponent constructor()', this.navParams.data);
    this.fonts = this.fontService.getFontsGroupedByCategory();
    if (this.navParams.data) {
      this.fontSelected = this.navParams.get('select');
      this.teaserText = this.navParams.get('text');

      if (this.teaserText === undefined) {
        this.teaserText = 'LOREM IPSUM DOLOR';
      }
    }
  }

  close(data: IFont) {
    // console.log('VariantsComponent close()', data);
    this.popoverCtrl.dismiss(data, 'select');
  }

  ngOnInit() {
    // console.log('VariantsComponent ngOnInit()');
  }
}
