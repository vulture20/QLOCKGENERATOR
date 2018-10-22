import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacementsService {

  public readonly DEFAULT_PLACEMENT_ID: number = 0;

  private _placements: IPlacement[] = [
    { id: 0, value: "corner", label: "Ecken" },
    { id: 1, value: "horizontal", label: "Waagerecht" },
    { id: 2, value: "vertical", label: "Senkrecht" }
  ];

  constructor() {
    // console.log("PlacementsService constructor()");
  }

  getDefaultPlacement(): IPlacement {
    // console.log("PlacementsService getDefaultPlacement()");
    return this.getPlacementById(this.DEFAULT_PLACEMENT_ID);
  }

  getPlacements(): IPlacement[] {
    console.log("PlacementsService getPlacements()");
    return this._placements;
  }

  getPlacementById(id): IPlacement {
    // console.log("PlacementsService getPlacementById()", id);
    let value: IPlacement = null;
    for (let i = 0; i < this._placements.length; i++) {
      if (this._placements[i].id == id) {
        value = this._placements[i];
        break;
      }
    }
    return value;
  }

  getPlacementByValue(val): IPlacement {
    // console.log("PlacementsService getPlacementById()", id);
    let value: IPlacement = null;
    for (let i = 0; i < this._placements.length; i++) {
      if (this._placements[i].value == val) {
        value = this._placements[i];
        break;
      }
    }
    return value;
  }

}

export interface IPlacement {
  id: number,
  value: string,
  label: string
}
