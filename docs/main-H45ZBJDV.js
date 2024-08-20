import{A as d,B as N,C as h,D as C,E as X1,G as Y1,H as K1,I as Q1,J as s1,K as J1,L as Z1,M as c3,N as E2,O as X,P as n1,S as l3,T as e3,U as s3,V as n3,W as a1,a as o,b as L,c as G1,d as j1,e as q1,f as W1,g as Z2,h as V,i as e2,j as z2,k as T,l as $,m as c1,n as l1,o as w2,p as A2,q as k2,r as y,s as _2,t as D2,u as s2,w as $1,y as e1,z as u}from"./chunk-SUNKBYAU.js";var z3=(()=>{let c=class c{constructor(s,n){this._renderer=s,this._elementRef=n,this.onChange=a=>{},this.onTouched=()=>{}}setProperty(s,n){this._renderer.setProperty(this._elementRef.nativeElement,s,n)}registerOnTouched(s){this.onTouched=s}registerOnChange(s){this.onChange=s}setDisabledState(s){this.setProperty("disabled",s)}};c.\u0275fac=function(n){return new(n||c)(y(_2),y(A2))},c.\u0275dir=$({type:c});let l=c;return l})(),W4=(()=>{let c=class c extends z3{};c.\u0275fac=(()=>{let s;return function(a){return(s||(s=l1(c)))(a||c)}})(),c.\u0275dir=$({type:c,features:[s2]});let l=c;return l})(),u3=new e2("");var $4={provide:u3,useExisting:Z2(()=>I2),multi:!0};function X4(){let l=n1()?n1().getUserAgent():"";return/android (\d+)/.test(l.toLowerCase())}var Y4=new e2(""),I2=(()=>{let c=class c extends z3{constructor(s,n,a){super(s,n),this._compositionMode=a,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!X4())}writeValue(s){let n=s??"";this.setProperty("value",n)}_handleInput(s){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(s)}_compositionStart(){this._composing=!0}_compositionEnd(s){this._composing=!1,this._compositionMode&&this.onChange(s)}};c.\u0275fac=function(n){return new(n||c)(y(_2),y(A2),y(Y4,8))},c.\u0275dir=$({type:c,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(n,a){n&1&&h("input",function(i){return a._handleInput(i.target.value)})("blur",function(){return a.onTouched()})("compositionstart",function(){return a._compositionStart()})("compositionend",function(i){return a._compositionEnd(i.target.value)})},features:[s1([$4]),s2]});let l=c;return l})();var K4=new e2(""),Q4=new e2("");function L3(l){return l!=null}function p3(l){return J1(l)?j1(l):l}function d3(l){let c={};return l.forEach(e=>{c=e!=null?o(o({},c),e):c}),Object.keys(c).length===0?null:c}function M3(l,c){return c.map(e=>e(l))}function J4(l){return!l.validate}function h3(l){return l.map(c=>J4(c)?c:e=>c.validate(e))}function Z4(l){if(!l)return null;let c=l.filter(L3);return c.length==0?null:function(e){return d3(M3(e,c))}}function C3(l){return l!=null?Z4(h3(l)):null}function c0(l){if(!l)return null;let c=l.filter(L3);return c.length==0?null:function(e){let s=M3(e,c).map(p3);return W1(s).pipe(q1(d3))}}function g3(l){return l!=null?c0(h3(l)):null}function a3(l,c){return l===null?[c]:Array.isArray(l)?[...l,c]:[l,c]}function l0(l){return l._rawValidators}function e0(l){return l._rawAsyncValidators}function t1(l){return l?Array.isArray(l)?l:[l]:[]}function P2(l,c){return Array.isArray(l)?l.includes(c):l===c}function t3(l,c){let e=t1(c);return t1(l).forEach(n=>{P2(e,n)||e.push(n)}),e}function i3(l,c){return t1(c).filter(e=>!P2(l,e))}var V2=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(c){this._rawValidators=c||[],this._composedValidatorFn=C3(this._rawValidators)}_setAsyncValidators(c){this._rawAsyncValidators=c||[],this._composedAsyncValidatorFn=g3(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(c){this._onDestroyCallbacks.push(c)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(c=>c()),this._onDestroyCallbacks=[]}reset(c=void 0){this.control&&this.control.reset(c)}hasError(c,e){return this.control?this.control.hasError(c,e):!1}getError(c,e){return this.control?this.control.getError(c,e):null}},i1=class extends V2{get formDirective(){return null}get path(){return null}},M2=class extends V2{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},o1=class{constructor(c){this._cd=c}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},s0={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},B8=L(o({},s0),{"[class.ng-submitted]":"isSubmitted"}),x3=(()=>{let c=class c extends o1{constructor(s){super(s)}};c.\u0275fac=function(n){return new(n||c)(y(M2,2))},c.\u0275dir=$({type:c,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(n,a){n&2&&e1("ng-untouched",a.isUntouched)("ng-touched",a.isTouched)("ng-pristine",a.isPristine)("ng-dirty",a.isDirty)("ng-valid",a.isValid)("ng-invalid",a.isInvalid)("ng-pending",a.isPending)},features:[s2]});let l=c;return l})();var u2="VALID",F2="INVALID",n2="PENDING",L2="DISABLED",t2=class{},T2=class extends t2{constructor(c,e){super(),this.value=c,this.source=e}},p2=class extends t2{constructor(c,e){super(),this.pristine=c,this.source=e}},d2=class extends t2{constructor(c,e){super(),this.touched=c,this.source=e}},a2=class extends t2{constructor(c,e){super(),this.status=c,this.source=e}};function n0(l){return(O2(l)?l.validators:l)||null}function a0(l){return Array.isArray(l)?C3(l):l||null}function t0(l,c){return(O2(c)?c.asyncValidators:l)||null}function i0(l){return Array.isArray(l)?g3(l):l||null}function O2(l){return l!=null&&!Array.isArray(l)&&typeof l=="object"}var r1=class{constructor(c,e){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=E2(()=>this.statusReactive()),this.statusReactive=D2(void 0),this._pristine=E2(()=>this.pristineReactive()),this.pristineReactive=D2(!0),this._touched=E2(()=>this.touchedReactive()),this.touchedReactive=D2(!1),this._events=new G1,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(c),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(c){this._rawValidators=this._composedValidatorFn=c}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(c){this._rawAsyncValidators=this._composedAsyncValidatorFn=c}get parent(){return this._parent}get status(){return X(this.statusReactive)}set status(c){X(()=>this.statusReactive.set(c))}get valid(){return this.status===u2}get invalid(){return this.status===F2}get pending(){return this.status==n2}get disabled(){return this.status===L2}get enabled(){return this.status!==L2}get pristine(){return X(this.pristineReactive)}set pristine(c){X(()=>this.pristineReactive.set(c))}get dirty(){return!this.pristine}get touched(){return X(this.touchedReactive)}set touched(c){X(()=>this.touchedReactive.set(c))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(c){this._assignValidators(c)}setAsyncValidators(c){this._assignAsyncValidators(c)}addValidators(c){this.setValidators(t3(c,this._rawValidators))}addAsyncValidators(c){this.setAsyncValidators(t3(c,this._rawAsyncValidators))}removeValidators(c){this.setValidators(i3(c,this._rawValidators))}removeAsyncValidators(c){this.setAsyncValidators(i3(c,this._rawAsyncValidators))}hasValidator(c){return P2(this._rawValidators,c)}hasAsyncValidator(c){return P2(this._rawAsyncValidators,c)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(c={}){let e=this.touched===!1;this.touched=!0;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsTouched(L(o({},c),{sourceControl:s})),e&&c.emitEvent!==!1&&this._events.next(new d2(!0,s))}markAllAsTouched(c={}){this.markAsTouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(c))}markAsUntouched(c={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let s=c.sourceControl??this;this._forEachChild(n=>{n.markAsUntouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:s})}),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,s),e&&c.emitEvent!==!1&&this._events.next(new d2(!1,s))}markAsDirty(c={}){let e=this.pristine===!0;this.pristine=!1;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsDirty(L(o({},c),{sourceControl:s})),e&&c.emitEvent!==!1&&this._events.next(new p2(!1,s))}markAsPristine(c={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let s=c.sourceControl??this;this._forEachChild(n=>{n.markAsPristine({onlySelf:!0,emitEvent:c.emitEvent})}),this._parent&&!c.onlySelf&&this._parent._updatePristine(c,s),e&&c.emitEvent!==!1&&this._events.next(new p2(!0,s))}markAsPending(c={}){this.status=n2;let e=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new a2(this.status,e)),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.markAsPending(L(o({},c),{sourceControl:e}))}disable(c={}){let e=this._parentMarkedDirty(c.onlySelf);this.status=L2,this.errors=null,this._forEachChild(n=>{n.disable(L(o({},c),{onlySelf:!0}))}),this._updateValue();let s=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new T2(this.value,s)),this._events.next(new a2(this.status,s)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(L(o({},c),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(n=>n(!0))}enable(c={}){let e=this._parentMarkedDirty(c.onlySelf);this.status=u2,this._forEachChild(s=>{s.enable(L(o({},c),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent}),this._updateAncestors(L(o({},c),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(s=>s(!1))}_updateAncestors(c,e){this._parent&&!c.onlySelf&&(this._parent.updateValueAndValidity(c),c.skipPristineCheck||this._parent._updatePristine({},e),this._parent._updateTouched({},e))}setParent(c){this._parent=c}getRawValue(){return this.value}updateValueAndValidity(c={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let s=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===u2||this.status===n2)&&this._runAsyncValidator(s,c.emitEvent)}let e=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new T2(this.value,e)),this._events.next(new a2(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.updateValueAndValidity(L(o({},c),{sourceControl:e}))}_updateTreeValidity(c={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(c)),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?L2:u2}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(c,e){if(this.asyncValidator){this.status=n2,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1};let s=p3(this.asyncValidator(this));this._asyncValidationSubscription=s.subscribe(n=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(n,{emitEvent:e,shouldHaveEmitted:c})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let c=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,c}return!1}setErrors(c,e={}){this.errors=c,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(c){let e=c;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((s,n)=>s&&s._find(n),this)}getError(c,e){let s=e?this.get(e):this;return s&&s.errors?s.errors[c]:null}hasError(c,e){return!!this.getError(c,e)}get root(){let c=this;for(;c._parent;)c=c._parent;return c}_updateControlsErrors(c,e,s){this.status=this._calculateStatus(),c&&this.statusChanges.emit(this.status),(c||s)&&this._events.next(new a2(this.status,e)),this._parent&&this._parent._updateControlsErrors(c,e,s)}_initObservables(){this.valueChanges=new w2,this.statusChanges=new w2}_calculateStatus(){return this._allControlsDisabled()?L2:this.errors?F2:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(n2)?n2:this._anyControlsHaveStatus(F2)?F2:u2}_anyControlsHaveStatus(c){return this._anyControls(e=>e.status===c)}_anyControlsDirty(){return this._anyControls(c=>c.dirty)}_anyControlsTouched(){return this._anyControls(c=>c.touched)}_updatePristine(c,e){let s=!this._anyControlsDirty(),n=this.pristine!==s;this.pristine=s,this._parent&&!c.onlySelf&&this._parent._updatePristine(c,e),n&&this._events.next(new p2(this.pristine,e))}_updateTouched(c={},e){this.touched=this._anyControlsTouched(),this._events.next(new d2(this.touched,e)),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,e)}_registerOnCollectionChange(c){this._onCollectionChange=c}_setUpdateStrategy(c){O2(c)&&c.updateOn!=null&&(this._updateOn=c.updateOn)}_parentMarkedDirty(c){let e=this._parent&&this._parent.dirty;return!c&&!!e&&!this._parent._anyControlsDirty()}_find(c){return null}_assignValidators(c){this._rawValidators=Array.isArray(c)?c.slice():c,this._composedValidatorFn=a0(this._rawValidators)}_assignAsyncValidators(c){this._rawAsyncValidators=Array.isArray(c)?c.slice():c,this._composedAsyncValidatorFn=i0(this._rawAsyncValidators)}};var N3=new e2("CallSetDisabledState",{providedIn:"root",factory:()=>f1}),f1="always";function o0(l,c){return[...c.path,l]}function r0(l,c,e=f1){m0(l,c),c.valueAccessor.writeValue(l.value),(l.disabled||e==="always")&&c.valueAccessor.setDisabledState?.(l.disabled),z0(l,c),L0(l,c),u0(l,c),f0(l,c)}function o3(l,c){l.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(c)})}function f0(l,c){if(c.valueAccessor.setDisabledState){let e=s=>{c.valueAccessor.setDisabledState(s)};l.registerOnDisabledChange(e),c._registerOnDestroy(()=>{l._unregisterOnDisabledChange(e)})}}function m0(l,c){let e=l0(l);c.validator!==null?l.setValidators(a3(e,c.validator)):typeof e=="function"&&l.setValidators([e]);let s=e0(l);c.asyncValidator!==null?l.setAsyncValidators(a3(s,c.asyncValidator)):typeof s=="function"&&l.setAsyncValidators([s]);let n=()=>l.updateValueAndValidity();o3(c._rawValidators,n),o3(c._rawAsyncValidators,n)}function z0(l,c){c.valueAccessor.registerOnChange(e=>{l._pendingValue=e,l._pendingChange=!0,l._pendingDirty=!0,l.updateOn==="change"&&b3(l,c)})}function u0(l,c){c.valueAccessor.registerOnTouched(()=>{l._pendingTouched=!0,l.updateOn==="blur"&&l._pendingChange&&b3(l,c),l.updateOn!=="submit"&&l.markAsTouched()})}function b3(l,c){l._pendingDirty&&l.markAsDirty(),l.setValue(l._pendingValue,{emitModelToViewChange:!1}),c.viewToModelUpdate(l._pendingValue),l._pendingChange=!1}function L0(l,c){let e=(s,n)=>{c.valueAccessor.writeValue(s),n&&c.viewToModelUpdate(s)};l.registerOnChange(e),c._registerOnDestroy(()=>{l._unregisterOnChange(e)})}function p0(l,c){if(!l.hasOwnProperty("model"))return!1;let e=l.model;return e.isFirstChange()?!0:!Object.is(c,e.currentValue)}function d0(l){return Object.getPrototypeOf(l.constructor)===W4}function M0(l,c){if(!c)return null;Array.isArray(c);let e,s,n;return c.forEach(a=>{a.constructor===I2?e=a:d0(a)?s=a:n=a}),n||s||e||null}function r3(l,c){let e=l.indexOf(c);e>-1&&l.splice(e,1)}function f3(l){return typeof l=="object"&&l!==null&&Object.keys(l).length===2&&"value"in l&&"disabled"in l}var h0=class extends r1{constructor(c=null,e,s){super(n0(e),t0(s,e)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(c),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),O2(e)&&(e.nonNullable||e.initialValueIsDefault)&&(f3(c)?this.defaultValue=c.value:this.defaultValue=c)}setValue(c,e={}){this.value=this._pendingValue=c,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(s=>s(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(c,e={}){this.setValue(c,e)}reset(c=this.defaultValue,e={}){this._applyFormState(c),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),this._pendingChange=!1}_updateValue(){}_anyControls(c){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(c){this._onChange.push(c)}_unregisterOnChange(c){r3(this._onChange,c)}registerOnDisabledChange(c){this._onDisabledChange.push(c)}_unregisterOnDisabledChange(c){r3(this._onDisabledChange,c)}_forEachChild(c){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(c){f3(c)?(this.value=this._pendingValue=c.value,c.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=c}};var C0={provide:M2,useExisting:Z2(()=>m1)},m3=Promise.resolve(),m1=(()=>{let c=class c extends M2{constructor(s,n,a,t,i,r){super(),this._changeDetectorRef=i,this.callSetDisabledState=r,this.control=new h0,this._registered=!1,this.name="",this.update=new w2,this._parent=s,this._setValidators(n),this._setAsyncValidators(a),this.valueAccessor=M0(this,t)}ngOnChanges(s){if(this._checkForErrors(),!this._registered||"name"in s){if(this._registered&&(this._checkName(),this.formDirective)){let n=s.name.previousValue;this.formDirective.removeControl({name:n,path:this._getPath(n)})}this._setUpControl()}"isDisabled"in s&&this._updateDisabled(s),p0(s,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(s){this.viewModel=s,this.update.emit(s)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){r0(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(s){m3.then(()=>{this.control.setValue(s,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(s){let n=s.isDisabled.currentValue,a=n!==0&&c3(n);m3.then(()=>{a&&!this.control.disabled?this.control.disable():!a&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(s){return this._parent?o0(s,this._parent):[s]}};c.\u0275fac=function(n){return new(n||c)(y(i1,9),y(K4,10),y(Q4,10),y(u3,10),y(Z1,8),y(N3,8))},c.\u0275dir=$({type:c,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[s1([C0]),s2,c1]});let l=c;return l})();var g0=(()=>{let c=class c{};c.\u0275fac=function(n){return new(n||c)},c.\u0275mod=T({type:c}),c.\u0275inj=V({});let l=c;return l})();var y3=(()=>{let c=class c{static withConfig(s){return{ngModule:c,providers:[{provide:N3,useValue:s.callSetDisabledState??f1}]}}};c.\u0275fac=function(n){return new(n||c)},c.\u0275mod=T({type:c}),c.\u0275inj=V({imports:[g0]});let l=c;return l})();var v3={prefix:"fas",iconName:"lightbulb",icon:[384,512,[128161],"f0eb","M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"]};var S3={prefix:"fas",iconName:"question",icon:[320,512,[10067,10068,61736],"3f","M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"]};var N0={prefix:"fas",iconName:"screwdriver-wrench",icon:[512,512,["tools"],"f7d9","M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"]},w3=N0;var b0={prefix:"fas",iconName:"shirt",icon:[640,512,[128085,"t-shirt","tshirt"],"f553","M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0l12.6 0c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7 480 448c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-250.3-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0l12.6 0z"]};var A3=b0;var k3={prefix:"fas",iconName:"dumbbell",icon:[640,512,[],"f44b","M96 64c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 160 0 64 0 160c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64-32 0c-17.7 0-32-14.3-32-32l0-64c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64c0-17.7 14.3-32 32-32l32 0 0-64zm448 0l0 64 32 0c17.7 0 32 14.3 32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 17.7-14.3 32-32 32l-32 0 0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-160 0-64 0-160c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32zM416 224l0 64-192 0 0-64 192 0z"]};var _3={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]};var y0={prefix:"fas",iconName:"delete-left",icon:[576,512,[9003,"backspace"],"f55a","M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]},D3=y0;var v0={prefix:"fas",iconName:"house",icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]},E3=v0;var F3={prefix:"fas",iconName:"utensils",icon:[448,512,[127860,61685,"cutlery"],"f2e7","M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"]};var P3={prefix:"fas",iconName:"credit-card",icon:[576,512,[128179,62083,"credit-card-alt"],"f09d","M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"]};var V3={prefix:"fas",iconName:"car",icon:[512,512,[128664,"automobile"],"f1b9","M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};var T3={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]};var I3={prefix:"fas",iconName:"baby",icon:[448,512,[],"f77c","M152 88a72 72 0 1 1 144 0A72 72 0 1 1 152 88zM39.7 144.5c13-17.9 38-21.8 55.9-8.8L131.8 162c26.8 19.5 59.1 30 92.2 30s65.4-10.5 92.2-30l36.2-26.4c17.9-13 42.9-9 55.9 8.8s9 42.9-8.8 55.9l-36.2 26.4c-13.6 9.9-28.1 18.2-43.3 25l0 36.3-192 0 0-36.3c-15.2-6.7-29.7-15.1-43.3-25L48.5 200.3c-17.9-13-21.8-38-8.8-55.9zm89.8 184.8l60.6 53-26 37.2 24.3 24.3c15.6 15.6 15.6 40.9 0 56.6s-40.9 15.6-56.6 0l-48-48C70 438.6 68.1 417 79.2 401.1l50.2-71.8zm128.5 53l60.6-53 50.2 71.8c11.1 15.9 9.2 37.5-4.5 51.2l-48 48c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6L284 419.4l-26-37.2z"]};var O3={prefix:"fas",iconName:"music",icon:[512,512,[127925],"f001","M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"]};var B3={prefix:"fas",iconName:"plane",icon:[576,512,[],"f072","M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"]};var B2=class l{faClock=_3;faPlus=T3;faBackspace=D3;categories=[{name:"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438",icon:F3},{name:"\u041E\u0434\u0435\u0436\u0434\u0430",icon:A3},{name:"\u0420\u0435\u043C\u043E\u043D\u0442",icon:w3},{name:"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F",icon:O3},{name:"\u0421\u043F\u043E\u0440\u0442",icon:k3},{name:"\u0410\u0432\u0442\u043E",icon:V3},{name:"\u041A\u043E\u043C\u043C\u0443\u043D\u0430\u043B\u043A\u0430",icon:v3},{name:"\u0414\u0435\u0442\u0438",icon:I3},{name:"\u0414\u043E\u043C",icon:E3},{name:"\u0420\u0430\u0437\u043D\u043E\u0435",icon:S3},{name:"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F",icon:B3},{name:"\u041A\u0440\u0435\u0434\u0438\u0442",icon:P3}];numbers=[1,2,3,4,5,6,7,8,9,0];enteredAmount="";enteredAmountAsNumber=0;totalAmount=0;ngOnInit(){let c=JSON.parse(localStorage.getItem("expenses")||"[]");this.totalAmount=c.reduce((e,s)=>e+s.amount,0)}onNumberClick(c){c==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=c):this.enteredAmount+=c,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(c){if(this.enteredAmountAsNumber>0){let e=localStorage.getItem("expenses"),s=e?JSON.parse(e):[];s.push({category:c,amount:this.enteredAmountAsNumber,currency:"EUR"}),localStorage.setItem("expenses",JSON.stringify(s)),this.totalAmount=s.reduce((n,a)=>n+a.amount,0),this.enteredAmount="",this.enteredAmountAsNumber=0}}static \u0275fac=function(e){return new(e||l)};static \u0275cmp=z2({type:l,selectors:[["app-expense"]],decls:83,vars:3,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[1,"expense-info"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],[1,"scrollable-content"],[1,"categories"],[1,"category",3,"click"],[1,"fas","fa-utensils"],[1,"fas","fa-tshirt"],[1,"fas","fa-paint-roller"],[1,"fas","fa-music"],[1,"fas","fa-dumbbell"],[1,"fas","fa-car"],[1,"fas","fa-home"],[1,"fas","fa-baby-carriage"],[1,"fas","fa-random"],[1,"fas","fa-plane"],[1,"number-board"],[1,"number-board-header"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(e,s){e&1&&(u(0,"div",0)(1,"div",1),N(2,"div",2),u(3,"div",3)(4,"span"),C(5,"\u041E\u0411\u0429\u0418\u0419 \u0420\u0410\u0421\u0425\u041E\u0414"),d()(),u(6,"div",4)(7,"span"),C(8),d(),u(9,"span"),C(10,"$"),d()(),u(11,"div",5),N(12,"i",6),d()(),u(13,"div",7)(14,"div",8)(15,"div",9),h("click",function(){return s.onCategoryClick("meal")}),N(16,"i",10),u(17,"span"),C(18,"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438"),d()(),u(19,"div",9),h("click",function(){return s.onCategoryClick("clothes")}),N(20,"i",11),u(21,"span"),C(22,"\u041E\u0434\u0435\u0436\u0434\u0430"),d()(),u(23,"div",9),h("click",function(){return s.onCategoryClick("repair")}),N(24,"i",12),u(25,"span"),C(26,"\u0420\u0435\u043C\u043E\u043D\u0442"),d()(),u(27,"div",9),h("click",function(){return s.onCategoryClick("entertainments")}),N(28,"i",13),u(29,"span"),C(30,"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F"),d()(),u(31,"div",9),h("click",function(){return s.onCategoryClick("sport")}),N(32,"i",14),u(33,"span"),C(34,"\u0421\u043F\u043E\u0440\u0442"),d()(),u(35,"div",9),h("click",function(){return s.onCategoryClick("car")}),N(36,"i",15),u(37,"span"),C(38,"\u0410\u0432\u0442\u043E"),d()(),u(39,"div",9),h("click",function(){return s.onCategoryClick("home")}),N(40,"i",16),u(41,"span"),C(42,"\u0414\u043E\u043C"),d()(),u(43,"div",9),h("click",function(){return s.onCategoryClick("children")}),N(44,"i",17),u(45,"span"),C(46,"\u0414\u0435\u0442\u0438"),d()(),u(47,"div",9),h("click",function(){return s.onCategoryClick("another")}),N(48,"i",18),u(49,"span"),C(50,"\u0420\u0430\u0437\u043D\u043E\u0435"),d()(),u(51,"div",9),h("click",function(){return s.onCategoryClick("travel")}),N(52,"i",19),u(53,"span"),C(54,"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F"),d()()()(),u(55,"div",20)(56,"div",21)(57,"input",22),Q1("ngModelChange",function(a){return K1(s.enteredAmount,a)||(s.enteredAmount=a),a}),d()(),u(58,"div",23)(59,"div",24),h("click",function(){return s.onNumberClick("1")}),C(60,"1"),d(),u(61,"div",24),h("click",function(){return s.onNumberClick("2")}),C(62,"2"),d(),u(63,"div",24),h("click",function(){return s.onNumberClick("3")}),C(64,"3"),d(),u(65,"div",24),h("click",function(){return s.onNumberClick("4")}),C(66,"4"),d(),u(67,"div",24),h("click",function(){return s.onNumberClick("5")}),C(68,"5"),d(),u(69,"div",24),h("click",function(){return s.onNumberClick("6")}),C(70,"6"),d(),u(71,"div",24),h("click",function(){return s.onNumberClick("7")}),C(72,"7"),d(),u(73,"div",24),h("click",function(){return s.onNumberClick("8")}),C(74,"8"),d(),u(75,"div",24),h("click",function(){return s.onNumberClick("9")}),C(76,"9"),d(),u(77,"div",24),h("click",function(){return s.onNumberClick(".")}),C(78,"."),d(),u(79,"div",24),h("click",function(){return s.onNumberClick("0")}),C(80,"0"),d(),u(81,"div",24),h("click",function(){return s.onDeleteClick()}),N(82,"i",25),d()()()()),e&2&&(k2(8),X1(s.totalAmount),k2(3),$1("routerLink","/history"),k2(46),Y1("ngModel",s.enteredAmount))},dependencies:[n3,I2,x3,m1],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.scrollable-content[_ngcontent-%COMP%]{flex:1;overflow-y:auto}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:60px;margin:10px;text-align:center}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:36px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding-bottom:10px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr)}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};var A0=[{path:"history",loadChildren:()=>import("./chunk-Q7BMMNDX.js").then(l=>l.HistoryModule)},{path:"",pathMatch:"full",component:B2}],R2=class l{static \u0275fac=function(e){return new(e||l)};static \u0275mod=T({type:l});static \u0275inj=V({imports:[a1.forRoot(A0),a1]})};var H2=class l{title="expenses";static \u0275fac=function(e){return new(e||l)};static \u0275cmp=z2({type:l,selectors:[["app-root"]],decls:1,vars:0,template:function(e,s){e&1&&N(0,"router-outlet")},dependencies:[s3]})};var R3=()=>{},E1={},f4={},m4=null,z4={mark:R3,measure:R3};try{typeof window<"u"&&(E1=window),typeof document<"u"&&(f4=document),typeof MutationObserver<"u"&&(m4=MutationObserver),typeof performance<"u"&&(z4=performance)}catch{}var{userAgent:H3=""}=E1.navigator||{},G=E1,g=f4,U3=m4,U2=z4,K8=!!G.document,B=!!g.documentElement&&!!g.head&&typeof g.addEventListener=="function"&&typeof g.createElement=="function",u4=~H3.indexOf("MSIE")||~H3.indexOf("Trident/"),x="classic",L4="duotone",S="sharp",w="sharp-duotone",k0=[x,L4,S,w],_0={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},G3={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},D0=["kit"],E0=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,F0=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,P0={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},V0={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},T0={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},I0={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},O0={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},B0={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},p4={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},R0=["solid","regular","light","thin","duotone","brands"],d4=[1,2,3,4,5,6,7,8,9,10],H0=d4.concat([11,12,13,14,15,16,17,18,19,20]),C2={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},U0=[...Object.keys(I0),...R0,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",C2.GROUP,C2.SWAP_OPACITY,C2.PRIMARY,C2.SECONDARY].concat(d4.map(l=>"".concat(l,"x"))).concat(H0.map(l=>"w-".concat(l))),G0={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},j0={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},q0={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},j3={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},I="___FONT_AWESOME___",M1=16,M4="fa",h4="svg-inline--fa",J="data-fa-i2svg",h1="data-fa-pseudo-element",W0="data-fa-pseudo-element-pending",F1="data-prefix",P1="data-icon",q3="fontawesome-i2svg",$0="async",X0=["HTML","HEAD","STYLE","SCRIPT"],C4=(()=>{try{return!0}catch{return!1}})(),g4=[x,S,w];function v2(l){return new Proxy(l,{get(c,e){return e in c?c[e]:c[x]}})}var x4=o({},p4);x4[x]=o(o(o({},p4[x]),G3.kit),G3["kit-duotone"]);var K=v2(x4),C1=o({},B0);C1[x]=o(o(o({},C1[x]),j3.kit),j3["kit-duotone"]);var b2=v2(C1),g1=o({},O0);g1[x]=o(o({},g1[x]),q0.kit);var Q=v2(g1),x1=o({},T0);x1[x]=o(o({},x1[x]),j0.kit);var Y0=v2(x1),K0=E0,N4="fa-layers-text",Q0=F0,J0=o({},_0),Q8=v2(J0),Z0=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],z1=C2,r2=new Set;Object.keys(b2[x]).map(r2.add.bind(r2));Object.keys(b2[S]).map(r2.add.bind(r2));Object.keys(b2[w]).map(r2.add.bind(r2));var c6=[...D0,...U0],x2=G.FontAwesomeConfig||{};function l6(l){var c=g.querySelector("script["+l+"]");if(c)return c.getAttribute(l)}function e6(l){return l===""?!0:l==="false"?!1:l==="true"?!0:l}g&&typeof g.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(c=>{let[e,s]=c,n=e6(l6(e));n!=null&&(x2[s]=n)});var b4={styleDefault:"solid",familyDefault:"classic",cssPrefix:M4,replacementClass:h4,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};x2.familyPrefix&&(x2.cssPrefix=x2.familyPrefix);var f2=o(o({},b4),x2);f2.autoReplaceSvg||(f2.observeMutations=!1);var m={};Object.keys(b4).forEach(l=>{Object.defineProperty(m,l,{enumerable:!0,set:function(c){f2[l]=c,N2.forEach(e=>e(m))},get:function(){return f2[l]}})});Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(l){f2.cssPrefix=l,N2.forEach(c=>c(m))},get:function(){return f2.cssPrefix}});G.FontAwesomeConfig=m;var N2=[];function s6(l){return N2.push(l),()=>{N2.splice(N2.indexOf(l),1)}}var H=M1,D={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function n6(l){if(!l||!B)return;let c=g.createElement("style");c.setAttribute("type","text/css"),c.innerHTML=l;let e=g.head.childNodes,s=null;for(let n=e.length-1;n>-1;n--){let a=e[n],t=(a.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(t)>-1&&(s=a)}return g.head.insertBefore(c,s),l}var a6="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function y2(){let l=12,c="";for(;l-- >0;)c+=a6[Math.random()*62|0];return c}function m2(l){let c=[];for(let e=(l||[]).length>>>0;e--;)c[e]=l[e];return c}function V1(l){return l.classList?m2(l.classList):(l.getAttribute("class")||"").split(" ").filter(c=>c)}function y4(l){return"".concat(l).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function t6(l){return Object.keys(l||{}).reduce((c,e)=>c+"".concat(e,'="').concat(y4(l[e]),'" '),"").trim()}function $2(l){return Object.keys(l||{}).reduce((c,e)=>c+"".concat(e,": ").concat(l[e].trim(),";"),"")}function T1(l){return l.size!==D.size||l.x!==D.x||l.y!==D.y||l.rotate!==D.rotate||l.flipX||l.flipY}function i6(l){let{transform:c,containerWidth:e,iconWidth:s}=l,n={transform:"translate(".concat(e/2," 256)")},a="translate(".concat(c.x*32,", ").concat(c.y*32,") "),t="scale(".concat(c.size/16*(c.flipX?-1:1),", ").concat(c.size/16*(c.flipY?-1:1),") "),i="rotate(".concat(c.rotate," 0 0)"),r={transform:"".concat(a," ").concat(t," ").concat(i)},f={transform:"translate(".concat(s/2*-1," -256)")};return{outer:n,inner:r,path:f}}function o6(l){let{transform:c,width:e=M1,height:s=M1,startCentered:n=!1}=l,a="";return n&&u4?a+="translate(".concat(c.x/H-e/2,"em, ").concat(c.y/H-s/2,"em) "):n?a+="translate(calc(-50% + ".concat(c.x/H,"em), calc(-50% + ").concat(c.y/H,"em)) "):a+="translate(".concat(c.x/H,"em, ").concat(c.y/H,"em) "),a+="scale(".concat(c.size/H*(c.flipX?-1:1),", ").concat(c.size/H*(c.flipY?-1:1),") "),a+="rotate(".concat(c.rotate,"deg) "),a}var r6=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function v4(){let l=M4,c=h4,e=m.cssPrefix,s=m.replacementClass,n=r6;if(e!==l||s!==c){let a=new RegExp("\\.".concat(l,"\\-"),"g"),t=new RegExp("\\--".concat(l,"\\-"),"g"),i=new RegExp("\\.".concat(c),"g");n=n.replace(a,".".concat(e,"-")).replace(t,"--".concat(e,"-")).replace(i,".".concat(s))}return n}var W3=!1;function u1(){m.autoAddCss&&!W3&&(n6(v4()),W3=!0)}var f6={mixout(){return{dom:{css:v4,insertCss:u1}}},hooks(){return{beforeDOMElementCreation(){u1()},beforeI2svg(){u1()}}}},O=G||{};O[I]||(O[I]={});O[I].styles||(O[I].styles={});O[I].hooks||(O[I].hooks={});O[I].shims||(O[I].shims=[]);var E=O[I],S4=[],w4=function(){g.removeEventListener("DOMContentLoaded",w4),q2=1,S4.map(l=>l())},q2=!1;B&&(q2=(g.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(g.readyState),q2||g.addEventListener("DOMContentLoaded",w4));function m6(l){B&&(q2?setTimeout(l,0):S4.push(l))}function S2(l){let{tag:c,attributes:e={},children:s=[]}=l;return typeof l=="string"?y4(l):"<".concat(c," ").concat(t6(e),">").concat(s.map(S2).join(""),"</").concat(c,">")}function $3(l,c,e){if(l&&l[c]&&l[c][e])return{prefix:c,iconName:e,icon:l[c][e]}}var z6=function(c,e){return function(s,n,a,t){return c.call(e,s,n,a,t)}},L1=function(c,e,s,n){var a=Object.keys(c),t=a.length,i=n!==void 0?z6(e,n):e,r,f,z;for(s===void 0?(r=1,z=c[a[0]]):(r=0,z=s);r<t;r++)f=a[r],z=i(z,c[f],f,c);return z};function u6(l){let c=[],e=0,s=l.length;for(;e<s;){let n=l.charCodeAt(e++);if(n>=55296&&n<=56319&&e<s){let a=l.charCodeAt(e++);(a&64512)==56320?c.push(((n&1023)<<10)+(a&1023)+65536):(c.push(n),e--)}else c.push(n)}return c}function N1(l){let c=u6(l);return c.length===1?c[0].toString(16):null}function L6(l,c){let e=l.length,s=l.charCodeAt(c),n;return s>=55296&&s<=56319&&e>c+1&&(n=l.charCodeAt(c+1),n>=56320&&n<=57343)?(s-55296)*1024+n-56320+65536:s}function X3(l){return Object.keys(l).reduce((c,e)=>{let s=l[e];return!!s.icon?c[s.iconName]=s.icon:c[e]=s,c},{})}function b1(l,c){let e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:s=!1}=e,n=X3(c);typeof E.hooks.addPack=="function"&&!s?E.hooks.addPack(l,X3(c)):E.styles[l]=o(o({},E.styles[l]||{}),n),l==="fas"&&b1("fa",c)}var{styles:Y,shims:p6}=E,d6={[x]:Object.values(Q[x]),[S]:Object.values(Q[S]),[w]:Object.values(Q[w])},I1=null,A4={},k4={},_4={},D4={},E4={},M6={[x]:Object.keys(K[x]),[S]:Object.keys(K[S]),[w]:Object.keys(K[w])};function h6(l){return~c6.indexOf(l)}function C6(l,c){let e=c.split("-"),s=e[0],n=e.slice(1).join("-");return s===l&&n!==""&&!h6(n)?n:null}var F4=()=>{let l=s=>L1(Y,(n,a,t)=>(n[t]=L1(a,s,{}),n),{});A4=l((s,n,a)=>(n[3]&&(s[n[3]]=a),n[2]&&n[2].filter(i=>typeof i=="number").forEach(i=>{s[i.toString(16)]=a}),s)),k4=l((s,n,a)=>(s[a]=a,n[2]&&n[2].filter(i=>typeof i=="string").forEach(i=>{s[i]=a}),s)),E4=l((s,n,a)=>{let t=n[2];return s[a]=a,t.forEach(i=>{s[i]=a}),s});let c="far"in Y||m.autoFetchSvg,e=L1(p6,(s,n)=>{let a=n[0],t=n[1],i=n[2];return t==="far"&&!c&&(t="fas"),typeof a=="string"&&(s.names[a]={prefix:t,iconName:i}),typeof a=="number"&&(s.unicodes[a.toString(16)]={prefix:t,iconName:i}),s},{names:{},unicodes:{}});_4=e.names,D4=e.unicodes,I1=X2(m.styleDefault,{family:m.familyDefault})};s6(l=>{I1=X2(l.styleDefault,{family:m.familyDefault})});F4();function O1(l,c){return(A4[l]||{})[c]}function g6(l,c){return(k4[l]||{})[c]}function U(l,c){return(E4[l]||{})[c]}function P4(l){return _4[l]||{prefix:null,iconName:null}}function x6(l){let c=D4[l],e=O1("fas",l);return c||(e?{prefix:"fas",iconName:e}:null)||{prefix:null,iconName:null}}function j(){return I1}var B1=()=>({prefix:null,iconName:null,rest:[]});function X2(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:e=x}=c,s=K[e][l],n=b2[e][l]||b2[e][s],a=l in E.styles?l:null;return n||a||null}var N6={[x]:Object.keys(Q[x]),[S]:Object.keys(Q[S]),[w]:Object.keys(Q[w])};function Y2(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:e=!1}=c,s={[x]:"".concat(m.cssPrefix,"-").concat(x),[S]:"".concat(m.cssPrefix,"-").concat(S),[w]:"".concat(m.cssPrefix,"-").concat(w)},n=null,a=x,t=k0.filter(r=>r!==L4);t.forEach(r=>{(l.includes(s[r])||l.some(f=>N6[r].includes(f)))&&(a=r)});let i=l.reduce((r,f)=>{let z=C6(m.cssPrefix,f);if(Y[f]?(f=d6[a].includes(f)?Y0[a][f]:f,n=f,r.prefix=f):M6[a].indexOf(f)>-1?(n=f,r.prefix=X2(f,{family:a})):z?r.iconName=z:f!==m.replacementClass&&!t.some(M=>f===s[M])&&r.rest.push(f),!e&&r.prefix&&r.iconName){let M=n==="fa"?P4(r.iconName):{},p=U(r.prefix,r.iconName);M.prefix&&(n=null),r.iconName=M.iconName||p||r.iconName,r.prefix=M.prefix||r.prefix,r.prefix==="far"&&!Y.far&&Y.fas&&!m.autoFetchSvg&&(r.prefix="fas")}return r},B1());return(l.includes("fa-brands")||l.includes("fab"))&&(i.prefix="fab"),(l.includes("fa-duotone")||l.includes("fad"))&&(i.prefix="fad"),!i.prefix&&a===S&&(Y.fass||m.autoFetchSvg)&&(i.prefix="fass",i.iconName=U(i.prefix,i.iconName)||i.iconName),!i.prefix&&a===w&&(Y.fasds||m.autoFetchSvg)&&(i.prefix="fasds",i.iconName=U(i.prefix,i.iconName)||i.iconName),(i.prefix==="fa"||n==="fa")&&(i.prefix=j()||"fas"),i}var y1=class{constructor(){this.definitions={}}add(){for(var c=arguments.length,e=new Array(c),s=0;s<c;s++)e[s]=arguments[s];let n=e.reduce(this._pullDefinitions,{});Object.keys(n).forEach(a=>{this.definitions[a]=o(o({},this.definitions[a]||{}),n[a]),b1(a,n[a]);let t=Q[x][a];t&&b1(t,n[a]),F4()})}reset(){this.definitions={}}_pullDefinitions(c,e){let s=e.prefix&&e.iconName&&e.icon?{0:e}:e;return Object.keys(s).map(n=>{let{prefix:a,iconName:t,icon:i}=s[n],r=i[2];c[a]||(c[a]={}),r.length>0&&r.forEach(f=>{typeof f=="string"&&(c[a][f]=i)}),c[a][t]=i}),c}},Y3=[],i2={},o2={},b6=Object.keys(o2);function y6(l,c){let{mixoutsTo:e}=c;return Y3=l,i2={},Object.keys(o2).forEach(s=>{b6.indexOf(s)===-1&&delete o2[s]}),Y3.forEach(s=>{let n=s.mixout?s.mixout():{};if(Object.keys(n).forEach(a=>{typeof n[a]=="function"&&(e[a]=n[a]),typeof n[a]=="object"&&Object.keys(n[a]).forEach(t=>{e[a]||(e[a]={}),e[a][t]=n[a][t]})}),s.hooks){let a=s.hooks();Object.keys(a).forEach(t=>{i2[t]||(i2[t]=[]),i2[t].push(a[t])})}s.provides&&s.provides(o2)}),e}function v1(l,c){for(var e=arguments.length,s=new Array(e>2?e-2:0),n=2;n<e;n++)s[n-2]=arguments[n];return(i2[l]||[]).forEach(t=>{c=t.apply(null,[c,...s])}),c}function Z(l){for(var c=arguments.length,e=new Array(c>1?c-1:0),s=1;s<c;s++)e[s-1]=arguments[s];(i2[l]||[]).forEach(a=>{a.apply(null,e)})}function q(){let l=arguments[0],c=Array.prototype.slice.call(arguments,1);return o2[l]?o2[l].apply(null,c):void 0}function S1(l){l.prefix==="fa"&&(l.prefix="fas");let{iconName:c}=l,e=l.prefix||j();if(c)return c=U(e,c)||c,$3(V4.definitions,e,c)||$3(E.styles,e,c)}var V4=new y1,v6=()=>{m.autoReplaceSvg=!1,m.observeMutations=!1,Z("noAuto")},S6={i2svg:function(){let l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return B?(Z("beforeI2svg",l),q("pseudoElements2svg",l),q("i2svg",l)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c}=l;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,m6(()=>{A6({autoReplaceSvgRoot:c}),Z("watch",l)})}},w6={icon:l=>{if(l===null)return null;if(typeof l=="object"&&l.prefix&&l.iconName)return{prefix:l.prefix,iconName:U(l.prefix,l.iconName)||l.iconName};if(Array.isArray(l)&&l.length===2){let c=l[1].indexOf("fa-")===0?l[1].slice(3):l[1],e=X2(l[0]);return{prefix:e,iconName:U(e,c)||c}}if(typeof l=="string"&&(l.indexOf("".concat(m.cssPrefix,"-"))>-1||l.match(K0))){let c=Y2(l.split(" "),{skipLookups:!0});return{prefix:c.prefix||j(),iconName:U(c.prefix,c.iconName)||c.iconName}}if(typeof l=="string"){let c=j();return{prefix:c,iconName:U(c,l)||l}}}},A={noAuto:v6,config:m,dom:S6,parse:w6,library:V4,findIconDefinition:S1,toHtml:S2},A6=function(){let l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c=g}=l;(Object.keys(E.styles).length>0||m.autoFetchSvg)&&B&&m.autoReplaceSvg&&A.dom.i2svg({node:c})};function K2(l,c){return Object.defineProperty(l,"abstract",{get:c}),Object.defineProperty(l,"html",{get:function(){return l.abstract.map(e=>S2(e))}}),Object.defineProperty(l,"node",{get:function(){if(!B)return;let e=g.createElement("div");return e.innerHTML=l.html,e.children}}),l}function k6(l){let{children:c,main:e,mask:s,attributes:n,styles:a,transform:t}=l;if(T1(t)&&e.found&&!s.found){let{width:i,height:r}=e,f={x:i/r/2,y:.5};n.style=$2(L(o({},a),{"transform-origin":"".concat(f.x+t.x/16,"em ").concat(f.y+t.y/16,"em")}))}return[{tag:"svg",attributes:n,children:c}]}function _6(l){let{prefix:c,iconName:e,children:s,attributes:n,symbol:a}=l,t=a===!0?"".concat(c,"-").concat(m.cssPrefix,"-").concat(e):a;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:L(o({},n),{id:t}),children:s}]}]}function R1(l){let{icons:{main:c,mask:e},prefix:s,iconName:n,transform:a,symbol:t,title:i,maskId:r,titleId:f,extra:z,watchable:M=!1}=l,{width:p,height:b}=e.found?e:c,R=s==="fak",W=[m.replacementClass,n?"".concat(m.cssPrefix,"-").concat(n):""].filter(l2=>z.classes.indexOf(l2)===-1).filter(l2=>l2!==""||!!l2).concat(z.classes).join(" "),k={children:[],attributes:L(o({},z.attributes),{"data-prefix":s,"data-icon":n,class:W,role:z.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(p," ").concat(b)})},P=R&&!~z.classes.indexOf("fa-fw")?{width:"".concat(p/b*16*.0625,"em")}:{};M&&(k.attributes[J]=""),i&&(k.children.push({tag:"title",attributes:{id:k.attributes["aria-labelledby"]||"title-".concat(f||y2())},children:[i]}),delete k.attributes.title);let v=L(o({},k),{prefix:s,iconName:n,main:c,mask:e,maskId:r,transform:a,symbol:t,styles:o(o({},P),z.styles)}),{children:_,attributes:c2}=e.found&&c.found?q("generateAbstractMask",v)||{children:[],attributes:{}}:q("generateAbstractIcon",v)||{children:[],attributes:{}};return v.children=_,v.attributes=c2,t?_6(v):k6(v)}function K3(l){let{content:c,width:e,height:s,transform:n,title:a,extra:t,watchable:i=!1}=l,r=L(o(o({},t.attributes),a?{title:a}:{}),{class:t.classes.join(" ")});i&&(r[J]="");let f=o({},t.styles);T1(n)&&(f.transform=o6({transform:n,startCentered:!0,width:e,height:s}),f["-webkit-transform"]=f.transform);let z=$2(f);z.length>0&&(r.style=z);let M=[];return M.push({tag:"span",attributes:r,children:[c]}),a&&M.push({tag:"span",attributes:{class:"sr-only"},children:[a]}),M}function D6(l){let{content:c,title:e,extra:s}=l,n=L(o(o({},s.attributes),e?{title:e}:{}),{class:s.classes.join(" ")}),a=$2(s.styles);a.length>0&&(n.style=a);let t=[];return t.push({tag:"span",attributes:n,children:[c]}),e&&t.push({tag:"span",attributes:{class:"sr-only"},children:[e]}),t}var{styles:p1}=E;function w1(l){let c=l[0],e=l[1],[s]=l.slice(4),n=null;return Array.isArray(s)?n={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(z1.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(z1.SECONDARY),fill:"currentColor",d:s[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(z1.PRIMARY),fill:"currentColor",d:s[1]}}]}:n={tag:"path",attributes:{fill:"currentColor",d:s}},{found:!0,width:c,height:e,icon:n}}var E6={found:!1,width:512,height:512};function F6(l,c){!C4&&!m.showMissingIcons&&l&&console.error('Icon with name "'.concat(l,'" and prefix "').concat(c,'" is missing.'))}function A1(l,c){let e=c;return c==="fa"&&m.styleDefault!==null&&(c=j()),new Promise((s,n)=>{if(e==="fa"){let a=P4(l)||{};l=a.iconName||l,c=a.prefix||c}if(l&&c&&p1[c]&&p1[c][l]){let a=p1[c][l];return s(w1(a))}F6(l,c),s(L(o({},E6),{icon:m.showMissingIcons&&l?q("missingIconAbstract")||{}:{}}))})}var Q3=()=>{},k1=m.measurePerformance&&U2&&U2.mark&&U2.measure?U2:{mark:Q3,measure:Q3},g2='FA "6.6.0"',P6=l=>(k1.mark("".concat(g2," ").concat(l," begins")),()=>T4(l)),T4=l=>{k1.mark("".concat(g2," ").concat(l," ends")),k1.measure("".concat(g2," ").concat(l),"".concat(g2," ").concat(l," begins"),"".concat(g2," ").concat(l," ends"))},H1={begin:P6,end:T4},G2=()=>{};function J3(l){return typeof(l.getAttribute?l.getAttribute(J):null)=="string"}function V6(l){let c=l.getAttribute?l.getAttribute(F1):null,e=l.getAttribute?l.getAttribute(P1):null;return c&&e}function T6(l){return l&&l.classList&&l.classList.contains&&l.classList.contains(m.replacementClass)}function I6(){return m.autoReplaceSvg===!0?j2.replace:j2[m.autoReplaceSvg]||j2.replace}function O6(l){return g.createElementNS("http://www.w3.org/2000/svg",l)}function B6(l){return g.createElement(l)}function I4(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:e=l.tag==="svg"?O6:B6}=c;if(typeof l=="string")return g.createTextNode(l);let s=e(l.tag);return Object.keys(l.attributes||[]).forEach(function(a){s.setAttribute(a,l.attributes[a])}),(l.children||[]).forEach(function(a){s.appendChild(I4(a,{ceFn:e}))}),s}function R6(l){let c=" ".concat(l.outerHTML," ");return c="".concat(c,"Font Awesome fontawesome.com "),c}var j2={replace:function(l){let c=l[0];if(c.parentNode)if(l[1].forEach(e=>{c.parentNode.insertBefore(I4(e),c)}),c.getAttribute(J)===null&&m.keepOriginalSource){let e=g.createComment(R6(c));c.parentNode.replaceChild(e,c)}else c.remove()},nest:function(l){let c=l[0],e=l[1];if(~V1(c).indexOf(m.replacementClass))return j2.replace(l);let s=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete e[0].attributes.id,e[0].attributes.class){let a=e[0].attributes.class.split(" ").reduce((t,i)=>(i===m.replacementClass||i.match(s)?t.toSvg.push(i):t.toNode.push(i),t),{toNode:[],toSvg:[]});e[0].attributes.class=a.toSvg.join(" "),a.toNode.length===0?c.removeAttribute("class"):c.setAttribute("class",a.toNode.join(" "))}let n=e.map(a=>S2(a)).join(`
`);c.setAttribute(J,""),c.innerHTML=n}};function Z3(l){l()}function O4(l,c){let e=typeof c=="function"?c:G2;if(l.length===0)e();else{let s=Z3;m.mutateApproach===$0&&(s=G.requestAnimationFrame||Z3),s(()=>{let n=I6(),a=H1.begin("mutate");l.map(n),a(),e()})}}var U1=!1;function B4(){U1=!0}function _1(){U1=!1}var W2=null;function c4(l){if(!U3||!m.observeMutations)return;let{treeCallback:c=G2,nodeCallback:e=G2,pseudoElementsCallback:s=G2,observeMutationsRoot:n=g}=l;W2=new U3(a=>{if(U1)return;let t=j();m2(a).forEach(i=>{if(i.type==="childList"&&i.addedNodes.length>0&&!J3(i.addedNodes[0])&&(m.searchPseudoElements&&s(i.target),c(i.target)),i.type==="attributes"&&i.target.parentNode&&m.searchPseudoElements&&s(i.target.parentNode),i.type==="attributes"&&J3(i.target)&&~Z0.indexOf(i.attributeName))if(i.attributeName==="class"&&V6(i.target)){let{prefix:r,iconName:f}=Y2(V1(i.target));i.target.setAttribute(F1,r||t),f&&i.target.setAttribute(P1,f)}else T6(i.target)&&e(i.target)})}),B&&W2.observe(n,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function H6(){W2&&W2.disconnect()}function U6(l){let c=l.getAttribute("style"),e=[];return c&&(e=c.split(";").reduce((s,n)=>{let a=n.split(":"),t=a[0],i=a.slice(1);return t&&i.length>0&&(s[t]=i.join(":").trim()),s},{})),e}function G6(l){let c=l.getAttribute("data-prefix"),e=l.getAttribute("data-icon"),s=l.innerText!==void 0?l.innerText.trim():"",n=Y2(V1(l));return n.prefix||(n.prefix=j()),c&&e&&(n.prefix=c,n.iconName=e),n.iconName&&n.prefix||(n.prefix&&s.length>0&&(n.iconName=g6(n.prefix,l.innerText)||O1(n.prefix,N1(l.innerText))),!n.iconName&&m.autoFetchSvg&&l.firstChild&&l.firstChild.nodeType===Node.TEXT_NODE&&(n.iconName=l.firstChild.data)),n}function j6(l){let c=m2(l.attributes).reduce((n,a)=>(n.name!=="class"&&n.name!=="style"&&(n[a.name]=a.value),n),{}),e=l.getAttribute("title"),s=l.getAttribute("data-fa-title-id");return m.autoA11y&&(e?c["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(s||y2()):(c["aria-hidden"]="true",c.focusable="false")),c}function q6(){return{iconName:null,title:null,titleId:null,prefix:null,transform:D,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function l4(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:e,prefix:s,rest:n}=G6(l),a=j6(l),t=v1("parseNodeAttributes",{},l),i=c.styleParser?U6(l):[];return o({iconName:e,title:l.getAttribute("title"),titleId:l.getAttribute("data-fa-title-id"),prefix:s,transform:D,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:n,styles:i,attributes:a}},t)}var{styles:W6}=E;function R4(l){let c=m.autoReplaceSvg==="nest"?l4(l,{styleParser:!1}):l4(l);return~c.extra.classes.indexOf(N4)?q("generateLayersText",l,c):q("generateSvgReplacementMutation",l,c)}var F=new Set;g4.map(l=>{F.add("fa-".concat(l))});Object.keys(K[x]).map(F.add.bind(F));Object.keys(K[S]).map(F.add.bind(F));Object.keys(K[w]).map(F.add.bind(F));F=[...F];function e4(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!B)return Promise.resolve();let e=g.documentElement.classList,s=z=>e.add("".concat(q3,"-").concat(z)),n=z=>e.remove("".concat(q3,"-").concat(z)),a=m.autoFetchSvg?F:g4.map(z=>"fa-".concat(z)).concat(Object.keys(W6));a.includes("fa")||a.push("fa");let t=[".".concat(N4,":not([").concat(J,"])")].concat(a.map(z=>".".concat(z,":not([").concat(J,"])"))).join(", ");if(t.length===0)return Promise.resolve();let i=[];try{i=m2(l.querySelectorAll(t))}catch{}if(i.length>0)s("pending"),n("complete");else return Promise.resolve();let r=H1.begin("onTree"),f=i.reduce((z,M)=>{try{let p=R4(M);p&&z.push(p)}catch(p){C4||p.name==="MissingIcon"&&console.error(p)}return z},[]);return new Promise((z,M)=>{Promise.all(f).then(p=>{O4(p,()=>{s("active"),s("complete"),n("pending"),typeof c=="function"&&c(),r(),z()})}).catch(p=>{r(),M(p)})})}function $6(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;R4(l).then(e=>{e&&O4([e],c)})}function X6(l){return function(c){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=(c||{}).icon?c:S1(c||{}),{mask:n}=e;return n&&(n=(n||{}).icon?n:S1(n||{})),l(s,L(o({},e),{mask:n}))}}var Y6=function(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:e=D,symbol:s=!1,mask:n=null,maskId:a=null,title:t=null,titleId:i=null,classes:r=[],attributes:f={},styles:z={}}=c;if(!l)return;let{prefix:M,iconName:p,icon:b}=l;return K2(o({type:"icon"},l),()=>(Z("beforeDOMElementCreation",{iconDefinition:l,params:c}),m.autoA11y&&(t?f["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(i||y2()):(f["aria-hidden"]="true",f.focusable="false")),R1({icons:{main:w1(b),mask:n?w1(n.icon):{found:!1,width:null,height:null,icon:{}}},prefix:M,iconName:p,transform:o(o({},D),e),symbol:s,title:t,maskId:a,titleId:i,extra:{attributes:f,styles:z,classes:r}})))},K6={mixout(){return{icon:X6(Y6)}},hooks(){return{mutationObserverCallbacks(l){return l.treeCallback=e4,l.nodeCallback=$6,l}}},provides(l){l.i2svg=function(c){let{node:e=g,callback:s=()=>{}}=c;return e4(e,s)},l.generateSvgReplacementMutation=function(c,e){let{iconName:s,title:n,titleId:a,prefix:t,transform:i,symbol:r,mask:f,maskId:z,extra:M}=e;return new Promise((p,b)=>{Promise.all([A1(s,t),f.iconName?A1(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(R=>{let[W,k]=R;p([c,R1({icons:{main:W,mask:k},prefix:t,iconName:s,transform:i,symbol:r,maskId:z,title:n,titleId:a,extra:M,watchable:!0})])}).catch(b)})},l.generateAbstractIcon=function(c){let{children:e,attributes:s,main:n,transform:a,styles:t}=c,i=$2(t);i.length>0&&(s.style=i);let r;return T1(a)&&(r=q("generateAbstractTransformGrouping",{main:n,transform:a,containerWidth:n.width,iconWidth:n.width})),e.push(r||n.icon),{children:e,attributes:s}}}},Q6={mixout(){return{layer(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:e=[]}=c;return K2({type:"layer"},()=>{Z("beforeDOMElementCreation",{assembler:l,params:c});let s=[];return l(n=>{Array.isArray(n)?n.map(a=>{s=s.concat(a.abstract)}):s=s.concat(n.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers"),...e].join(" ")},children:s}]})}}}},J6={mixout(){return{counter(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:e=null,classes:s=[],attributes:n={},styles:a={}}=c;return K2({type:"counter",content:l},()=>(Z("beforeDOMElementCreation",{content:l,params:c}),D6({content:l.toString(),title:e,extra:{attributes:n,styles:a,classes:["".concat(m.cssPrefix,"-layers-counter"),...s]}})))}}}},Z6={mixout(){return{text(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:e=D,title:s=null,classes:n=[],attributes:a={},styles:t={}}=c;return K2({type:"text",content:l},()=>(Z("beforeDOMElementCreation",{content:l,params:c}),K3({content:l,transform:o(o({},D),e),title:s,extra:{attributes:a,styles:t,classes:["".concat(m.cssPrefix,"-layers-text"),...n]}})))}}},provides(l){l.generateLayersText=function(c,e){let{title:s,transform:n,extra:a}=e,t=null,i=null;if(u4){let r=parseInt(getComputedStyle(c).fontSize,10),f=c.getBoundingClientRect();t=f.width/r,i=f.height/r}return m.autoA11y&&!s&&(a.attributes["aria-hidden"]="true"),Promise.resolve([c,K3({content:c.innerHTML,width:t,height:i,transform:n,title:s,extra:a,watchable:!0})])}}},c8=new RegExp('"',"ug"),s4=[1105920,1112319],n4=o(o(o({FontAwesome:{normal:"fas",400:"fas"}},V0),P0),G0),D1=Object.keys(n4).reduce((l,c)=>(l[c.toLowerCase()]=n4[c],l),{}),l8=Object.keys(D1).reduce((l,c)=>{let e=D1[c];return l[c]=e[900]||[...Object.entries(e)][0][1],l},{});function e8(l){let c=l.replace(c8,""),e=L6(c,0),s=e>=s4[0]&&e<=s4[1],n=c.length===2?c[0]===c[1]:!1;return{value:N1(n?c[0]:c),isSecondary:s||n}}function s8(l,c){let e=l.replace(/^['"]|['"]$/g,"").toLowerCase(),s=parseInt(c),n=isNaN(s)?"normal":s;return(D1[e]||{})[n]||l8[e]}function a4(l,c){let e="".concat(W0).concat(c.replace(":","-"));return new Promise((s,n)=>{if(l.getAttribute(e)!==null)return s();let t=m2(l.children).filter(p=>p.getAttribute(h1)===c)[0],i=G.getComputedStyle(l,c),r=i.getPropertyValue("font-family"),f=r.match(Q0),z=i.getPropertyValue("font-weight"),M=i.getPropertyValue("content");if(t&&!f)return l.removeChild(t),s();if(f&&M!=="none"&&M!==""){let p=i.getPropertyValue("content"),b=s8(r,z),{value:R,isSecondary:W}=e8(p),k=f[0].startsWith("FontAwesome"),P=O1(b,R),v=P;if(k){let _=x6(R);_.iconName&&_.prefix&&(P=_.iconName,b=_.prefix)}if(P&&!W&&(!t||t.getAttribute(F1)!==b||t.getAttribute(P1)!==v)){l.setAttribute(e,v),t&&l.removeChild(t);let _=q6(),{extra:c2}=_;c2.attributes[h1]=c,A1(P,b).then(l2=>{let U4=R1(L(o({},_),{icons:{main:l2,mask:B1()},prefix:b,iconName:v,extra:c2,watchable:!0})),J2=g.createElementNS("http://www.w3.org/2000/svg","svg");c==="::before"?l.insertBefore(J2,l.firstChild):l.appendChild(J2),J2.outerHTML=U4.map(G4=>S2(G4)).join(`
`),l.removeAttribute(e),s()}).catch(n)}else s()}else s()})}function n8(l){return Promise.all([a4(l,"::before"),a4(l,"::after")])}function a8(l){return l.parentNode!==document.head&&!~X0.indexOf(l.tagName.toUpperCase())&&!l.getAttribute(h1)&&(!l.parentNode||l.parentNode.tagName!=="svg")}function t4(l){if(B)return new Promise((c,e)=>{let s=m2(l.querySelectorAll("*")).filter(a8).map(n8),n=H1.begin("searchPseudoElements");B4(),Promise.all(s).then(()=>{n(),_1(),c()}).catch(()=>{n(),_1(),e()})})}var t8={hooks(){return{mutationObserverCallbacks(l){return l.pseudoElementsCallback=t4,l}}},provides(l){l.pseudoElements2svg=function(c){let{node:e=g}=c;m.searchPseudoElements&&t4(e)}}},i4=!1,i8={mixout(){return{dom:{unwatch(){B4(),i4=!0}}}},hooks(){return{bootstrap(){c4(v1("mutationObserverCallbacks",{}))},noAuto(){H6()},watch(l){let{observeMutationsRoot:c}=l;i4?_1():c4(v1("mutationObserverCallbacks",{observeMutationsRoot:c}))}}}},o4=l=>{let c={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return l.toLowerCase().split(" ").reduce((e,s)=>{let n=s.toLowerCase().split("-"),a=n[0],t=n.slice(1).join("-");if(a&&t==="h")return e.flipX=!0,e;if(a&&t==="v")return e.flipY=!0,e;if(t=parseFloat(t),isNaN(t))return e;switch(a){case"grow":e.size=e.size+t;break;case"shrink":e.size=e.size-t;break;case"left":e.x=e.x-t;break;case"right":e.x=e.x+t;break;case"up":e.y=e.y-t;break;case"down":e.y=e.y+t;break;case"rotate":e.rotate=e.rotate+t;break}return e},c)},o8={mixout(){return{parse:{transform:l=>o4(l)}}},hooks(){return{parseNodeAttributes(l,c){let e=c.getAttribute("data-fa-transform");return e&&(l.transform=o4(e)),l}}},provides(l){l.generateAbstractTransformGrouping=function(c){let{main:e,transform:s,containerWidth:n,iconWidth:a}=c,t={transform:"translate(".concat(n/2," 256)")},i="translate(".concat(s.x*32,", ").concat(s.y*32,") "),r="scale(".concat(s.size/16*(s.flipX?-1:1),", ").concat(s.size/16*(s.flipY?-1:1),") "),f="rotate(".concat(s.rotate," 0 0)"),z={transform:"".concat(i," ").concat(r," ").concat(f)},M={transform:"translate(".concat(a/2*-1," -256)")},p={outer:t,inner:z,path:M};return{tag:"g",attributes:o({},p.outer),children:[{tag:"g",attributes:o({},p.inner),children:[{tag:e.icon.tag,children:e.icon.children,attributes:o(o({},e.icon.attributes),p.path)}]}]}}}},d1={x:0,y:0,width:"100%",height:"100%"};function r4(l){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return l.attributes&&(l.attributes.fill||c)&&(l.attributes.fill="black"),l}function r8(l){return l.tag==="g"?l.children:[l]}var f8={hooks(){return{parseNodeAttributes(l,c){let e=c.getAttribute("data-fa-mask"),s=e?Y2(e.split(" ").map(n=>n.trim())):B1();return s.prefix||(s.prefix=j()),l.mask=s,l.maskId=c.getAttribute("data-fa-mask-id"),l}}},provides(l){l.generateAbstractMask=function(c){let{children:e,attributes:s,main:n,mask:a,maskId:t,transform:i}=c,{width:r,icon:f}=n,{width:z,icon:M}=a,p=i6({transform:i,containerWidth:z,iconWidth:r}),b={tag:"rect",attributes:L(o({},d1),{fill:"white"})},R=f.children?{children:f.children.map(r4)}:{},W={tag:"g",attributes:o({},p.inner),children:[r4(o({tag:f.tag,attributes:o(o({},f.attributes),p.path)},R))]},k={tag:"g",attributes:o({},p.outer),children:[W]},P="mask-".concat(t||y2()),v="clip-".concat(t||y2()),_={tag:"mask",attributes:L(o({},d1),{id:P,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[b,k]},c2={tag:"defs",children:[{tag:"clipPath",attributes:{id:v},children:r8(M)},_]};return e.push(c2,{tag:"rect",attributes:o({fill:"currentColor","clip-path":"url(#".concat(v,")"),mask:"url(#".concat(P,")")},d1)}),{children:e,attributes:s}}}},m8={provides(l){let c=!1;G.matchMedia&&(c=G.matchMedia("(prefers-reduced-motion: reduce)").matches),l.missingIconAbstract=function(){let e=[],s={fill:"currentColor"},n={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};e.push({tag:"path",attributes:L(o({},s),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let a=L(o({},n),{attributeName:"opacity"}),t={tag:"circle",attributes:L(o({},s),{cx:"256",cy:"364",r:"28"}),children:[]};return c||t.children.push({tag:"animate",attributes:L(o({},n),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:L(o({},a),{values:"1;0;1;1;0;1;"})}),e.push(t),e.push({tag:"path",attributes:L(o({},s),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:c?[]:[{tag:"animate",attributes:L(o({},a),{values:"1;0;0;0;0;1;"})}]}),c||e.push({tag:"path",attributes:L(o({},s),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:L(o({},a),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:e}}}},z8={hooks(){return{parseNodeAttributes(l,c){let e=c.getAttribute("data-fa-symbol"),s=e===null?!1:e===""?!0:e;return l.symbol=s,l}}}},u8=[f6,K6,Q6,J6,Z6,t8,i8,o8,f8,m8,z8];y6(u8,{mixoutsTo:A});var J8=A.noAuto,L8=A.config,Z8=A.library,p8=A.dom,d8=A.parse,c5=A.findIconDefinition,l5=A.toHtml,M8=A.icon,e5=A.layer,h8=A.text,C8=A.counter;var H4=(()=>{let c=class c{};c.\u0275fac=function(n){return new(n||c)},c.\u0275mod=T({type:c}),c.\u0275inj=V({});let l=c;return l})();var Q2=class l{static \u0275fac=function(e){return new(e||l)};static \u0275mod=T({type:l,bootstrap:[H2]});static \u0275inj=V({imports:[e3,R2,H4,y3]})};l3().bootstrapModule(Q2,{ngZoneEventCoalescing:!0}).catch(l=>console.error(l));
