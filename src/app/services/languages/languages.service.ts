import { ILanguage } from './../../core/core.module';
import { LANGUAGES } from './../../configs/languages';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  _languages = LANGUAGES;

  constructor() {
    // console.log('LanguagesService constructor()');
  }

  /**
   * Get all languages
   *
   * @returns {ILanguage[]}
   * @memberof LanguagesService
   */
  public getLanguages(): ILanguage[] {
    // console.log('LanguagesService getLanguages()');
    return JSON.parse(JSON.stringify(this._languages)); // Return a new copy and not a reference
  }

  public getLanguageById(id: string): ILanguage {
    console.log('LanguagesService getLanguageById()', id);
    let value: ILanguage;
    for (let i = 0; i < this._languages.length; i++) {
      if (this._languages[i].id === id) {
        value = this._languages[i];
        break;
      }
    }
    return value;
  }

  public getLanguageValueById(id: string): string {
    // console.log('LanguagesService getLanguageValueById()', id);
    let value = '';
    for (let i = 0; i < this._languages.length; i++) {
      if (this._languages[i].id === id) {
        value = this._languages[i].value;
        break;
      }
    }
    return value;
  }

  public getLanguageLabelById(id: string): string {
    // console.log('LanguagesService getLanguageValueById()', id);
    let value = '';
    for (let i = 0; i < this._languages.length; i++) {
      if (this._languages[i].id === id) {
        value = this._languages[i].label;
        break;
      }
    }
    return value;
  }

}
