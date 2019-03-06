import { ILanguage } from './../../../core/core.module';
import { LanguagesService } from './../../../services/languages/languages.service';
import { PopoverController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
  // providers: [LanguagesService]
})
export class LanguagesComponent implements OnInit {

  languages: ILanguage[] = [];
  languageSelected: ILanguage;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private languagesService: LanguagesService,
  ) {
    // console.log('LanguagesComponent constructor()');
    this.languages = this.languagesService.getLanguages();
    this.sortLanguagesById();
    this.cutLanguagesValue(0, 15);

    if (this.navParams.data) {
      this.languageSelected = this.navParams.get('select');
    }
  }

  sortLanguagesById(): void {
    // console.log('LanguagesComponent sortLanguagesById()');
    this.languages.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  }

  cutLanguagesValue(from: number = 0, length: number = 15): void {
    // console.log('LanguagesComponent cutLanguagesValue()', from, length);
    this.languages.forEach((element) => {
      element.value = element.value.replace(/\s+/g, '').substr(from, length);
    });
  }

  close(data: ILanguage) {
    // console.log('LanguagesComponent close()', data);
    this.popoverCtrl.dismiss(data, 'select');
  }

  ngOnInit() {
    // console.log('LanguagesComponent ngOnInit()');
  }

}
