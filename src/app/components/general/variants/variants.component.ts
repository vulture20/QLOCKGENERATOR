import { IVariant, IVariantGroupedBySupplier } from './../../../core/core.module';
import { VariantsService } from './../../../services/variants/variants.service';
import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss']
})
export class VariantsComponent implements OnInit {
  variants: IVariantGroupedBySupplier[] = [];
  variantSelected: IVariant;

  constructor(private navParams: NavParams, private popoverCtrl: PopoverController, private variantsService: VariantsService) {
    // console.log("VariantsComponent constructor()", this.navParams.data);
    this.variants = this.variantsService.getVariantsGroupedBySupplier();
    if (this.navParams.data) {
      this.variantSelected = this.navParams.get('select');
    }
  }

  close(data: IVariant) {
    // console.log("VariantsComponent close()", data);
    this.popoverCtrl.dismiss(data, 'select');
  }

  ngOnInit() {
    // console.log("VariantsComponent ngOnInit()");
  }
}
