import { ALARM_SYMBOLS, FONTS } from './../../configs/fonts';
import {
  IFont,
  IFontAlarm,
  IFontGroupedByCategory,
  FontCategory
} from './../../core/core.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontsService {
  public readonly DIRECTORY: string = './assets/fonts/';
  public readonly FILENAME_ALARM_FONT: string = 'Alarm-Symbols.ttf';

  private readonly _fonts: IFont[] = FONTS;

  private readonly _alarmSymbols: IFontAlarm[] = ALARM_SYMBOLS;

  constructor() {
    // console.log('FontsService constructor()');
  }

  getAlarms(): IFontAlarm[] {
    // console.log('FontsService getAlarms()');
    return this._alarmSymbols;
  }

  getAlarmById(id: string): IFontAlarm {
    let value: IFontAlarm;
    for (let i = 0; i < this._alarmSymbols.length; i++) {
      if (this._alarmSymbols[i].id === id) {
        value = this._alarmSymbols[i];
        break;
      }
    }
    return value;
  }

  getFonts() {
    // console.log('FontsService getFonts()');
    return this._fonts;
  }

  getFontsGroupedByCategory(): IFontGroupedByCategory[] {
    const value: IFontGroupedByCategory[] = [];

    for (let i = 0; i < this._fonts.length; i++) {
      // Check if Category already exists in value
      const categoryExists = value.findIndex(element => {
        return element.category === FontCategory[this._fonts[i].category];
      });

      if (categoryExists === -1) {
        // Category not exists, add first variant entry
        const element: IFontGroupedByCategory = {
          category: FontCategory[this._fonts[i].category],
          fonts: [this._fonts[i]]
        };
        value.push(element);
      } else {
        // Supplier exists, add variant entry
        value[categoryExists].fonts.push(this._fonts[i]);
      }
    }

    value.sort(this.sortCategory);

    for (let i = 0; i < value.length; i++) {
      value[i].fonts.sort(this.sortFontsByLabel);
    }

    // console.log('VariantService getFontsGroupedByCategory()', value);
    return value;
  }

  getFontPathById(id: string): IFont {
    // console.log('FontsService getFontPathById()', id);
    let value: IFont;
    for (let i = 0; i < this._fonts.length; i++) {
      if (this._fonts[i].id === id) {
        value = this._fonts[i];
        break;
      }
    }
    return value;
  }

  // Alphabetical sort by supplier name
  private sortCategory(a: IFontGroupedByCategory, b: IFontGroupedByCategory) {
    const nameA = a.category;
    const nameB = b.category;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // categories are equal
    return 0;
  }

  // Alphabetical sort by font name per category
  private sortFontsByLabel(a: IFont, b: IFont) {
    const nameA = a.label.toUpperCase(); // ignore upper and lowercase
    const nameB = b.label.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are equal
    return 0;
  }
}
