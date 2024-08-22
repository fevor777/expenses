import{$ as lr,A as he,B as Ft,C as X,D as Nn,E as tr,F as _,G as C,H as Y,I as me,J as I,K as O,L as E,M as bt,N as nt,O as er,P as nr,Q as ir,R as Fn,S as rr,V as sr,W as or,X as ar,Y as Ge,Z as Pt,_ as Pn,a as h,aa as We,b as D,ba as cr,c as xo,d as qi,e as Ki,ea as ur,f as Zi,fa as dr,g as Ji,ga as fr,h as Qi,ha as kn,i as Vn,ia as hr,j as He,ja as mr,k as pt,ka as pr,l as Wt,la as Xt,m as gt,ma as gr,n as vt,na as Rn,o as yt,oa as Ye,p as On,pa as vr,q as N,r as F,s as fe,t as _t,u as Yt,v as w,w as V,x as ze,y as Be,z as $t}from"./chunk-5ZUFUI6A.js";var Ln=xo((nc,$e)=>{(function(e,t,n,i){"use strict";var s=["","webkit","Moz","MS","ms","o"],l=t.createElement("div"),u="function",d=Math.round,m=Math.abs,p=Date.now;function y(r,o,a){return setTimeout(U(r,a),o)}function A(r,o,a){return Array.isArray(r)?(b(r,a[o],a),!0):!1}function b(r,o,a){var c;if(r)if(r.forEach)r.forEach(o,a);else if(r.length!==i)for(c=0;c<r.length;)o.call(a,r[c],c,r),c++;else for(c in r)r.hasOwnProperty(c)&&o.call(a,r[c],c,r)}function L(r,o,a){var c="DEPRECATED METHOD: "+o+`
`+a+` AT 
`;return function(){var f=new Error("get-stack-trace"),g=f&&f.stack?f.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",x=e.console&&(e.console.warn||e.console.log);return x&&x.call(e.console,c,g),r.apply(this,arguments)}}var k;typeof Object.assign!="function"?k=function(o){if(o===i||o===null)throw new TypeError("Cannot convert undefined or null to object");for(var a=Object(o),c=1;c<arguments.length;c++){var f=arguments[c];if(f!==i&&f!==null)for(var g in f)f.hasOwnProperty(g)&&(a[g]=f[g])}return a}:k=Object.assign;var it=L(function(o,a,c){for(var f=Object.keys(a),g=0;g<f.length;)(!c||c&&o[f[g]]===i)&&(o[f[g]]=a[f[g]]),g++;return o},"extend","Use `assign`."),$=L(function(o,a){return it(o,a,!0)},"merge","Use `assign`.");function S(r,o,a){var c=o.prototype,f;f=r.prototype=Object.create(c),f.constructor=r,f._super=c,a&&k(f,a)}function U(r,o){return function(){return r.apply(o,arguments)}}function z(r,o){return typeof r==u?r.apply(o&&o[0]||i,o):r}function ut(r,o){return r===i?o:r}function tt(r,o,a){b(Me(o),function(c){r.addEventListener(c,a,!1)})}function Ht(r,o,a){b(Me(o),function(c){r.removeEventListener(c,a,!1)})}function zt(r,o){for(;r;){if(r==o)return!0;r=r.parentNode}return!1}function dt(r,o){return r.indexOf(o)>-1}function Me(r){return r.trim().split(/\s+/g)}function Bt(r,o,a){if(r.indexOf&&!a)return r.indexOf(o);for(var c=0;c<r.length;){if(a&&r[c][a]==o||!a&&r[c]===o)return c;c++}return-1}function Te(r){return Array.prototype.slice.call(r,0)}function Ii(r,o,a){for(var c=[],f=[],g=0;g<r.length;){var x=o?r[g][o]:r[g];Bt(f,x)<0&&c.push(r[g]),f[g]=x,g++}return a&&(o?c=c.sort(function(j,G){return j[o]>G[o]}):c=c.sort()),c}function Se(r,o){for(var a,c,f=o[0].toUpperCase()+o.slice(1),g=0;g<s.length;){if(a=s[g],c=a?a+f:o,c in r)return c;g++}return i}var Hs=1;function zs(){return Hs++}function Mi(r){var o=r.ownerDocument||r;return o.defaultView||o.parentWindow||e}var Bs=/mobile|tablet|ip(ad|hone|od)|android/i,Ti="ontouchstart"in e,Gs=Se(e,"PointerEvent")!==i,Ws=Ti&&Bs.test(navigator.userAgent),re="touch",Ys="pen",bn="mouse",$s="kinect",Xs=25,B=1,Vt=2,P=4,W=8,Ve=1,se=2,oe=4,ae=8,le=16,rt=se|oe,Ot=ae|le,Si=rt|Ot,Vi=["x","y"],Oe=["clientX","clientY"];function J(r,o){var a=this;this.manager=r,this.callback=o,this.element=r.element,this.target=r.options.inputTarget,this.domHandler=function(c){z(r.options.enable,[r])&&a.handler(c)},this.init()}J.prototype={handler:function(){},init:function(){this.evEl&&tt(this.element,this.evEl,this.domHandler),this.evTarget&&tt(this.target,this.evTarget,this.domHandler),this.evWin&&tt(Mi(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&Ht(this.element,this.evEl,this.domHandler),this.evTarget&&Ht(this.target,this.evTarget,this.domHandler),this.evWin&&Ht(Mi(this.element),this.evWin,this.domHandler)}};function qs(r){var o,a=r.options.inputClass;return a?o=a:Gs?o=En:Ws?o=Pe:Ti?o=xn:o=Fe,new o(r,Ks)}function Ks(r,o,a){var c=a.pointers.length,f=a.changedPointers.length,g=o&B&&c-f===0,x=o&(P|W)&&c-f===0;a.isFirst=!!g,a.isFinal=!!x,g&&(r.session={}),a.eventType=o,Zs(r,a),r.emit("hammer.input",a),r.recognize(a),r.session.prevInput=a}function Zs(r,o){var a=r.session,c=o.pointers,f=c.length;a.firstInput||(a.firstInput=Oi(o)),f>1&&!a.firstMultiple?a.firstMultiple=Oi(o):f===1&&(a.firstMultiple=!1);var g=a.firstInput,x=a.firstMultiple,R=x?x.center:g.center,j=o.center=Ni(c);o.timeStamp=p(),o.deltaTime=o.timeStamp-g.timeStamp,o.angle=Cn(R,j),o.distance=Ne(R,j),Js(a,o),o.offsetDirection=Pi(o.deltaX,o.deltaY);var G=Fi(o.deltaTime,o.deltaX,o.deltaY);o.overallVelocityX=G.x,o.overallVelocityY=G.y,o.overallVelocity=m(G.x)>m(G.y)?G.x:G.y,o.scale=x?eo(x.pointers,c):1,o.rotation=x?to(x.pointers,c):0,o.maxPointers=a.prevInput?o.pointers.length>a.prevInput.maxPointers?o.pointers.length:a.prevInput.maxPointers:o.pointers.length,Qs(a,o);var ot=r.element;zt(o.srcEvent.target,ot)&&(ot=o.srcEvent.target),o.target=ot}function Js(r,o){var a=o.center,c=r.offsetDelta||{},f=r.prevDelta||{},g=r.prevInput||{};(o.eventType===B||g.eventType===P)&&(f=r.prevDelta={x:g.deltaX||0,y:g.deltaY||0},c=r.offsetDelta={x:a.x,y:a.y}),o.deltaX=f.x+(a.x-c.x),o.deltaY=f.y+(a.y-c.y)}function Qs(r,o){var a=r.lastInterval||o,c=o.timeStamp-a.timeStamp,f,g,x,R;if(o.eventType!=W&&(c>Xs||a.velocity===i)){var j=o.deltaX-a.deltaX,G=o.deltaY-a.deltaY,ot=Fi(c,j,G);g=ot.x,x=ot.y,f=m(ot.x)>m(ot.y)?ot.x:ot.y,R=Pi(j,G),r.lastInterval=o}else f=a.velocity,g=a.velocityX,x=a.velocityY,R=a.direction;o.velocity=f,o.velocityX=g,o.velocityY=x,o.direction=R}function Oi(r){for(var o=[],a=0;a<r.pointers.length;)o[a]={clientX:d(r.pointers[a].clientX),clientY:d(r.pointers[a].clientY)},a++;return{timeStamp:p(),pointers:o,center:Ni(o),deltaX:r.deltaX,deltaY:r.deltaY}}function Ni(r){var o=r.length;if(o===1)return{x:d(r[0].clientX),y:d(r[0].clientY)};for(var a=0,c=0,f=0;f<o;)a+=r[f].clientX,c+=r[f].clientY,f++;return{x:d(a/o),y:d(c/o)}}function Fi(r,o,a){return{x:o/r||0,y:a/r||0}}function Pi(r,o){return r===o?Ve:m(r)>=m(o)?r<0?se:oe:o<0?ae:le}function Ne(r,o,a){a||(a=Vi);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.sqrt(c*c+f*f)}function Cn(r,o,a){a||(a=Vi);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.atan2(f,c)*180/Math.PI}function to(r,o){return Cn(o[1],o[0],Oe)+Cn(r[1],r[0],Oe)}function eo(r,o){return Ne(o[0],o[1],Oe)/Ne(r[0],r[1],Oe)}var no={mousedown:B,mousemove:Vt,mouseup:P},io="mousedown",ro="mousemove mouseup";function Fe(){this.evEl=io,this.evWin=ro,this.pressed=!1,J.apply(this,arguments)}S(Fe,J,{handler:function(o){var a=no[o.type];a&B&&o.button===0&&(this.pressed=!0),a&Vt&&o.which!==1&&(a=P),this.pressed&&(a&P&&(this.pressed=!1),this.callback(this.manager,a,{pointers:[o],changedPointers:[o],pointerType:bn,srcEvent:o}))}});var so={pointerdown:B,pointermove:Vt,pointerup:P,pointercancel:W,pointerout:W},oo={2:re,3:Ys,4:bn,5:$s},ki="pointerdown",Ri="pointermove pointerup pointercancel";e.MSPointerEvent&&!e.PointerEvent&&(ki="MSPointerDown",Ri="MSPointerMove MSPointerUp MSPointerCancel");function En(){this.evEl=ki,this.evWin=Ri,J.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}S(En,J,{handler:function(o){var a=this.store,c=!1,f=o.type.toLowerCase().replace("ms",""),g=so[f],x=oo[o.pointerType]||o.pointerType,R=x==re,j=Bt(a,o.pointerId,"pointerId");g&B&&(o.button===0||R)?j<0&&(a.push(o),j=a.length-1):g&(P|W)&&(c=!0),!(j<0)&&(a[j]=o,this.callback(this.manager,g,{pointers:a,changedPointers:[o],pointerType:x,srcEvent:o}),c&&a.splice(j,1))}});var ao={touchstart:B,touchmove:Vt,touchend:P,touchcancel:W},lo="touchstart",co="touchstart touchmove touchend touchcancel";function Li(){this.evTarget=lo,this.evWin=co,this.started=!1,J.apply(this,arguments)}S(Li,J,{handler:function(o){var a=ao[o.type];if(a===B&&(this.started=!0),!!this.started){var c=uo.call(this,o,a);a&(P|W)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:re,srcEvent:o})}}});function uo(r,o){var a=Te(r.touches),c=Te(r.changedTouches);return o&(P|W)&&(a=Ii(a.concat(c),"identifier",!0)),[a,c]}var fo={touchstart:B,touchmove:Vt,touchend:P,touchcancel:W},ho="touchstart touchmove touchend touchcancel";function Pe(){this.evTarget=ho,this.targetIds={},J.apply(this,arguments)}S(Pe,J,{handler:function(o){var a=fo[o.type],c=mo.call(this,o,a);c&&this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:re,srcEvent:o})}});function mo(r,o){var a=Te(r.touches),c=this.targetIds;if(o&(B|Vt)&&a.length===1)return c[a[0].identifier]=!0,[a,a];var f,g,x=Te(r.changedTouches),R=[],j=this.target;if(g=a.filter(function(G){return zt(G.target,j)}),o===B)for(f=0;f<g.length;)c[g[f].identifier]=!0,f++;for(f=0;f<x.length;)c[x[f].identifier]&&R.push(x[f]),o&(P|W)&&delete c[x[f].identifier],f++;if(R.length)return[Ii(g.concat(R),"identifier",!0),R]}var po=2500,Ui=25;function xn(){J.apply(this,arguments);var r=U(this.handler,this);this.touch=new Pe(this.manager,r),this.mouse=new Fe(this.manager,r),this.primaryTouch=null,this.lastTouches=[]}S(xn,J,{handler:function(o,a,c){var f=c.pointerType==re,g=c.pointerType==bn;if(!(g&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(f)go.call(this,a,c);else if(g&&vo.call(this,c))return;this.callback(o,a,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function go(r,o){r&B?(this.primaryTouch=o.changedPointers[0].identifier,ji.call(this,o)):r&(P|W)&&ji.call(this,o)}function ji(r){var o=r.changedPointers[0];if(o.identifier===this.primaryTouch){var a={x:o.clientX,y:o.clientY};this.lastTouches.push(a);var c=this.lastTouches,f=function(){var g=c.indexOf(a);g>-1&&c.splice(g,1)};setTimeout(f,po)}}function vo(r){for(var o=r.srcEvent.clientX,a=r.srcEvent.clientY,c=0;c<this.lastTouches.length;c++){var f=this.lastTouches[c],g=Math.abs(o-f.x),x=Math.abs(a-f.y);if(g<=Ui&&x<=Ui)return!0}return!1}var Hi=Se(l.style,"touchAction"),zi=Hi!==i,Bi="compute",Gi="auto",An="manipulation",Nt="none",ce="pan-x",ue="pan-y",ke=_o();function wn(r,o){this.manager=r,this.set(o)}wn.prototype={set:function(r){r==Bi&&(r=this.compute()),zi&&this.manager.element.style&&ke[r]&&(this.manager.element.style[Hi]=r),this.actions=r.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var r=[];return b(this.manager.recognizers,function(o){z(o.options.enable,[o])&&(r=r.concat(o.getTouchAction()))}),yo(r.join(" "))},preventDefaults:function(r){var o=r.srcEvent,a=r.offsetDirection;if(this.manager.session.prevented){o.preventDefault();return}var c=this.actions,f=dt(c,Nt)&&!ke[Nt],g=dt(c,ue)&&!ke[ue],x=dt(c,ce)&&!ke[ce];if(f){var R=r.pointers.length===1,j=r.distance<2,G=r.deltaTime<250;if(R&&j&&G)return}if(!(x&&g)&&(f||g&&a&rt||x&&a&Ot))return this.preventSrc(o)},preventSrc:function(r){this.manager.session.prevented=!0,r.preventDefault()}};function yo(r){if(dt(r,Nt))return Nt;var o=dt(r,ce),a=dt(r,ue);return o&&a?Nt:o||a?o?ce:ue:dt(r,An)?An:Gi}function _o(){if(!zi)return!1;var r={},o=e.CSS&&e.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(a){r[a]=o?e.CSS.supports("touch-action",a):!0}),r}var Re=1,Q=2,Gt=4,wt=8,ft=wt,de=16,st=32;function ht(r){this.options=k({},this.defaults,r||{}),this.id=zs(),this.manager=null,this.options.enable=ut(this.options.enable,!0),this.state=Re,this.simultaneous={},this.requireFail=[]}ht.prototype={defaults:{},set:function(r){return k(this.options,r),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(r){if(A(r,"recognizeWith",this))return this;var o=this.simultaneous;return r=Le(r,this),o[r.id]||(o[r.id]=r,r.recognizeWith(this)),this},dropRecognizeWith:function(r){return A(r,"dropRecognizeWith",this)?this:(r=Le(r,this),delete this.simultaneous[r.id],this)},requireFailure:function(r){if(A(r,"requireFailure",this))return this;var o=this.requireFail;return r=Le(r,this),Bt(o,r)===-1&&(o.push(r),r.requireFailure(this)),this},dropRequireFailure:function(r){if(A(r,"dropRequireFailure",this))return this;r=Le(r,this);var o=Bt(this.requireFail,r);return o>-1&&this.requireFail.splice(o,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(r){return!!this.simultaneous[r.id]},emit:function(r){var o=this,a=this.state;function c(f){o.manager.emit(f,r)}a<wt&&c(o.options.event+Wi(a)),c(o.options.event),r.additionalEvent&&c(r.additionalEvent),a>=wt&&c(o.options.event+Wi(a))},tryEmit:function(r){if(this.canEmit())return this.emit(r);this.state=st},canEmit:function(){for(var r=0;r<this.requireFail.length;){if(!(this.requireFail[r].state&(st|Re)))return!1;r++}return!0},recognize:function(r){var o=k({},r);if(!z(this.options.enable,[this,o])){this.reset(),this.state=st;return}this.state&(ft|de|st)&&(this.state=Re),this.state=this.process(o),this.state&(Q|Gt|wt|de)&&this.tryEmit(o)},process:function(r){},getTouchAction:function(){},reset:function(){}};function Wi(r){return r&de?"cancel":r&wt?"end":r&Gt?"move":r&Q?"start":""}function Yi(r){return r==le?"down":r==ae?"up":r==se?"left":r==oe?"right":""}function Le(r,o){var a=o.manager;return a?a.get(r):r}function et(){ht.apply(this,arguments)}S(et,ht,{defaults:{pointers:1},attrTest:function(r){var o=this.options.pointers;return o===0||r.pointers.length===o},process:function(r){var o=this.state,a=r.eventType,c=o&(Q|Gt),f=this.attrTest(r);return c&&(a&W||!f)?o|de:c||f?a&P?o|wt:o&Q?o|Gt:Q:st}});function Ue(){et.apply(this,arguments),this.pX=null,this.pY=null}S(Ue,et,{defaults:{event:"pan",threshold:10,pointers:1,direction:Si},getTouchAction:function(){var r=this.options.direction,o=[];return r&rt&&o.push(ue),r&Ot&&o.push(ce),o},directionTest:function(r){var o=this.options,a=!0,c=r.distance,f=r.direction,g=r.deltaX,x=r.deltaY;return f&o.direction||(o.direction&rt?(f=g===0?Ve:g<0?se:oe,a=g!=this.pX,c=Math.abs(r.deltaX)):(f=x===0?Ve:x<0?ae:le,a=x!=this.pY,c=Math.abs(r.deltaY))),r.direction=f,a&&c>o.threshold&&f&o.direction},attrTest:function(r){return et.prototype.attrTest.call(this,r)&&(this.state&Q||!(this.state&Q)&&this.directionTest(r))},emit:function(r){this.pX=r.deltaX,this.pY=r.deltaY;var o=Yi(r.direction);o&&(r.additionalEvent=this.options.event+o),this._super.emit.call(this,r)}});function Dn(){et.apply(this,arguments)}S(Dn,et,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Nt]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.scale-1)>this.options.threshold||this.state&Q)},emit:function(r){if(r.scale!==1){var o=r.scale<1?"in":"out";r.additionalEvent=this.options.event+o}this._super.emit.call(this,r)}});function In(){ht.apply(this,arguments),this._timer=null,this._input=null}S(In,ht,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[Gi]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime>o.time;if(this._input=r,!c||!a||r.eventType&(P|W)&&!f)this.reset();else if(r.eventType&B)this.reset(),this._timer=y(function(){this.state=ft,this.tryEmit()},o.time,this);else if(r.eventType&P)return ft;return st},reset:function(){clearTimeout(this._timer)},emit:function(r){this.state===ft&&(r&&r.eventType&P?this.manager.emit(this.options.event+"up",r):(this._input.timeStamp=p(),this.manager.emit(this.options.event,this._input)))}});function Mn(){et.apply(this,arguments)}S(Mn,et,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Nt]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.rotation)>this.options.threshold||this.state&Q)}});function Tn(){et.apply(this,arguments)}S(Tn,et,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:rt|Ot,pointers:1},getTouchAction:function(){return Ue.prototype.getTouchAction.call(this)},attrTest:function(r){var o=this.options.direction,a;return o&(rt|Ot)?a=r.overallVelocity:o&rt?a=r.overallVelocityX:o&Ot&&(a=r.overallVelocityY),this._super.attrTest.call(this,r)&&o&r.offsetDirection&&r.distance>this.options.threshold&&r.maxPointers==this.options.pointers&&m(a)>this.options.velocity&&r.eventType&P},emit:function(r){var o=Yi(r.offsetDirection);o&&this.manager.emit(this.options.event+o,r),this.manager.emit(this.options.event,r)}});function je(){ht.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}S(je,ht,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[An]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime<o.time;if(this.reset(),r.eventType&B&&this.count===0)return this.failTimeout();if(c&&f&&a){if(r.eventType!=P)return this.failTimeout();var g=this.pTime?r.timeStamp-this.pTime<o.interval:!0,x=!this.pCenter||Ne(this.pCenter,r.center)<o.posThreshold;this.pTime=r.timeStamp,this.pCenter=r.center,!x||!g?this.count=1:this.count+=1,this._input=r;var R=this.count%o.taps;if(R===0)return this.hasRequireFailures()?(this._timer=y(function(){this.state=ft,this.tryEmit()},o.interval,this),Q):ft}return st},failTimeout:function(){return this._timer=y(function(){this.state=st},this.options.interval,this),st},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ft&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function mt(r,o){return o=o||{},o.recognizers=ut(o.recognizers,mt.defaults.preset),new Sn(r,o)}mt.VERSION="2.0.7",mt.defaults={domEvents:!1,touchAction:Bi,enable:!0,inputTarget:null,inputClass:null,preset:[[Mn,{enable:!1}],[Dn,{enable:!1},["rotate"]],[Tn,{direction:rt}],[Ue,{direction:rt},["swipe"]],[je],[je,{event:"doubletap",taps:2},["tap"]],[In]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var bo=1,$i=2;function Sn(r,o){this.options=k({},mt.defaults,o||{}),this.options.inputTarget=this.options.inputTarget||r,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=r,this.input=qs(this),this.touchAction=new wn(this,this.options.touchAction),Xi(this,!0),b(this.options.recognizers,function(a){var c=this.add(new a[0](a[1]));a[2]&&c.recognizeWith(a[2]),a[3]&&c.requireFailure(a[3])},this)}Sn.prototype={set:function(r){return k(this.options,r),r.touchAction&&this.touchAction.update(),r.inputTarget&&(this.input.destroy(),this.input.target=r.inputTarget,this.input.init()),this},stop:function(r){this.session.stopped=r?$i:bo},recognize:function(r){var o=this.session;if(!o.stopped){this.touchAction.preventDefaults(r);var a,c=this.recognizers,f=o.curRecognizer;(!f||f&&f.state&ft)&&(f=o.curRecognizer=null);for(var g=0;g<c.length;)a=c[g],o.stopped!==$i&&(!f||a==f||a.canRecognizeWith(f))?a.recognize(r):a.reset(),!f&&a.state&(Q|Gt|wt)&&(f=o.curRecognizer=a),g++}},get:function(r){if(r instanceof ht)return r;for(var o=this.recognizers,a=0;a<o.length;a++)if(o[a].options.event==r)return o[a];return null},add:function(r){if(A(r,"add",this))return this;var o=this.get(r.options.event);return o&&this.remove(o),this.recognizers.push(r),r.manager=this,this.touchAction.update(),r},remove:function(r){if(A(r,"remove",this))return this;if(r=this.get(r),r){var o=this.recognizers,a=Bt(o,r);a!==-1&&(o.splice(a,1),this.touchAction.update())}return this},on:function(r,o){if(r!==i&&o!==i){var a=this.handlers;return b(Me(r),function(c){a[c]=a[c]||[],a[c].push(o)}),this}},off:function(r,o){if(r!==i){var a=this.handlers;return b(Me(r),function(c){o?a[c]&&a[c].splice(Bt(a[c],o),1):delete a[c]}),this}},emit:function(r,o){this.options.domEvents&&Co(r,o);var a=this.handlers[r]&&this.handlers[r].slice();if(!(!a||!a.length)){o.type=r,o.preventDefault=function(){o.srcEvent.preventDefault()};for(var c=0;c<a.length;)a[c](o),c++}},destroy:function(){this.element&&Xi(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function Xi(r,o){var a=r.element;if(a.style){var c;b(r.options.cssProps,function(f,g){c=Se(a.style,g),o?(r.oldCssProps[c]=a.style[c],a.style[c]=f):a.style[c]=r.oldCssProps[c]||""}),o||(r.oldCssProps={})}}function Co(r,o){var a=t.createEvent("Event");a.initEvent(r,!0,!0),a.gesture=o,o.target.dispatchEvent(a)}k(mt,{INPUT_START:B,INPUT_MOVE:Vt,INPUT_END:P,INPUT_CANCEL:W,STATE_POSSIBLE:Re,STATE_BEGAN:Q,STATE_CHANGED:Gt,STATE_ENDED:wt,STATE_RECOGNIZED:ft,STATE_CANCELLED:de,STATE_FAILED:st,DIRECTION_NONE:Ve,DIRECTION_LEFT:se,DIRECTION_RIGHT:oe,DIRECTION_UP:ae,DIRECTION_DOWN:le,DIRECTION_HORIZONTAL:rt,DIRECTION_VERTICAL:Ot,DIRECTION_ALL:Si,Manager:Sn,Input:J,TouchAction:wn,TouchInput:Pe,MouseInput:Fe,PointerEventInput:En,TouchMouseInput:xn,SingleTouchInput:Li,Recognizer:ht,AttrRecognizer:et,Tap:je,Pan:Ue,Swipe:Tn,Pinch:Dn,Rotate:Mn,Press:In,on:tt,off:Ht,each:b,merge:$,extend:it,assign:k,inherit:S,bindFn:U,prefixed:Se});var Eo=typeof e<"u"?e:typeof self<"u"?self:{};Eo.Hammer=mt,typeof define=="function"&&define.amd?define(function(){return mt}):typeof $e<"u"&&$e.exports?$e.exports=mt:e[n]=mt})(window,document,"Hammer")});var Du=qi(Ln());var wr=(()=>{let t=class t{constructor(i,s){this._renderer=i,this._elementRef=s,this.onChange=l=>{},this.onTouched=()=>{}}setProperty(i,s){this._renderer.setProperty(this._elementRef.nativeElement,i,s)}registerOnTouched(i){this.onTouched=i}registerOnChange(i){this.onChange=i}setDisabledState(i){this.setProperty("disabled",i)}};t.\u0275fac=function(s){return new(s||t)(V(ze),V(Yt))},t.\u0275dir=yt({type:t});let e=t;return e})(),wo=(()=>{let t=class t extends wr{};t.\u0275fac=(()=>{let i;return function(l){return(i||(i=fe(t)))(l||t)}})(),t.\u0275dir=yt({type:t,features:[$t]});let e=t;return e})(),Dr=new Wt("");var Do={provide:Dr,useExisting:Vn(()=>Je),multi:!0};function Io(){let e=Pn()?Pn().getUserAgent():"";return/android (\d+)/.test(e.toLowerCase())}var Mo=new Wt(""),Je=(()=>{let t=class t extends wr{constructor(i,s,l){super(i,s),this._compositionMode=l,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!Io())}writeValue(i){let s=i??"";this.setProperty("value",s)}_handleInput(i){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(i)}_compositionStart(){this._composing=!0}_compositionEnd(i){this._composing=!1,this._compositionMode&&this.onChange(i)}};t.\u0275fac=function(s){return new(s||t)(V(ze),V(Yt),V(Mo,8))},t.\u0275dir=yt({type:t,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(s,l){s&1&&I("input",function(d){return l._handleInput(d.target.value)})("blur",function(){return l.onTouched()})("compositionstart",function(){return l._compositionStart()})("compositionend",function(d){return l._compositionEnd(d.target.value)})},features:[Fn([Do]),$t]});let e=t;return e})();var To=new Wt(""),So=new Wt("");function Ir(e){return e!=null}function Mr(e){return sr(e)?Zi(e):e}function Tr(e){let t={};return e.forEach(n=>{t=n!=null?h(h({},t),n):t}),Object.keys(t).length===0?null:t}function Sr(e,t){return t.map(n=>n(e))}function Vo(e){return!e.validate}function Vr(e){return e.map(t=>Vo(t)?t:n=>t.validate(n))}function Oo(e){if(!e)return null;let t=e.filter(Ir);return t.length==0?null:function(n){return Tr(Sr(n,t))}}function Or(e){return e!=null?Oo(Vr(e)):null}function No(e){if(!e)return null;let t=e.filter(Ir);return t.length==0?null:function(n){let i=Sr(n,t).map(Mr);return Qi(i).pipe(Ji(Tr))}}function Nr(e){return e!=null?No(Vr(e)):null}function yr(e,t){return e===null?[t]:Array.isArray(e)?[...e,t]:[e,t]}function Fo(e){return e._rawValidators}function Po(e){return e._rawAsyncValidators}function Un(e){return e?Array.isArray(e)?e:[e]:[]}function qe(e,t){return Array.isArray(e)?e.includes(t):e===t}function _r(e,t){let n=Un(t);return Un(e).forEach(s=>{qe(n,s)||n.push(s)}),n}function br(e,t){return Un(t).filter(n=>!qe(e,n))}var Ke=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(t){this._rawValidators=t||[],this._composedValidatorFn=Or(this._rawValidators)}_setAsyncValidators(t){this._rawAsyncValidators=t||[],this._composedAsyncValidatorFn=Nr(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(t){this._onDestroyCallbacks.push(t)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(t=>t()),this._onDestroyCallbacks=[]}reset(t=void 0){this.control&&this.control.reset(t)}hasError(t,n){return this.control?this.control.hasError(t,n):!1}getError(t,n){return this.control?this.control.getError(t,n):null}},jn=class extends Ke{get formDirective(){return null}get path(){return null}},_e=class extends Ke{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},Hn=class{constructor(t){this._cd=t}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},ko={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},Ec=D(h({},ko),{"[class.ng-submitted]":"isSubmitted"}),Fr=(()=>{let t=class t extends Hn{constructor(i){super(i)}};t.\u0275fac=function(s){return new(s||t)(V(_e,2))},t.\u0275dir=yt({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(s,l){s&2&&Nn("ng-untouched",l.isUntouched)("ng-touched",l.isTouched)("ng-pristine",l.isPristine)("ng-dirty",l.isDirty)("ng-valid",l.isValid)("ng-invalid",l.isInvalid)("ng-pending",l.isPending)},features:[$t]});let e=t;return e})();var pe="VALID",Xe="INVALID",qt="PENDING",ge="DISABLED",Zt=class{},Ze=class extends Zt{constructor(t,n){super(),this.value=t,this.source=n}},ve=class extends Zt{constructor(t,n){super(),this.pristine=t,this.source=n}},ye=class extends Zt{constructor(t,n){super(),this.touched=t,this.source=n}},Kt=class extends Zt{constructor(t,n){super(),this.status=t,this.source=n}};function Ro(e){return(Qe(e)?e.validators:e)||null}function Lo(e){return Array.isArray(e)?Or(e):e||null}function Uo(e,t){return(Qe(t)?t.asyncValidators:e)||null}function jo(e){return Array.isArray(e)?Nr(e):e||null}function Qe(e){return e!=null&&!Array.isArray(e)&&typeof e=="object"}var zn=class{constructor(t,n){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=Ge(()=>this.statusReactive()),this.statusReactive=Be(void 0),this._pristine=Ge(()=>this.pristineReactive()),this.pristineReactive=Be(!0),this._touched=Ge(()=>this.touchedReactive()),this.touchedReactive=Be(!1),this._events=new Ki,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(t),this._assignAsyncValidators(n)}get validator(){return this._composedValidatorFn}set validator(t){this._rawValidators=this._composedValidatorFn=t}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(t){this._rawAsyncValidators=this._composedAsyncValidatorFn=t}get parent(){return this._parent}get status(){return Pt(this.statusReactive)}set status(t){Pt(()=>this.statusReactive.set(t))}get valid(){return this.status===pe}get invalid(){return this.status===Xe}get pending(){return this.status==qt}get disabled(){return this.status===ge}get enabled(){return this.status!==ge}get pristine(){return Pt(this.pristineReactive)}set pristine(t){Pt(()=>this.pristineReactive.set(t))}get dirty(){return!this.pristine}get touched(){return Pt(this.touchedReactive)}set touched(t){Pt(()=>this.touchedReactive.set(t))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(t){this._assignValidators(t)}setAsyncValidators(t){this._assignAsyncValidators(t)}addValidators(t){this.setValidators(_r(t,this._rawValidators))}addAsyncValidators(t){this.setAsyncValidators(_r(t,this._rawAsyncValidators))}removeValidators(t){this.setValidators(br(t,this._rawValidators))}removeAsyncValidators(t){this.setAsyncValidators(br(t,this._rawAsyncValidators))}hasValidator(t){return qe(this._rawValidators,t)}hasAsyncValidator(t){return qe(this._rawAsyncValidators,t)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(t={}){let n=this.touched===!1;this.touched=!0;let i=t.sourceControl??this;this._parent&&!t.onlySelf&&this._parent.markAsTouched(D(h({},t),{sourceControl:i})),n&&t.emitEvent!==!1&&this._events.next(new ye(!0,i))}markAllAsTouched(t={}){this.markAsTouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(n=>n.markAllAsTouched(t))}markAsUntouched(t={}){let n=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=t.sourceControl??this;this._forEachChild(s=>{s.markAsUntouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:i})}),this._parent&&!t.onlySelf&&this._parent._updateTouched(t,i),n&&t.emitEvent!==!1&&this._events.next(new ye(!1,i))}markAsDirty(t={}){let n=this.pristine===!0;this.pristine=!1;let i=t.sourceControl??this;this._parent&&!t.onlySelf&&this._parent.markAsDirty(D(h({},t),{sourceControl:i})),n&&t.emitEvent!==!1&&this._events.next(new ve(!1,i))}markAsPristine(t={}){let n=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=t.sourceControl??this;this._forEachChild(s=>{s.markAsPristine({onlySelf:!0,emitEvent:t.emitEvent})}),this._parent&&!t.onlySelf&&this._parent._updatePristine(t,i),n&&t.emitEvent!==!1&&this._events.next(new ve(!0,i))}markAsPending(t={}){this.status=qt;let n=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Kt(this.status,n)),this.statusChanges.emit(this.status)),this._parent&&!t.onlySelf&&this._parent.markAsPending(D(h({},t),{sourceControl:n}))}disable(t={}){let n=this._parentMarkedDirty(t.onlySelf);this.status=ge,this.errors=null,this._forEachChild(s=>{s.disable(D(h({},t),{onlySelf:!0}))}),this._updateValue();let i=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Ze(this.value,i)),this._events.next(new Kt(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(D(h({},t),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(s=>s(!0))}enable(t={}){let n=this._parentMarkedDirty(t.onlySelf);this.status=pe,this._forEachChild(i=>{i.enable(D(h({},t),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent}),this._updateAncestors(D(h({},t),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(t,n){this._parent&&!t.onlySelf&&(this._parent.updateValueAndValidity(t),t.skipPristineCheck||this._parent._updatePristine({},n),this._parent._updateTouched({},n))}setParent(t){this._parent=t}getRawValue(){return this.value}updateValueAndValidity(t={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===pe||this.status===qt)&&this._runAsyncValidator(i,t.emitEvent)}let n=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Ze(this.value,n)),this._events.next(new Kt(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!t.onlySelf&&this._parent.updateValueAndValidity(D(h({},t),{sourceControl:n}))}_updateTreeValidity(t={emitEvent:!0}){this._forEachChild(n=>n._updateTreeValidity(t)),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?ge:pe}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(t,n){if(this.asyncValidator){this.status=qt,this._hasOwnPendingAsyncValidator={emitEvent:n!==!1};let i=Mr(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(s=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(s,{emitEvent:n,shouldHaveEmitted:t})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let t=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,t}return!1}setErrors(t,n={}){this.errors=t,this._updateControlsErrors(n.emitEvent!==!1,this,n.shouldHaveEmitted)}get(t){let n=t;return n==null||(Array.isArray(n)||(n=n.split(".")),n.length===0)?null:n.reduce((i,s)=>i&&i._find(s),this)}getError(t,n){let i=n?this.get(n):this;return i&&i.errors?i.errors[t]:null}hasError(t,n){return!!this.getError(t,n)}get root(){let t=this;for(;t._parent;)t=t._parent;return t}_updateControlsErrors(t,n,i){this.status=this._calculateStatus(),t&&this.statusChanges.emit(this.status),(t||i)&&this._events.next(new Kt(this.status,n)),this._parent&&this._parent._updateControlsErrors(t,n,i)}_initObservables(){this.valueChanges=new _t,this.statusChanges=new _t}_calculateStatus(){return this._allControlsDisabled()?ge:this.errors?Xe:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(qt)?qt:this._anyControlsHaveStatus(Xe)?Xe:pe}_anyControlsHaveStatus(t){return this._anyControls(n=>n.status===t)}_anyControlsDirty(){return this._anyControls(t=>t.dirty)}_anyControlsTouched(){return this._anyControls(t=>t.touched)}_updatePristine(t,n){let i=!this._anyControlsDirty(),s=this.pristine!==i;this.pristine=i,this._parent&&!t.onlySelf&&this._parent._updatePristine(t,n),s&&this._events.next(new ve(this.pristine,n))}_updateTouched(t={},n){this.touched=this._anyControlsTouched(),this._events.next(new ye(this.touched,n)),this._parent&&!t.onlySelf&&this._parent._updateTouched(t,n)}_registerOnCollectionChange(t){this._onCollectionChange=t}_setUpdateStrategy(t){Qe(t)&&t.updateOn!=null&&(this._updateOn=t.updateOn)}_parentMarkedDirty(t){let n=this._parent&&this._parent.dirty;return!t&&!!n&&!this._parent._anyControlsDirty()}_find(t){return null}_assignValidators(t){this._rawValidators=Array.isArray(t)?t.slice():t,this._composedValidatorFn=Lo(this._rawValidators)}_assignAsyncValidators(t){this._rawAsyncValidators=Array.isArray(t)?t.slice():t,this._composedAsyncValidatorFn=jo(this._rawAsyncValidators)}};var Pr=new Wt("CallSetDisabledState",{providedIn:"root",factory:()=>Bn}),Bn="always";function Ho(e,t){return[...t.path,e]}function zo(e,t,n=Bn){Go(e,t),t.valueAccessor.writeValue(e.value),(e.disabled||n==="always")&&t.valueAccessor.setDisabledState?.(e.disabled),Wo(e,t),$o(e,t),Yo(e,t),Bo(e,t)}function Cr(e,t){e.forEach(n=>{n.registerOnValidatorChange&&n.registerOnValidatorChange(t)})}function Bo(e,t){if(t.valueAccessor.setDisabledState){let n=i=>{t.valueAccessor.setDisabledState(i)};e.registerOnDisabledChange(n),t._registerOnDestroy(()=>{e._unregisterOnDisabledChange(n)})}}function Go(e,t){let n=Fo(e);t.validator!==null?e.setValidators(yr(n,t.validator)):typeof n=="function"&&e.setValidators([n]);let i=Po(e);t.asyncValidator!==null?e.setAsyncValidators(yr(i,t.asyncValidator)):typeof i=="function"&&e.setAsyncValidators([i]);let s=()=>e.updateValueAndValidity();Cr(t._rawValidators,s),Cr(t._rawAsyncValidators,s)}function Wo(e,t){t.valueAccessor.registerOnChange(n=>{e._pendingValue=n,e._pendingChange=!0,e._pendingDirty=!0,e.updateOn==="change"&&kr(e,t)})}function Yo(e,t){t.valueAccessor.registerOnTouched(()=>{e._pendingTouched=!0,e.updateOn==="blur"&&e._pendingChange&&kr(e,t),e.updateOn!=="submit"&&e.markAsTouched()})}function kr(e,t){e._pendingDirty&&e.markAsDirty(),e.setValue(e._pendingValue,{emitModelToViewChange:!1}),t.viewToModelUpdate(e._pendingValue),e._pendingChange=!1}function $o(e,t){let n=(i,s)=>{t.valueAccessor.writeValue(i),s&&t.viewToModelUpdate(i)};e.registerOnChange(n),t._registerOnDestroy(()=>{e._unregisterOnChange(n)})}function Xo(e,t){if(!e.hasOwnProperty("model"))return!1;let n=e.model;return n.isFirstChange()?!0:!Object.is(t,n.currentValue)}function qo(e){return Object.getPrototypeOf(e.constructor)===wo}function Ko(e,t){if(!t)return null;Array.isArray(t);let n,i,s;return t.forEach(l=>{l.constructor===Je?n=l:qo(l)?i=l:s=l}),s||i||n||null}function Er(e,t){let n=e.indexOf(t);n>-1&&e.splice(n,1)}function xr(e){return typeof e=="object"&&e!==null&&Object.keys(e).length===2&&"value"in e&&"disabled"in e}var Zo=class extends zn{constructor(t=null,n,i){super(Ro(n),Uo(i,n)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(t),this._setUpdateStrategy(n),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Qe(n)&&(n.nonNullable||n.initialValueIsDefault)&&(xr(t)?this.defaultValue=t.value:this.defaultValue=t)}setValue(t,n={}){this.value=this._pendingValue=t,this._onChange.length&&n.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,n.emitViewToModelChange!==!1)),this.updateValueAndValidity(n)}patchValue(t,n={}){this.setValue(t,n)}reset(t=this.defaultValue,n={}){this._applyFormState(t),this.markAsPristine(n),this.markAsUntouched(n),this.setValue(this.value,n),this._pendingChange=!1}_updateValue(){}_anyControls(t){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(t){this._onChange.push(t)}_unregisterOnChange(t){Er(this._onChange,t)}registerOnDisabledChange(t){this._onDisabledChange.push(t)}_unregisterOnDisabledChange(t){Er(this._onDisabledChange,t)}_forEachChild(t){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(t){xr(t)?(this.value=this._pendingValue=t.value,t.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=t}};var Jo={provide:_e,useExisting:Vn(()=>Gn)},Ar=Promise.resolve(),Gn=(()=>{let t=class t extends _e{constructor(i,s,l,u,d,m){super(),this._changeDetectorRef=d,this.callSetDisabledState=m,this.control=new Zo,this._registered=!1,this.name="",this.update=new _t,this._parent=i,this._setValidators(s),this._setAsyncValidators(l),this.valueAccessor=Ko(this,u)}ngOnChanges(i){if(this._checkForErrors(),!this._registered||"name"in i){if(this._registered&&(this._checkName(),this.formDirective)){let s=i.name.previousValue;this.formDirective.removeControl({name:s,path:this._getPath(s)})}this._setUpControl()}"isDisabled"in i&&this._updateDisabled(i),Xo(i,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(i){this.viewModel=i,this.update.emit(i)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){zo(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(i){Ar.then(()=>{this.control.setValue(i,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(i){let s=i.isDisabled.currentValue,l=s!==0&&ar(s);Ar.then(()=>{l&&!this.control.disabled?this.control.disable():!l&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(i){return this._parent?Ho(i,this._parent):[i]}};t.\u0275fac=function(s){return new(s||t)(V(jn,9),V(To,10),V(So,10),V(Dr,10),V(or,8),V(Pr,8))},t.\u0275dir=yt({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[Fn([Jo]),$t,On]});let e=t;return e})();var Qo=(()=>{let t=class t{};t.\u0275fac=function(s){return new(s||t)},t.\u0275mod=vt({type:t}),t.\u0275inj=pt({});let e=t;return e})();var Rr=(()=>{let t=class t{static withConfig(i){return{ngModule:t,providers:[{provide:Pr,useValue:i.callSetDisabledState??Bn}]}}};t.\u0275fac=function(s){return new(s||t)},t.\u0275mod=vt({type:t}),t.\u0275inj=pt({imports:[Qo]});let e=t;return e})();var H=[];for(tn=0;tn<256;++tn)H.push((tn+256).toString(16).slice(1));var tn;function Lr(e,t=0){return(H[e[t+0]]+H[e[t+1]]+H[e[t+2]]+H[e[t+3]]+"-"+H[e[t+4]]+H[e[t+5]]+"-"+H[e[t+6]]+H[e[t+7]]+"-"+H[e[t+8]]+H[e[t+9]]+"-"+H[e[t+10]]+H[e[t+11]]+H[e[t+12]]+H[e[t+13]]+H[e[t+14]]+H[e[t+15]]).toLowerCase()}var en,ea=new Uint8Array(16);function Wn(){if(!en&&(en=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!en))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return en(ea)}var na=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Yn={randomUUID:na};function ia(e,t,n){if(Yn.randomUUID&&!t&&!e)return Yn.randomUUID();e=e||{};var i=e.random||(e.rng||Wn)();if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,t){n=n||0;for(var s=0;s<16;++s)t[n+s]=i[s];return t}return Lr(i)}var $n=ia;var Jt=qi(Ln());var nn=class e{constructor(t){this.el=t}swipeLeft=new _t;swipeRight=new _t;swipeDown=new _t;swipeUp=new _t;hammer;ngOnInit(){this.hammer=new Jt.Manager(this.el.nativeElement),this.hammer.add(new Jt.Swipe({direction:Jt.DIRECTION_ALL})),this.hammer.on("swipeleft",()=>this.onSwipeLeft()),this.hammer.on("swiperight",()=>this.onSwipeRight()),this.hammer.on("swipeup",()=>this.onSwipeUp()),this.hammer.on("swipedown",()=>this.onSwipeDown())}onSwipeLeft(){this.swipeLeft.emit()}onSwipeRight(){this.swipeRight.emit()}onSwipeDown(){this.swipeDown.emit()}onSwipeUp(){this.swipeUp.emit()}ngOnDestroy(){this.hammer&&this.hammer.destroy()}static \u0275fac=function(n){return new(n||e)(V(Yt))};static \u0275dir=yt({type:e,selectors:[["","appSwipe",""]],outputs:{swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeDown:"swipeDown",swipeUp:"swipeUp"}})};var oa=e=>({"scrollable-content-down":e});function aa(e,t){if(e&1){let n=me();_(0,"div",12),I("click",function(){let s=N(n).$implicit,l=O();return F(l.onCategoryClick(s.id))}),Y(1,"i"),_(2,"span"),E(3),C()()}if(e&2){let n=t.$implicit;w(),tr(n.icon),X("color","#DB872C"),w(2),bt(n.name)}}function la(e,t){if(e&1){let n=me();_(0,"div",13)(1,"div",14),I("swipeleft",function(){N(n);let s=O();return F(s.onDeleteClick())})("swiperight",function(){N(n);let s=O();return F(s.onDeleteClick())}),_(2,"input",15),ir("ngModelChange",function(s){N(n);let l=O();return nr(l.enteredAmount,s)||(l.enteredAmount=s),F(s)}),C()(),_(3,"div",16),I("swipedown",function(s){N(n);let l=O();return F(l.onDisableRefresh(s))}),_(4,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("1"))}),E(5,"1"),C(),_(6,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("2"))}),E(7,"2"),C(),_(8,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("3"))}),E(9,"3"),C(),_(10,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("4"))}),E(11,"4"),C(),_(12,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("5"))}),E(13,"5"),C(),_(14,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("6"))}),E(15,"6"),C(),_(16,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("7"))}),E(17,"7"),C(),_(18,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("8"))}),E(19,"8"),C(),_(20,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("9"))}),E(21,"9"),C(),_(22,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("."))}),E(23,"."),C(),_(24,"div",17),I("click",function(){N(n);let s=O();return F(s.onNumberClick("0"))}),E(25,"0"),C(),_(26,"div",17),I("click",function(){N(n);let s=O();return F(s.onDeleteClick())}),Y(27,"i",18),C()()()}if(e&2){let n=O();w(2),er("ngModel",n.enteredAmount)}}var rn=class e{constructor(t){this.router=t}enteredAmount="";enteredAmountAsNumber=0;currentAmount=0;monthAmount=0;balance=0;balanceDate="";showKeyBoard=!0;currentDate=new Date().toLocaleDateString("ru-RU",{weekday:"short",month:"short",day:"numeric"});categories=vr;ngOnInit(){let t=JSON.parse(localStorage.getItem("expenses")||"[]");console.log("expenses",t),this.sumValues(t),console.log("currentAmount",this.currentAmount),this.balance=Number(localStorage.getItem("balance"))||0,this.balanceDate=localStorage.getItem("balanceDate")}onNumberClick(t){t==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=t):this.enteredAmount+=t,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(t){if(this.enteredAmountAsNumber>0){let n=localStorage.getItem("expenses"),i=n?JSON.parse(n):[];i.unshift({id:$n(),category:t,amount:this.enteredAmountAsNumber,currency:"EUR",date:Date.now()});let s=Number(localStorage.getItem("balance")||0),l=Math.round((s-this.enteredAmountAsNumber)*100)/100;localStorage.setItem("balance",l.toString()),this.balance=l,localStorage.setItem("expenses",JSON.stringify(i)),this.sumValues(i),this.enteredAmount="",this.enteredAmountAsNumber=0,this.showKeyBoard=!0}}onBalanceChange(){let t=prompt("Enter new balance",this.balance.toString());t&&(localStorage.setItem("balance",t),this.balance=Number(t))}onBalanceDateChange(){let t=prompt("Enter new balance date",this.balanceDate||"");t&&(localStorage.setItem("balanceDate",t),this.balanceDate=t)}onDisableRefresh(t){t.stopPropagation()}onSwipeLeft(){this.router.navigate(["/history"])}onSwipeRight(){this.router.navigate(["/statistics"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}sumValues(t){this.currentAmount=0,this.monthAmount=0,t.forEach(n=>{if(new Date(n.date).toDateString()===new Date().toDateString()){let d=this.currentAmount+n.amount;this.currentAmount=Math.round(d*100)/100}let i=new Date().getMonth(),s=new Date().getFullYear(),l=new Date(n.date).getMonth(),u=new Date(n.date).getFullYear();if(i===l&&s===u){let d=this.monthAmount+n.amount;this.monthAmount=Math.round(d*100)/100}})}static \u0275fac=function(n){return new(n||e)(V(Xt))};static \u0275cmp=gt({type:e,selectors:[["app-expense"]],decls:32,vars:23,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[1,"title-total"],[3,"click"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],["appSwipe","",1,"scrollable-content",3,"swipeDown","swipeUp","swipeLeft","swipeRight","ngClass"],[1,"categories"],["class","category",3,"click",4,"ngFor","ngForOf"],["class","number-board",4,"ngIf"],[1,"category",3,"click"],[1,"number-board"],[1,"number-board-header",3,"swipeleft","swiperight"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body",3,"swipedown"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div",1),Y(2,"div",2),_(3,"div",3)(4,"span"),E(5),C(),_(6,"span"),E(7,"\u20AC"),C()(),_(8,"div",3),E(9,"-"),C(),_(10,"div",3)(11,"div"),E(12),C(),_(13,"span",4),E(14),C(),_(15,"span"),E(16,"\u20AC"),C()(),_(17,"div",3),E(18,"-"),C(),_(19,"div",3)(20,"div",5),I("click",function(){return i.onBalanceDateChange()}),E(21),C(),_(22,"span",5),I("click",function(){return i.onBalanceChange()}),E(23),C(),_(24,"span",5),I("click",function(){return i.onBalanceChange()}),E(25,"\u20AC "),C()(),_(26,"div",6),Y(27,"i",7),C()(),_(28,"div",8),I("swipeDown",function(){return i.onHideKeyboard()})("swipeUp",function(){return i.onShowKeyboard()})("swipeLeft",function(){return i.onSwipeLeft()})("swipeRight",function(){return i.onSwipeRight()}),_(29,"div",9),he(30,aa,4,5,"div",10),C()(),he(31,la,28,1,"div",11),C()),n&2&&(w(4),X("color","#ff6f61"),w(),bt(i.monthAmount),w(),X("color","#ff6f61"),w(6),nt("",i.currentDate," "),w(),X("color","#DB2C07"),w(),bt(i.currentAmount),w(),X("color","#DB2C07"),w(6),nt("\u0434\u043E ",i.balanceDate," "),w(),X("color","green"),w(),bt(i.balance),w(),X("color","green"),w(2),Ft("routerLink","/history"),w(2),Ft("ngClass",rr(21,oa,!i.showKeyBoard)),w(2),Ft("ngForOf",i.categories),w(),Ft("ngIf",i.showKeyBoard))},dependencies:[lr,We,cr,gr,Je,Fr,Gn,nn],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none;overflow:hidden}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.title-total[_ngcontent-%COMP%]{font-size:27px}.scrollable-content[_ngcontent-%COMP%]{display:flex}.scrollable-content[_ngcontent-%COMP%]   .scrollable-content-down[_ngcontent-%COMP%]{align-items:end}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:70px;margin:10px;text-align:center;font-size:15px}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:25px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da;overflow:hidden}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding:12px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px;overflow:hidden}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};function ca(e,t){if(e&1){let n=me();_(0,"div",3)(1,"div",4),I("click",function(){let s=N(n).$implicit,l=O();return F(l.showCategoryDetails(s.category))}),_(2,"span"),E(3),C(),_(4,"span"),E(5),C()(),_(6,"div",5),I("click",function(){let s=N(n).$implicit,l=O();return F(l.showCategoryDetails(s.category))}),_(7,"div",6),E(8),C()()()}if(e&2){let n=t.$implicit,i=O();w(2),X("color","blue"),w(),bt(i.getCategoryNameByIdFunc(n.category)),w(2),nt("",n.amount,"\u20AC"),w(2),X("width",n.percentage,"%")("background-color",n.color),w(),nt(" ",n.percentage.toFixed(2),"% ")}}var sn=class e{constructor(t){this.router=t}categoryTotals=[];totalAmount=0;getCategoryNameByIdFunc=Ye;ngOnInit(){this.calculateCategoryTotals()}showCategoryDetails(t){this.router.navigate(["/details"],{queryParams:{"category-id":t,"back-url":"/statistics"}})}calculateCategoryTotals(){let t=JSON.parse(localStorage.getItem("expenses")||"[]"),n={};t.filter(i=>{let s=new Date(i.date),l=new Date;return s.getDate()===l.getDate()&&s.getMonth()===l.getMonth()&&s.getFullYear()===l.getFullYear()}).forEach(i=>{n[i.category]||(n[i.category]=0),n[i.category]+=i.amount,this.totalAmount+=i.amount});for(let i in n){let s=n[i],l=s/this.totalAmount*100,u=this.getColor(l);this.categoryTotals.push({category:i,amount:s,percentage:l,color:u}),this.categoryTotals.sort((d,m)=>d.amount-m.amount)}}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(t){this.touchStartX=t.changedTouches[0].screenX,this.touchStartY=t.changedTouches[0].screenY}onTouchEnd(t){this.touchEndX=t.changedTouches[0].screenX,this.touchEndY=t.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let t=this.touchEndX-this.touchStartX,n=this.touchEndY-this.touchStartY;Math.abs(t)>Math.abs(n)&&(t>50?this.onSwipeRight():t<-50&&this.onSwipeLeft())}onSwipeLeft(){this.router.navigate(["/"])}onSwipeRight(){this.router.navigate(["/history"])}getColor(t){let n=Math.min(255,Math.round((100-t)*2.55));return`rgb(${Math.min(255,Math.round(t*2.55))}, ${n}, 0)`}static \u0275fac=function(n){return new(n||e)(V(Xt))};static \u0275cmp=gt({type:e,selectors:[["app-statistics"]],hostBindings:function(n,i){n&1&&I("touchstart",function(l){return i.onTouchStart(l)})("touchend",function(l){return i.onTouchEnd(l)})},decls:7,vars:2,consts:[[1,"statistics"],[1,"statistics-title"],["class","category-summary",4,"ngFor","ngForOf"],[1,"category-summary"],[1,"category-header",3,"click"],[1,"progress-bar-container",3,"click"],[1,"progress-bar"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div",1),E(2,"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043F\u043E \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C \u0437\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:"),C(),E(3),Y(4,"br")(5,"br"),he(6,ca,9,9,"div",2),C()),n&2&&(w(3),nt(" \u0412\u0441\u0435\u0433\u043E \u043F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E: ",i.totalAmount,"\u20AC"),w(3),Ft("ngForOf",i.categoryTotals))},dependencies:[We],styles:[".category-summary[_ngcontent-%COMP%]{margin-bottom:20px}.category-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;font-weight:700;margin-bottom:5px}.progress-bar-container[_ngcontent-%COMP%]{background-color:#e0e0e0;border-radius:5px;overflow:hidden}.progress-bar[_ngcontent-%COMP%]{background-color:#4caf50;height:25px;line-height:25px;color:#fff;text-align:center;border-radius:5px}.statistics[_ngcontent-%COMP%]{padding:15px;height:100dvh}.statistics-title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:15px}"]})};var on=class e{constructor(t,n){this.activatedRoute=t;this.router=n}amountForDay=0;amountForMonth=0;amountForYear=0;backUrl="";selectedCategory="";ngOnInit(){this.initDetails()}initDetails(){let t=this.activatedRoute.snapshot.queryParamMap.get("category-id");this.selectedCategory=Ye(t),this.backUrl=this.activatedRoute.snapshot.queryParamMap.get("back-url");let n=JSON.parse(localStorage.getItem("expenses")||"[]"),i=new Date().getDate(),s=new Date().getMonth(),l=new Date().getFullYear();n.forEach(u=>{let d=new Date(u.date),m=d.getDate(),p=d.getMonth(),y=d.getFullYear();t===u.category&&(i===m&&s===p&&l===y&&(this.amountForDay+=u.amount),s===p&&l===y&&(this.amountForMonth+=u.amount),l===y&&(this.amountForYear+=u.amount))})}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(t){this.touchStartX=t.changedTouches[0].screenX,this.touchStartY=t.changedTouches[0].screenY}onTouchEnd(t){this.touchEndX=t.changedTouches[0].screenX,this.touchEndY=t.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let t=this.touchEndX-this.touchStartX,n=this.touchEndY-this.touchStartY;Math.abs(t)>Math.abs(n)&&(t>50?this.navigateBack():t<-50&&this.navigateBack())}navigateBack(){this.router.navigate([this.backUrl])}static \u0275fac=function(n){return new(n||e)(V(mr),V(Xt))};static \u0275cmp=gt({type:e,selectors:[["app-details"]],hostBindings:function(n,i){n&1&&I("touchstart",function(l){return i.onTouchStart(l)})("touchend",function(l){return i.onTouchEnd(l)})},decls:21,vars:6,consts:[[1,"details"],[1,"details-item"],[1,"amount"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div"),E(2," \u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: "),_(3,"span"),E(4),C()(),Y(5,"hr"),_(6,"div",1),E(7," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F: "),_(8,"span",2),E(9),C()(),Y(10,"hr"),_(11,"div",1),E(12," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0437\u0430 \u043C\u0435\u0441\u044F\u0446: "),_(13,"span",2),E(14),C()(),Y(15,"hr"),_(16,"div",1),E(17," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0437\u0430 \u0433\u043E\u0434: "),_(18,"span",2),E(19),C()(),Y(20,"hr"),C()),n&2&&(w(3),X("color","#DB654D"),w(),bt(i.selectedCategory),w(5),nt("",i.amountForDay,"\u20AC"),w(5),nt("",i.amountForMonth,"\u20AC"),w(5),nt("",i.amountForYear,"\u20AC"))},styles:[".details[_ngcontent-%COMP%]{height:100dvh;margin:15px}.details-item[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin:10px 0}.details[_ngcontent-%COMP%]   .amount[_ngcontent-%COMP%]{font-size:18px;color:#ff6f61}"]})};var ua=[{path:"history",loadChildren:()=>import("./chunk-E476VZLM.js").then(e=>e.HistoryModule)},{path:"statistics",component:sn},{path:"details",component:on},{path:"",pathMatch:"full",component:rn}],an=class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=vt({type:e});static \u0275inj=pt({imports:[Rn.forRoot(ua),Rn]})};var ln=class e{title="expenses";static \u0275fac=function(n){return new(n||e)};static \u0275cmp=gt({type:e,selectors:[["app-root"]],decls:1,vars:0,template:function(n,i){n&1&&Y(0,"router-outlet")},dependencies:[pr]})};var Ur=()=>{},gi={},cs={},us=null,ds={mark:Ur,measure:Ur};try{typeof window<"u"&&(gi=window),typeof document<"u"&&(cs=document),typeof MutationObserver<"u"&&(us=MutationObserver),typeof performance<"u"&&(ds=performance)}catch{}var{userAgent:jr=""}=gi.navigator||{},Mt=gi,M=cs,Hr=us,cn=ds,tu=!!Mt.document,At=!!M.documentElement&&!!M.head&&typeof M.addEventListener=="function"&&typeof M.createElement=="function",fs=~jr.indexOf("MSIE")||~jr.indexOf("Trident/"),T="classic",hs="duotone",q="sharp",K="sharp-duotone",da=[T,hs,q,K],fa={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},zr={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ha=["kit"],ma=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,pa=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,ga={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},va={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},ya={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},_a={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},ba={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},Ca={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},ms={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},Ea=["solid","regular","light","thin","duotone","brands"],ps=[1,2,3,4,5,6,7,8,9,10],xa=ps.concat([11,12,13,14,15,16,17,18,19,20]),be={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Aa=[...Object.keys(_a),...Ea,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",be.GROUP,be.SWAP_OPACITY,be.PRIMARY,be.SECONDARY].concat(ps.map(e=>"".concat(e,"x"))).concat(xa.map(e=>"w-".concat(e))),wa={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Da={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},Ia={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},Br={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Et="___FONT_AWESOME___",ei=16,gs="fa",vs="svg-inline--fa",Ut="data-fa-i2svg",ni="data-fa-pseudo-element",Ma="data-fa-pseudo-element-pending",vi="data-prefix",yi="data-icon",Gr="fontawesome-i2svg",Ta="async",Sa=["HTML","HEAD","STYLE","SCRIPT"],ys=(()=>{try{return!0}catch{return!1}})(),_s=[T,q,K];function De(e){return new Proxy(e,{get(t,n){return n in t?t[n]:t[T]}})}var bs=h({},ms);bs[T]=h(h(h({},ms[T]),zr.kit),zr["kit-duotone"]);var Rt=De(bs),ii=h({},Ca);ii[T]=h(h(h({},ii[T]),Br.kit),Br["kit-duotone"]);var Ae=De(ii),ri=h({},ba);ri[T]=h(h({},ri[T]),Ia.kit);var Lt=De(ri),si=h({},ya);si[T]=h(h({},si[T]),Da.kit);var Va=De(si),Oa=ma,Cs="fa-layers-text",Na=pa,Fa=h({},fa),eu=De(Fa),Pa=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Kn=be,ee=new Set;Object.keys(Ae[T]).map(ee.add.bind(ee));Object.keys(Ae[q]).map(ee.add.bind(ee));Object.keys(Ae[K]).map(ee.add.bind(ee));var ka=[...ha,...Aa],Ee=Mt.FontAwesomeConfig||{};function Ra(e){var t=M.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function La(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}M&&typeof M.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(t=>{let[n,i]=t,s=La(Ra(n));s!=null&&(Ee[i]=s)});var Es={styleDefault:"solid",familyDefault:"classic",cssPrefix:gs,replacementClass:vs,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Ee.familyPrefix&&(Ee.cssPrefix=Ee.familyPrefix);var ne=h(h({},Es),Ee);ne.autoReplaceSvg||(ne.observeMutations=!1);var v={};Object.keys(Es).forEach(e=>{Object.defineProperty(v,e,{enumerable:!0,set:function(t){ne[e]=t,xe.forEach(n=>n(v))},get:function(){return ne[e]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(e){ne.cssPrefix=e,xe.forEach(t=>t(v))},get:function(){return ne.cssPrefix}});Mt.FontAwesomeConfig=v;var xe=[];function Ua(e){return xe.push(e),()=>{xe.splice(xe.indexOf(e),1)}}var Dt=ei,at={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function ja(e){if(!e||!At)return;let t=M.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;let n=M.head.childNodes,i=null;for(let s=n.length-1;s>-1;s--){let l=n[s],u=(l.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(u)>-1&&(i=l)}return M.head.insertBefore(t,i),e}var Ha="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function we(){let e=12,t="";for(;e-- >0;)t+=Ha[Math.random()*62|0];return t}function ie(e){let t=[];for(let n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function _i(e){return e.classList?ie(e.classList):(e.getAttribute("class")||"").split(" ").filter(t=>t)}function xs(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function za(e){return Object.keys(e||{}).reduce((t,n)=>t+"".concat(n,'="').concat(xs(e[n]),'" '),"").trim()}function mn(e){return Object.keys(e||{}).reduce((t,n)=>t+"".concat(n,": ").concat(e[n].trim(),";"),"")}function bi(e){return e.size!==at.size||e.x!==at.x||e.y!==at.y||e.rotate!==at.rotate||e.flipX||e.flipY}function Ba(e){let{transform:t,containerWidth:n,iconWidth:i}=e,s={transform:"translate(".concat(n/2," 256)")},l="translate(".concat(t.x*32,", ").concat(t.y*32,") "),u="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),d="rotate(".concat(t.rotate," 0 0)"),m={transform:"".concat(l," ").concat(u," ").concat(d)},p={transform:"translate(".concat(i/2*-1," -256)")};return{outer:s,inner:m,path:p}}function Ga(e){let{transform:t,width:n=ei,height:i=ei,startCentered:s=!1}=e,l="";return s&&fs?l+="translate(".concat(t.x/Dt-n/2,"em, ").concat(t.y/Dt-i/2,"em) "):s?l+="translate(calc(-50% + ".concat(t.x/Dt,"em), calc(-50% + ").concat(t.y/Dt,"em)) "):l+="translate(".concat(t.x/Dt,"em, ").concat(t.y/Dt,"em) "),l+="scale(".concat(t.size/Dt*(t.flipX?-1:1),", ").concat(t.size/Dt*(t.flipY?-1:1),") "),l+="rotate(".concat(t.rotate,"deg) "),l}var Wa=`:root, :host {
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
}`;function As(){let e=gs,t=vs,n=v.cssPrefix,i=v.replacementClass,s=Wa;if(n!==e||i!==t){let l=new RegExp("\\.".concat(e,"\\-"),"g"),u=new RegExp("\\--".concat(e,"\\-"),"g"),d=new RegExp("\\.".concat(t),"g");s=s.replace(l,".".concat(n,"-")).replace(u,"--".concat(n,"-")).replace(d,".".concat(i))}return s}var Wr=!1;function Zn(){v.autoAddCss&&!Wr&&(ja(As()),Wr=!0)}var Ya={mixout(){return{dom:{css:As,insertCss:Zn}}},hooks(){return{beforeDOMElementCreation(){Zn()},beforeI2svg(){Zn()}}}},xt=Mt||{};xt[Et]||(xt[Et]={});xt[Et].styles||(xt[Et].styles={});xt[Et].hooks||(xt[Et].hooks={});xt[Et].shims||(xt[Et].shims=[]);var lt=xt[Et],ws=[],Ds=function(){M.removeEventListener("DOMContentLoaded",Ds),fn=1,ws.map(e=>e())},fn=!1;At&&(fn=(M.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(M.readyState),fn||M.addEventListener("DOMContentLoaded",Ds));function $a(e){At&&(fn?setTimeout(e,0):ws.push(e))}function Ie(e){let{tag:t,attributes:n={},children:i=[]}=e;return typeof e=="string"?xs(e):"<".concat(t," ").concat(za(n),">").concat(i.map(Ie).join(""),"</").concat(t,">")}function Yr(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Xa=function(t,n){return function(i,s,l,u){return t.call(n,i,s,l,u)}},Jn=function(t,n,i,s){var l=Object.keys(t),u=l.length,d=s!==void 0?Xa(n,s):n,m,p,y;for(i===void 0?(m=1,y=t[l[0]]):(m=0,y=i);m<u;m++)p=l[m],y=d(y,t[p],p,t);return y};function qa(e){let t=[],n=0,i=e.length;for(;n<i;){let s=e.charCodeAt(n++);if(s>=55296&&s<=56319&&n<i){let l=e.charCodeAt(n++);(l&64512)==56320?t.push(((s&1023)<<10)+(l&1023)+65536):(t.push(s),n--)}else t.push(s)}return t}function oi(e){let t=qa(e);return t.length===1?t[0].toString(16):null}function Ka(e,t){let n=e.length,i=e.charCodeAt(t),s;return i>=55296&&i<=56319&&n>t+1&&(s=e.charCodeAt(t+1),s>=56320&&s<=57343)?(i-55296)*1024+s-56320+65536:i}function $r(e){return Object.keys(e).reduce((t,n)=>{let i=e[n];return!!i.icon?t[i.iconName]=i.icon:t[n]=i,t},{})}function ai(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:i=!1}=n,s=$r(t);typeof lt.hooks.addPack=="function"&&!i?lt.hooks.addPack(e,$r(t)):lt.styles[e]=h(h({},lt.styles[e]||{}),s),e==="fas"&&ai("fa",t)}var{styles:kt,shims:Za}=lt,Ja={[T]:Object.values(Lt[T]),[q]:Object.values(Lt[q]),[K]:Object.values(Lt[K])},Ci=null,Is={},Ms={},Ts={},Ss={},Vs={},Qa={[T]:Object.keys(Rt[T]),[q]:Object.keys(Rt[q]),[K]:Object.keys(Rt[K])};function tl(e){return~ka.indexOf(e)}function el(e,t){let n=t.split("-"),i=n[0],s=n.slice(1).join("-");return i===e&&s!==""&&!tl(s)?s:null}var Os=()=>{let e=i=>Jn(kt,(s,l,u)=>(s[u]=Jn(l,i,{}),s),{});Is=e((i,s,l)=>(s[3]&&(i[s[3]]=l),s[2]&&s[2].filter(d=>typeof d=="number").forEach(d=>{i[d.toString(16)]=l}),i)),Ms=e((i,s,l)=>(i[l]=l,s[2]&&s[2].filter(d=>typeof d=="string").forEach(d=>{i[d]=l}),i)),Vs=e((i,s,l)=>{let u=s[2];return i[l]=l,u.forEach(d=>{i[d]=l}),i});let t="far"in kt||v.autoFetchSvg,n=Jn(Za,(i,s)=>{let l=s[0],u=s[1],d=s[2];return u==="far"&&!t&&(u="fas"),typeof l=="string"&&(i.names[l]={prefix:u,iconName:d}),typeof l=="number"&&(i.unicodes[l.toString(16)]={prefix:u,iconName:d}),i},{names:{},unicodes:{}});Ts=n.names,Ss=n.unicodes,Ci=pn(v.styleDefault,{family:v.familyDefault})};Ua(e=>{Ci=pn(e.styleDefault,{family:v.familyDefault})});Os();function Ei(e,t){return(Is[e]||{})[t]}function nl(e,t){return(Ms[e]||{})[t]}function It(e,t){return(Vs[e]||{})[t]}function Ns(e){return Ts[e]||{prefix:null,iconName:null}}function il(e){let t=Ss[e],n=Ei("fas",e);return t||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function Tt(){return Ci}var xi=()=>({prefix:null,iconName:null,rest:[]});function pn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:n=T}=t,i=Rt[n][e],s=Ae[n][e]||Ae[n][i],l=e in lt.styles?e:null;return s||l||null}var rl={[T]:Object.keys(Lt[T]),[q]:Object.keys(Lt[q]),[K]:Object.keys(Lt[K])};function gn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:n=!1}=t,i={[T]:"".concat(v.cssPrefix,"-").concat(T),[q]:"".concat(v.cssPrefix,"-").concat(q),[K]:"".concat(v.cssPrefix,"-").concat(K)},s=null,l=T,u=da.filter(m=>m!==hs);u.forEach(m=>{(e.includes(i[m])||e.some(p=>rl[m].includes(p)))&&(l=m)});let d=e.reduce((m,p)=>{let y=el(v.cssPrefix,p);if(kt[p]?(p=Ja[l].includes(p)?Va[l][p]:p,s=p,m.prefix=p):Qa[l].indexOf(p)>-1?(s=p,m.prefix=pn(p,{family:l})):y?m.iconName=y:p!==v.replacementClass&&!u.some(A=>p===i[A])&&m.rest.push(p),!n&&m.prefix&&m.iconName){let A=s==="fa"?Ns(m.iconName):{},b=It(m.prefix,m.iconName);A.prefix&&(s=null),m.iconName=A.iconName||b||m.iconName,m.prefix=A.prefix||m.prefix,m.prefix==="far"&&!kt.far&&kt.fas&&!v.autoFetchSvg&&(m.prefix="fas")}return m},xi());return(e.includes("fa-brands")||e.includes("fab"))&&(d.prefix="fab"),(e.includes("fa-duotone")||e.includes("fad"))&&(d.prefix="fad"),!d.prefix&&l===q&&(kt.fass||v.autoFetchSvg)&&(d.prefix="fass",d.iconName=It(d.prefix,d.iconName)||d.iconName),!d.prefix&&l===K&&(kt.fasds||v.autoFetchSvg)&&(d.prefix="fasds",d.iconName=It(d.prefix,d.iconName)||d.iconName),(d.prefix==="fa"||s==="fa")&&(d.prefix=Tt()||"fas"),d}var li=class{constructor(){this.definitions={}}add(){for(var t=arguments.length,n=new Array(t),i=0;i<t;i++)n[i]=arguments[i];let s=n.reduce(this._pullDefinitions,{});Object.keys(s).forEach(l=>{this.definitions[l]=h(h({},this.definitions[l]||{}),s[l]),ai(l,s[l]);let u=Lt[T][l];u&&ai(u,s[l]),Os()})}reset(){this.definitions={}}_pullDefinitions(t,n){let i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(s=>{let{prefix:l,iconName:u,icon:d}=i[s],m=d[2];t[l]||(t[l]={}),m.length>0&&m.forEach(p=>{typeof p=="string"&&(t[l][p]=d)}),t[l][u]=d}),t}},Xr=[],Qt={},te={},sl=Object.keys(te);function ol(e,t){let{mixoutsTo:n}=t;return Xr=e,Qt={},Object.keys(te).forEach(i=>{sl.indexOf(i)===-1&&delete te[i]}),Xr.forEach(i=>{let s=i.mixout?i.mixout():{};if(Object.keys(s).forEach(l=>{typeof s[l]=="function"&&(n[l]=s[l]),typeof s[l]=="object"&&Object.keys(s[l]).forEach(u=>{n[l]||(n[l]={}),n[l][u]=s[l][u]})}),i.hooks){let l=i.hooks();Object.keys(l).forEach(u=>{Qt[u]||(Qt[u]=[]),Qt[u].push(l[u])})}i.provides&&i.provides(te)}),n}function ci(e,t){for(var n=arguments.length,i=new Array(n>2?n-2:0),s=2;s<n;s++)i[s-2]=arguments[s];return(Qt[e]||[]).forEach(u=>{t=u.apply(null,[t,...i])}),t}function jt(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];(Qt[e]||[]).forEach(l=>{l.apply(null,n)})}function St(){let e=arguments[0],t=Array.prototype.slice.call(arguments,1);return te[e]?te[e].apply(null,t):void 0}function ui(e){e.prefix==="fa"&&(e.prefix="fas");let{iconName:t}=e,n=e.prefix||Tt();if(t)return t=It(n,t)||t,Yr(Fs.definitions,n,t)||Yr(lt.styles,n,t)}var Fs=new li,al=()=>{v.autoReplaceSvg=!1,v.observeMutations=!1,jt("noAuto")},ll={i2svg:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return At?(jt("beforeI2svg",e),St("pseudoElements2svg",e),St("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:t}=e;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,$a(()=>{ul({autoReplaceSvgRoot:t}),jt("watch",e)})}},cl={icon:e=>{if(e===null)return null;if(typeof e=="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:It(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){let t=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],n=pn(e[0]);return{prefix:n,iconName:It(n,t)||t}}if(typeof e=="string"&&(e.indexOf("".concat(v.cssPrefix,"-"))>-1||e.match(Oa))){let t=gn(e.split(" "),{skipLookups:!0});return{prefix:t.prefix||Tt(),iconName:It(t.prefix,t.iconName)||t.iconName}}if(typeof e=="string"){let t=Tt();return{prefix:t,iconName:It(t,e)||e}}}},Z={noAuto:al,config:v,dom:ll,parse:cl,library:Fs,findIconDefinition:ui,toHtml:Ie},ul=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:t=M}=e;(Object.keys(lt.styles).length>0||v.autoFetchSvg)&&At&&v.autoReplaceSvg&&Z.dom.i2svg({node:t})};function vn(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(n=>Ie(n))}}),Object.defineProperty(e,"node",{get:function(){if(!At)return;let n=M.createElement("div");return n.innerHTML=e.html,n.children}}),e}function dl(e){let{children:t,main:n,mask:i,attributes:s,styles:l,transform:u}=e;if(bi(u)&&n.found&&!i.found){let{width:d,height:m}=n,p={x:d/m/2,y:.5};s.style=mn(D(h({},l),{"transform-origin":"".concat(p.x+u.x/16,"em ").concat(p.y+u.y/16,"em")}))}return[{tag:"svg",attributes:s,children:t}]}function fl(e){let{prefix:t,iconName:n,children:i,attributes:s,symbol:l}=e,u=l===!0?"".concat(t,"-").concat(v.cssPrefix,"-").concat(n):l;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:D(h({},s),{id:u}),children:i}]}]}function Ai(e){let{icons:{main:t,mask:n},prefix:i,iconName:s,transform:l,symbol:u,title:d,maskId:m,titleId:p,extra:y,watchable:A=!1}=e,{width:b,height:L}=n.found?n:t,k=i==="fak",it=[v.replacementClass,s?"".concat(v.cssPrefix,"-").concat(s):""].filter(tt=>y.classes.indexOf(tt)===-1).filter(tt=>tt!==""||!!tt).concat(y.classes).join(" "),$={children:[],attributes:D(h({},y.attributes),{"data-prefix":i,"data-icon":s,class:it,role:y.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(b," ").concat(L)})},S=k&&!~y.classes.indexOf("fa-fw")?{width:"".concat(b/L*16*.0625,"em")}:{};A&&($.attributes[Ut]=""),d&&($.children.push({tag:"title",attributes:{id:$.attributes["aria-labelledby"]||"title-".concat(p||we())},children:[d]}),delete $.attributes.title);let U=D(h({},$),{prefix:i,iconName:s,main:t,mask:n,maskId:m,transform:l,symbol:u,styles:h(h({},S),y.styles)}),{children:z,attributes:ut}=n.found&&t.found?St("generateAbstractMask",U)||{children:[],attributes:{}}:St("generateAbstractIcon",U)||{children:[],attributes:{}};return U.children=z,U.attributes=ut,u?fl(U):dl(U)}function qr(e){let{content:t,width:n,height:i,transform:s,title:l,extra:u,watchable:d=!1}=e,m=D(h(h({},u.attributes),l?{title:l}:{}),{class:u.classes.join(" ")});d&&(m[Ut]="");let p=h({},u.styles);bi(s)&&(p.transform=Ga({transform:s,startCentered:!0,width:n,height:i}),p["-webkit-transform"]=p.transform);let y=mn(p);y.length>0&&(m.style=y);let A=[];return A.push({tag:"span",attributes:m,children:[t]}),l&&A.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),A}function hl(e){let{content:t,title:n,extra:i}=e,s=D(h(h({},i.attributes),n?{title:n}:{}),{class:i.classes.join(" ")}),l=mn(i.styles);l.length>0&&(s.style=l);let u=[];return u.push({tag:"span",attributes:s,children:[t]}),n&&u.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),u}var{styles:Qn}=lt;function di(e){let t=e[0],n=e[1],[i]=e.slice(4),s=null;return Array.isArray(i)?s={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat(Kn.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Kn.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Kn.PRIMARY),fill:"currentColor",d:i[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:n,icon:s}}var ml={found:!1,width:512,height:512};function pl(e,t){!ys&&!v.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function fi(e,t){let n=t;return t==="fa"&&v.styleDefault!==null&&(t=Tt()),new Promise((i,s)=>{if(n==="fa"){let l=Ns(e)||{};e=l.iconName||e,t=l.prefix||t}if(e&&t&&Qn[t]&&Qn[t][e]){let l=Qn[t][e];return i(di(l))}pl(e,t),i(D(h({},ml),{icon:v.showMissingIcons&&e?St("missingIconAbstract")||{}:{}}))})}var Kr=()=>{},hi=v.measurePerformance&&cn&&cn.mark&&cn.measure?cn:{mark:Kr,measure:Kr},Ce='FA "6.6.0"',gl=e=>(hi.mark("".concat(Ce," ").concat(e," begins")),()=>Ps(e)),Ps=e=>{hi.mark("".concat(Ce," ").concat(e," ends")),hi.measure("".concat(Ce," ").concat(e),"".concat(Ce," ").concat(e," begins"),"".concat(Ce," ").concat(e," ends"))},wi={begin:gl,end:Ps},un=()=>{};function Zr(e){return typeof(e.getAttribute?e.getAttribute(Ut):null)=="string"}function vl(e){let t=e.getAttribute?e.getAttribute(vi):null,n=e.getAttribute?e.getAttribute(yi):null;return t&&n}function yl(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(v.replacementClass)}function _l(){return v.autoReplaceSvg===!0?dn.replace:dn[v.autoReplaceSvg]||dn.replace}function bl(e){return M.createElementNS("http://www.w3.org/2000/svg",e)}function Cl(e){return M.createElement(e)}function ks(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:n=e.tag==="svg"?bl:Cl}=t;if(typeof e=="string")return M.createTextNode(e);let i=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(l){i.setAttribute(l,e.attributes[l])}),(e.children||[]).forEach(function(l){i.appendChild(ks(l,{ceFn:n}))}),i}function El(e){let t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var dn={replace:function(e){let t=e[0];if(t.parentNode)if(e[1].forEach(n=>{t.parentNode.insertBefore(ks(n),t)}),t.getAttribute(Ut)===null&&v.keepOriginalSource){let n=M.createComment(El(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){let t=e[0],n=e[1];if(~_i(t).indexOf(v.replacementClass))return dn.replace(e);let i=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){let l=n[0].attributes.class.split(" ").reduce((u,d)=>(d===v.replacementClass||d.match(i)?u.toSvg.push(d):u.toNode.push(d),u),{toNode:[],toSvg:[]});n[0].attributes.class=l.toSvg.join(" "),l.toNode.length===0?t.removeAttribute("class"):t.setAttribute("class",l.toNode.join(" "))}let s=n.map(l=>Ie(l)).join(`
`);t.setAttribute(Ut,""),t.innerHTML=s}};function Jr(e){e()}function Rs(e,t){let n=typeof t=="function"?t:un;if(e.length===0)n();else{let i=Jr;v.mutateApproach===Ta&&(i=Mt.requestAnimationFrame||Jr),i(()=>{let s=_l(),l=wi.begin("mutate");e.map(s),l(),n()})}}var Di=!1;function Ls(){Di=!0}function mi(){Di=!1}var hn=null;function Qr(e){if(!Hr||!v.observeMutations)return;let{treeCallback:t=un,nodeCallback:n=un,pseudoElementsCallback:i=un,observeMutationsRoot:s=M}=e;hn=new Hr(l=>{if(Di)return;let u=Tt();ie(l).forEach(d=>{if(d.type==="childList"&&d.addedNodes.length>0&&!Zr(d.addedNodes[0])&&(v.searchPseudoElements&&i(d.target),t(d.target)),d.type==="attributes"&&d.target.parentNode&&v.searchPseudoElements&&i(d.target.parentNode),d.type==="attributes"&&Zr(d.target)&&~Pa.indexOf(d.attributeName))if(d.attributeName==="class"&&vl(d.target)){let{prefix:m,iconName:p}=gn(_i(d.target));d.target.setAttribute(vi,m||u),p&&d.target.setAttribute(yi,p)}else yl(d.target)&&n(d.target)})}),At&&hn.observe(s,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function xl(){hn&&hn.disconnect()}function Al(e){let t=e.getAttribute("style"),n=[];return t&&(n=t.split(";").reduce((i,s)=>{let l=s.split(":"),u=l[0],d=l.slice(1);return u&&d.length>0&&(i[u]=d.join(":").trim()),i},{})),n}function wl(e){let t=e.getAttribute("data-prefix"),n=e.getAttribute("data-icon"),i=e.innerText!==void 0?e.innerText.trim():"",s=gn(_i(e));return s.prefix||(s.prefix=Tt()),t&&n&&(s.prefix=t,s.iconName=n),s.iconName&&s.prefix||(s.prefix&&i.length>0&&(s.iconName=nl(s.prefix,e.innerText)||Ei(s.prefix,oi(e.innerText))),!s.iconName&&v.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=e.firstChild.data)),s}function Dl(e){let t=ie(e.attributes).reduce((s,l)=>(s.name!=="class"&&s.name!=="style"&&(s[l.name]=l.value),s),{}),n=e.getAttribute("title"),i=e.getAttribute("data-fa-title-id");return v.autoA11y&&(n?t["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(i||we()):(t["aria-hidden"]="true",t.focusable="false")),t}function Il(){return{iconName:null,title:null,titleId:null,prefix:null,transform:at,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function ts(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:n,prefix:i,rest:s}=wl(e),l=Dl(e),u=ci("parseNodeAttributes",{},e),d=t.styleParser?Al(e):[];return h({iconName:n,title:e.getAttribute("title"),titleId:e.getAttribute("data-fa-title-id"),prefix:i,transform:at,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:d,attributes:l}},u)}var{styles:Ml}=lt;function Us(e){let t=v.autoReplaceSvg==="nest"?ts(e,{styleParser:!1}):ts(e);return~t.extra.classes.indexOf(Cs)?St("generateLayersText",e,t):St("generateSvgReplacementMutation",e,t)}var ct=new Set;_s.map(e=>{ct.add("fa-".concat(e))});Object.keys(Rt[T]).map(ct.add.bind(ct));Object.keys(Rt[q]).map(ct.add.bind(ct));Object.keys(Rt[K]).map(ct.add.bind(ct));ct=[...ct];function es(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!At)return Promise.resolve();let n=M.documentElement.classList,i=y=>n.add("".concat(Gr,"-").concat(y)),s=y=>n.remove("".concat(Gr,"-").concat(y)),l=v.autoFetchSvg?ct:_s.map(y=>"fa-".concat(y)).concat(Object.keys(Ml));l.includes("fa")||l.push("fa");let u=[".".concat(Cs,":not([").concat(Ut,"])")].concat(l.map(y=>".".concat(y,":not([").concat(Ut,"])"))).join(", ");if(u.length===0)return Promise.resolve();let d=[];try{d=ie(e.querySelectorAll(u))}catch{}if(d.length>0)i("pending"),s("complete");else return Promise.resolve();let m=wi.begin("onTree"),p=d.reduce((y,A)=>{try{let b=Us(A);b&&y.push(b)}catch(b){ys||b.name==="MissingIcon"&&console.error(b)}return y},[]);return new Promise((y,A)=>{Promise.all(p).then(b=>{Rs(b,()=>{i("active"),i("complete"),s("pending"),typeof t=="function"&&t(),m(),y()})}).catch(b=>{m(),A(b)})})}function Tl(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Us(e).then(n=>{n&&Rs([n],t)})}function Sl(e){return function(t){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=(t||{}).icon?t:ui(t||{}),{mask:s}=n;return s&&(s=(s||{}).icon?s:ui(s||{})),e(i,D(h({},n),{mask:s}))}}var Vl=function(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=at,symbol:i=!1,mask:s=null,maskId:l=null,title:u=null,titleId:d=null,classes:m=[],attributes:p={},styles:y={}}=t;if(!e)return;let{prefix:A,iconName:b,icon:L}=e;return vn(h({type:"icon"},e),()=>(jt("beforeDOMElementCreation",{iconDefinition:e,params:t}),v.autoA11y&&(u?p["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(d||we()):(p["aria-hidden"]="true",p.focusable="false")),Ai({icons:{main:di(L),mask:s?di(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:A,iconName:b,transform:h(h({},at),n),symbol:i,title:u,maskId:l,titleId:d,extra:{attributes:p,styles:y,classes:m}})))},Ol={mixout(){return{icon:Sl(Vl)}},hooks(){return{mutationObserverCallbacks(e){return e.treeCallback=es,e.nodeCallback=Tl,e}}},provides(e){e.i2svg=function(t){let{node:n=M,callback:i=()=>{}}=t;return es(n,i)},e.generateSvgReplacementMutation=function(t,n){let{iconName:i,title:s,titleId:l,prefix:u,transform:d,symbol:m,mask:p,maskId:y,extra:A}=n;return new Promise((b,L)=>{Promise.all([fi(i,u),p.iconName?fi(p.iconName,p.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(k=>{let[it,$]=k;b([t,Ai({icons:{main:it,mask:$},prefix:u,iconName:i,transform:d,symbol:m,maskId:y,title:s,titleId:l,extra:A,watchable:!0})])}).catch(L)})},e.generateAbstractIcon=function(t){let{children:n,attributes:i,main:s,transform:l,styles:u}=t,d=mn(u);d.length>0&&(i.style=d);let m;return bi(l)&&(m=St("generateAbstractTransformGrouping",{main:s,transform:l,containerWidth:s.width,iconWidth:s.width})),n.push(m||s.icon),{children:n,attributes:i}}}},Nl={mixout(){return{layer(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:n=[]}=t;return vn({type:"layer"},()=>{jt("beforeDOMElementCreation",{assembler:e,params:t});let i=[];return e(s=>{Array.isArray(s)?s.map(l=>{i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers"),...n].join(" ")},children:i}]})}}}},Fl={mixout(){return{counter(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:n=null,classes:i=[],attributes:s={},styles:l={}}=t;return vn({type:"counter",content:e},()=>(jt("beforeDOMElementCreation",{content:e,params:t}),hl({content:e.toString(),title:n,extra:{attributes:s,styles:l,classes:["".concat(v.cssPrefix,"-layers-counter"),...i]}})))}}}},Pl={mixout(){return{text(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=at,title:i=null,classes:s=[],attributes:l={},styles:u={}}=t;return vn({type:"text",content:e},()=>(jt("beforeDOMElementCreation",{content:e,params:t}),qr({content:e,transform:h(h({},at),n),title:i,extra:{attributes:l,styles:u,classes:["".concat(v.cssPrefix,"-layers-text"),...s]}})))}}},provides(e){e.generateLayersText=function(t,n){let{title:i,transform:s,extra:l}=n,u=null,d=null;if(fs){let m=parseInt(getComputedStyle(t).fontSize,10),p=t.getBoundingClientRect();u=p.width/m,d=p.height/m}return v.autoA11y&&!i&&(l.attributes["aria-hidden"]="true"),Promise.resolve([t,qr({content:t.innerHTML,width:u,height:d,transform:s,title:i,extra:l,watchable:!0})])}}},kl=new RegExp('"',"ug"),ns=[1105920,1112319],is=h(h(h({FontAwesome:{normal:"fas",400:"fas"}},va),ga),wa),pi=Object.keys(is).reduce((e,t)=>(e[t.toLowerCase()]=is[t],e),{}),Rl=Object.keys(pi).reduce((e,t)=>{let n=pi[t];return e[t]=n[900]||[...Object.entries(n)][0][1],e},{});function Ll(e){let t=e.replace(kl,""),n=Ka(t,0),i=n>=ns[0]&&n<=ns[1],s=t.length===2?t[0]===t[1]:!1;return{value:oi(s?t[0]:t),isSecondary:i||s}}function Ul(e,t){let n=e.replace(/^['"]|['"]$/g,"").toLowerCase(),i=parseInt(t),s=isNaN(i)?"normal":i;return(pi[n]||{})[s]||Rl[n]}function rs(e,t){let n="".concat(Ma).concat(t.replace(":","-"));return new Promise((i,s)=>{if(e.getAttribute(n)!==null)return i();let u=ie(e.children).filter(b=>b.getAttribute(ni)===t)[0],d=Mt.getComputedStyle(e,t),m=d.getPropertyValue("font-family"),p=m.match(Na),y=d.getPropertyValue("font-weight"),A=d.getPropertyValue("content");if(u&&!p)return e.removeChild(u),i();if(p&&A!=="none"&&A!==""){let b=d.getPropertyValue("content"),L=Ul(m,y),{value:k,isSecondary:it}=Ll(b),$=p[0].startsWith("FontAwesome"),S=Ei(L,k),U=S;if($){let z=il(k);z.iconName&&z.prefix&&(S=z.iconName,L=z.prefix)}if(S&&!it&&(!u||u.getAttribute(vi)!==L||u.getAttribute(yi)!==U)){e.setAttribute(n,U),u&&e.removeChild(u);let z=Il(),{extra:ut}=z;ut.attributes[ni]=t,fi(S,L).then(tt=>{let Ht=Ai(D(h({},z),{icons:{main:tt,mask:xi()},prefix:L,iconName:U,extra:ut,watchable:!0})),zt=M.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(zt,e.firstChild):e.appendChild(zt),zt.outerHTML=Ht.map(dt=>Ie(dt)).join(`
`),e.removeAttribute(n),i()}).catch(s)}else i()}else i()})}function jl(e){return Promise.all([rs(e,"::before"),rs(e,"::after")])}function Hl(e){return e.parentNode!==document.head&&!~Sa.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(ni)&&(!e.parentNode||e.parentNode.tagName!=="svg")}function ss(e){if(At)return new Promise((t,n)=>{let i=ie(e.querySelectorAll("*")).filter(Hl).map(jl),s=wi.begin("searchPseudoElements");Ls(),Promise.all(i).then(()=>{s(),mi(),t()}).catch(()=>{s(),mi(),n()})})}var zl={hooks(){return{mutationObserverCallbacks(e){return e.pseudoElementsCallback=ss,e}}},provides(e){e.pseudoElements2svg=function(t){let{node:n=M}=t;v.searchPseudoElements&&ss(n)}}},os=!1,Bl={mixout(){return{dom:{unwatch(){Ls(),os=!0}}}},hooks(){return{bootstrap(){Qr(ci("mutationObserverCallbacks",{}))},noAuto(){xl()},watch(e){let{observeMutationsRoot:t}=e;os?mi():Qr(ci("mutationObserverCallbacks",{observeMutationsRoot:t}))}}}},as=e=>{let t={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce((n,i)=>{let s=i.toLowerCase().split("-"),l=s[0],u=s.slice(1).join("-");if(l&&u==="h")return n.flipX=!0,n;if(l&&u==="v")return n.flipY=!0,n;if(u=parseFloat(u),isNaN(u))return n;switch(l){case"grow":n.size=n.size+u;break;case"shrink":n.size=n.size-u;break;case"left":n.x=n.x-u;break;case"right":n.x=n.x+u;break;case"up":n.y=n.y-u;break;case"down":n.y=n.y+u;break;case"rotate":n.rotate=n.rotate+u;break}return n},t)},Gl={mixout(){return{parse:{transform:e=>as(e)}}},hooks(){return{parseNodeAttributes(e,t){let n=t.getAttribute("data-fa-transform");return n&&(e.transform=as(n)),e}}},provides(e){e.generateAbstractTransformGrouping=function(t){let{main:n,transform:i,containerWidth:s,iconWidth:l}=t,u={transform:"translate(".concat(s/2," 256)")},d="translate(".concat(i.x*32,", ").concat(i.y*32,") "),m="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),p="rotate(".concat(i.rotate," 0 0)"),y={transform:"".concat(d," ").concat(m," ").concat(p)},A={transform:"translate(".concat(l/2*-1," -256)")},b={outer:u,inner:y,path:A};return{tag:"g",attributes:h({},b.outer),children:[{tag:"g",attributes:h({},b.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:h(h({},n.icon.attributes),b.path)}]}]}}}},ti={x:0,y:0,width:"100%",height:"100%"};function ls(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Wl(e){return e.tag==="g"?e.children:[e]}var Yl={hooks(){return{parseNodeAttributes(e,t){let n=t.getAttribute("data-fa-mask"),i=n?gn(n.split(" ").map(s=>s.trim())):xi();return i.prefix||(i.prefix=Tt()),e.mask=i,e.maskId=t.getAttribute("data-fa-mask-id"),e}}},provides(e){e.generateAbstractMask=function(t){let{children:n,attributes:i,main:s,mask:l,maskId:u,transform:d}=t,{width:m,icon:p}=s,{width:y,icon:A}=l,b=Ba({transform:d,containerWidth:y,iconWidth:m}),L={tag:"rect",attributes:D(h({},ti),{fill:"white"})},k=p.children?{children:p.children.map(ls)}:{},it={tag:"g",attributes:h({},b.inner),children:[ls(h({tag:p.tag,attributes:h(h({},p.attributes),b.path)},k))]},$={tag:"g",attributes:h({},b.outer),children:[it]},S="mask-".concat(u||we()),U="clip-".concat(u||we()),z={tag:"mask",attributes:D(h({},ti),{id:S,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[L,$]},ut={tag:"defs",children:[{tag:"clipPath",attributes:{id:U},children:Wl(A)},z]};return n.push(ut,{tag:"rect",attributes:h({fill:"currentColor","clip-path":"url(#".concat(U,")"),mask:"url(#".concat(S,")")},ti)}),{children:n,attributes:i}}}},$l={provides(e){let t=!1;Mt.matchMedia&&(t=Mt.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){let n=[],i={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:D(h({},i),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let l=D(h({},s),{attributeName:"opacity"}),u={tag:"circle",attributes:D(h({},i),{cx:"256",cy:"364",r:"28"}),children:[]};return t||u.children.push({tag:"animate",attributes:D(h({},s),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:D(h({},l),{values:"1;0;1;1;0;1;"})}),n.push(u),n.push({tag:"path",attributes:D(h({},i),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:t?[]:[{tag:"animate",attributes:D(h({},l),{values:"1;0;0;0;0;1;"})}]}),t||n.push({tag:"path",attributes:D(h({},i),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:D(h({},l),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Xl={hooks(){return{parseNodeAttributes(e,t){let n=t.getAttribute("data-fa-symbol"),i=n===null?!1:n===""?!0:n;return e.symbol=i,e}}}},ql=[Ya,Ol,Nl,Fl,Pl,zl,Bl,Gl,Yl,$l,Xl];ol(ql,{mixoutsTo:Z});var nu=Z.noAuto,Kl=Z.config,iu=Z.library,Zl=Z.dom,Jl=Z.parse,ru=Z.findIconDefinition,su=Z.toHtml,Ql=Z.icon,ou=Z.layer,tc=Z.text,ec=Z.counter;var js=(()=>{let t=class t{};t.\u0275fac=function(s){return new(s||t)},t.\u0275mod=vt({type:t}),t.\u0275inj=pt({});let e=t;return e})();var yn=class e extends kn{override={swipe:{direction:Hammer.DIRECTION_HORIZONTAL,threshold:10,velocity:.3}};static \u0275fac=(()=>{let t;return function(i){return(t||(t=fe(e)))(i||e)}})();static \u0275prov=He({token:e,factory:e.\u0275fac})};var _n=class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=vt({type:e,bootstrap:[ln]});static \u0275inj=pt({providers:[{provide:fr,useClass:yn}],imports:[dr,an,js,Rr,hr]})};ur().bootstrapModule(_n,{ngZoneEventCoalescing:!0}).catch(e=>console.error(e));
