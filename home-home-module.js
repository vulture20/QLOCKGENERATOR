(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/file-saver/FileSaver.js":
/*!**********************************************!*\
  !*** ./node_modules/file-saver/FileSaver.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js") !== null) && (__webpack_require__(/*! !webpack amd options */ "./node_modules/webpack/buildin/amd-options.js") !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "./src/app/components/alarm/symbols/symbols.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/components/alarm/symbols/symbols.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-list>\n  <ion-item *ngFor=\"let symbol of this.alarmSymbols\" (click)=\"close(symbol)\">\n    <ion-text slot=\"start\" class=\"alarm-symbol-value\">{{symbol.value}}</ion-text>\n    <ion-label>{{symbol.label}}</ion-label>\n    <ion-icon *ngIf=\"symbol.id == this.alarmSymbolSelected.id\" name=\"checkmark\" slot=\"end\"></ion-icon>\n  </ion-item>\n</ion-list>"

/***/ }),

/***/ "./src/app/components/alarm/symbols/symbols.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/components/alarm/symbols/symbols.component.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".alarm-symbol-value {\n  font-family: Alarm-Symbols;\n  width: 10%; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zaW1vbmdvbG1zL0RldmVsb3BtZW50L1FMT0NLR0VORVJBVE9SL3NyYy9hcHAvY29tcG9uZW50cy9hbGFybS9zeW1ib2xzL3N5bWJvbHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSwyQkFBMEI7RUFDMUIsV0FBVSxFQUNiIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9hbGFybS9zeW1ib2xzL3N5bWJvbHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYWxhcm0tc3ltYm9sLXZhbHVlIHtcbiAgICBmb250LWZhbWlseTogQWxhcm0tU3ltYm9scztcbiAgICB3aWR0aDogMTAlO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/components/alarm/symbols/symbols.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/alarm/symbols/symbols.component.ts ***!
  \***************************************************************/
/*! exports provided: SymbolsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolsComponent", function() { return SymbolsComponent; });
/* harmony import */ var _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/fonts/fonts.service */ "./src/app/services/fonts/fonts.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SymbolsComponent = /** @class */ (function () {
    function SymbolsComponent(navParams, popoverCtrl, fontsService) {
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.fontsService = fontsService;
        this.alarmSymbols = [];
        // console.log("SymbolsComponent constructor()", this.navParams.data);
        this.alarmSymbols = this.fontsService.getAlarms();
        if (this.navParams.data) {
            this.alarmSymbolSelected = this.navParams.get("select");
        }
    }
    SymbolsComponent.prototype.close = function (data) {
        // console.log("SymbolsComponent close()", data);
        this.popoverCtrl.dismiss(data, "select");
    };
    SymbolsComponent.prototype.ngOnInit = function () {
        // console.log("SymbolsComponent ngOnInit()");
    };
    SymbolsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-symbols',
            template: __webpack_require__(/*! ./symbols.component.html */ "./src/app/components/alarm/symbols/symbols.component.html"),
            styles: [__webpack_require__(/*! ./symbols.component.scss */ "./src/app/components/alarm/symbols/symbols.component.scss")],
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_2__["NavParams"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["PopoverController"],
            _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_0__["FontsService"]])
    ], SymbolsComponent);
    return SymbolsComponent;
}());



/***/ }),

/***/ "./src/app/components/components.module.ts":
/*!*************************************************!*\
  !*** ./src/app/components/components.module.ts ***!
  \*************************************************/
/*! exports provided: ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./alarm/symbols/symbols.component */ "./src/app/components/alarm/symbols/symbols.component.ts");
/* harmony import */ var _general_variants_variants_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./general/variants/variants.component */ "./src/app/components/general/variants/variants.component.ts");
/* harmony import */ var _matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./matrix/fonts/fonts.component */ "./src/app/components/matrix/fonts/fonts.component.ts");
/* harmony import */ var _matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./matrix/languages/languages.component */ "./src/app/components/matrix/languages/languages.component.ts");
/* harmony import */ var _minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./minutes/placements/placements.component */ "./src/app/components/minutes/placements/placements.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_3__["SymbolsComponent"],
                _general_variants_variants_component__WEBPACK_IMPORTED_MODULE_4__["VariantsComponent"],
                _matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_5__["FontsComponent"],
                _matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_6__["LanguagesComponent"],
                _minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_7__["PlacementsComponent"]
            ],
            entryComponents: [
                _alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_3__["SymbolsComponent"],
                _general_variants_variants_component__WEBPACK_IMPORTED_MODULE_4__["VariantsComponent"],
                _matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_5__["FontsComponent"],
                _matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_6__["LanguagesComponent"],
                _minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_7__["PlacementsComponent"]
            ],
            imports: [
                _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]
            ],
            exports: [
                _alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_3__["SymbolsComponent"],
                _general_variants_variants_component__WEBPACK_IMPORTED_MODULE_4__["VariantsComponent"],
                _matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_5__["FontsComponent"],
                _matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_6__["LanguagesComponent"],
                _minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_7__["PlacementsComponent"]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());



/***/ }),

/***/ "./src/app/components/general/variants/variants.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/general/variants/variants.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-list>\n  <ng-container *ngFor=\"let supplier of this.variants\">\n    <ion-item-divider>\n      <ion-label>{{supplier.name}}</ion-label>\n    </ion-item-divider>\n    <ion-item *ngFor=\"let variant of this.supplier.variants\" (click)=\"close(variant)\">\n      <ion-label>{{variant.data.info.model}}</ion-label>\n      <!-- <ion-icon *ngIf=\"symbol.id == this.alarmSymbolSelected.id\" name=\"checkmark\" slot=\"end\"></ion-icon> -->\n    </ion-item>\n  </ng-container>\n</ion-list>"

/***/ }),

/***/ "./src/app/components/general/variants/variants.component.scss":
/*!*********************************************************************!*\
  !*** ./src/app/components/general/variants/variants.component.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZ2VuZXJhbC92YXJpYW50cy92YXJpYW50cy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/general/variants/variants.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/general/variants/variants.component.ts ***!
  \*******************************************************************/
/*! exports provided: VariantsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariantsComponent", function() { return VariantsComponent; });
/* harmony import */ var _services_variants_variants_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../services/variants/variants.service */ "./src/app/services/variants/variants.service.ts");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var VariantsComponent = /** @class */ (function () {
    function VariantsComponent(navParams, popoverCtrl, variantsService) {
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.variantsService = variantsService;
        this.variants = [];
        // console.log("VariantsComponent constructor()", this.navParams.data);
        this.variants = this.variantsService.getVariantsGroupedBySupplier();
        if (this.navParams.data) {
            this.variantSelected = this.navParams.get("select");
        }
    }
    VariantsComponent.prototype.close = function (data) {
        // console.log("VariantsComponent close()", data);
        this.popoverCtrl.dismiss(data, "select");
    };
    VariantsComponent.prototype.ngOnInit = function () {
        // console.log("VariantsComponent ngOnInit()");
    };
    VariantsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-variants',
            template: __webpack_require__(/*! ./variants.component.html */ "./src/app/components/general/variants/variants.component.html"),
            styles: [__webpack_require__(/*! ./variants.component.scss */ "./src/app/components/general/variants/variants.component.scss")]
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["NavParams"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
            _services_variants_variants_service__WEBPACK_IMPORTED_MODULE_0__["VariantsService"]])
    ], VariantsComponent);
    return VariantsComponent;
}());



/***/ }),

/***/ "./src/app/components/matrix/fonts/fonts.component.html":
/*!**************************************************************!*\
  !*** ./src/app/components/matrix/fonts/fonts.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-list>\n  <ng-container *ngFor=\"let category of this.fonts\">\n    <ion-item-divider>\n      <ion-label>{{category.category}}</ion-label>\n    </ion-item-divider>\n\n    <ion-item *ngFor=\"let font of this.category.fonts\" (click)=\"close(font)\">\n      <ion-label>\n        <ion-text color=\"tertiary\">\n          <p>{{font.label}}</p>\n        </ion-text>\n        <ion-text text-wrap [style.font-family]=\"font.label\">{{this.teaserText}}</ion-text>\n      </ion-label>\n      <ion-icon *ngIf=\"font.id == this.fontSelected.id\" name=\"checkmark\" slot=\"end\"></ion-icon>\n    </ion-item>\n  </ng-container>\n</ion-list>"

/***/ }),

/***/ "./src/app/components/matrix/fonts/fonts.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/components/matrix/fonts/fonts.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbWF0cml4L2ZvbnRzL2ZvbnRzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/matrix/fonts/fonts.component.ts":
/*!************************************************************!*\
  !*** ./src/app/components/matrix/fonts/fonts.component.ts ***!
  \************************************************************/
/*! exports provided: FontsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontsComponent", function() { return FontsComponent; });
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../services/fonts/fonts.service */ "./src/app/services/fonts/fonts.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FontsComponent = /** @class */ (function () {
    function FontsComponent(navParams, popoverCtrl, fontService) {
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.fontService = fontService;
        this.fonts = [];
        // console.log("VariantsComponent constructor()", this.navParams.data);
        this.fonts = this.fontService.getFontsGroupedByCategory();
        if (this.navParams.data) {
            this.fontSelected = this.navParams.get("select");
            this.teaserText = this.navParams.get("text");
            if (this.teaserText == undefined) {
                this.teaserText = "LOREM IPSUM DOLOR";
            }
        }
    }
    FontsComponent.prototype.close = function (data) {
        // console.log("VariantsComponent close()", data);
        this.popoverCtrl.dismiss(data, "select");
    };
    FontsComponent.prototype.ngOnInit = function () {
        // console.log("VariantsComponent ngOnInit()");
    };
    FontsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-fonts',
            template: __webpack_require__(/*! ./fonts.component.html */ "./src/app/components/matrix/fonts/fonts.component.html"),
            styles: [__webpack_require__(/*! ./fonts.component.scss */ "./src/app/components/matrix/fonts/fonts.component.scss")]
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_0__["NavParams"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_0__["PopoverController"],
            _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_2__["FontsService"]])
    ], FontsComponent);
    return FontsComponent;
}());



/***/ }),

/***/ "./src/app/components/matrix/languages/languages.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/components/matrix/languages/languages.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-list>\n  <ion-item *ngFor=\"let language of this.languages\" (click)=\"close(language)\">\n    <ion-label>\n      <ion-text text-wrap color=\"tertiary\">\n        <p>{{language.label}}</p>\n      </ion-text>\n      <ion-text>{{language.value}}</ion-text>\n    </ion-label>\n    <ion-icon *ngIf=\"language.id == this.languageSelected.id\" name=\"checkmark\" slot=\"end\"></ion-icon>\n  </ion-item>\n</ion-list>"

/***/ }),

/***/ "./src/app/components/matrix/languages/languages.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/components/matrix/languages/languages.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbWF0cml4L2xhbmd1YWdlcy9sYW5ndWFnZXMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/matrix/languages/languages.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/components/matrix/languages/languages.component.ts ***!
  \********************************************************************/
/*! exports provided: LanguagesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LanguagesComponent", function() { return LanguagesComponent; });
/* harmony import */ var _services_languages_languages_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../services/languages/languages.service */ "./src/app/services/languages/languages.service.ts");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LanguagesComponent = /** @class */ (function () {
    function LanguagesComponent(navParams, popoverCtrl, languagesService) {
        // console.log("LanguagesComponent constructor()");
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.languagesService = languagesService;
        this.languages = [];
        this.languages = this.languagesService.getLanguages();
        this.languages.forEach(function (element) {
            element.value = element.value.replace(/\s/g, "").substr(0, 15);
        });
        if (this.navParams.data) {
            this.languageSelected = this.navParams.get("select");
        }
    }
    LanguagesComponent.prototype.close = function (data) {
        // console.log("LanguagesComponent close()", data);
        this.popoverCtrl.dismiss(data, "select");
    };
    LanguagesComponent.prototype.ngOnInit = function () {
        // console.log("LanguagesComponent ngOnInit()");
    };
    LanguagesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-languages',
            template: __webpack_require__(/*! ./languages.component.html */ "./src/app/components/matrix/languages/languages.component.html"),
            styles: [__webpack_require__(/*! ./languages.component.scss */ "./src/app/components/matrix/languages/languages.component.scss")],
            providers: [_services_languages_languages_service__WEBPACK_IMPORTED_MODULE_0__["LanguagesService"]]
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["NavParams"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
            _services_languages_languages_service__WEBPACK_IMPORTED_MODULE_0__["LanguagesService"]])
    ], LanguagesComponent);
    return LanguagesComponent;
}());



/***/ }),

/***/ "./src/app/components/minutes/placements/placements.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/minutes/placements/placements.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-list>\n  <ion-item *ngFor=\"let placement of this.placements\" (click)=\"close(placement)\">\n    <ion-label>{{placement.label}}</ion-label>\n    <ion-icon *ngIf=\"placement.id == this.placementSelected.id\" name=\"checkmark\" slot=\"end\"></ion-icon>\n  </ion-item>\n</ion-list>"

/***/ }),

/***/ "./src/app/components/minutes/placements/placements.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/minutes/placements/placements.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbWludXRlcy9wbGFjZW1lbnRzL3BsYWNlbWVudHMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/minutes/placements/placements.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/minutes/placements/placements.component.ts ***!
  \***********************************************************************/
/*! exports provided: PlacementsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlacementsComponent", function() { return PlacementsComponent; });
/* harmony import */ var _services_placements_placements_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../services/placements/placements.service */ "./src/app/services/placements/placements.service.ts");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PlacementsComponent = /** @class */ (function () {
    function PlacementsComponent(navParams, popoverCtrl, placementsService) {
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.placementsService = placementsService;
        this.placements = [];
        // console.log("PlacementsComponent constructor()", this.navParams.data);
        this.placements = this.placementsService.getPlacements();
        if (this.navParams.data) {
            this.placementSelected = this.navParams.get("select");
        }
    }
    PlacementsComponent.prototype.close = function (data) {
        // console.log("PlacementsComponent close()", data);
        this.popoverCtrl.dismiss(data, "select");
    };
    PlacementsComponent.prototype.ngOnInit = function () {
        // console.log("PlacementsComponent ngOnInit()");
    };
    PlacementsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-placements',
            template: __webpack_require__(/*! ./placements.component.html */ "./src/app/components/minutes/placements/placements.component.html"),
            styles: [__webpack_require__(/*! ./placements.component.scss */ "./src/app/components/minutes/placements/placements.component.scss")]
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["NavParams"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
            _services_placements_placements_service__WEBPACK_IMPORTED_MODULE_0__["PlacementsService"]])
    ], PlacementsComponent);
    return PlacementsComponent;
}());



/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/components.module */ "./src/app/components/components.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var HomePageModule = /** @class */ (function () {
    function HomePageModule() {
    }
    HomePageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild([
                    {
                        path: '',
                        component: _home_page__WEBPACK_IMPORTED_MODULE_5__["HomePage"]
                    }
                ]),
                _components_components_module__WEBPACK_IMPORTED_MODULE_6__["ComponentsModule"]
            ],
            declarations: [_home_page__WEBPACK_IMPORTED_MODULE_5__["HomePage"]]
        })
    ], HomePageModule);
    return HomePageModule;
}());



/***/ }),

/***/ "./src/app/home/home.page.html":
/*!*************************************!*\
  !*** ./src/app/home/home.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar color=\"primary\">\n    <ion-buttons slot=\"start\">\n      <ion-menu-button color=\"light\"></ion-menu-button>\n    </ion-buttons>\n    <ion-title>\n      QLOCKGENERATOR\n    </ion-title>\n    <ion-buttons slot=\"end\">\n      <ion-button (click)=\"this.onClickGithubLogo()\">\n        <ion-icon slot=\"icon-only\" name=\"logo-github\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-grid>\n    <ion-row align-items-start>\n      <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" size-xl=\"2\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text>\n              <h2>Allgemein</h2>\n            </ion-text>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Variante</ion-label>\n              <ion-input [(ngModel)]=\"this.generalFrontVariant.data.info.model\" readonly=\"true\" (ionFocus)=\"this.onClickFrontVariant()\">\n                <ion-icon name=\"arrow-dropdown\"></ion-icon>\n              </ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Höhe (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.generalFrontHeight\" debounce=\"300\" (ionChange)=\"this.onChangeFrontHeight($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Breite (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.generalFrontWidth\" debounce=\"300\" (ionChange)=\"this.onChangeFrontWidth($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label>Spiegelverkehrt</ion-label>\n              <ion-toggle [(ngModel)]=\"this.generalFrontMirror\" slot=\"end\" debounce=\"300\" (ionChange)=\"this.onChangeFrontMirror()\"></ion-toggle>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label>Outline</ion-label>\n              <ion-toggle [(ngModel)]=\"this.generalFrontOutline\" slot=\"end\" debounce=\"300\" (ionChange)=\"this.onChangeFrontMirror()\"></ion-toggle>\n            </ion-item>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" size-xl=\"2\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <h2>Minuten</h2>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Platzierung</ion-label>\n              <ion-input [(ngModel)]=\"this.minutesPlacement.label\" readonly=\"true\" (ionFocus)=\"this.onClickMinutesPlacement($event)\">\n                <ion-icon name=\"arrow-dropdown\"></ion-icon>\n              </ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Radius (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.minutesRadius\" debounce=\"300\" (ionChange)=\"this.onChangeMinutesRadius($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Abstand X (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.minutesDistanceX\" debounce=\"300\" (ionChange)=\"this.onChangeMinutesDistanceX($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Abstand Y (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.minutesDistanceY\" debounce=\"300\" (ionChange)=\"this.onChangeMinutesDistanceY($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" size-xl=\"2\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text>\n              <h2>Alarm</h2>\n            </ion-text>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item lines=\"full\">\n              <ion-label position=\"stacked\">Symbol</ion-label>\n              <ion-input [(ngModel)]=\"this.alarmSymbol.label\" readonly=\"true\" (ionFocus)=\"this.onClickAlarmSymbol($event)\">\n                <ion-icon name=\"arrow-dropdown\"></ion-icon>\n              </ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Größe (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.alarmSize\" debounce=\"300\" (ionChange)=\"this.onChangeAlarmSize($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Abstand X (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.alarmDistanceX\" debounce=\"300\" (ionChange)=\"this.onChangeAlarmDistanceX($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Abstand Y (mm)</ion-label>\n              <ion-input type=\"number\" [ngModel]=\"this.alarmDistanceY\" debounce=\"300\" (ionChange)=\"this.onChangeAlarmDistanceY($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col size=\"12\" size-sm=\"12\" size-md=\"12\" size-xl=\"6\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text>\n              <h2>Matrix</h2>\n            </ion-text>\n          </ion-col>\n          <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" no-padding>\n            <ion-row>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Spalten</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.matrixColumns\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixColumns($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Zeilen</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.matrixRows\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixRows($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Abstand X (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.matrixDistanceX\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixDistanceX($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Abstand Y (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.matrixDistanceY\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixDistanceY($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n          <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" no-padding>\n            <ion-row>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Sprache</ion-label>\n                  <ion-input [(ngModel)]=\"this.matrixLanguage.label\" readonly=\"true\" (ionFocus)=\"this.onClickMatrixLanguage($event)\">\n                    <ion-icon name=\"arrow-dropdown\"></ion-icon>\n                  </ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Text</ion-label>\n                  <ion-textarea rows=\"10\" [(ngModel)]=\"this.matrixText\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixText($event)\"></ion-textarea>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n          <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" no-padding>\n            <ion-row>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Schriftart</ion-label>\n                  <ion-input [(ngModel)]=\"this.matrixFont.label\" readonly=\"true\" (ionFocus)=\"this.onClickMatrixFont($event)\">\n                    <ion-icon name=\"arrow-dropdown\"></ion-icon>\n                  </ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Schriftgröße (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.matrixFontSize\" debounce=\"300\" (ionChange)=\"this.onChangeMatrixFontSize($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col size=\"12\" size-sm=\"12\" size-md=\"8\" size-xl=\"4\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text>\n              <h2>Logo</h2>\n            </ion-text>\n          </ion-col>\n          <ion-col size=\"12\" size-sm=\"6\" size-md=\"6\" no-padding>\n            <ion-row>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Text</ion-label>\n                  <ion-input type=\"text\" [ngModel]=\"this.logoText\" debounce=\"300\" (ionChange)=\"this.onChangeLogoText($event)\"\n                    placeholder=\"QLOCKGENERATOR\"></ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Größe (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.logoTextSize\" debounce=\"300\" (ionChange)=\"this.onChangeLogoTextSize($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n          <ion-col size=\"12\" size-sm=\"6\" size-md=\"6\" no-padding>\n            <ion-row>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Abstand X (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.logoDistanceX\" debounce=\"300\" (ionChange)=\"this.onChangeLogoDistanceX($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n              <ion-col size=\"12\">\n                <ion-item>\n                  <ion-label position=\"stacked\">Abstand Y (mm)</ion-label>\n                  <ion-input type=\"number\" [ngModel]=\"this.logoDistanceY\" debounce=\"300\" (ionChange)=\"this.onChangeLogoDistanceY($event)\"></ion-input>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col size=\"12\" size-sm=\"6\" size-md=\"4\" size-xl=\"2\">\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text>\n              <h2>Farbe</h2>\n            </ion-text>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Front</ion-label>\n              <ion-input type=\"text\" [(ngModel)]=\"this.colorFront\" debounce=\"300\" (ionChange)=\"this.onChangeColorFront($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n          <ion-col size=\"12\">\n            <ion-item>\n              <ion-label position=\"stacked\">Beleuchtung</ion-label>\n              <ion-input type=\"text\" [(ngModel)]=\"this.colorLight\" debounce=\"300\" (ionChange)=\"this.onChangeColorLight($event)\"></ion-input>\n            </ion-item>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n    </ion-row>\n    <ion-row margin-top margin-bottom justify-content-center>\n      <ion-col size=\"12\">\n        <ion-text>\n          <h2>Vorschau</h2>\n        </ion-text>\n      </ion-col>\n      <ion-col size=\"8\" text-center>\n        <div #drawing id=\"drawing\"></div>\n      </ion-col>\n    </ion-row>\n    <ion-row margin-top>\n      <ion-col size=\"12\">\n        <ion-text>\n          <h2>Export</h2>\n        </ion-text>\n      </ion-col>\n      <ion-col text-center>\n        <ion-button color=\"primary\" expand=\"block\" fill=\"outline\" (click)=\"this.exportAsSVG()\">SVG</ion-button>\n      </ion-col>\n      <ion-col text-center>\n        <ion-button color=\"primary\" expand=\"block\" fill=\"outline\" (click)=\"this.exportAsDXF()\">DXF</ion-button>\n      </ion-col>\n      <ion-col text-center>\n        <ion-button color=\"primary\" expand=\"block\" fill=\"outline\" (click)=\"this.exportAsPDF()\">PDF</ion-button>\n      </ion-col>\n      <ion-col text-center>\n        <ion-button color=\"primary\" expand=\"block\" fill=\"outline\" (click)=\"this.exportAsPNG()\">PNG</ion-button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n</ion-content>"

/***/ }),

/***/ "./src/app/home/home.page.scss":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ion-textarea {\n  white-space: pre; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zaW1vbmdvbG1zL0RldmVsb3BtZW50L1FMT0NLR0VORVJBVE9SL3NyYy9hcHAvaG9tZS9ob21lLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFnQixFQUNuQiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpb24tdGV4dGFyZWEge1xuICAgIHdoaXRlLXNwYWNlOiBwcmU7XG59Il19 */"

/***/ }),

/***/ "./src/app/home/home.page.ts":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var _services_placements_placements_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../services/placements/placements.service */ "./src/app/services/placements/placements.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../services/fonts/fonts.service */ "./src/app/services/fonts/fonts.service.ts");
/* harmony import */ var _services_generator_generator_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../services/generator/generator.service */ "./src/app/services/generator/generator.service.ts");
/* harmony import */ var _services_languages_languages_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/languages/languages.service */ "./src/app/services/languages/languages.service.ts");
/* harmony import */ var _services_variants_variants_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/variants/variants.service */ "./src/app/services/variants/variants.service.ts");
/* harmony import */ var _components_alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../components/alarm/symbols/symbols.component */ "./src/app/components/alarm/symbols/symbols.component.ts");
/* harmony import */ var _components_general_variants_variants_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../components/general/variants/variants.component */ "./src/app/components/general/variants/variants.component.ts");
/* harmony import */ var _components_matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/matrix/languages/languages.component */ "./src/app/components/matrix/languages/languages.component.ts");
/* harmony import */ var _components_matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../components/matrix/fonts/fonts.component */ "./src/app/components/matrix/fonts/fonts.component.ts");
/* harmony import */ var _components_minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./../components/minutes/placements/placements.component */ "./src/app/components/minutes/placements/placements.component.ts");
/* harmony import */ var file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! file-saver/FileSaver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};













var HomePage = /** @class */ (function () {
    function HomePage(generator, languagesService, fontService, variantsService, placementsService, popoverController) {
        this.generator = generator;
        this.languagesService = languagesService;
        this.fontService = fontService;
        this.variantsService = variantsService;
        this.placementsService = placementsService;
        this.popoverController = popoverController;
        this.generalFrontVariants = [];
        this.generalFrontHeight = 450;
        this.generalFrontWidth = 450;
        this.generalFrontMirror = false;
        this.generalFrontOutline = false;
        this.minutesPlacement = { id: 0, value: "corner", label: "Ecken" };
        this.minutesRadius = 1;
        this.minutesDistanceX = 25;
        this.minutesDistanceY = 25;
        this.alarmSymbol = { id: "0", label: "Ohne", category: _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_3__["FontCategory"].REGULAR, filename: null, path: null, value: "", };
        this.alarmSymbols = [];
        this.alarmSize = 11;
        this.alarmDistanceX = 225;
        this.alarmDistanceY = 25;
        this.matrixColumns = 11;
        this.matrixRows = 10;
        this.matrixDistanceX = 83.5;
        this.matrixDistanceY = 83.5;
        this.matrixLanguage = { id: "DE", label: "DE Deutsch", value: "" };
        this.matrixLanguages = [];
        this.matrixText = "ESKISTAFÜNF\nZEHNZWANZIG\nDREIVIERTEL\nVORFUNKNACH\nHALBAELFÜNF\nEINSXAMZWEI\nDREIPMJVIER\nSECHSNLACHT\nSIEBENZWÖLF\nZEHNEUNKUHR";
        this.matrixFont = { id: "4000", label: "DIN", category: _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_3__["FontCategory"].REGULAR, filename: "7737a754866a4378500fbf0a6808fe54.ttf", path: "./assets/fonts/", };
        this.matrixFonts = [];
        this.matrixFontSize = 21;
        this.logoText = "";
        this.logoTextSize = 5.25;
        this.logoDistanceX = 225;
        this.logoDistanceY = 425;
        this.colorFront = "#000000";
        this.colorLight = "#FFFFFF";
        // console.log("HomePage constructor()");
        this.alarmSymbols = this.fontService.getAlarms();
        this.matrixLanguages = this.languagesService.getLanguages();
        this.matrixFonts = this.fontService.getFonts();
        this.generalFrontVariant = this.variantsService.getVariantById("000");
        this.generalFrontVariants = this.variantsService.getVariantsGroupedBySupplier();
    }
    HomePage.prototype.ngAfterViewInit = function () {
        var _this = this;
        // console.log("HomePage ngOnInit()");
        this.generator.preview.subscribe(function (preview) {
            _this.drawing.nativeElement.innerHTML = preview;
        });
        this.generateFrontPreview();
    };
    HomePage.prototype.onClickGithubLogo = function () {
        // console.log("HomePage onClickGithubLogo()");
        window.open("https://github.com/SimonGolms/QLOCKGENERATOR");
    };
    HomePage.prototype.onChangeFrontVariant = function () {
        // console.log("HomePage onChangeFrontVariant()");
    };
    HomePage.prototype.onClickFrontVariant = function () {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _components_general_variants_variants_component__WEBPACK_IMPORTED_MODULE_8__["VariantsComponent"],
                            componentProps: { select: this.generalFrontVariant },
                            event: event,
                            translucent: true
                        })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            // console.log("HomePage onClickFrontVariant() - popover.onDidDismiss()", data);
                            if (data.role == "select") {
                                _this.generalFrontVariant = data.data;
                                _this.generalFrontHeight = _this.generalFrontVariant.data.front.height;
                                _this.generalFrontWidth = _this.generalFrontVariant.data.front.width;
                                _this.minutesPlacement = _this.placementsService.getPlacementByValue(_this.generalFrontVariant.data.minutes.placement);
                                _this.minutesRadius = _this.generalFrontVariant.data.minutes.radius;
                                _this.minutesDistanceX = _this.generalFrontVariant.data.minutes.distance.x;
                                _this.minutesDistanceY = _this.generalFrontVariant.data.minutes.distance.y;
                                if (_this.generalFrontVariant.data.alarm.show == true) {
                                    _this.alarmSymbol = _this.fontService.getAlarmById(_this.fontService.DEFAULT_ALARM_SYMBOL_ID);
                                }
                                else {
                                    _this.alarmSymbol = _this.fontService.getAlarmById(_this.fontService.DEFAULT_ALARM_SYMBOL_NONE_ID);
                                }
                                _this.alarmSize = _this.generalFrontVariant.data.alarm.size;
                                _this.alarmDistanceX = _this.generalFrontVariant.data.alarm.distance.x;
                                _this.alarmDistanceY = _this.generalFrontVariant.data.alarm.distance.y;
                                _this.matrixColumns = _this.generalFrontVariant.data.matrix.columns;
                                _this.matrixRows = _this.generalFrontVariant.data.matrix.rows;
                                _this.matrixDistanceX = _this.generalFrontVariant.data.matrix.distance.x;
                                _this.matrixDistanceY = _this.generalFrontVariant.data.matrix.distance.y;
                                _this.matrixFontSize = _this.generalFrontVariant.data.matrix.font.size;
                                _this.logoTextSize = _this.generalFrontVariant.data.logo.size;
                                _this.logoDistanceX = _this.generalFrontVariant.data.logo.distance.x;
                                _this.logoDistanceY = _this.generalFrontVariant.data.logo.distance.y;
                                _this.generateFrontPreview();
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.onChangeFrontHeight = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeFrontHeight()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.generalFrontHeight != event.detail.value)) {
            this.generalFrontHeight = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeFrontWidth = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeFrontWidth()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.generalFrontWidth != event.detail.value)) {
            this.generalFrontWidth = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeFrontMirror = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeFrontMirror()", event);
        this.generateFrontPreview();
    };
    HomePage.prototype.onChangeFrontOutline = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeFrontOutline()", event);
        this.generateFrontPreview();
    };
    HomePage.prototype.onChangeMinutesPlacement = function (event) {
        if (event === void 0) { event = null; }
        console.log("HomePage onChangeMinutesPlacement()", event, this.minutesPlacement);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        // if ((event != null)) {
        //   console.log("HomePage onChangeMinutesPlacement() IF", event, this.minutesPlacement);
        //   this.minutesPlacement = event.detail.value;
        // }
        this.generateFrontPreview();
    };
    HomePage.prototype.onClickMinutesPlacement = function (event) {
        if (event === void 0) { event = null; }
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("HomePage onClickMinutesPlacement()", event);
                        return [4 /*yield*/, this.popoverController.create({
                                component: _components_minutes_placements_placements_component__WEBPACK_IMPORTED_MODULE_11__["PlacementsComponent"],
                                componentProps: { select: this.minutesPlacement },
                                event: event,
                                translucent: true
                            })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            console.log("HomePage onClickMinutesPlacement() - popover.onDidDismiss()", data);
                            if (data.role == "select") {
                                _this.minutesPlacement = data.data;
                                _this.generateFrontPreview();
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.onChangeMinutesRadius = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMinutesRadius()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.minutesRadius != event.detail.value)) {
            this.minutesRadius = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMinutesDistanceX = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMinutesDistanceX()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.minutesDistanceX != event.detail.value)) {
            this.minutesDistanceX = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMinutesDistanceY = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMinutesDistanceY()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.minutesDistanceY != event.detail.value)) {
            this.minutesDistanceY = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeAlarmSymbol = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeAlarmSymbol()", event);
    };
    HomePage.prototype.onClickAlarmSymbol = function (event) {
        if (event === void 0) { event = null; }
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _components_alarm_symbols_symbols_component__WEBPACK_IMPORTED_MODULE_7__["SymbolsComponent"],
                            componentProps: { select: this.alarmSymbol },
                            event: event,
                            translucent: true
                        })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            // console.log("HomePage onClickAlarmSymbol() - popover.onDidDismiss()", data);
                            if (data.role == "select") {
                                _this.alarmSymbol = data.data;
                                _this.generateFrontPreview();
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.onChangeAlarmSize = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeAlarmSize()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.alarmSize != event.detail.value)) {
            this.alarmSize = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeAlarmDistanceX = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeAlarmDistanceX()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.alarmDistanceX != event.detail.value)) {
            this.alarmDistanceX = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeAlarmDistanceY = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeAlarmDistanceY()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.alarmDistanceY != event.detail.value)) {
            this.alarmDistanceY = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMatrixColumns = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixColumns()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.matrixColumns != event.detail.value)) {
            this.matrixColumns = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMatrixRows = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixRows()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.matrixRows != event.detail.value)) {
            this.matrixRows = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMatrixDistanceX = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixDistanceX()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.matrixDistanceX != event.detail.value)) {
            this.matrixDistanceX = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMatrixDistanceY = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixDistanceY()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.matrixDistanceY != event.detail.value)) {
            this.matrixDistanceY = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeMatrixLanguage = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixLanguage()", event);
    };
    HomePage.prototype.onClickMatrixLanguage = function (event) {
        if (event === void 0) { event = null; }
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _components_matrix_languages_languages_component__WEBPACK_IMPORTED_MODULE_9__["LanguagesComponent"],
                            componentProps: {
                                select: this.matrixLanguage,
                            },
                            event: event,
                        })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            // console.log("HomePage onClickMatrixLanguage() - popover.onDidDismiss()", data);
                            if (data.role == "select") {
                                _this.matrixLanguage = data.data;
                                _this.matrixText = _this.languagesService.getLanguageValueById(_this.matrixLanguage.id);
                                _this.generateFrontPreview();
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.onChangeMatrixText = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixText()", event);
        this.generateFrontPreview();
    };
    HomePage.prototype.onChangeMatrixFont = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixFont()", event);
        this.matrixFont = this.fontService.getFontPathById(this.matrixFont.id);
    };
    HomePage.prototype.onClickMatrixFont = function (event) {
        if (event === void 0) { event = null; }
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _components_matrix_fonts_fonts_component__WEBPACK_IMPORTED_MODULE_10__["FontsComponent"],
                            componentProps: {
                                select: this.matrixFont,
                                text: this.matrixText.replace(/\s/g, "").substr(0, 15) // RegEx '\s' matches a single white white space character, including space, tab, form feed, line feed.
                            },
                            event: event,
                        })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            // console.log("HomePage onClickMatrixFont() - popover.onDidDismiss()", data);
                            if (data.role == "select") {
                                _this.matrixFont = data.data;
                                _this.generateFrontPreview();
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.onChangeMatrixFontSize = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeMatrixFontSize()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.matrixFontSize != event.detail.value)) {
            this.matrixFontSize = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeLogoText = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeLogoText()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.logoText != event.detail.value)) {
            this.logoText = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeLogoTextSize = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeLogoTextSize()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.logoTextSize != event.detail.value)) {
            this.logoTextSize = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeLogoDistanceX = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeLogoDistanceX()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.logoDistanceX != event.detail.value)) {
            this.logoDistanceX = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeLogoDistanceY = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeLogoDistanceY()", event);
        // Workaround to only allow changes via the view component to trigger a new generation of a Front Preview
        if ((event != null) && (this.logoDistanceY != event.detail.value)) {
            this.logoDistanceY = event.detail.value;
            this.generateFrontPreview();
        }
    };
    HomePage.prototype.onChangeColorFront = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeColorFront()", event);
        // Change the fill CSS property of the SVG preview for better performance instead of generating a new preview 
        var element = document.getElementById("background");
        if (element != undefined) {
            element.setAttribute("fill", this.colorFront);
            element.style.fill = this.colorFront;
        }
    };
    HomePage.prototype.onChangeColorLight = function (event) {
        if (event === void 0) { event = null; }
        // console.log("HomePage onChangeColorLight()", event);
        // Change the fill CSS property of the SVG preview for better performance instead of generating a new preview 
        var element = document.getElementById("minutes");
        if (element != undefined) {
            element.setAttribute("fill", this.colorLight);
            element.style.fill = this.colorLight;
        }
        element = document.getElementById("text");
        if (element != undefined) {
            element.setAttribute("fill", this.colorLight);
            element.style.fill = this.colorLight;
        }
    };
    HomePage.prototype.generateFrontPreview = function () {
        this.generator.generatePreview(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline, this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY, this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY, this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY, this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize, this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY, this.colorFront, this.colorLight);
    };
    HomePage.prototype.exportAsSVG = function () {
        var filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model, this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);
        this.generator.generateSVG(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline, this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY, this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY, this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY, this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize, this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY, this.colorFront, this.colorLight).then(function (svg) {
            var svgBlob = new Blob([svg], {
                type: "image/svg+xml"
            });
            Object(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__["saveAs"])(svgBlob, filename);
        });
    };
    HomePage.prototype.exportAsDXF = function () {
        var filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model, this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);
        this.generator.generateDXF(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline, this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY, this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY, this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY, this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize, this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY, this.colorFront, this.colorLight).then(function (dxf) {
            var blob = new Blob([dxf], { type: "dxf/dxf;charset=utf-8" });
            Object(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__["saveAs"])(blob, filename);
        });
    };
    HomePage.prototype.exportAsPDF = function () {
        var filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model, this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);
        this.generator.generatePDF(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline, this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY, this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY, this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY, this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize, this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY, this.colorFront, this.colorLight).then(function (pdf) {
            Object(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__["saveAs"])(pdf, filename);
        });
    };
    HomePage.prototype.exportAsPNG = function () {
        var filename = this.generator.getFileName(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontVariant.data.info.model, this.matrixLanguage.id, false, this.matrixFont.label, this.alarmSymbol.value, this.logoText, this.generalFrontOutline, this.generalFrontMirror);
        this.generator.generatePNG(this.generalFrontHeight, this.generalFrontWidth, this.generalFrontMirror, this.generalFrontOutline, this.minutesPlacement.value, this.minutesRadius, this.minutesDistanceX, this.minutesDistanceY, this.alarmSymbol.value, this.alarmSize, this.alarmDistanceX, this.alarmDistanceY, this.matrixColumns, this.matrixRows, this.matrixDistanceX, this.matrixDistanceY, this.matrixLanguage.id, this.matrixText, this.matrixFont.path + this.matrixFont.filename, this.matrixFontSize, this.logoText, this.logoTextSize, this.logoDistanceX, this.logoDistanceY, this.colorFront, this.colorLight).then(function (png) {
            var blob = new Blob([png], { type: "image/png" });
            Object(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_12__["saveAs"])(blob, filename + ".png");
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('drawing'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], HomePage.prototype, "drawing", void 0);
    HomePage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! ./home.page.html */ "./src/app/home/home.page.html"),
            styles: [__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")],
        }),
        __metadata("design:paramtypes", [_services_generator_generator_service__WEBPACK_IMPORTED_MODULE_4__["GeneratorService"],
            _services_languages_languages_service__WEBPACK_IMPORTED_MODULE_5__["LanguagesService"],
            _services_fonts_fonts_service__WEBPACK_IMPORTED_MODULE_3__["FontsService"],
            _services_variants_variants_service__WEBPACK_IMPORTED_MODULE_6__["VariantsService"],
            _services_placements_placements_service__WEBPACK_IMPORTED_MODULE_0__["PlacementsService"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["PopoverController"]])
    ], HomePage);
    return HomePage;
}());



/***/ })

}]);
//# sourceMappingURL=home-home-module.js.map