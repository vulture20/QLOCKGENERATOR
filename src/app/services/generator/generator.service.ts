import { FontsService } from './../fonts/fonts.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as opentype from 'opentype.js';
import * as makerjs from 'makerjs';
import svgToPng from './lib/saveSvgAsPng.js';
import SVGtoPDF from './lib/svg-to-pdfkit.js';
import blobStream from './lib/blob-stream.js';
import PDFDocument from './lib/pdfkit.js';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  private readonly EXPORT_AUTHOR: string = 'QLOCKGENERATOR';
  private readonly EXPORT_SUBJECT: string = 'Front Template';
  private readonly EXPORT_KEYWORDS: string =
    'QLOCKGENERATOR; Word Clock; Template; Front; Wortuhr; Vorlage';

  public preview: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private alarmFont = '';

  constructor(private fontsService: FontsService) {
    // console.log('GeneratorService constructor()');
    this.alarmFont =
      this.fontsService.DIRECTORY + this.fontsService.FILENAME_ALARM_FONT;
  }

  public async generatePreview(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    frontOutline: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    this.generateFrontModel(
      frontHeight,
      frontWidth,
      frontMirror,
      minutesPlacement,
      minutesRadius,
      minutesDistanceX,
      minutesDistanceY,
      alarmSymbol,
      alarmSize,
      alarmDistanceX,
      alarmDistanceY,
      matrixColumns,
      matrixRows,
      matrixDistanceX,
      matrixDistanceY,
      matrixLanguages,
      matrixText,
      matrixFont,
      matrixFontSize,
      logoText,
      logoTextSize,
      logoDistanceX,
      logoDistanceY,
      colorFront,
      colorLight
    ).then(front => {
      // console.log('GeneratorService generatePreview() - generateFrontModel() - SUCCESS', front);
      const svg = makerjs.exporter.toSVG(
        front,
        this.getSvgRenderOptions(frontOutline, colorFront, colorLight)
      );

      this.preview.next(svg);
    });
  }

  public async generateSVG(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    frontOutline: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    const promise = new Promise((resolve, reject) => {
      this.generateFrontModel(
        frontHeight,
        frontWidth,
        frontMirror,
        minutesPlacement,
        minutesRadius,
        minutesDistanceX,
        minutesDistanceY,
        alarmSymbol,
        alarmSize,
        alarmDistanceX,
        alarmDistanceY,
        matrixColumns,
        matrixRows,
        matrixDistanceX,
        matrixDistanceY,
        matrixLanguages,
        matrixText,
        matrixFont,
        matrixFontSize,
        logoText,
        logoTextSize,
        logoDistanceX,
        logoDistanceY,
        colorFront,
        colorLight
      ).then(front => {
        const svg = makerjs.exporter.toSVG(
          front,
          this.getSvgRenderOptions(frontOutline, colorFront, colorLight)
        );

        resolve(svg);
      });
    });

    return promise;
  }

  public async generateDXF(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    frontOutline: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    const promise = new Promise((resolve, reject) => {
      this.generateFrontModel(
        frontHeight,
        frontWidth,
        frontMirror,
        minutesPlacement,
        minutesRadius,
        minutesDistanceX,
        minutesDistanceY,
        alarmSymbol,
        alarmSize,
        alarmDistanceX,
        alarmDistanceY,
        matrixColumns,
        matrixRows,
        matrixDistanceX,
        matrixDistanceY,
        matrixLanguages,
        matrixText,
        matrixFont,
        matrixFontSize,
        logoText,
        logoTextSize,
        logoDistanceX,
        logoDistanceY,
        colorFront,
        colorLight
      ).then(front => {
        const dxf = makerjs.exporter.toDXF(front, {
          units: makerjs.unitType.Millimeter
          // Creates corrupt DXF file, see: https://github.com/Microsoft/maker.js/issues/324
          // usePOLYLINE: true
        });

        resolve(dxf);
      });
    });

    return promise;
  }

  public async generatePNG(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    frontOutline: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    const promise = new Promise((resolve, reject) => {
      this.generateFrontModel(
        frontHeight,
        frontWidth,
        frontMirror,
        minutesPlacement,
        minutesRadius,
        minutesDistanceX,
        minutesDistanceY,
        alarmSymbol,
        alarmSize,
        alarmDistanceX,
        alarmDistanceY,
        matrixColumns,
        matrixRows,
        matrixDistanceX,
        matrixDistanceY,
        matrixLanguages,
        matrixText,
        matrixFont,
        matrixFontSize,
        logoText,
        logoTextSize,
        logoDistanceX,
        logoDistanceY,
        colorFront,
        colorLight
      ).then(front => {
        const svg = makerjs.exporter.toSVG(
          front,
          this.getSvgRenderOptions(frontOutline, colorFront, colorLight)
        );
        const element = document.createElement('div');
        element.innerHTML = svg;
        svgToPng.svgAsPngUri(
          element.firstChild,
          {
            encoderOptions: 1,
            scale: 5.906
          },
          uri => {
            // Convert URI to Blob, see https://stackoverflow.com/a/30407959
            const arr = uri.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(u8arr);
          }
        );
      });
    });

    return promise;
  }

  /**
   * Returns the generate front as PDF to display
   */
  public async generatePDF(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    frontOutline: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    const promise = new Promise((resolve, reject) => {
      this.generateFrontModel(
        frontHeight,
        frontWidth,
        frontMirror,
        minutesPlacement,
        minutesRadius,
        minutesDistanceX,
        minutesDistanceY,
        alarmSymbol,
        alarmSize,
        alarmDistanceX,
        alarmDistanceY,
        matrixColumns,
        matrixRows,
        matrixDistanceX,
        matrixDistanceY,
        matrixLanguages,
        matrixText,
        matrixFont,
        matrixFontSize,
        logoText,
        logoTextSize,
        logoDistanceX,
        logoDistanceY,
        colorFront,
        colorLight
      ).then(front => {
        const pdfOptions = {
          compress: false,
          // 1 millimeter [mm] = 2.83464566929134 point
          size: [frontHeight * 2.83464566929134, frontWidth * 2.83464566929134],
          info: {
            Title: this.getFileName(
              frontHeight,
              frontWidth,
              '',
              matrixLanguages,
              false,
              matrixFont,
              alarmSymbol,
              logoText,
              frontOutline,
              frontMirror
            ),
            Author: this.EXPORT_AUTHOR,
            Subject: this.EXPORT_SUBJECT,
            Keywords: this.EXPORT_KEYWORDS
          }
        };
        const doc = new PDFDocument(pdfOptions);
        const stream = doc.pipe(blobStream());

        // Workaround to get a color PDF, as well as to fine-tune the stroke width in case it is an Outline export.
        const svg = makerjs.exporter.toSVG(
          front,
          this.getSvgRenderOptions(frontOutline, colorFront, colorLight)
        );
        SVGtoPDF(doc, svg, 0, 0);

        // Preferred solution, as soon as makerjs can handle layer color and stroke width.
        // makerjs.exporter.toPDF(doc, front, {
        //   units: makerjs.unitType.Millimeter,
        // });

        stream.on('finish', function() {
          resolve(stream.toBlob('application/pdf'));
        });
        doc.end();
      });
    });
    return promise;
  }

  private getSvgRenderOptions(
    frontOutline: boolean,
    colorFront: string,
    colorLight: string
  ): makerjs.exporter.ISVGRenderOptions {
    let svgRenderOptions: makerjs.exporter.ISVGRenderOptions = {
      layerOptions: {
        background: { fill: colorFront, stroke: 'none' },
        minutes: { fill: colorLight, stroke: 'none' },
        text: { fill: colorLight, stroke: 'none' }
      }
    };
    if (frontOutline === true) {
      svgRenderOptions = {
        strokeWidth: '0.01mm'
      };
    }
    svgRenderOptions.svgAttrs = {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg'
    };
    svgRenderOptions.units = makerjs.unitType.Millimeter;

    // console.log('GeneratorService getSvgRenderOptions()', svgRenderOptions);
    return svgRenderOptions;
  }

  private calculateAlarmCoordinate(
    height: number,
    width: number,
    startX: number,
    startY: number
  ): ICoordinate[] {
    const grid: ICoordinate[] = [];
    const x = startX;
    const y = height - startY;
    grid.push({ x: x, y: y });
    // console.log('GeneratorService calculateAlarmCoordinate()', grid);
    return grid;
  }

  /**
   * Calculation of the individual points of the letters
   */
  private calculateLettersCoordinate(
    height: number,
    width: number,
    columns: number,
    rows: number,
    startX: number,
    startY: number
  ): ICoordinate[] {
    const grid: Array<{ x: number; y: number }> = [];
    const diffX = (width - 2 * startX) / (columns - 1);
    const diffY = (height - 2 * startY) / (rows - 1);

    /**
     * Maker.js uses the same coordinate system from basic mathematics and traditional drafting,
     * where x values increase from left to right, and y values increase from bottom to top.
     * Negative values are allowed.
     * Note that the SVG coordinate system is slightly different (Y values increase from top to bottom,
     * and negative values do not appear), but Maker.js will handle that for us automatically.
     * See: https://maker.js.org/docs/basic-drawing/#content
     */
    for (let row = 0; row < rows; row++) {
      const y = height - (row * diffY + startY);
      for (let column = 0; column < columns; column++) {
        const x = column * diffX + startX;
        grid.push({ x: x, y: y });
      }
    }
    // console.log('GeneratorService calculateLettersCoordinate()', grid);
    return grid;
  }

  private calculateLogoCoordinate(
    height: number,
    width: number,
    startX: number,
    startY: number
  ): ICoordinate[] {
    const grid: ICoordinate[] = [];
    const x = startX;
    const y = height - startY;
    grid.push({ x: x, y: y });
    // console.log('GeneratorService calculateLogoCoordinate()', grid);
    return grid;
  }

  private calculateMinutesCoordinate(
    height: number,
    width: number,
    startX: number,
    startY: number,
    mode: string
  ): ICoordinate[] {
    const grid: ICoordinate[] = [];
    switch (mode) {
      case 'horizontal':
        const diffX = (width - 2 * startX) / 3;
        for (let minute = 0; minute < 4; minute++) {
          grid.push({
            x: minute * diffX + startX,
            y: startY
          });
        }
        break;
      case 'vertical':
        const diffY = (height - 2 * startY) / 3;
        for (let minute = 0; minute < 4; minute++) {
          grid.push({
            x: startX,
            y: minute * diffY + startY
          });
        }
        break;
      case 'corner':
      default:
        // minute 1
        let x = startX;
        let y = startY;
        grid.push({ x: x, y: y });
        // minute 2
        x = width - startX;
        grid.push({ x: x, y: y });
        // minute 3
        y = height - startY;
        grid.push({ x: x, y: y });
        // minute 4
        x = startX;
        grid.push({ x: x, y: y });
        break;
    }
    // console.log('GeneratorService calculateMinutesCoordinate()', grid);
    return grid;
  }

  private async generateFrontModelAddBackground(
    frontHeight: number,
    frontWidth: number
  ) {
    // console.log('GeneratorService generateFrontModelAddBackground()', frontHeight, frontWidth);
    const models: makerjs.IModel[] = [];

    const promise = new Promise((resolve, reject) => {
      // Add Rectangle as background
      const background: makerjs.IModel = new makerjs.models.Rectangle(
        frontWidth,
        frontHeight
      );
      background.units = 'Millimeter';
      background.layer = 'background';
      models.push(background);
      resolve(models);
    });
    return promise;
  }

  private async generateFrontModelAddMinutes(
    minutesGrid: ICoordinate[],
    minutesRadius: number
  ) {
    // console.log('GeneratorService generateFrontModelAddMinutes()', minutesGrid, minutesRadius);
    const models: makerjs.IModel[] = [];

    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < minutesGrid.length; i++) {
        let model: makerjs.IModel = new makerjs.models.Oval(
          minutesRadius * 2,
          minutesRadius * 2
        );
        model.units = 'Millimeter';
        model = makerjs.model.move(model, [
          minutesGrid[i].x - minutesRadius,
          minutesGrid[i].y - minutesRadius
        ]);
        model.layer = 'minutes';
        models.push(model);
      }
      resolve(models);
    });
    return promise;
  }

  private async generateFrontModelAddAlarm(
    frontHeight: number,
    frontWidth: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmGrid: ICoordinate[]
  ) {
    // console.log('GeneratorService generateFrontModelAddAlarm()', frontHeight, frontWidth, alarmSymbol, alarmSize, alarmGrid);
    const models: makerjs.IModel[] = [];

    const promise = new Promise((resolve, reject) => {
      opentype.load(this.alarmFont, (error, font) => {
        if (error) {
          // console.log('GeneratorService generateFrontModelAddAlarm() opentype.load(alarmFont) - the font could not be loaded :(', error);
          reject(error);
        } else {
          // console.log('GeneratorService generateFrontModelAddAlarm() opentype.load(alarmFont) - SUCCESS');

          let model: makerjs.IModel = new makerjs.models.Text(
            font,
            alarmSymbol,
            alarmSize
          );
          model.units = 'Millimeter';
          const size = makerjs.measure.modelExtents(model);
          const width = size.center[0];
          const height = size.center[1];
          model = makerjs.model.move(model, [
            alarmGrid[0].x - width,
            alarmGrid[0].y - height
          ]);
          model.layer = 'text';
          models.push(model);
        }
        resolve(models);
      });
    });
    return promise;
  }

  private async generateFrontModelAddText(
    matrixFont: string,
    matrixFontSize: number,
    text: string[],
    lettersGrid: ICoordinate[]
  ) {
    // console.log('GeneratorService generateFrontModelAddText()', matrixFont, matrixFontSize, text, lettersGrid);
    const models: makerjs.IModel[] = [];

    const promise = new Promise((resolve, reject) => {
      opentype.load(matrixFont, (error, font) => {
        if (error) {
          // console.log('HomePage generateFrontModelAddText() - the font could not be loaded :(', error);
          reject(error);
        } else {
          // console.log('HomePage generateFrontModelAddText() - SUCCESS');
          for (let i = 0; i < text.length && i < lettersGrid.length; i++) {
            let model: makerjs.IModel = new makerjs.models.Text(
              font,
              text[i],
              matrixFontSize
            );
            model.units = 'Millimeter';

            let size = this.getLettersSize(
              model,
              font,
              text[i],
              matrixFontSize
            );
            // Special case, if a letter is not defined in the font file, e.g. X in Klingon
            if (size === undefined) {
              size = {
                high: [0],
                low: [0, 0],
                center: [0, 0],
                width: 0,
                height: 0
              };
            }

            const width = size.center[0];
            const height = size.center[1];
            model = makerjs.model.move(model, [
              lettersGrid[i].x - width,
              lettersGrid[i].y - height
            ]);
            model.layer = 'text';
            models.push(model);
          }
        }
        resolve(models);
      });
    });
    return promise;
  }

  private async generateFrontModelAddLogo(
    matrixFont: string,
    logoText: string,
    logoTextSize: number,
    logoGrid: ICoordinate[]
  ) {
    // console.log('GeneratorService generateFrontModelAddLogo()', matrixFont, logoText, logoTextSize, logoGrid);
    const models: makerjs.IModel[] = [];

    const promise = new Promise((resolve, reject) => {
      opentype.load(matrixFont, (error, font) => {
        if (error) {
          // console.log('HomePage generateFrontModelAddLogo() - the font could not be loaded :(', error);
          reject(error);
        } else {
          // console.log('HomePage generateFrontModelAddLogo() - SUCCESS');
          let model: makerjs.IModel = new makerjs.models.Text(
            font,
            logoText,
            logoTextSize
          );
          model.units = 'Millimeter';
          const size = makerjs.measure.modelExtents(model);
          const width = size.center[0];
          const height = size.center[1];
          model = makerjs.model.move(model, [
            logoGrid[0].x - width,
            logoGrid[0].y - height
          ]);
          model.layer = 'text';
          models.push(model);
        }
        resolve(models);
      });
    });
    return promise;
  }

  private async generateFrontModel(
    frontHeight: number,
    frontWidth: number,
    frontMirror: boolean,
    minutesPlacement: string,
    minutesRadius: number,
    minutesDistanceX: number,
    minutesDistanceY: number,
    alarmSymbol: string,
    alarmSize: number,
    alarmDistanceX: number,
    alarmDistanceY: number,
    matrixColumns: number,
    matrixRows: number,
    matrixDistanceX: number,
    matrixDistanceY: number,
    matrixLanguages: string,
    matrixText: string,
    matrixFont: string,
    matrixFontSize: number,
    logoText: string,
    logoTextSize: number,
    logoDistanceX: number,
    logoDistanceY: number,
    colorFront: string,
    colorLight: string
  ) {
    const front: any = {
      models: []
    };

    const resultBackground = await this.generateFrontModelAddBackground(
      frontHeight,
      frontWidth
    ).then(models => {
      front.models = front.models.concat(models);
    });

    // Add Minutes
    const minutesGrid = this.calculateMinutesCoordinate(
      frontHeight,
      frontWidth,
      minutesDistanceX,
      minutesDistanceY,
      minutesPlacement
    );
    const resultMinutes = await this.generateFrontModelAddMinutes(
      minutesGrid,
      minutesRadius
    ).then(models => {
      front.models = front.models.concat(models);
    });

    // Add Alarm
    if (alarmSymbol.length > 0) {
      const alarmGrid = this.calculateAlarmCoordinate(
        frontHeight,
        frontWidth,
        alarmDistanceX,
        alarmDistanceY
      );
      const resultAlarm = await this.generateFrontModelAddAlarm(
        frontHeight,
        frontWidth,
        alarmSymbol,
        alarmSize,
        alarmGrid
      ).then(models => {
        front.models = front.models.concat(models);
      });
    }

    // Add Text
    const text = this.prepareMatrixText(matrixText);
    const lettersGrid = this.calculateLettersCoordinate(
      frontHeight,
      frontWidth,
      matrixColumns,
      matrixRows,
      matrixDistanceX,
      matrixDistanceY
    );
    const resultText = await this.generateFrontModelAddText(
      matrixFont,
      matrixFontSize,
      text,
      lettersGrid
    ).then(models => {
      front.models = front.models.concat(models);
    });

    // Add Logo
    if (logoText.length > 0) {
      const logoGrid = this.calculateLogoCoordinate(
        frontHeight,
        frontWidth,
        logoDistanceX,
        logoDistanceY
      );
      const resultLogo = await this.generateFrontModelAddLogo(
        matrixFont,
        logoText,
        logoTextSize,
        logoGrid
      ).then(models => {
        front.models = front.models.concat(models);
      });
    }

    if (frontMirror === true) {
      for (let i = 0; i < front.models.length; i++) {
        front.models[i] = makerjs.model.mirror(front.models[i], true, false);
      }
    }

    return front;
  }

  private getLettersSize(
    model: makerjs.IModel,
    font: opentype.Font,
    letter: string,
    matrixFontSize: number
  ): makerjs.IMeasureWithCenter {
    let size: makerjs.IMeasureWithCenter;
    let char: makerjs.IModel;
    /**
     * Special case for calculating the height of non-standard characters, e.g. umlauts, accents or diacritical marks
     * Otherwise, for example, the points or the tilde of a letter in the height are also included in the calculation,
     * which leads to a wrong centered representation.
     */
    switch (letter) {
      case 'Á':
      case 'Ä':
      case 'Ă':
      case 'Å':
        char = new makerjs.models.Text(font, 'A', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      case 'Č':
      case 'Ç':
        char = new makerjs.models.Text(font, 'C', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      case 'Ě':
      case 'É':
      case 'Ê':
      case 'È':
        char = new makerjs.models.Text(font, 'E', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      case 'Ö':
      case 'Ó':
        char = new makerjs.models.Text(font, 'O', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      case 'Š':
      case 'Ş':
        char = new makerjs.models.Text(font, 'S', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      case 'Ü':
        char = new makerjs.models.Text(font, 'U', matrixFontSize);
        size = makerjs.measure.modelExtents(char);
        break;
      default:
        size = makerjs.measure.modelExtents(model);
        break;
    }
    return size;
  }

  /**
   * Creates the file name using the given parameters.
   * @example
   * getFileName(450,450,'CLT','DE',false,DINPro-Light,false,false,false,false)
   *  // returns '450x450_CLT_DE_DINPro-Light'
   *
   * @param {number} height The height of the front
   * @param {number} width The width of the front
   * @param {string} [variant=null]
   * @param {string} language The used language
   * @param {boolean} [isLanguageChanged=false]
   * @param {string} font Which font where used
   * @param {boolean} alarm Is an alarm selected
   * @param {boolean} logo Is a logo available
   * @param {boolean} outline Is file generate in outline
   * @param {boolean} mirror Is file generate in mirror mode
   * @returns {string} Returns the file name as string
   * @memberof GeneratorService
   */
  getFileName(
    height: number,
    width: number,
    variant: string = null,
    language: string,
    isLanguageChanged: boolean = false,
    font: string,
    alarmValue: string,
    logoText: string,
    outline: boolean,
    mirror: boolean
  ): string {
    let filename = height + 'x' + width;

    if (variant.length > 0) {
      // Add variante, e.g. CLT or 303
      filename = filename + '_' + variant;
    }
    // Add language, e.g. DE, EN, IT
    filename = filename + '_' + language;

    if (isLanguageChanged === true) {
      // Add additional hint when language text were changed
      filename = filename + '-Custom';
    }

    // Add font name, e.g. DINPro-Light, DIN-Q2, LaserLED
    filename = filename + '_' + font;

    if (alarmValue.length > 0) {
      // Add additional hint when alarm is selected
      filename = filename + '_Alarm';
    }

    if (logoText.length > 0) {
      // Add additional hint when logo is available
      filename = filename + '_Logo';
    }

    if (outline === true) {
      // Add additional hint if the front is generated in outline
      filename = filename + '_Outline';
    }

    if (mirror === true) {
      // Add additional hint if the front is generated in mirror mode
      filename = filename + '_Mirror';
    }

    return filename.replace(/ /g, '');
  }

  private prepareMatrixText(text: string): string[] {
    const letters = [];
    // Remove all new lines
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    for (let letter = 0; letter < text.length; letter++) {
      // SPECIAL CASE: Add Unicode Character 'APOSTROPHE' (U+0027) and 'ACUTE ACCENT' (U+00B4) to previous letter
      if (
        text.charCodeAt(letter + 1) === 39 ||
        text.charCodeAt(letter + 1) === 180
      ) {
        letters.push(text.charAt(letter) + text.charAt(letter + 1));
        letter = letter + 1;
      } else {
        letters.push(text.charAt(letter));
      }
    }
    // console.log('GeneratorService prepareMatrixText()', letters);
    return letters;
  }
}

export interface ICoordinate {
  x: number;
  y: number;
}
