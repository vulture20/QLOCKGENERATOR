(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[159],{

/***/ "./node_modules/@ionic/core/dist/esm/es5/build/zrjve6r6.sc.entry.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/es5/build/zrjve6r6.sc.entry.js ***!
  \**************************************************************************/
/*! exports provided: IonRippleEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IonRippleEffect", function() { return RippleEffect; });
/* harmony import */ var _chunk_c23403d0_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-c23403d0.js */ "./node_modules/@ionic/core/dist/esm/es5/build/chunk-c23403d0.js");
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
var RippleEffect=function(){function e(){}return e.prototype.addRipple=function(e,t){var n=this;this.config.getBoolean("animated",!0)&&Object(_chunk_c23403d0_js__WEBPACK_IMPORTED_MODULE_0__["a"])(function(){return n.prepareRipple(e,t)})},e.prototype.prepareRipple=function(e,t){var n,i,r,o=this;this.queue.read(function(){var p=o.el.getBoundingClientRect(),a=p.width,u=p.height;r=Math.min(2*Math.sqrt(a*a+u*u),MAX_RIPPLE_DIAMETER),n=e-p.left-.5*r,i=t-p.top-.5*r}),this.queue.write(function(){var e=o.win.document.createElement("div");e.classList.add("ripple-effect");var t=e.style,p=Math.max(RIPPLE_FACTOR*Math.sqrt(r),MIN_RIPPLE_DURATION);t.top=i+"px",t.left=n+"px",t.width=t.height=r+"px",t.animationDuration=p+"ms",(o.el.shadowRoot||o.el).appendChild(e),setTimeout(function(){return e.remove()},p+50)})},Object.defineProperty(e,"is",{get:function(){return"ion-ripple-effect"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{addRipple:{method:!0},config:{context:"config"},el:{elementRef:!0},queue:{context:"queue"},win:{context:"window"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return".sc-ion-ripple-effect-h{left:0;right:0;top:0;bottom:0}.ripple-effect.sc-ion-ripple-effect, .sc-ion-ripple-effect-h{position:absolute;contain:strict}.ripple-effect.sc-ion-ripple-effect{border-radius:50%;background-color:currentColor;color:inherit;opacity:0;-webkit-animation-name:rippleAnimation;animation-name:rippleAnimation;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;will-change:transform,opacity;pointer-events:none}\@-webkit-keyframes rippleAnimation{0%{-webkit-transform:scale(.1);transform:scale(.1);opacity:.2}to{-webkit-transform:scale(1);transform:scale(1);opacity:0}}\@keyframes rippleAnimation{0%{-webkit-transform:scale(.1);transform:scale(.1);opacity:.2}to{-webkit-transform:scale(1);transform:scale(1);opacity:0}}"},enumerable:!0,configurable:!0}),e}(),RIPPLE_FACTOR=35,MIN_RIPPLE_DURATION=260,MAX_RIPPLE_DIAMETER=550;

/***/ })

}]);
//# sourceMappingURL=159.js.map