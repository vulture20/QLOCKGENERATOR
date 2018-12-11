import { VARIANTS } from './../../configs/variants';
import { IVariant, IVariantGroupedBySupplier } from './../../core/core.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {

  public readonly DEFAULT_VARIANT_ID: string = '000';

  private _variants: IVariant[] = VARIANTS;

  constructor() {
    // console.log('VariantService constructor()');
    this.getVariantsGroupedBySupplier();
  }

  getDefaultVariant(): IVariant {
    return this.getVariantById(this.DEFAULT_VARIANT_ID);
  }

  getVariants(): IVariant[] {
    return this._variants;
  }

  getVariantById(id): IVariant {
    // console.log('LanguagesService getVariantById()', id);
    let value: IVariant;
    for (let i = 0; i < this._variants.length; i++) {
      if (this._variants[i].id === id) {
        value = this._variants[i];
        break;
      }
    }
    return value;
  }

  getVariantsBySupplier(name): IVariant[] {
    const value: IVariant[] = [];
    for (let i = 0; i < this._variants.length; i++) {
      if (this._variants[i].data.info.supplier === name) {
        value.push(this._variants[i]);
      }
    }
    return value;
  }

  getVariantsGroupedBySupplier(): IVariantGroupedBySupplier[] {
    const value: IVariantGroupedBySupplier[] = [];

    for (let i = 0; i < this._variants.length; i++) {
      // Check if Supplier already exists in value
      const supplierExists = value.findIndex((element) => {
        return element.name === this._variants[i].data.info.supplier;
      });

      if (supplierExists === -1) {
        // Supplier not exists, add first variant entry
        const element: IVariantGroupedBySupplier = { name: this._variants[i].data.info.supplier, variants: [this._variants[i]] };
        value.push(element);
      } else {
        // Supplier exists, add variant entry
        value[supplierExists].variants.push(this._variants[i]);
      }
    }

    value.sort(this.sortSupplier);

    for (let i = 0; i < value.length; i++) {
      value[i].variants.sort(this.sortModelsBySupplier);
    }

    // console.log('VariantService getVariantsGroupedBySupplier()', value);
    return value;
  }

  // Alphabetical sort by supplier name
  private sortSupplier(a: IVariantGroupedBySupplier, b: IVariantGroupedBySupplier) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are equal
    return 0;
  }

  // Alphabetical sort by model name per supplier
  private sortModelsBySupplier(a: IVariant, b: IVariant) {
    const nameA = a.data.info.model.toUpperCase(); // ignore upper and lowercase
    const nameB = b.data.info.model.toUpperCase(); // ignore upper and lowercase
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
