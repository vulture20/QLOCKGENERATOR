import { FONTS } from './../configs/fonts';
import { ILanguage, IVariant, IVariantGroupedBySupplier, IFont, IFontAlarm, FontCategory } from './../core/core.module';
import { IPlacement, PlacementsService } from './../services/placements/placements.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { FontsService, } from './../services/fonts/fonts.service';
import { GeneratorService } from './../services/generator/generator.service';
import { LanguagesService } from './../services/languages/languages.service';
import { VariantsService } from './../services/variants/variants.service';

import { SymbolsComponent } from './../components/alarm/symbols/symbols.component';
import { VariantsComponent } from './../components/general/variants/variants.component';
import { LanguagesComponent } from '../components/matrix/languages/languages.component';
import { FontsComponent } from './../components/matrix/fonts/fonts.component';
import { PlacementsComponent } from './../components/minutes/placements/placements.component';

import { saveAs } from 'file-saver/FileSaver';
import { DEFAULT_ALARM_SYMBOL_NONE, DEFAULT_ALARM_SYMBOL, DEFAULT_FONT, DEFAULT_VARIANT } from '../configs/defaults';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  @ViewChild('drawing') drawing: ElementRef;

  // Default settings
  protected generalFrontVariant: IVariant = DEFAULT_VARIANT;
  protected generalFrontVariants: IVariantGroupedBySupplier[] = [];
  protected generalFrontHeight: number = 450;
  protected generalFrontWidth: number = 450;
  protected generalFrontMirror: boolean = false;
  protected generalFrontOutline: boolean = false;
  protected minutesPlacement: IPlacement = { id: 0, value: "corner", label: "Ecken" };
  protected minutesRadius: number = 1;
  protected minutesDistanceX: number = 25;
  protected minutesDistanceY: number = 25;
  protected alarmSymbol: IFontAlarm = DEFAULT_ALARM_SYMBOL_NONE;
  protected alarmSymbols: IFontAlarm[] = [];
  protected alarmSize: number = 11;
  protected alarmDistanceX: number = 225;
  protected alarmDistanceY: number = 25;
  protected matrixColumns: number = 11;
  protected matrixRows: number = 10;
  protected matrixDistanceX: number = 83.5;
  protected matrixDistanceY: number = 83.5;
  protected matrixLanguage: ILanguage = { id: "DE", label: "DE Deutsch", value: "" };
  protected matrixLanguages: ILanguage[] = [];
  protected matrixText: string = "ESKISTAFÜNF\nZEHNZWANZIG\nDREIVIERTEL\nVORFUNKNACH\nHALBAELFÜNF\nEINSXAMZWEI\nDREIPMJVIER\nSECHSNLACHT\nSIEBENZWÖLF\nZEHNEUNKUHR";
  protected matrixFont: IFont = DEFAULT_FONT;
  protected matrixFonts: IFont[] = FONTS;
  protected matrixFontSize: number = 21;
  protected logoText: string = "";
  protected logoTextSize: number = 5.25;
  protected logoDistanceX: number = 225;
  protected logoDistanceY: number = 425;
  protected colorFront: string = "#000000";
  protected colorLight: string = "#FFFFFF";

  constructor(
    public generator: GeneratorService,
    private languagesService: LanguagesService,
    public fontService: FontsService,
    public variantsService: VariantsService,
    public placementsService: PlacementsService,
    public popoverController: PopoverController,
  ) {
    // console.log("HomePage constructor()");
    this.alarmSymbols = this.fontService.getAlarms();
    this.matrixLanguages = this.languagesService.getLanguages();
    this.matrixFonts = this.fontService.getFonts();
    this.generalFrontVariant = this.variantsService.getVariantById("000");
    this.generalFrontVariants = this.variantsService.getVariantsGroupedBySupplier();
  }

  ngAfterViewInit() {
    // console.log("HomePage ngOnInit()");
    this.generator.preview.subscribe((preview) => {
      this.drawing.nativeElement.innerHTML = preview;
    });
    this.generateFrontPreview();
  }

  protected onClickGithubLogo() {
    // console.log("HomePage onClickGithubLogo()");
    window.open('https://github.com/SimonGolms/QLOCKGENERATOR');
  }

  protected onChangeFrontVariant() {
    // console.log("HomePage onChangeFrontVariant()");
  }

  protected async onClickFrontVariant(event: any = null) {
    // console.log("HomePage onClickFrontVariant()");
    const popover = await this.popoverController.create({
      component: VariantsComponent,
      componentProps: { select: this.generalFrontVariant },
      event: event,
      translucent: true
    });

    popover.onDidDismiss().then((data) => {
      // console.log("HomePage onClickFrontVariant() - popover.onDidDismiss()", data);
      if (data.role === 'select') {
        this.generalFrontVariant = data.data;

        this.generalFrontHeight = this.generalFrontVariant.data.front.height;
        this.generalFrontWidth = this.generalFrontVariant.data.front.width;
        this.minutesPlacement = this.placementsService.getPlacementByValue(this.generalFrontVariant.data.minutes.placement);
        this.minutesRadius = this.generalFrontVariant.data.minutes.radius;
        this.minutesDistanceX = this.generalFrontVariant.data.minutes.distance.x;
        this.minutesDistanceY = this.generalFrontVariant.data.minutes.distance.y;
        if (this.generalFrontVariant.data.alarm.show === true) {
          this.alarmSymbol = DEFAULT_ALARM_SYMBOL;
        } else {
          this.alarmSymbol = DEFAULT_ALARM_SYMBOL_NONE;
        }
        this.alarmSize = this.generalFrontVariant.data.alarm.size;
        this.alarmDistanceX = this.generalFrontVariant.data.alarm.distance.x;
        this.alarmDistanceY = this.generalFrontVariant.data.alarm.distance.y;
        this.matrixColumns = this.generalFrontVariant.data.matrix.columns;
        this.matrixRows = this.generalFrontVariant.data.matrix.rows;
        this.matrixDistanceX = this.generalFrontVariant.data.matrix.distance.x;
        this.matrixDistanceY = this.generalFrontVariant.data.matrix.distance.y;
        this.matrixFontSize = this.generalFrontVariant.data.matrix.font.size;
        this.logoTextSize = this.generalFrontVariant.data.logo.size;
        this.logoDistanceX = this.generalFrontVariant.data.logo.distance.x;
        this.logoDistanceY = this.generalFrontVariant.data.logo.distance.y;
        this.generateFrontPreview();
      }
    });
    return await popover.present();
  }

  protected onChangeFrontHeight(event: any = null) {
    // console.log("HomePage onChangeFrontHeight()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.generalFrontHeight != event.detail.value)) {
      this.generalFrontHeight = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeFrontWidth(event: any = null) {
    // console.log("HomePage onChangeFrontWidth()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.generalFrontWidth != event.detail.value)) {
      this.generalFrontWidth = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeFrontMirror(event: any = null) {
    // console.log("HomePage onChangeFrontMirror()", event);
    this.generateFrontPreview();
  }

  protected onChangeFrontOutline(event: any = null) {
    // console.log("HomePage onChangeFrontOutline()", event);
    this.generateFrontPreview();
  }

  protected onChangeMinutesPlacement(event: any = null) {
    //  console.log("HomePage onChangeMinutesPlacement()", event, this.minutesPlacement);
    this.generateFrontPreview();
  }

  protected async onClickMinutesPlacement(event: any = null) {
    //  console.log("HomePage onClickMinutesPlacement()", event);
    const popover = await this.popoverController.create({
      component: PlacementsComponent,
      componentProps: { select: this.minutesPlacement },
      event: event,
      translucent: true
    });

    popover.onDidDismiss().then((data) => {
      //  console.log("HomePage onClickMinutesPlacement() - popover.onDidDismiss()", data);
      if (data.role == "select") {
        this.minutesPlacement = data.data;
        this.generateFrontPreview();
      }
    });

    return await popover.present();
  }

  protected onChangeMinutesRadius(event: any = null) {
    // console.log("HomePage onChangeMinutesRadius()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.minutesRadius != event.detail.value)) {
      this.minutesRadius = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMinutesDistanceX(event: any = null) {
    // console.log("HomePage onChangeMinutesDistanceX()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.minutesDistanceX != event.detail.value)) {
      this.minutesDistanceX = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMinutesDistanceY(event: any = null) {
    // console.log("HomePage onChangeMinutesDistanceY()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.minutesDistanceY != event.detail.value)) {
      this.minutesDistanceY = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeAlarmSymbol(event: any = null) {
    // console.log("HomePage onChangeAlarmSymbol()", event);
  }

  protected async onClickAlarmSymbol(event: any = null) {
    // console.log("HomePage onClickAlarmSymbol()", event);
    const popover = await this.popoverController.create({
      component: SymbolsComponent,
      componentProps: { select: this.alarmSymbol },
      event: event,
      translucent: true
    });

    popover.onDidDismiss().then((data) => {
      // console.log("HomePage onClickAlarmSymbol() - popover.onDidDismiss()", data);
      if (data.role == "select") {
        this.alarmSymbol = data.data;
        this.generateFrontPreview();
      }
    });

    return await popover.present();
  }

  protected onChangeAlarmSize(event: any = null) {
    // console.log("HomePage onChangeAlarmSize()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.alarmSize != event.detail.value)) {
      this.alarmSize = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeAlarmDistanceX(event: any = null) {
    // console.log("HomePage onChangeAlarmDistanceX()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.alarmDistanceX != event.detail.value)) {
      this.alarmDistanceX = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeAlarmDistanceY(event: any = null) {
    // console.log("HomePage onChangeAlarmDistanceY()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.alarmDistanceY != event.detail.value)) {
      this.alarmDistanceY = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMatrixColumns(event: any = null) {
    // console.log("HomePage onChangeMatrixColumns()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.matrixColumns != event.detail.value)) {
      this.matrixColumns = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMatrixRows(event: any = null) {
    // console.log("HomePage onChangeMatrixRows()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.matrixRows != event.detail.value)) {
      this.matrixRows = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMatrixDistanceX(event: any = null) {
    // console.log("HomePage onChangeMatrixDistanceX()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.matrixDistanceX != event.detail.value)) {
      this.matrixDistanceX = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMatrixDistanceY(event: any = null) {
    // console.log("HomePage onChangeMatrixDistanceY()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.matrixDistanceY != event.detail.value)) {
      this.matrixDistanceY = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeMatrixLanguage(event: any = null) {
    // console.log("HomePage onChangeMatrixLanguage()", event);
  }

  protected async onClickMatrixLanguage(event: any = null) {
    // console.log("HomePage onClickMatrixLanguage()", event);
    const popover = await this.popoverController.create({
      component: LanguagesComponent,
      componentProps: {
        select: this.matrixLanguage,
      },
      event: event,
    });

    popover.onDidDismiss().then((data) => {
      console.log('HomePage onClickMatrixLanguage() - popover.onDidDismiss()', data);
      if (data.role === 'select') {
        this.matrixLanguage = data.data;
        this.matrixText = this.languagesService.getLanguageValueById(this.matrixLanguage.id);

        this.generateFrontPreview();
      }
    });

    return await popover.present();
  }

  protected onChangeMatrixText(event: any = null) {
    // console.log("HomePage onChangeMatrixText()", event);
    this.generateFrontPreview();
  }

  protected onChangeMatrixFont(event: any = null) {
    // console.log("HomePage onChangeMatrixFont()", event);
    this.matrixFont = this.fontService.getFontPathById(this.matrixFont.id);
  }

  protected async onClickMatrixFont(event: any = null) {
    // console.log("HomePage onClickMatrixFont()", event);
    const popover = await this.popoverController.create({
      component: FontsComponent,
      componentProps: {
        select: this.matrixFont,
        text: this.matrixText.replace(/\s/g, "").substr(0, 15)  // RegEx '\s' matches a single white white space character, including space, tab, form feed, line feed.
      },
      event: event,
    });

    popover.onDidDismiss().then((data) => {
      // console.log("HomePage onClickMatrixFont() - popover.onDidDismiss()", data);
      if (data.role == "select") {
        this.matrixFont = data.data;
        this.generateFrontPreview();
      }
    });

    return await popover.present();
  }

  protected onChangeMatrixFontSize(event: any = null) {
    // console.log("HomePage onChangeMatrixFontSize()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.matrixFontSize != event.detail.value)) {
      this.matrixFontSize = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }
  protected onChangeLogoText(event: any = null) {
    // console.log("HomePage onChangeLogoText()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.logoText != event.detail.value)) {
      this.logoText = event.detail.value;
      this.generateFrontPreview();
    }
  }
  protected onChangeLogoTextSize(event: any = null) {
    // console.log("HomePage onChangeLogoTextSize()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.logoTextSize != event.detail.value)) {
      this.logoTextSize = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }
  protected onChangeLogoDistanceX(event: any = null) {
    // console.log("HomePage onChangeLogoDistanceX()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.logoDistanceX != event.detail.value)) {
      this.logoDistanceX = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeLogoDistanceY(event: any = null) {
    // console.log("HomePage onChangeLogoDistanceY()", event);
    // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
    if ((event != null) && (this.logoDistanceY != event.detail.value)) {
      this.logoDistanceY = Number(event.detail.value);
      this.generateFrontPreview();
    }
  }

  protected onChangeColorFront(event: any = null) {
    // console.log("HomePage onChangeColorFront()", event);
    // Change the fill CSS property of the SVG preview for better performance instead of generating a new preview 
    let element = document.getElementById("background");
    if (element != undefined) {
      element.setAttribute("fill", this.colorFront);
      element.style.fill = this.colorFront;
    }
  }

  protected onChangeColorLight(event: any = null) {
    // console.log("HomePage onChangeColorLight()", event);
    // Change the fill CSS property of the SVG preview for better performance instead of generating a new preview 
    let element = document.getElementById("minutes");
    if (element != undefined) {
      element.setAttribute("fill", this.colorLight);
      element.style.fill = this.colorLight;
    }
    element = document.getElementById("text");
    if (element != undefined) {
      element.setAttribute("fill", this.colorLight);
      element.style.fill = this.colorLight;
    }
  }

  generateFrontPreview() {
    this.generator.generatePreview(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline,
      this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY,
      this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY,
      this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY,
      this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize,
      this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY,
      this.colorFront, this.colorLight)
  }

  exportAsSVG() {
    let filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model,
      this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);

    this.generator.generateSVG(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline,
      this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY,
      this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY,
      this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY,
      this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize,
      this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY,
      this.colorFront, this.colorLight).then((svg: string) => {
        let svgBlob = new Blob([svg], {
          type: "image/svg+xml"
        });
        saveAs(svgBlob, filename + ".svg");
      });
  }

  exportAsDXF() {
    let filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model,
      this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);

    this.generator.generateDXF(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline,
      this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY,
      this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY,
      this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY,
      this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize,
      this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY,
      this.colorFront, this.colorLight).then((dxf: string) => {
        let blob = new Blob([dxf], { type: "dxf/dxf;charset=utf-8" });
        saveAs(blob, filename + ".dxf");
      });
  }

  exportAsPDF() {
    let filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model,
      this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);

    this.generator.generatePDF(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline,
      this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY,
      this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY,
      this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY,
      this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize,
      this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY,
      this.colorFront, this.colorLight).then((pdf) => {
        saveAs(pdf, filename + ".pdf");
      });
  }

  exportAsPNG() {
    let filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model,
      this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);

    this.generator.generatePNG(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline,
      this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY,
      this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY,
      this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY,
      this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize,
      this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY,
      this.colorFront, this.colorLight).then((png: Uint8Array) => {
        let blob = new Blob([png], { type: "image/png" });
        saveAs(blob, filename + ".png");
      });
  }
}
