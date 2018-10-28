import { IFont } from './fonts.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontsService {

  public readonly DIRECTORY: string = "./assets/fonts/";
  // public readonly DIRECTORY: string = "/";
  public readonly FILENAME_ALARM_FONT: string = "Alarm-Symbols.ttf";
  public readonly DEFAULT_FONT_ID: string = "1";
  public readonly DEFAULT_ALARM_SYMBOL_NONE_ID: string = "0";
  public readonly DEFAULT_ALARM_SYMBOL_ID: string = "3";

  private _fonts: IFont[] = [
    {
      id: "1000",
      label: "Avion",
      category: FontCategory.SPECIAL,
      filename: "bd184bc4cff38e2ac7228dc490291a03.ttf",
      path: this.DIRECTORY,
    }, {
      id: "2000",
      label: "Blades",
      category: FontCategory.REGULAR,
      filename: "d8d5af6222225e2cb626557c53a17944.ttf",
      path: this.DIRECTORY,
    }, {
      id: "3000",
      label: "Breymont",
      category: FontCategory.SPECIAL,
      filename: "ca1f1c7d1993425b5284cd47a6aef619.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4000",
      label: "DIN",
      category: FontCategory.REGULAR,
      filename: "7737a754866a4378500fbf0a6808fe54.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4010",
      label: "DIN - Thin",
      category: FontCategory.REGULAR,
      filename: "02db292e6c9f218372d371479a8e417a.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4020",
      label: "DIN - Light",
      category: FontCategory.REGULAR,
      filename: "975553ad05763e290ba31a889f390868.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4030",
      label: "DIN - Bold",
      category: FontCategory.REGULAR,
      filename: "8c3956e750af056bfa9ccdcc45ef0e4e.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4100",
      label: "DIN Round",
      category: FontCategory.REGULAR,
      filename: "72dab58a307a3da921bc4813519ed441.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4110",
      label: "DIN Round - Light",
      category: FontCategory.REGULAR,
      filename: "df595a18935ddd7171bc6411ce42bdab.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4120",
      label: "DIN Round - Bold",
      category: FontCategory.REGULAR,
      filename: "a5686978417340480eb3b3a0c2982464.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4200",
      label: "DIN Stencil",
      category: FontCategory.STENCIL,
      filename: "1a3840bea709f24a0129f7a4e5372885.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4210",
      label: "DIN Stencil - Thin",
      category: FontCategory.STENCIL,
      filename: "6fbb7d0251a1f8a4ce01a22df835f4e3.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4220",
      label: "DIN Stencil - Light",
      category: FontCategory.STENCIL,
      filename: "431b4006ab48b77105500b8030a2821e.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4230",
      label: "DIN Stencil - Bold",
      category: FontCategory.STENCIL,
      filename: "04956e1957f2622721b1593fb6551dab.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4300",
      label: "DIN Q1",
      category: FontCategory.STENCIL,
      filename: "3db4863fed3e13b63db057a5b7099b25.ttf",
      path: this.DIRECTORY,
    }, {
      id: "4310",
      label: "DIN Q2",
      category: FontCategory.STENCIL,
      filename: "7c6f5cd6fa441cb04d13679f92b4a262.ttf",
      path: this.DIRECTORY,
    }, {
      id: "5000",
      label: "Dot Matrix",
      category: FontCategory.SPECIAL,
      filename: "a995332cb20cd46e2849967f5152d728.ttf",
      path: this.DIRECTORY,
    }, {
      id: "6000",
      label: "Frutiger",
      category: FontCategory.REGULAR,
      filename: "3890fc143c4bee26d3001584630b1d37.ttf",
      path: this.DIRECTORY,
    }, {
      id: "7000",
      label: "Gluck",
      category: FontCategory.REGULAR,
      filename: "c99d43ab6fdc02b9011bccfe29075158.ttf",
      path: this.DIRECTORY,
    }, {
      id: "7100",
      label: "Gluck - Stroked",
      category: FontCategory.REGULAR,
      filename: "5dafad024b25d002a2ea1dc29846c708.ttf",
      path: this.DIRECTORY,
    }, {
      id: "8000",
      label: "Heimdal",
      category: FontCategory.REGULAR,
      filename: "368d146f8a7c87973d100963d020a5f1.ttf",
      path: this.DIRECTORY,
    }, {
      id: "9000",
      label: "Italianno",
      category: FontCategory.REGULAR,
      filename: "b622cce140ed636cecb658f4d5ffc499.ttf",
      path: this.DIRECTORY,
    }, {
      id: "10000",
      label: "Khalbot",
      category: FontCategory.REGULAR,
      filename: "469e61cd1088ef30e9298e912b1a87dc.ttf",
      path: this.DIRECTORY,
    }, {
      id: "11000",
      label: "Klingon",
      category: FontCategory.SPECIAL,
      filename: "60bf06c50e504aa328a7dc7a3f43ffd6.ttf",
      path: this.DIRECTORY,
    }, {
      id: "12000",
      label: "Laser LED",
      category: FontCategory.STENCIL,
      filename: "02f60539fc43f783a9359b15f2ac21bc.ttf",
      path: this.DIRECTORY,
    }, {
      id: "13000",
      label: "Laser Punch 2",
      category: FontCategory.REGULAR,
      filename: "be70ccc4b605ee104e06353e9ddc3c52.ttf",
      path: this.DIRECTORY,
    }, {
      id: "14000",
      label: "Laser Sans Serif",
      category: FontCategory.STENCIL,
      filename: "e185f7fa2652932c42c1e75a58520d85.ttf",
      path: this.DIRECTORY,
    }, {
      id: "14100",
      label: "Laser Sans Serif - Bold",
      category: FontCategory.STENCIL,
      filename: "bfb58ec1cfe2f2acb2c63f3584ffbd78.ttf",
      path: this.DIRECTORY,
    }, {
      id: "15000",
      label: "Laser Time",
      category: FontCategory.STENCIL,
      filename: "a78c3954e21562483ce1e13104033ea2.ttf",
      path: this.DIRECTORY,
    }, {
      id: "16000",
      label: "Milk Cookies",
      category: FontCategory.REGULAR,
      filename: "286c9ab85ef8803326d2b52f3b2ea1c1.ttf",
      path: this.DIRECTORY,
    }, {
      id: "17000",
      label: "Montour",
      category: FontCategory.REGULAR,
      filename: "d081acc2da38bdacbcf4b10ddeaf9752.ttf",
      path: this.DIRECTORY,
    }, {
      id: "18000",
      label: "Neon One",
      category: FontCategory.STENCIL,
      filename: "21107c42084fbcd207ce848b0e01dabe.ttf",
      path: this.DIRECTORY,
    }, {
      id: "19000",
      label: "Night Life",
      category: FontCategory.REGULAR,
      filename: "636b0737e45c487ba691133e299c265a.ttf",
      path: this.DIRECTORY,
    }, {
      id: "20000",
      label: "Old English Text",
      category: FontCategory.REGULAR,
      filename: "19d538b99afe170b5d18de15ea9c8b67.ttf",
      path: this.DIRECTORY,
    }, {
      id: "21000",
      label: "Rachel Roman",
      category: FontCategory.REGULAR,
      filename: "bf1807e9b9b6a5b3ee05ba34e288ffa4.ttf",
      path: this.DIRECTORY,
    }, {
      id: "22000",
      label: "Solia Sans",
      category: FontCategory.REGULAR,
      filename: "c2f8fc3015a38a9e0d3c6f41f16c33cd.ttf",
      path: this.DIRECTORY,
    }, {
      id: "23000",
      label: "Teratur",
      category: FontCategory.REGULAR,
      filename: "f90d69171098075e502c9465e1d5538f.ttf",
      path: this.DIRECTORY,
    }, {
      id: "24000",
      label: "Theo Aged 6",
      category: FontCategory.SPECIAL,
      filename: "7c449a3d6488f894902edfedc36205a2.ttf",
      path: this.DIRECTORY,
    }, {
      id: "25000",
      label: "Ykar",
      category: FontCategory.REGULAR,
      filename: "3a40308bd4fedb785b2d57a21451b722.ttf",
      path: this.DIRECTORY,
    }
    // ,{
    //   id: "30000",
    //   label: "MyOwnFont",
    //   category: FontCategory.REGULAR,
    //   filename: "MyOwnFont.ttf",
    //   path: this.DIRECTORY,
    // },
  ];

  private _alarmSymbol: IFontAlarm[] = [
    {
      id: "0",
      label: "Ohne",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "",
    },
    {
      id: "1",
      label: "Symbol 1",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "A",
    },
    {
      id: "2",
      label: "Symbol 1 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "B",
    },
    {
      id: "3",
      label: "Symbol 2",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "C",
    },
    {
      id: "4",
      label: "Symbol 2 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "D",
    },
    {
      id: "5",
      label: "Symbol 3",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "E",
    },
    {
      id: "6",
      label: "Symbol 3 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "F",
    },
    {
      id: "7",
      label: "Symbol 4",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "G",
    },
    {
      id: "8",
      label: "Symbol 4 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "H",
    },
    {
      id: "9",
      label: "Symbol 5",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "I",
    },
    {
      id: "10",
      label: "Symbol 6",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "J",
    },
    {
      id: "11",
      label: "Symbol 7",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "K",
    },
    {
      id: "12",
      label: "Symbol 7 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "L",
    },
    {
      id: "13",
      label: "Symbol 8",
      category: FontCategory.REGULAR,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "M",
    },
    {
      id: "14",
      label: "Symbol 8 (Stencil)",
      category: FontCategory.STENCIL,
      filename: this.FILENAME_ALARM_FONT,
      path: this.DIRECTORY,
      value: "N",
    }
  ]

  constructor(
  ) {
    // console.log("FontsService constructor()");
  }

  getDefaultAlarmSymbol(): IFontAlarm {
    return this.getAlarmById(this.DEFAULT_ALARM_SYMBOL_ID);
  }

  getAlarms(): IFontAlarm[] {
    // console.log("FontsService getAlarms()");
    return this._alarmSymbol;
  }

  getAlarmById(id: string): IFontAlarm {
    let value: IFontAlarm;
    for (let i = 0; i < this._alarmSymbol.length; i++) {
      if (this._alarmSymbol[i].id == id) {
        value = this._alarmSymbol[i];
        break;
      }
    }
    return value;
  }

  getAlarmValueById(id: string): string {
    let value: string = "";
    for (let i = 0; i < this._alarmSymbol.length; i++) {
      if (this._alarmSymbol[i].id == id) {
        value = this._alarmSymbol[i].value;
        break;
      }
    }
    return value;
  }

  getAlarmValueByLabel(label: string): string {
    let value: string = "";
    for (let i = 0; i < this._alarmSymbol.length; i++) {
      if (this._alarmSymbol[i].label == label) {
        value = this._alarmSymbol[i].value;
        break;
      }
    }
    return value;
  }

  getFonts() {
    // console.log("FontsService getFonts()");
    // console.log(this._fonts);
    return this._fonts;
  }

  getFontsGroupedByCategory(): IFontGroupedByCategory[] {
    let value: IFontGroupedByCategory[] = [];

    for (let i = 0; i < this._fonts.length; i++) {
      // Check if Category already exists in value
      let categoryExists = value.findIndex((element) => {
        return element.category == FontCategory[this._fonts[i].category]
      })

      if (categoryExists == -1) {
        // Category not exists, add first variant entry
        let element: IFontGroupedByCategory = { category: FontCategory[this._fonts[i].category], fonts: [this._fonts[i]] };
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

    // console.log("VariantService getFontsGroupedByCategory()", value);
    return value;
  }

  getFontPathById(id: string): IFont {
    // console.log("FontsService getFontPathById()", id);
    let value: IFont;
    for (let i = 0; i < this._fonts.length; i++) {
      if (this._fonts[i].id == id) {
        value = this._fonts[i];
        break;
      }
    }
    return value;
  }

  // Alphabetical sort by supplier name
  private sortCategory(a: IFontGroupedByCategory, b: IFontGroupedByCategory) {
    let nameA = a.category;
    let nameB = b.category;
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
    let nameA = a.label.toUpperCase(); // ignore upper and lowercase
    let nameB = b.label.toUpperCase(); // ignore upper and lowercase
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

export enum FontCategory {
  REGULAR,
  STENCIL,
  SPECIAL
}

export interface IFont {
  id: string;
  label: string;
  category: FontCategory;
  filename: string;
  path: string;
}

export interface IFontGroupedByCategory {
  category: string;
  fonts: IFont[];
}

export interface IFontAlarm extends IFont {
  value: string;
}
