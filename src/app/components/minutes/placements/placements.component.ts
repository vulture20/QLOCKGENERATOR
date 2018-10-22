import { IPlacement, PlacementsService } from './../../../services/placements/placements.service';
import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss']
})
export class PlacementsComponent implements OnInit {

  protected placements: IPlacement[] = [];
  protected placementSelected: IPlacement;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private placementsService: PlacementsService,
  ) {
    // console.log("PlacementsComponent constructor()", this.navParams.data);
    this.placements = this.placementsService.getPlacements();
    if (this.navParams.data) {
      this.placementSelected = this.navParams.get("select");
    }
  }

  protected close(data: IPlacement, ) {
    // console.log("PlacementsComponent close()", data);
    this.popoverCtrl.dismiss(data, "select");
  }

  ngOnInit() {
    // console.log("PlacementsComponent ngOnInit()");
  }

}
