import { ILanguage, LanguagesService } from './../../../services/languages/languages.service';
import { PopoverController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
  providers: [LanguagesService]
})
export class LanguagesComponent implements OnInit {

  protected languages: ILanguage[] = [];
  protected languageSelected: ILanguage;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    public languagesService: LanguagesService,
  ) {
    // console.log("LanguagesComponent constructor()");

    this.languages = this.languagesService.getLanguages();
    this.languages.forEach(element => {
      element.value = element.value.replace(/\s/g, "").substr(0, 15);
    })

    if (this.navParams.data) {
      this.languageSelected = this.navParams.get("select");
    }
  }

  protected close(data: ILanguage) {
    // console.log("LanguagesComponent close()", data);
    this.popoverCtrl.dismiss(data, "select");
  }

  ngOnInit() {
    // console.log("LanguagesComponent ngOnInit()");
  }

}
