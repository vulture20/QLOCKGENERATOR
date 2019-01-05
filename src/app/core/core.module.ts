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

export interface ILanguage {
  /**
   * Language Code
   *
   * @type {string}
   * @memberof ILanguage
   */
  id: string;
  label: string;
  value: string;
}

interface IVariantDataInfo {
  supplier: string;
  model: string;
}

interface IVariantDataFront {
  width: number;
  height: number;
}

interface IVariantDataDistance {
  x: number;
  y: number;
}

interface IVariantDataMinutes {
  placement: string;
  radius: number;
  distance: IVariantDataDistance;
}

interface IVariantDataAlarm {
  show: boolean;
  size: number;
  distance: IVariantDataDistance;
}

interface IVariantDataFont {
  size: number;
}

interface IVariantDataMatrix {
  columns: number;
  rows: number;
  distance: IVariantDataDistance;
  font: IVariantDataFont;
}

interface IVariantDataLogo {
  text: string;
  size: number;
  distance: IVariantDataDistance;
}

interface IVariantData {
  info: IVariantDataInfo;
  front: IVariantDataFront;
  minutes: IVariantDataMinutes;
  alarm: IVariantDataAlarm;
  matrix: IVariantDataMatrix;
  logo: IVariantDataLogo;
}

export interface IVariant {
  id: string;
  data: IVariantData;
}

export interface IVariantGroupedBySupplier {
  name: string;
  variants: IVariant[];
}
