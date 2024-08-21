import{$ as W4,A as d3,C as h3,D as C,E as y,F as V,G as P4,H as b,I as O,J as S,K as F4,M as I4,N as V4,O as O4,P as M3,Q as R4,R as H4,S as B4,T as P1,U as w2,V as C3,X as U4,Z as G4,_ as q4,a as z,aa as j4,b as v,ba as Y4,c as L8,ca as X4,d as A4,da as $4,e as _4,ea as K4,f as k4,fa as g3,g as E4,h as T4,i as z3,j as m2,k as V2,l as n1,m as u2,n as z2,o as p3,p as U,q as G,r as L3,s as p2,t as O2,u as t1,v as D,w as T1,x as D1,y as R2,z as D4}from"./chunk-QW73LVRX.js";var x3=L8((X7,F1)=>{"use strict";(function(e,c,l,s){"use strict";var a=["","webkit","Moz","MS","ms","o"],o=c.createElement("div"),f="function",m=Math.round,p=Math.abs,d=Date.now;function M(n,t,i){return setTimeout(F(n,i),t)}function N(n,t,i){return Array.isArray(n)?(g(n,i[t],i),!0):!1}function g(n,t,i){var r;if(n)if(n.forEach)n.forEach(t,i);else if(n.length!==s)for(r=0;r<n.length;)t.call(i,n[r],r,n),r++;else for(r in n)n.hasOwnProperty(r)&&t.call(i,n[r],r,n)}function P(n,t,i){var r="DEPRECATED METHOD: "+t+`
`+i+` AT 
`;return function(){var u=new Error("get-stack-trace"),L=u&&u.stack?u.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",x=e.console&&(e.console.warn||e.console.log);return x&&x.call(e.console,r,L),n.apply(this,arguments)}}var E;typeof Object.assign!="function"?E=function(t){if(t===s||t===null)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),r=1;r<arguments.length;r++){var u=arguments[r];if(u!==s&&u!==null)for(var L in u)u.hasOwnProperty(L)&&(i[L]=u[L])}return i}:E=Object.assign;var J=P(function(t,i,r){for(var u=Object.keys(i),L=0;L<u.length;)(!r||r&&t[u[L]]===s)&&(t[u[L]]=i[u[L]]),L++;return t},"extend","Use `assign`."),W=P(function(t,i){return J(t,i,!0)},"merge","Use `assign`.");function _(n,t,i){var r=t.prototype,u;u=n.prototype=Object.create(r),u.constructor=n,u._super=r,i&&E(u,i)}function F(n,t){return function(){return n.apply(t,arguments)}}function R(n,t){return typeof n==f?n.apply(t&&t[0]||s,t):n}function a2(n,t){return n===s?t:n}function Q(n,t,i){g(C1(t),function(r){n.addEventListener(r,i,!1)})}function D2(n,t,i){g(C1(t),function(r){n.removeEventListener(r,i,!1)})}function P2(n,t){for(;n;){if(n==t)return!0;n=n.parentNode}return!1}function i2(n,t){return n.indexOf(t)>-1}function C1(n){return n.trim().split(/\s+/g)}function F2(n,t,i){if(n.indexOf&&!i)return n.indexOf(t);for(var r=0;r<n.length;){if(i&&n[r][i]==t||!i&&n[r]===t)return r;r++}return-1}function g1(n){return Array.prototype.slice.call(n,0)}function a4(n,t,i){for(var r=[],u=[],L=0;L<n.length;){var x=t?n[L][t]:n[L];F2(u,x)<0&&r.push(n[L]),u[L]=x,L++}return i&&(t?r=r.sort(function(I,B){return I[t]>B[t]}):r=r.sort()),r}function x1(n,t){for(var i,r,u=t[0].toUpperCase()+t.slice(1),L=0;L<a.length;){if(i=a[L],r=i?i+u:t,r in n)return r;L++}return s}var P6=1;function F6(){return P6++}function i4(n){var t=n.ownerDocument||n;return t.defaultView||t.parentWindow||e}var I6=/mobile|tablet|ip(ad|hone|od)|android/i,o4="ontouchstart"in e,V6=x1(e,"PointerEvent")!==s,O6=o4&&I6.test(navigator.userAgent),K2="touch",R6="pen",l3="mouse",H6="kinect",B6=25,H=1,y2=2,k=4,q=8,N1=1,Q2=2,Z2=4,J2=8,c1=16,c2=Q2|Z2,b2=J2|c1,r4=c2|b2,f4=["x","y"],v1=["clientX","clientY"];function $(n,t){var i=this;this.manager=n,this.callback=t,this.element=n.element,this.target=n.options.inputTarget,this.domHandler=function(r){R(n.options.enable,[n])&&i.handler(r)},this.init()}$.prototype={handler:function(){},init:function(){this.evEl&&Q(this.element,this.evEl,this.domHandler),this.evTarget&&Q(this.target,this.evTarget,this.domHandler),this.evWin&&Q(i4(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&D2(this.element,this.evEl,this.domHandler),this.evTarget&&D2(this.target,this.evTarget,this.domHandler),this.evWin&&D2(i4(this.element),this.evWin,this.domHandler)}};function U6(n){var t,i=n.options.inputClass;return i?t=i:V6?t=n3:O6?t=S1:o4?t=t3:t=b1,new t(n,G6)}function G6(n,t,i){var r=i.pointers.length,u=i.changedPointers.length,L=t&H&&r-u===0,x=t&(k|q)&&r-u===0;i.isFirst=!!L,i.isFinal=!!x,L&&(n.session={}),i.eventType=t,q6(n,i),n.emit("hammer.input",i),n.recognize(i),n.session.prevInput=i}function q6(n,t){var i=n.session,r=t.pointers,u=r.length;i.firstInput||(i.firstInput=m4(t)),u>1&&!i.firstMultiple?i.firstMultiple=m4(t):u===1&&(i.firstMultiple=!1);var L=i.firstInput,x=i.firstMultiple,T=x?x.center:L.center,I=t.center=u4(r);t.timeStamp=d(),t.deltaTime=t.timeStamp-L.timeStamp,t.angle=s3(T,I),t.distance=y1(T,I),W6(i,t),t.offsetDirection=p4(t.deltaX,t.deltaY);var B=z4(t.deltaTime,t.deltaX,t.deltaY);t.overallVelocityX=B.x,t.overallVelocityY=B.y,t.overallVelocity=p(B.x)>p(B.y)?B.x:B.y,t.scale=x?X6(x.pointers,r):1,t.rotation=x?Y6(x.pointers,r):0,t.maxPointers=i.prevInput?t.pointers.length>i.prevInput.maxPointers?t.pointers.length:i.prevInput.maxPointers:t.pointers.length,j6(i,t);var l2=n.element;P2(t.srcEvent.target,l2)&&(l2=t.srcEvent.target),t.target=l2}function W6(n,t){var i=t.center,r=n.offsetDelta||{},u=n.prevDelta||{},L=n.prevInput||{};(t.eventType===H||L.eventType===k)&&(u=n.prevDelta={x:L.deltaX||0,y:L.deltaY||0},r=n.offsetDelta={x:i.x,y:i.y}),t.deltaX=u.x+(i.x-r.x),t.deltaY=u.y+(i.y-r.y)}function j6(n,t){var i=n.lastInterval||t,r=t.timeStamp-i.timeStamp,u,L,x,T;if(t.eventType!=q&&(r>B6||i.velocity===s)){var I=t.deltaX-i.deltaX,B=t.deltaY-i.deltaY,l2=z4(r,I,B);L=l2.x,x=l2.y,u=p(l2.x)>p(l2.y)?l2.x:l2.y,T=p4(I,B),n.lastInterval=t}else u=i.velocity,L=i.velocityX,x=i.velocityY,T=i.direction;t.velocity=u,t.velocityX=L,t.velocityY=x,t.direction=T}function m4(n){for(var t=[],i=0;i<n.pointers.length;)t[i]={clientX:m(n.pointers[i].clientX),clientY:m(n.pointers[i].clientY)},i++;return{timeStamp:d(),pointers:t,center:u4(t),deltaX:n.deltaX,deltaY:n.deltaY}}function u4(n){var t=n.length;if(t===1)return{x:m(n[0].clientX),y:m(n[0].clientY)};for(var i=0,r=0,u=0;u<t;)i+=n[u].clientX,r+=n[u].clientY,u++;return{x:m(i/t),y:m(r/t)}}function z4(n,t,i){return{x:t/n||0,y:i/n||0}}function p4(n,t){return n===t?N1:p(n)>=p(t)?n<0?Q2:Z2:t<0?J2:c1}function y1(n,t,i){i||(i=f4);var r=t[i[0]]-n[i[0]],u=t[i[1]]-n[i[1]];return Math.sqrt(r*r+u*u)}function s3(n,t,i){i||(i=f4);var r=t[i[0]]-n[i[0]],u=t[i[1]]-n[i[1]];return Math.atan2(u,r)*180/Math.PI}function Y6(n,t){return s3(t[1],t[0],v1)+s3(n[1],n[0],v1)}function X6(n,t){return y1(t[0],t[1],v1)/y1(n[0],n[1],v1)}var $6={mousedown:H,mousemove:y2,mouseup:k},K6="mousedown",Q6="mousemove mouseup";function b1(){this.evEl=K6,this.evWin=Q6,this.pressed=!1,$.apply(this,arguments)}_(b1,$,{handler:function(t){var i=$6[t.type];i&H&&t.button===0&&(this.pressed=!0),i&y2&&t.which!==1&&(i=k),this.pressed&&(i&k&&(this.pressed=!1),this.callback(this.manager,i,{pointers:[t],changedPointers:[t],pointerType:l3,srcEvent:t}))}});var Z6={pointerdown:H,pointermove:y2,pointerup:k,pointercancel:q,pointerout:q},J6={2:K2,3:R6,4:l3,5:H6},L4="pointerdown",d4="pointermove pointerup pointercancel";e.MSPointerEvent&&!e.PointerEvent&&(L4="MSPointerDown",d4="MSPointerMove MSPointerUp MSPointerCancel");function n3(){this.evEl=L4,this.evWin=d4,$.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}_(n3,$,{handler:function(t){var i=this.store,r=!1,u=t.type.toLowerCase().replace("ms",""),L=Z6[u],x=J6[t.pointerType]||t.pointerType,T=x==K2,I=F2(i,t.pointerId,"pointerId");L&H&&(t.button===0||T)?I<0&&(i.push(t),I=i.length-1):L&(k|q)&&(r=!0),!(I<0)&&(i[I]=t,this.callback(this.manager,L,{pointers:i,changedPointers:[t],pointerType:x,srcEvent:t}),r&&i.splice(I,1))}});var c8={touchstart:H,touchmove:y2,touchend:k,touchcancel:q},e8="touchstart",l8="touchstart touchmove touchend touchcancel";function h4(){this.evTarget=e8,this.evWin=l8,this.started=!1,$.apply(this,arguments)}_(h4,$,{handler:function(t){var i=c8[t.type];if(i===H&&(this.started=!0),!!this.started){var r=s8.call(this,t,i);i&(k|q)&&r[0].length-r[1].length===0&&(this.started=!1),this.callback(this.manager,i,{pointers:r[0],changedPointers:r[1],pointerType:K2,srcEvent:t})}}});function s8(n,t){var i=g1(n.touches),r=g1(n.changedTouches);return t&(k|q)&&(i=a4(i.concat(r),"identifier",!0)),[i,r]}var n8={touchstart:H,touchmove:y2,touchend:k,touchcancel:q},t8="touchstart touchmove touchend touchcancel";function S1(){this.evTarget=t8,this.targetIds={},$.apply(this,arguments)}_(S1,$,{handler:function(t){var i=n8[t.type],r=a8.call(this,t,i);r&&this.callback(this.manager,i,{pointers:r[0],changedPointers:r[1],pointerType:K2,srcEvent:t})}});function a8(n,t){var i=g1(n.touches),r=this.targetIds;if(t&(H|y2)&&i.length===1)return r[i[0].identifier]=!0,[i,i];var u,L,x=g1(n.changedTouches),T=[],I=this.target;if(L=i.filter(function(B){return P2(B.target,I)}),t===H)for(u=0;u<L.length;)r[L[u].identifier]=!0,u++;for(u=0;u<x.length;)r[x[u].identifier]&&T.push(x[u]),t&(k|q)&&delete r[x[u].identifier],u++;if(T.length)return[a4(L.concat(T),"identifier",!0),T]}var i8=2500,M4=25;function t3(){$.apply(this,arguments);var n=F(this.handler,this);this.touch=new S1(this.manager,n),this.mouse=new b1(this.manager,n),this.primaryTouch=null,this.lastTouches=[]}_(t3,$,{handler:function(t,i,r){var u=r.pointerType==K2,L=r.pointerType==l3;if(!(L&&r.sourceCapabilities&&r.sourceCapabilities.firesTouchEvents)){if(u)o8.call(this,i,r);else if(L&&r8.call(this,r))return;this.callback(t,i,r)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function o8(n,t){n&H?(this.primaryTouch=t.changedPointers[0].identifier,C4.call(this,t)):n&(k|q)&&C4.call(this,t)}function C4(n){var t=n.changedPointers[0];if(t.identifier===this.primaryTouch){var i={x:t.clientX,y:t.clientY};this.lastTouches.push(i);var r=this.lastTouches,u=function(){var L=r.indexOf(i);L>-1&&r.splice(L,1)};setTimeout(u,i8)}}function r8(n){for(var t=n.srcEvent.clientX,i=n.srcEvent.clientY,r=0;r<this.lastTouches.length;r++){var u=this.lastTouches[r],L=Math.abs(t-u.x),x=Math.abs(i-u.y);if(L<=M4&&x<=M4)return!0}return!1}var g4=x1(o.style,"touchAction"),x4=g4!==s,N4="compute",v4="auto",a3="manipulation",S2="none",e1="pan-x",l1="pan-y",w1=m8();function i3(n,t){this.manager=n,this.set(t)}i3.prototype={set:function(n){n==N4&&(n=this.compute()),x4&&this.manager.element.style&&w1[n]&&(this.manager.element.style[g4]=n),this.actions=n.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var n=[];return g(this.manager.recognizers,function(t){R(t.options.enable,[t])&&(n=n.concat(t.getTouchAction()))}),f8(n.join(" "))},preventDefaults:function(n){var t=n.srcEvent,i=n.offsetDirection;if(this.manager.session.prevented){t.preventDefault();return}var r=this.actions,u=i2(r,S2)&&!w1[S2],L=i2(r,l1)&&!w1[l1],x=i2(r,e1)&&!w1[e1];if(u){var T=n.pointers.length===1,I=n.distance<2,B=n.deltaTime<250;if(T&&I&&B)return}if(!(x&&L)&&(u||L&&i&c2||x&&i&b2))return this.preventSrc(t)},preventSrc:function(n){this.manager.session.prevented=!0,n.preventDefault()}};function f8(n){if(i2(n,S2))return S2;var t=i2(n,e1),i=i2(n,l1);return t&&i?S2:t||i?t?e1:l1:i2(n,a3)?a3:v4}function m8(){if(!x4)return!1;var n={},t=e.CSS&&e.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(i){n[i]=t?e.CSS.supports("touch-action",i):!0}),n}var A1=1,K=2,I2=4,M2=8,o2=M2,s1=16,e2=32;function r2(n){this.options=E({},this.defaults,n||{}),this.id=F6(),this.manager=null,this.options.enable=a2(this.options.enable,!0),this.state=A1,this.simultaneous={},this.requireFail=[]}r2.prototype={defaults:{},set:function(n){return E(this.options,n),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(n){if(N(n,"recognizeWith",this))return this;var t=this.simultaneous;return n=_1(n,this),t[n.id]||(t[n.id]=n,n.recognizeWith(this)),this},dropRecognizeWith:function(n){return N(n,"dropRecognizeWith",this)?this:(n=_1(n,this),delete this.simultaneous[n.id],this)},requireFailure:function(n){if(N(n,"requireFailure",this))return this;var t=this.requireFail;return n=_1(n,this),F2(t,n)===-1&&(t.push(n),n.requireFailure(this)),this},dropRequireFailure:function(n){if(N(n,"dropRequireFailure",this))return this;n=_1(n,this);var t=F2(this.requireFail,n);return t>-1&&this.requireFail.splice(t,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(n){return!!this.simultaneous[n.id]},emit:function(n){var t=this,i=this.state;function r(u){t.manager.emit(u,n)}i<M2&&r(t.options.event+y4(i)),r(t.options.event),n.additionalEvent&&r(n.additionalEvent),i>=M2&&r(t.options.event+y4(i))},tryEmit:function(n){if(this.canEmit())return this.emit(n);this.state=e2},canEmit:function(){for(var n=0;n<this.requireFail.length;){if(!(this.requireFail[n].state&(e2|A1)))return!1;n++}return!0},recognize:function(n){var t=E({},n);if(!R(this.options.enable,[this,t])){this.reset(),this.state=e2;return}this.state&(o2|s1|e2)&&(this.state=A1),this.state=this.process(t),this.state&(K|I2|M2|s1)&&this.tryEmit(t)},process:function(n){},getTouchAction:function(){},reset:function(){}};function y4(n){return n&s1?"cancel":n&M2?"end":n&I2?"move":n&K?"start":""}function b4(n){return n==c1?"down":n==J2?"up":n==Q2?"left":n==Z2?"right":""}function _1(n,t){var i=t.manager;return i?i.get(n):n}function Z(){r2.apply(this,arguments)}_(Z,r2,{defaults:{pointers:1},attrTest:function(n){var t=this.options.pointers;return t===0||n.pointers.length===t},process:function(n){var t=this.state,i=n.eventType,r=t&(K|I2),u=this.attrTest(n);return r&&(i&q||!u)?t|s1:r||u?i&k?t|M2:t&K?t|I2:K:e2}});function k1(){Z.apply(this,arguments),this.pX=null,this.pY=null}_(k1,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:r4},getTouchAction:function(){var n=this.options.direction,t=[];return n&c2&&t.push(l1),n&b2&&t.push(e1),t},directionTest:function(n){var t=this.options,i=!0,r=n.distance,u=n.direction,L=n.deltaX,x=n.deltaY;return u&t.direction||(t.direction&c2?(u=L===0?N1:L<0?Q2:Z2,i=L!=this.pX,r=Math.abs(n.deltaX)):(u=x===0?N1:x<0?J2:c1,i=x!=this.pY,r=Math.abs(n.deltaY))),n.direction=u,i&&r>t.threshold&&u&t.direction},attrTest:function(n){return Z.prototype.attrTest.call(this,n)&&(this.state&K||!(this.state&K)&&this.directionTest(n))},emit:function(n){this.pX=n.deltaX,this.pY=n.deltaY;var t=b4(n.direction);t&&(n.additionalEvent=this.options.event+t),this._super.emit.call(this,n)}});function o3(){Z.apply(this,arguments)}_(o3,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[S2]},attrTest:function(n){return this._super.attrTest.call(this,n)&&(Math.abs(n.scale-1)>this.options.threshold||this.state&K)},emit:function(n){if(n.scale!==1){var t=n.scale<1?"in":"out";n.additionalEvent=this.options.event+t}this._super.emit.call(this,n)}});function r3(){r2.apply(this,arguments),this._timer=null,this._input=null}_(r3,r2,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[v4]},process:function(n){var t=this.options,i=n.pointers.length===t.pointers,r=n.distance<t.threshold,u=n.deltaTime>t.time;if(this._input=n,!r||!i||n.eventType&(k|q)&&!u)this.reset();else if(n.eventType&H)this.reset(),this._timer=M(function(){this.state=o2,this.tryEmit()},t.time,this);else if(n.eventType&k)return o2;return e2},reset:function(){clearTimeout(this._timer)},emit:function(n){this.state===o2&&(n&&n.eventType&k?this.manager.emit(this.options.event+"up",n):(this._input.timeStamp=d(),this.manager.emit(this.options.event,this._input)))}});function f3(){Z.apply(this,arguments)}_(f3,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[S2]},attrTest:function(n){return this._super.attrTest.call(this,n)&&(Math.abs(n.rotation)>this.options.threshold||this.state&K)}});function m3(){Z.apply(this,arguments)}_(m3,Z,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:c2|b2,pointers:1},getTouchAction:function(){return k1.prototype.getTouchAction.call(this)},attrTest:function(n){var t=this.options.direction,i;return t&(c2|b2)?i=n.overallVelocity:t&c2?i=n.overallVelocityX:t&b2&&(i=n.overallVelocityY),this._super.attrTest.call(this,n)&&t&n.offsetDirection&&n.distance>this.options.threshold&&n.maxPointers==this.options.pointers&&p(i)>this.options.velocity&&n.eventType&k},emit:function(n){var t=b4(n.offsetDirection);t&&this.manager.emit(this.options.event+t,n),this.manager.emit(this.options.event,n)}});function E1(){r2.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}_(E1,r2,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[a3]},process:function(n){var t=this.options,i=n.pointers.length===t.pointers,r=n.distance<t.threshold,u=n.deltaTime<t.time;if(this.reset(),n.eventType&H&&this.count===0)return this.failTimeout();if(r&&u&&i){if(n.eventType!=k)return this.failTimeout();var L=this.pTime?n.timeStamp-this.pTime<t.interval:!0,x=!this.pCenter||y1(this.pCenter,n.center)<t.posThreshold;this.pTime=n.timeStamp,this.pCenter=n.center,!x||!L?this.count=1:this.count+=1,this._input=n;var T=this.count%t.taps;if(T===0)return this.hasRequireFailures()?(this._timer=M(function(){this.state=o2,this.tryEmit()},t.interval,this),K):o2}return e2},failTimeout:function(){return this._timer=M(function(){this.state=e2},this.options.interval,this),e2},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==o2&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function f2(n,t){return t=t||{},t.recognizers=a2(t.recognizers,f2.defaults.preset),new u3(n,t)}f2.VERSION="2.0.7",f2.defaults={domEvents:!1,touchAction:N4,enable:!0,inputTarget:null,inputClass:null,preset:[[f3,{enable:!1}],[o3,{enable:!1},["rotate"]],[m3,{direction:c2}],[k1,{direction:c2},["swipe"]],[E1],[E1,{event:"doubletap",taps:2},["tap"]],[r3]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var u8=1,S4=2;function u3(n,t){this.options=E({},f2.defaults,t||{}),this.options.inputTarget=this.options.inputTarget||n,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=n,this.input=U6(this),this.touchAction=new i3(this,this.options.touchAction),w4(this,!0),g(this.options.recognizers,function(i){var r=this.add(new i[0](i[1]));i[2]&&r.recognizeWith(i[2]),i[3]&&r.requireFailure(i[3])},this)}u3.prototype={set:function(n){return E(this.options,n),n.touchAction&&this.touchAction.update(),n.inputTarget&&(this.input.destroy(),this.input.target=n.inputTarget,this.input.init()),this},stop:function(n){this.session.stopped=n?S4:u8},recognize:function(n){var t=this.session;if(!t.stopped){this.touchAction.preventDefaults(n);var i,r=this.recognizers,u=t.curRecognizer;(!u||u&&u.state&o2)&&(u=t.curRecognizer=null);for(var L=0;L<r.length;)i=r[L],t.stopped!==S4&&(!u||i==u||i.canRecognizeWith(u))?i.recognize(n):i.reset(),!u&&i.state&(K|I2|M2)&&(u=t.curRecognizer=i),L++}},get:function(n){if(n instanceof r2)return n;for(var t=this.recognizers,i=0;i<t.length;i++)if(t[i].options.event==n)return t[i];return null},add:function(n){if(N(n,"add",this))return this;var t=this.get(n.options.event);return t&&this.remove(t),this.recognizers.push(n),n.manager=this,this.touchAction.update(),n},remove:function(n){if(N(n,"remove",this))return this;if(n=this.get(n),n){var t=this.recognizers,i=F2(t,n);i!==-1&&(t.splice(i,1),this.touchAction.update())}return this},on:function(n,t){if(n!==s&&t!==s){var i=this.handlers;return g(C1(n),function(r){i[r]=i[r]||[],i[r].push(t)}),this}},off:function(n,t){if(n!==s){var i=this.handlers;return g(C1(n),function(r){t?i[r]&&i[r].splice(F2(i[r],t),1):delete i[r]}),this}},emit:function(n,t){this.options.domEvents&&z8(n,t);var i=this.handlers[n]&&this.handlers[n].slice();if(!(!i||!i.length)){t.type=n,t.preventDefault=function(){t.srcEvent.preventDefault()};for(var r=0;r<i.length;)i[r](t),r++}},destroy:function(){this.element&&w4(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function w4(n,t){var i=n.element;if(i.style){var r;g(n.options.cssProps,function(u,L){r=x1(i.style,L),t?(n.oldCssProps[r]=i.style[r],i.style[r]=u):i.style[r]=n.oldCssProps[r]||""}),t||(n.oldCssProps={})}}function z8(n,t){var i=c.createEvent("Event");i.initEvent(n,!0,!0),i.gesture=t,t.target.dispatchEvent(i)}E(f2,{INPUT_START:H,INPUT_MOVE:y2,INPUT_END:k,INPUT_CANCEL:q,STATE_POSSIBLE:A1,STATE_BEGAN:K,STATE_CHANGED:I2,STATE_ENDED:M2,STATE_RECOGNIZED:o2,STATE_CANCELLED:s1,STATE_FAILED:e2,DIRECTION_NONE:N1,DIRECTION_LEFT:Q2,DIRECTION_RIGHT:Z2,DIRECTION_UP:J2,DIRECTION_DOWN:c1,DIRECTION_HORIZONTAL:c2,DIRECTION_VERTICAL:b2,DIRECTION_ALL:r4,Manager:u3,Input:$,TouchAction:i3,TouchInput:S1,MouseInput:b1,PointerEventInput:n3,TouchMouseInput:t3,SingleTouchInput:h4,Recognizer:r2,AttrRecognizer:Z,Tap:E1,Pan:k1,Swipe:m3,Pinch:o3,Rotate:f3,Press:r3,on:Q,off:D2,each:g,merge:W,extend:J,assign:E,inherit:_,bindFn:F,prefixed:x1});var p8=typeof e<"u"?e:typeof self<"u"?self:{};p8.Hammer=f2,typeof define=="function"&&define.amd?define(function(){return f2}):typeof F1<"u"&&F1.exports?F1.exports=f2:e[l]=f2})(window,document,"Hammer")});var c9=A4(x3());var n0=(()=>{let c=class c{constructor(s,a){this._renderer=s,this._elementRef=a,this.onChange=o=>{},this.onTouched=()=>{}}setProperty(s,a){this._renderer.setProperty(this._elementRef.nativeElement,s,a)}registerOnTouched(s){this.onTouched=s}registerOnChange(s){this.onChange=s}setDisabledState(s){this.setProperty("disabled",s)}};c.\u0275fac=function(a){return new(a||c)(D(T1),D(O2))},c.\u0275dir=z2({type:c});let e=c;return e})(),M8=(()=>{let c=class c extends n0{};c.\u0275fac=(()=>{let s;return function(o){return(s||(s=L3(c)))(o||c)}})(),c.\u0275dir=z2({type:c,features:[R2]});let e=c;return e})(),t0=new V2("");var C8={provide:t0,useExisting:z3(()=>H1),multi:!0};function g8(){let e=C3()?C3().getUserAgent():"";return/android (\d+)/.test(e.toLowerCase())}var x8=new V2(""),H1=(()=>{let c=class c extends n0{constructor(s,a,o){super(s,a),this._compositionMode=o,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!g8())}writeValue(s){let a=s??"";this.setProperty("value",a)}_handleInput(s){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(s)}_compositionStart(){this._composing=!0}_compositionEnd(s){this._composing=!1,this._compositionMode&&this.onChange(s)}};c.\u0275fac=function(a){return new(a||c)(D(T1),D(O2),D(x8,8))},c.\u0275dir=z2({type:c,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(a,o){a&1&&b("input",function(m){return o._handleInput(m.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(m){return o._compositionEnd(m.target.value)})},features:[M3([C8]),R2]});let e=c;return e})();var N8=new V2(""),v8=new V2("");function a0(e){return e!=null}function i0(e){return R4(e)?k4(e):e}function o0(e){let c={};return e.forEach(l=>{c=l!=null?z(z({},c),l):c}),Object.keys(c).length===0?null:c}function r0(e,c){return c.map(l=>l(e))}function y8(e){return!e.validate}function f0(e){return e.map(c=>y8(c)?c:l=>c.validate(l))}function b8(e){if(!e)return null;let c=e.filter(a0);return c.length==0?null:function(l){return o0(r0(l,c))}}function m0(e){return e!=null?b8(f0(e)):null}function S8(e){if(!e)return null;let c=e.filter(a0);return c.length==0?null:function(l){let s=r0(l,c).map(i0);return T4(s).pipe(E4(o0))}}function u0(e){return e!=null?S8(f0(e)):null}function Q4(e,c){return e===null?[c]:Array.isArray(e)?[...e,c]:[e,c]}function w8(e){return e._rawValidators}function A8(e){return e._rawAsyncValidators}function N3(e){return e?Array.isArray(e)?e:[e]:[]}function V1(e,c){return Array.isArray(e)?e.includes(c):e===c}function Z4(e,c){let l=N3(c);return N3(e).forEach(a=>{V1(l,a)||l.push(a)}),l}function J4(e,c){return N3(c).filter(l=>!V1(e,l))}var O1=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(c){this._rawValidators=c||[],this._composedValidatorFn=m0(this._rawValidators)}_setAsyncValidators(c){this._rawAsyncValidators=c||[],this._composedAsyncValidatorFn=u0(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(c){this._onDestroyCallbacks.push(c)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(c=>c()),this._onDestroyCallbacks=[]}reset(c=void 0){this.control&&this.control.reset(c)}hasError(c,l){return this.control?this.control.hasError(c,l):!1}getError(c,l){return this.control?this.control.getError(c,l):null}},v3=class extends O1{get formDirective(){return null}get path(){return null}},f1=class extends O1{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},y3=class{constructor(c){this._cd=c}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},_8={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},pc=v(z({},_8),{"[class.ng-submitted]":"isSubmitted"}),z0=(()=>{let c=class c extends y3{constructor(s){super(s)}};c.\u0275fac=function(a){return new(a||c)(D(f1,2))},c.\u0275dir=z2({type:c,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(a,o){a&2&&h3("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},features:[R2]});let e=c;return e})();var a1="VALID",I1="INVALID",H2="PENDING",i1="DISABLED",U2=class{},R1=class extends U2{constructor(c,l){super(),this.value=c,this.source=l}},o1=class extends U2{constructor(c,l){super(),this.pristine=c,this.source=l}},r1=class extends U2{constructor(c,l){super(),this.touched=c,this.source=l}},B2=class extends U2{constructor(c,l){super(),this.status=c,this.source=l}};function k8(e){return(B1(e)?e.validators:e)||null}function E8(e){return Array.isArray(e)?m0(e):e||null}function T8(e,c){return(B1(c)?c.asyncValidators:e)||null}function D8(e){return Array.isArray(e)?u0(e):e||null}function B1(e){return e!=null&&!Array.isArray(e)&&typeof e=="object"}var b3=class{constructor(c,l){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=P1(()=>this.statusReactive()),this.statusReactive=D1(void 0),this._pristine=P1(()=>this.pristineReactive()),this.pristineReactive=D1(!0),this._touched=P1(()=>this.touchedReactive()),this.touchedReactive=D1(!1),this._events=new _4,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(c),this._assignAsyncValidators(l)}get validator(){return this._composedValidatorFn}set validator(c){this._rawValidators=this._composedValidatorFn=c}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(c){this._rawAsyncValidators=this._composedAsyncValidatorFn=c}get parent(){return this._parent}get status(){return w2(this.statusReactive)}set status(c){w2(()=>this.statusReactive.set(c))}get valid(){return this.status===a1}get invalid(){return this.status===I1}get pending(){return this.status==H2}get disabled(){return this.status===i1}get enabled(){return this.status!==i1}get pristine(){return w2(this.pristineReactive)}set pristine(c){w2(()=>this.pristineReactive.set(c))}get dirty(){return!this.pristine}get touched(){return w2(this.touchedReactive)}set touched(c){w2(()=>this.touchedReactive.set(c))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(c){this._assignValidators(c)}setAsyncValidators(c){this._assignAsyncValidators(c)}addValidators(c){this.setValidators(Z4(c,this._rawValidators))}addAsyncValidators(c){this.setAsyncValidators(Z4(c,this._rawAsyncValidators))}removeValidators(c){this.setValidators(J4(c,this._rawValidators))}removeAsyncValidators(c){this.setAsyncValidators(J4(c,this._rawAsyncValidators))}hasValidator(c){return V1(this._rawValidators,c)}hasAsyncValidator(c){return V1(this._rawAsyncValidators,c)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(c={}){let l=this.touched===!1;this.touched=!0;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsTouched(v(z({},c),{sourceControl:s})),l&&c.emitEvent!==!1&&this._events.next(new r1(!0,s))}markAllAsTouched(c={}){this.markAsTouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:this}),this._forEachChild(l=>l.markAllAsTouched(c))}markAsUntouched(c={}){let l=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let s=c.sourceControl??this;this._forEachChild(a=>{a.markAsUntouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:s})}),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,s),l&&c.emitEvent!==!1&&this._events.next(new r1(!1,s))}markAsDirty(c={}){let l=this.pristine===!0;this.pristine=!1;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsDirty(v(z({},c),{sourceControl:s})),l&&c.emitEvent!==!1&&this._events.next(new o1(!1,s))}markAsPristine(c={}){let l=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let s=c.sourceControl??this;this._forEachChild(a=>{a.markAsPristine({onlySelf:!0,emitEvent:c.emitEvent})}),this._parent&&!c.onlySelf&&this._parent._updatePristine(c,s),l&&c.emitEvent!==!1&&this._events.next(new o1(!0,s))}markAsPending(c={}){this.status=H2;let l=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new B2(this.status,l)),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.markAsPending(v(z({},c),{sourceControl:l}))}disable(c={}){let l=this._parentMarkedDirty(c.onlySelf);this.status=i1,this.errors=null,this._forEachChild(a=>{a.disable(v(z({},c),{onlySelf:!0}))}),this._updateValue();let s=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new R1(this.value,s)),this._events.next(new B2(this.status,s)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(v(z({},c),{skipPristineCheck:l}),this),this._onDisabledChange.forEach(a=>a(!0))}enable(c={}){let l=this._parentMarkedDirty(c.onlySelf);this.status=a1,this._forEachChild(s=>{s.enable(v(z({},c),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent}),this._updateAncestors(v(z({},c),{skipPristineCheck:l}),this),this._onDisabledChange.forEach(s=>s(!1))}_updateAncestors(c,l){this._parent&&!c.onlySelf&&(this._parent.updateValueAndValidity(c),c.skipPristineCheck||this._parent._updatePristine({},l),this._parent._updateTouched({},l))}setParent(c){this._parent=c}getRawValue(){return this.value}updateValueAndValidity(c={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let s=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===a1||this.status===H2)&&this._runAsyncValidator(s,c.emitEvent)}let l=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new R1(this.value,l)),this._events.next(new B2(this.status,l)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.updateValueAndValidity(v(z({},c),{sourceControl:l}))}_updateTreeValidity(c={emitEvent:!0}){this._forEachChild(l=>l._updateTreeValidity(c)),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?i1:a1}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(c,l){if(this.asyncValidator){this.status=H2,this._hasOwnPendingAsyncValidator={emitEvent:l!==!1};let s=i0(this.asyncValidator(this));this._asyncValidationSubscription=s.subscribe(a=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(a,{emitEvent:l,shouldHaveEmitted:c})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let c=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,c}return!1}setErrors(c,l={}){this.errors=c,this._updateControlsErrors(l.emitEvent!==!1,this,l.shouldHaveEmitted)}get(c){let l=c;return l==null||(Array.isArray(l)||(l=l.split(".")),l.length===0)?null:l.reduce((s,a)=>s&&s._find(a),this)}getError(c,l){let s=l?this.get(l):this;return s&&s.errors?s.errors[c]:null}hasError(c,l){return!!this.getError(c,l)}get root(){let c=this;for(;c._parent;)c=c._parent;return c}_updateControlsErrors(c,l,s){this.status=this._calculateStatus(),c&&this.statusChanges.emit(this.status),(c||s)&&this._events.next(new B2(this.status,l)),this._parent&&this._parent._updateControlsErrors(c,l,s)}_initObservables(){this.valueChanges=new p2,this.statusChanges=new p2}_calculateStatus(){return this._allControlsDisabled()?i1:this.errors?I1:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(H2)?H2:this._anyControlsHaveStatus(I1)?I1:a1}_anyControlsHaveStatus(c){return this._anyControls(l=>l.status===c)}_anyControlsDirty(){return this._anyControls(c=>c.dirty)}_anyControlsTouched(){return this._anyControls(c=>c.touched)}_updatePristine(c,l){let s=!this._anyControlsDirty(),a=this.pristine!==s;this.pristine=s,this._parent&&!c.onlySelf&&this._parent._updatePristine(c,l),a&&this._events.next(new o1(this.pristine,l))}_updateTouched(c={},l){this.touched=this._anyControlsTouched(),this._events.next(new r1(this.touched,l)),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,l)}_registerOnCollectionChange(c){this._onCollectionChange=c}_setUpdateStrategy(c){B1(c)&&c.updateOn!=null&&(this._updateOn=c.updateOn)}_parentMarkedDirty(c){let l=this._parent&&this._parent.dirty;return!c&&!!l&&!this._parent._anyControlsDirty()}_find(c){return null}_assignValidators(c){this._rawValidators=Array.isArray(c)?c.slice():c,this._composedValidatorFn=E8(this._rawValidators)}_assignAsyncValidators(c){this._rawAsyncValidators=Array.isArray(c)?c.slice():c,this._composedAsyncValidatorFn=D8(this._rawAsyncValidators)}};var p0=new V2("CallSetDisabledState",{providedIn:"root",factory:()=>S3}),S3="always";function P8(e,c){return[...c.path,e]}function F8(e,c,l=S3){V8(e,c),c.valueAccessor.writeValue(e.value),(e.disabled||l==="always")&&c.valueAccessor.setDisabledState?.(e.disabled),O8(e,c),H8(e,c),R8(e,c),I8(e,c)}function c0(e,c){e.forEach(l=>{l.registerOnValidatorChange&&l.registerOnValidatorChange(c)})}function I8(e,c){if(c.valueAccessor.setDisabledState){let l=s=>{c.valueAccessor.setDisabledState(s)};e.registerOnDisabledChange(l),c._registerOnDestroy(()=>{e._unregisterOnDisabledChange(l)})}}function V8(e,c){let l=w8(e);c.validator!==null?e.setValidators(Q4(l,c.validator)):typeof l=="function"&&e.setValidators([l]);let s=A8(e);c.asyncValidator!==null?e.setAsyncValidators(Q4(s,c.asyncValidator)):typeof s=="function"&&e.setAsyncValidators([s]);let a=()=>e.updateValueAndValidity();c0(c._rawValidators,a),c0(c._rawAsyncValidators,a)}function O8(e,c){c.valueAccessor.registerOnChange(l=>{e._pendingValue=l,e._pendingChange=!0,e._pendingDirty=!0,e.updateOn==="change"&&L0(e,c)})}function R8(e,c){c.valueAccessor.registerOnTouched(()=>{e._pendingTouched=!0,e.updateOn==="blur"&&e._pendingChange&&L0(e,c),e.updateOn!=="submit"&&e.markAsTouched()})}function L0(e,c){e._pendingDirty&&e.markAsDirty(),e.setValue(e._pendingValue,{emitModelToViewChange:!1}),c.viewToModelUpdate(e._pendingValue),e._pendingChange=!1}function H8(e,c){let l=(s,a)=>{c.valueAccessor.writeValue(s),a&&c.viewToModelUpdate(s)};e.registerOnChange(l),c._registerOnDestroy(()=>{e._unregisterOnChange(l)})}function B8(e,c){if(!e.hasOwnProperty("model"))return!1;let l=e.model;return l.isFirstChange()?!0:!Object.is(c,l.currentValue)}function U8(e){return Object.getPrototypeOf(e.constructor)===M8}function G8(e,c){if(!c)return null;Array.isArray(c);let l,s,a;return c.forEach(o=>{o.constructor===H1?l=o:U8(o)?s=o:a=o}),a||s||l||null}function e0(e,c){let l=e.indexOf(c);l>-1&&e.splice(l,1)}function l0(e){return typeof e=="object"&&e!==null&&Object.keys(e).length===2&&"value"in e&&"disabled"in e}var q8=class extends b3{constructor(c=null,l,s){super(k8(l),T8(s,l)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(c),this._setUpdateStrategy(l),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),B1(l)&&(l.nonNullable||l.initialValueIsDefault)&&(l0(c)?this.defaultValue=c.value:this.defaultValue=c)}setValue(c,l={}){this.value=this._pendingValue=c,this._onChange.length&&l.emitModelToViewChange!==!1&&this._onChange.forEach(s=>s(this.value,l.emitViewToModelChange!==!1)),this.updateValueAndValidity(l)}patchValue(c,l={}){this.setValue(c,l)}reset(c=this.defaultValue,l={}){this._applyFormState(c),this.markAsPristine(l),this.markAsUntouched(l),this.setValue(this.value,l),this._pendingChange=!1}_updateValue(){}_anyControls(c){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(c){this._onChange.push(c)}_unregisterOnChange(c){e0(this._onChange,c)}registerOnDisabledChange(c){this._onDisabledChange.push(c)}_unregisterOnDisabledChange(c){e0(this._onDisabledChange,c)}_forEachChild(c){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(c){l0(c)?(this.value=this._pendingValue=c.value,c.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=c}};var W8={provide:f1,useExisting:z3(()=>w3)},s0=Promise.resolve(),w3=(()=>{let c=class c extends f1{constructor(s,a,o,f,m,p){super(),this._changeDetectorRef=m,this.callSetDisabledState=p,this.control=new q8,this._registered=!1,this.name="",this.update=new p2,this._parent=s,this._setValidators(a),this._setAsyncValidators(o),this.valueAccessor=G8(this,f)}ngOnChanges(s){if(this._checkForErrors(),!this._registered||"name"in s){if(this._registered&&(this._checkName(),this.formDirective)){let a=s.name.previousValue;this.formDirective.removeControl({name:a,path:this._getPath(a)})}this._setUpControl()}"isDisabled"in s&&this._updateDisabled(s),B8(s,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(s){this.viewModel=s,this.update.emit(s)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){F8(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(s){s0.then(()=>{this.control.setValue(s,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(s){let a=s.isDisabled.currentValue,o=a!==0&&B4(a);s0.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(s){return this._parent?P8(s,this._parent):[s]}};c.\u0275fac=function(a){return new(a||c)(D(v3,9),D(N8,10),D(v8,10),D(t0,10),D(H4,8),D(p0,8))},c.\u0275dir=z2({type:c,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[M3([W8]),R2,p3]});let e=c;return e})();var j8=(()=>{let c=class c{};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({});let e=c;return e})();var d0=(()=>{let c=class c{static withConfig(s){return{ngModule:c,providers:[{provide:p0,useValue:s.callSetDisabledState??S3}]}}};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({imports:[j8]});let e=c;return e})();var h0={prefix:"fas",iconName:"lightbulb",icon:[384,512,[128161],"f0eb","M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"]};var M0={prefix:"fas",iconName:"question",icon:[320,512,[10067,10068,61736],"3f","M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"]};var X8={prefix:"fas",iconName:"screwdriver-wrench",icon:[512,512,["tools"],"f7d9","M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"]},C0=X8;var $8={prefix:"fas",iconName:"shirt",icon:[640,512,[128085,"t-shirt","tshirt"],"f553","M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0l12.6 0c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7 480 448c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-250.3-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0l12.6 0z"]};var g0=$8;var x0={prefix:"fas",iconName:"dumbbell",icon:[640,512,[],"f44b","M96 64c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 160 0 64 0 160c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64-32 0c-17.7 0-32-14.3-32-32l0-64c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64c0-17.7 14.3-32 32-32l32 0 0-64zm448 0l0 64 32 0c17.7 0 32 14.3 32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 17.7-14.3 32-32 32l-32 0 0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-160 0-64 0-160c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32zM416 224l0 64-192 0 0-64 192 0z"]};var N0={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]};var K8={prefix:"fas",iconName:"delete-left",icon:[576,512,[9003,"backspace"],"f55a","M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]},v0=K8;var Q8={prefix:"fas",iconName:"house",icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]},y0=Q8;var b0={prefix:"fas",iconName:"utensils",icon:[448,512,[127860,61685,"cutlery"],"f2e7","M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"]};var S0={prefix:"fas",iconName:"credit-card",icon:[576,512,[128179,62083,"credit-card-alt"],"f09d","M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"]};var w0={prefix:"fas",iconName:"car",icon:[512,512,[128664,"automobile"],"f1b9","M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};var A0={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]};var _0={prefix:"fas",iconName:"baby",icon:[448,512,[],"f77c","M152 88a72 72 0 1 1 144 0A72 72 0 1 1 152 88zM39.7 144.5c13-17.9 38-21.8 55.9-8.8L131.8 162c26.8 19.5 59.1 30 92.2 30s65.4-10.5 92.2-30l36.2-26.4c17.9-13 42.9-9 55.9 8.8s9 42.9-8.8 55.9l-36.2 26.4c-13.6 9.9-28.1 18.2-43.3 25l0 36.3-192 0 0-36.3c-15.2-6.7-29.7-15.1-43.3-25L48.5 200.3c-17.9-13-21.8-38-8.8-55.9zm89.8 184.8l60.6 53-26 37.2 24.3 24.3c15.6 15.6 15.6 40.9 0 56.6s-40.9 15.6-56.6 0l-48-48C70 438.6 68.1 417 79.2 401.1l50.2-71.8zm128.5 53l60.6-53 50.2 71.8c11.1 15.9 9.2 37.5-4.5 51.2l-48 48c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6L284 419.4l-26-37.2z"]};var k0={prefix:"fas",iconName:"music",icon:[512,512,[127925],"f001","M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"]};var E0={prefix:"fas",iconName:"plane",icon:[576,512,[],"f072","M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"]};var q2=A4(x3());var U1=class e{constructor(c){this.el=c}swipeLeft=new p2;swipeRight=new p2;swipeDown=new p2;swipeUp=new p2;hammer;ngOnInit(){this.hammer=new q2.Manager(this.el.nativeElement),this.hammer.add(new q2.Swipe({direction:q2.DIRECTION_ALL})),this.hammer.on("swipeleft",()=>this.onSwipeLeft()),this.hammer.on("swiperight",()=>this.onSwipeRight()),this.hammer.on("swipeup",()=>this.onSwipeUp()),this.hammer.on("swipedown",()=>this.onSwipeDown())}onSwipeLeft(){this.swipeLeft.emit()}onSwipeRight(){this.swipeRight.emit()}onSwipeDown(){this.swipeDown.emit()}onSwipeUp(){this.swipeUp.emit()}ngOnDestroy(){this.hammer&&this.hammer.destroy()}static \u0275fac=function(l){return new(l||e)(D(O2))};static \u0275dir=z2({type:e,selectors:[["","appSwipe",""]],outputs:{swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeDown:"swipeDown",swipeUp:"swipeUp"}})};function e5(e,c){if(e&1){let l=P4();C(0,"div",21)(1,"div",22),b("swipeLeft",function(){U(l);let a=O();return G(a.onDeleteClick())}),C(2,"input",23),O4("ngModelChange",function(a){U(l);let o=O();return V4(o.enteredAmount,a)||(o.enteredAmount=a),G(a)}),y()(),C(3,"div",24)(4,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("1"))}),S(5,"1"),y(),C(6,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("2"))}),S(7,"2"),y(),C(8,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("3"))}),S(9,"3"),y(),C(10,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("4"))}),S(11,"4"),y(),C(12,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("5"))}),S(13,"5"),y(),C(14,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("6"))}),S(15,"6"),y(),C(16,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("7"))}),S(17,"7"),y(),C(18,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("8"))}),S(19,"8"),y(),C(20,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("9"))}),S(21,"9"),y(),C(22,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("."))}),S(23,"."),y(),C(24,"div",25),b("click",function(){U(l);let a=O();return G(a.onNumberClick("0"))}),S(25,"0"),y(),C(26,"div",25),b("click",function(){U(l);let a=O();return G(a.onDeleteClick())}),V(27,"i",26),y()()()}if(e&2){let l=O();t1(2),I4("ngModel",l.enteredAmount)}}var G1=class e{constructor(c){this.router=c}faClock=N0;faPlus=A0;faBackspace=v0;categories=[{name:"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438",icon:b0},{name:"\u041E\u0434\u0435\u0436\u0434\u0430",icon:g0},{name:"\u0420\u0435\u043C\u043E\u043D\u0442",icon:C0},{name:"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F",icon:k0},{name:"\u0421\u043F\u043E\u0440\u0442",icon:x0},{name:"\u0410\u0432\u0442\u043E",icon:w0},{name:"\u041A\u043E\u043C\u043C\u0443\u043D\u0430\u043B\u043A\u0430",icon:h0},{name:"\u0414\u0435\u0442\u0438",icon:_0},{name:"\u0414\u043E\u043C",icon:y0},{name:"\u0420\u0430\u0437\u043D\u043E\u0435",icon:M0},{name:"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F",icon:E0},{name:"\u041A\u0440\u0435\u0434\u0438\u0442",icon:S0}];numbers=[1,2,3,4,5,6,7,8,9,0];enteredAmount="";enteredAmountAsNumber=0;totalAmount=0;showKeyBoard=!0;ngOnInit(){let c=JSON.parse(localStorage.getItem("expenses")||"[]");this.sumValues(c)}onNumberClick(c){c==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=c):this.enteredAmount+=c,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(c){if(this.enteredAmountAsNumber>0){let l=localStorage.getItem("expenses"),s=l?JSON.parse(l):[];s.push({category:c,amount:this.enteredAmountAsNumber,currency:"EUR"}),localStorage.setItem("expenses",JSON.stringify(s)),this.sumValues(s),this.enteredAmount="",this.enteredAmountAsNumber=0}}onSwipeLeft(){this.router.navigate(["/history"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}sumValues(c){this.totalAmount=c.reduce((l,s)=>{let a=l+s.amount;return Math.round(a*100)/100},0)}static \u0275fac=function(l){return new(l||e)(D($4))};static \u0275cmp=n1({type:e,selectors:[["app-expense"]],decls:56,vars:3,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[1,"expense-info"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],["appSwipe","",1,"scrollable-content",3,"swipeDown","swipeLeft"],[1,"categories"],[1,"category",3,"click"],[1,"fas","fa-utensils"],[1,"fas","fa-tshirt"],[1,"fas","fa-paint-roller"],[1,"fas","fa-music"],[1,"fas","fa-dumbbell"],[1,"fas","fa-car"],[1,"fas","fa-home"],[1,"fas","fa-baby-carriage"],[1,"fas","fa-random"],[1,"fas","fa-plane"],["class","number-board",4,"ngIf"],[1,"number-board"],["appSwipe","",1,"number-board-header",3,"swipeLeft"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(l,s){l&1&&(C(0,"div",0)(1,"div",1),V(2,"div",2),C(3,"div",3)(4,"span"),S(5,"\u041E\u0411\u0429\u0418\u0419 \u0420\u0410\u0421\u0425\u041E\u0414"),y()(),C(6,"div",4)(7,"span"),S(8),y(),C(9,"span"),S(10,"$"),y()(),C(11,"div",5),V(12,"i",6),y()(),C(13,"div",7),b("swipeDown",function(){return s.onHideKeyboard()})("swipeLeft",function(){return s.onSwipeLeft()}),C(14,"div",8)(15,"div",9),b("click",function(){return s.onCategoryClick("meal")}),V(16,"i",10),C(17,"span"),S(18,"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438"),y()(),C(19,"div",9),b("click",function(){return s.onCategoryClick("clothes")}),V(20,"i",11),C(21,"span"),S(22,"\u041E\u0434\u0435\u0436\u0434\u0430"),y()(),C(23,"div",9),b("click",function(){return s.onCategoryClick("repair")}),V(24,"i",12),C(25,"span"),S(26,"\u0420\u0435\u043C\u043E\u043D\u0442"),y()(),C(27,"div",9),b("click",function(){return s.onCategoryClick("entertainments")}),V(28,"i",13),C(29,"span"),S(30,"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F"),y()(),C(31,"div",9),b("click",function(){return s.onCategoryClick("sport")}),V(32,"i",14),C(33,"span"),S(34,"\u0421\u043F\u043E\u0440\u0442"),y()(),C(35,"div",9),b("click",function(){return s.onCategoryClick("car")}),V(36,"i",15),C(37,"span"),S(38,"\u0410\u0432\u0442\u043E"),y()(),C(39,"div",9),b("click",function(){return s.onCategoryClick("home")}),V(40,"i",16),C(41,"span"),S(42,"\u0414\u043E\u043C"),y()(),C(43,"div",9),b("click",function(){return s.onCategoryClick("children")}),V(44,"i",17),C(45,"span"),S(46,"\u0414\u0435\u0442\u0438"),y()(),C(47,"div",9),b("click",function(){return s.onCategoryClick("another")}),V(48,"i",18),C(49,"span"),S(50,"\u0420\u0430\u0437\u043D\u043E\u0435"),y()(),C(51,"div",9),b("click",function(){return s.onCategoryClick("travel")}),V(52,"i",19),C(53,"span"),S(54,"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F"),y()()()(),D4(55,e5,28,1,"div",20),y()),l&2&&(t1(8),F4(s.totalAmount),t1(3),d3("routerLink","/history"),t1(44),d3("ngIf",s.showKeyBoard))},dependencies:[U4,K4,H1,z0,w3,U1],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.scrollable-content[_ngcontent-%COMP%]{flex:1}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:60px;margin:10px;text-align:center}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:36px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding:12px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr)}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};var l5=[{path:"history",loadChildren:()=>import("./chunk-YNVEVF5D.js").then(e=>e.HistoryModule)},{path:"",pathMatch:"full",component:G1}],q1=class e{static \u0275fac=function(l){return new(l||e)};static \u0275mod=u2({type:e});static \u0275inj=m2({imports:[g3.forRoot(l5),g3]})};var W1=class e{title="expenses";static \u0275fac=function(l){return new(l||e)};static \u0275cmp=n1({type:e,selectors:[["app-root"]],decls:1,vars:0,template:function(l,s){l&1&&V(0,"router-outlet")},dependencies:[X4]})};var T0=()=>{},X3={},l6={},s6=null,n6={mark:T0,measure:T0};try{typeof window<"u"&&(X3=window),typeof document<"u"&&(l6=document),typeof MutationObserver<"u"&&(s6=MutationObserver),typeof performance<"u"&&(n6=performance)}catch{}var{userAgent:D0=""}=X3.navigator||{},x2=X3,w=l6,P0=s6,j1=n6,Ec=!!x2.document,h2=!!w.documentElement&&!!w.head&&typeof w.addEventListener=="function"&&typeof w.createElement=="function",t6=~D0.indexOf("MSIE")||~D0.indexOf("Trident/"),A="classic",a6="duotone",j="sharp",Y="sharp-duotone",s5=[A,a6,j,Y],n5={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},F0={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},t5=["kit"],a5=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,i5=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,o5={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},r5={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},f5={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},m5={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},u5={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},z5={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},i6={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},p5=["solid","regular","light","thin","duotone","brands"],o6=[1,2,3,4,5,6,7,8,9,10],L5=o6.concat([11,12,13,14,15,16,17,18,19,20]),m1={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},d5=[...Object.keys(m5),...p5,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",m1.GROUP,m1.SWAP_OPACITY,m1.PRIMARY,m1.SECONDARY].concat(o6.map(e=>"".concat(e,"x"))).concat(L5.map(e=>"w-".concat(e))),h5={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},M5={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},C5={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},I0={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},L2="___FONT_AWESOME___",D3=16,r6="fa",f6="svg-inline--fa",E2="data-fa-i2svg",P3="data-fa-pseudo-element",g5="data-fa-pseudo-element-pending",$3="data-prefix",K3="data-icon",V0="fontawesome-i2svg",x5="async",N5=["HTML","HEAD","STYLE","SCRIPT"],m6=(()=>{try{return!0}catch{return!1}})(),u6=[A,j,Y];function h1(e){return new Proxy(e,{get(c,l){return l in c?c[l]:c[A]}})}var z6=z({},i6);z6[A]=z(z(z({},i6[A]),F0.kit),F0["kit-duotone"]);var _2=h1(z6),F3=z({},z5);F3[A]=z(z(z({},F3[A]),I0.kit),I0["kit-duotone"]);var L1=h1(F3),I3=z({},u5);I3[A]=z(z({},I3[A]),C5.kit);var k2=h1(I3),V3=z({},f5);V3[A]=z(z({},V3[A]),M5.kit);var v5=h1(V3),y5=a5,p6="fa-layers-text",b5=i5,S5=z({},n5),Tc=h1(S5),w5=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],A3=m1,Y2=new Set;Object.keys(L1[A]).map(Y2.add.bind(Y2));Object.keys(L1[j]).map(Y2.add.bind(Y2));Object.keys(L1[Y]).map(Y2.add.bind(Y2));var A5=[...t5,...d5],z1=x2.FontAwesomeConfig||{};function _5(e){var c=w.querySelector("script["+e+"]");if(c)return c.getAttribute(e)}function k5(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}w&&typeof w.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(c=>{let[l,s]=c,a=k5(_5(l));a!=null&&(z1[s]=a)});var L6={styleDefault:"solid",familyDefault:"classic",cssPrefix:r6,replacementClass:f6,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};z1.familyPrefix&&(z1.cssPrefix=z1.familyPrefix);var X2=z(z({},L6),z1);X2.autoReplaceSvg||(X2.observeMutations=!1);var h={};Object.keys(L6).forEach(e=>{Object.defineProperty(h,e,{enumerable:!0,set:function(c){X2[e]=c,p1.forEach(l=>l(h))},get:function(){return X2[e]}})});Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(e){X2.cssPrefix=e,p1.forEach(c=>c(h))},get:function(){return X2.cssPrefix}});x2.FontAwesomeConfig=h;var p1=[];function E5(e){return p1.push(e),()=>{p1.splice(p1.indexOf(e),1)}}var C2=D3,s2={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function T5(e){if(!e||!h2)return;let c=w.createElement("style");c.setAttribute("type","text/css"),c.innerHTML=e;let l=w.head.childNodes,s=null;for(let a=l.length-1;a>-1;a--){let o=l[a],f=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(f)>-1&&(s=o)}return w.head.insertBefore(c,s),e}var D5="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function d1(){let e=12,c="";for(;e-- >0;)c+=D5[Math.random()*62|0];return c}function $2(e){let c=[];for(let l=(e||[]).length>>>0;l--;)c[l]=e[l];return c}function Q3(e){return e.classList?$2(e.classList):(e.getAttribute("class")||"").split(" ").filter(c=>c)}function d6(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function P5(e){return Object.keys(e||{}).reduce((c,l)=>c+"".concat(l,'="').concat(d6(e[l]),'" '),"").trim()}function Q1(e){return Object.keys(e||{}).reduce((c,l)=>c+"".concat(l,": ").concat(e[l].trim(),";"),"")}function Z3(e){return e.size!==s2.size||e.x!==s2.x||e.y!==s2.y||e.rotate!==s2.rotate||e.flipX||e.flipY}function F5(e){let{transform:c,containerWidth:l,iconWidth:s}=e,a={transform:"translate(".concat(l/2," 256)")},o="translate(".concat(c.x*32,", ").concat(c.y*32,") "),f="scale(".concat(c.size/16*(c.flipX?-1:1),", ").concat(c.size/16*(c.flipY?-1:1),") "),m="rotate(".concat(c.rotate," 0 0)"),p={transform:"".concat(o," ").concat(f," ").concat(m)},d={transform:"translate(".concat(s/2*-1," -256)")};return{outer:a,inner:p,path:d}}function I5(e){let{transform:c,width:l=D3,height:s=D3,startCentered:a=!1}=e,o="";return a&&t6?o+="translate(".concat(c.x/C2-l/2,"em, ").concat(c.y/C2-s/2,"em) "):a?o+="translate(calc(-50% + ".concat(c.x/C2,"em), calc(-50% + ").concat(c.y/C2,"em)) "):o+="translate(".concat(c.x/C2,"em, ").concat(c.y/C2,"em) "),o+="scale(".concat(c.size/C2*(c.flipX?-1:1),", ").concat(c.size/C2*(c.flipY?-1:1),") "),o+="rotate(".concat(c.rotate,"deg) "),o}var V5=`:root, :host {
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
}`;function h6(){let e=r6,c=f6,l=h.cssPrefix,s=h.replacementClass,a=V5;if(l!==e||s!==c){let o=new RegExp("\\.".concat(e,"\\-"),"g"),f=new RegExp("\\--".concat(e,"\\-"),"g"),m=new RegExp("\\.".concat(c),"g");a=a.replace(o,".".concat(l,"-")).replace(f,"--".concat(l,"-")).replace(m,".".concat(s))}return a}var O0=!1;function _3(){h.autoAddCss&&!O0&&(T5(h6()),O0=!0)}var O5={mixout(){return{dom:{css:h6,insertCss:_3}}},hooks(){return{beforeDOMElementCreation(){_3()},beforeI2svg(){_3()}}}},d2=x2||{};d2[L2]||(d2[L2]={});d2[L2].styles||(d2[L2].styles={});d2[L2].hooks||(d2[L2].hooks={});d2[L2].shims||(d2[L2].shims=[]);var n2=d2[L2],M6=[],C6=function(){w.removeEventListener("DOMContentLoaded",C6),$1=1,M6.map(e=>e())},$1=!1;h2&&($1=(w.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(w.readyState),$1||w.addEventListener("DOMContentLoaded",C6));function R5(e){h2&&($1?setTimeout(e,0):M6.push(e))}function M1(e){let{tag:c,attributes:l={},children:s=[]}=e;return typeof e=="string"?d6(e):"<".concat(c," ").concat(P5(l),">").concat(s.map(M1).join(""),"</").concat(c,">")}function R0(e,c,l){if(e&&e[c]&&e[c][l])return{prefix:c,iconName:l,icon:e[c][l]}}var H5=function(c,l){return function(s,a,o,f){return c.call(l,s,a,o,f)}},k3=function(c,l,s,a){var o=Object.keys(c),f=o.length,m=a!==void 0?H5(l,a):l,p,d,M;for(s===void 0?(p=1,M=c[o[0]]):(p=0,M=s);p<f;p++)d=o[p],M=m(M,c[d],d,c);return M};function B5(e){let c=[],l=0,s=e.length;for(;l<s;){let a=e.charCodeAt(l++);if(a>=55296&&a<=56319&&l<s){let o=e.charCodeAt(l++);(o&64512)==56320?c.push(((a&1023)<<10)+(o&1023)+65536):(c.push(a),l--)}else c.push(a)}return c}function O3(e){let c=B5(e);return c.length===1?c[0].toString(16):null}function U5(e,c){let l=e.length,s=e.charCodeAt(c),a;return s>=55296&&s<=56319&&l>c+1&&(a=e.charCodeAt(c+1),a>=56320&&a<=57343)?(s-55296)*1024+a-56320+65536:s}function H0(e){return Object.keys(e).reduce((c,l)=>{let s=e[l];return!!s.icon?c[s.iconName]=s.icon:c[l]=s,c},{})}function R3(e,c){let l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:s=!1}=l,a=H0(c);typeof n2.hooks.addPack=="function"&&!s?n2.hooks.addPack(e,H0(c)):n2.styles[e]=z(z({},n2.styles[e]||{}),a),e==="fas"&&R3("fa",c)}var{styles:A2,shims:G5}=n2,q5={[A]:Object.values(k2[A]),[j]:Object.values(k2[j]),[Y]:Object.values(k2[Y])},J3=null,g6={},x6={},N6={},v6={},y6={},W5={[A]:Object.keys(_2[A]),[j]:Object.keys(_2[j]),[Y]:Object.keys(_2[Y])};function j5(e){return~A5.indexOf(e)}function Y5(e,c){let l=c.split("-"),s=l[0],a=l.slice(1).join("-");return s===e&&a!==""&&!j5(a)?a:null}var b6=()=>{let e=s=>k3(A2,(a,o,f)=>(a[f]=k3(o,s,{}),a),{});g6=e((s,a,o)=>(a[3]&&(s[a[3]]=o),a[2]&&a[2].filter(m=>typeof m=="number").forEach(m=>{s[m.toString(16)]=o}),s)),x6=e((s,a,o)=>(s[o]=o,a[2]&&a[2].filter(m=>typeof m=="string").forEach(m=>{s[m]=o}),s)),y6=e((s,a,o)=>{let f=a[2];return s[o]=o,f.forEach(m=>{s[m]=o}),s});let c="far"in A2||h.autoFetchSvg,l=k3(G5,(s,a)=>{let o=a[0],f=a[1],m=a[2];return f==="far"&&!c&&(f="fas"),typeof o=="string"&&(s.names[o]={prefix:f,iconName:m}),typeof o=="number"&&(s.unicodes[o.toString(16)]={prefix:f,iconName:m}),s},{names:{},unicodes:{}});N6=l.names,v6=l.unicodes,J3=Z1(h.styleDefault,{family:h.familyDefault})};E5(e=>{J3=Z1(e.styleDefault,{family:h.familyDefault})});b6();function c4(e,c){return(g6[e]||{})[c]}function X5(e,c){return(x6[e]||{})[c]}function g2(e,c){return(y6[e]||{})[c]}function S6(e){return N6[e]||{prefix:null,iconName:null}}function $5(e){let c=v6[e],l=c4("fas",e);return c||(l?{prefix:"fas",iconName:l}:null)||{prefix:null,iconName:null}}function N2(){return J3}var e4=()=>({prefix:null,iconName:null,rest:[]});function Z1(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:l=A}=c,s=_2[l][e],a=L1[l][e]||L1[l][s],o=e in n2.styles?e:null;return a||o||null}var K5={[A]:Object.keys(k2[A]),[j]:Object.keys(k2[j]),[Y]:Object.keys(k2[Y])};function J1(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:l=!1}=c,s={[A]:"".concat(h.cssPrefix,"-").concat(A),[j]:"".concat(h.cssPrefix,"-").concat(j),[Y]:"".concat(h.cssPrefix,"-").concat(Y)},a=null,o=A,f=s5.filter(p=>p!==a6);f.forEach(p=>{(e.includes(s[p])||e.some(d=>K5[p].includes(d)))&&(o=p)});let m=e.reduce((p,d)=>{let M=Y5(h.cssPrefix,d);if(A2[d]?(d=q5[o].includes(d)?v5[o][d]:d,a=d,p.prefix=d):W5[o].indexOf(d)>-1?(a=d,p.prefix=Z1(d,{family:o})):M?p.iconName=M:d!==h.replacementClass&&!f.some(N=>d===s[N])&&p.rest.push(d),!l&&p.prefix&&p.iconName){let N=a==="fa"?S6(p.iconName):{},g=g2(p.prefix,p.iconName);N.prefix&&(a=null),p.iconName=N.iconName||g||p.iconName,p.prefix=N.prefix||p.prefix,p.prefix==="far"&&!A2.far&&A2.fas&&!h.autoFetchSvg&&(p.prefix="fas")}return p},e4());return(e.includes("fa-brands")||e.includes("fab"))&&(m.prefix="fab"),(e.includes("fa-duotone")||e.includes("fad"))&&(m.prefix="fad"),!m.prefix&&o===j&&(A2.fass||h.autoFetchSvg)&&(m.prefix="fass",m.iconName=g2(m.prefix,m.iconName)||m.iconName),!m.prefix&&o===Y&&(A2.fasds||h.autoFetchSvg)&&(m.prefix="fasds",m.iconName=g2(m.prefix,m.iconName)||m.iconName),(m.prefix==="fa"||a==="fa")&&(m.prefix=N2()||"fas"),m}var H3=class{constructor(){this.definitions={}}add(){for(var c=arguments.length,l=new Array(c),s=0;s<c;s++)l[s]=arguments[s];let a=l.reduce(this._pullDefinitions,{});Object.keys(a).forEach(o=>{this.definitions[o]=z(z({},this.definitions[o]||{}),a[o]),R3(o,a[o]);let f=k2[A][o];f&&R3(f,a[o]),b6()})}reset(){this.definitions={}}_pullDefinitions(c,l){let s=l.prefix&&l.iconName&&l.icon?{0:l}:l;return Object.keys(s).map(a=>{let{prefix:o,iconName:f,icon:m}=s[a],p=m[2];c[o]||(c[o]={}),p.length>0&&p.forEach(d=>{typeof d=="string"&&(c[o][d]=m)}),c[o][f]=m}),c}},B0=[],W2={},j2={},Q5=Object.keys(j2);function Z5(e,c){let{mixoutsTo:l}=c;return B0=e,W2={},Object.keys(j2).forEach(s=>{Q5.indexOf(s)===-1&&delete j2[s]}),B0.forEach(s=>{let a=s.mixout?s.mixout():{};if(Object.keys(a).forEach(o=>{typeof a[o]=="function"&&(l[o]=a[o]),typeof a[o]=="object"&&Object.keys(a[o]).forEach(f=>{l[o]||(l[o]={}),l[o][f]=a[o][f]})}),s.hooks){let o=s.hooks();Object.keys(o).forEach(f=>{W2[f]||(W2[f]=[]),W2[f].push(o[f])})}s.provides&&s.provides(j2)}),l}function B3(e,c){for(var l=arguments.length,s=new Array(l>2?l-2:0),a=2;a<l;a++)s[a-2]=arguments[a];return(W2[e]||[]).forEach(f=>{c=f.apply(null,[c,...s])}),c}function T2(e){for(var c=arguments.length,l=new Array(c>1?c-1:0),s=1;s<c;s++)l[s-1]=arguments[s];(W2[e]||[]).forEach(o=>{o.apply(null,l)})}function v2(){let e=arguments[0],c=Array.prototype.slice.call(arguments,1);return j2[e]?j2[e].apply(null,c):void 0}function U3(e){e.prefix==="fa"&&(e.prefix="fas");let{iconName:c}=e,l=e.prefix||N2();if(c)return c=g2(l,c)||c,R0(w6.definitions,l,c)||R0(n2.styles,l,c)}var w6=new H3,J5=()=>{h.autoReplaceSvg=!1,h.observeMutations=!1,T2("noAuto")},c7={i2svg:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return h2?(T2("beforeI2svg",e),v2("pseudoElements2svg",e),v2("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c}=e;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,R5(()=>{l7({autoReplaceSvgRoot:c}),T2("watch",e)})}},e7={icon:e=>{if(e===null)return null;if(typeof e=="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:g2(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){let c=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],l=Z1(e[0]);return{prefix:l,iconName:g2(l,c)||c}}if(typeof e=="string"&&(e.indexOf("".concat(h.cssPrefix,"-"))>-1||e.match(y5))){let c=J1(e.split(" "),{skipLookups:!0});return{prefix:c.prefix||N2(),iconName:g2(c.prefix,c.iconName)||c.iconName}}if(typeof e=="string"){let c=N2();return{prefix:c,iconName:g2(c,e)||e}}}},X={noAuto:J5,config:h,dom:c7,parse:e7,library:w6,findIconDefinition:U3,toHtml:M1},l7=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c=w}=e;(Object.keys(n2.styles).length>0||h.autoFetchSvg)&&h2&&h.autoReplaceSvg&&X.dom.i2svg({node:c})};function c3(e,c){return Object.defineProperty(e,"abstract",{get:c}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(l=>M1(l))}}),Object.defineProperty(e,"node",{get:function(){if(!h2)return;let l=w.createElement("div");return l.innerHTML=e.html,l.children}}),e}function s7(e){let{children:c,main:l,mask:s,attributes:a,styles:o,transform:f}=e;if(Z3(f)&&l.found&&!s.found){let{width:m,height:p}=l,d={x:m/p/2,y:.5};a.style=Q1(v(z({},o),{"transform-origin":"".concat(d.x+f.x/16,"em ").concat(d.y+f.y/16,"em")}))}return[{tag:"svg",attributes:a,children:c}]}function n7(e){let{prefix:c,iconName:l,children:s,attributes:a,symbol:o}=e,f=o===!0?"".concat(c,"-").concat(h.cssPrefix,"-").concat(l):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:v(z({},a),{id:f}),children:s}]}]}function l4(e){let{icons:{main:c,mask:l},prefix:s,iconName:a,transform:o,symbol:f,title:m,maskId:p,titleId:d,extra:M,watchable:N=!1}=e,{width:g,height:P}=l.found?l:c,E=s==="fak",J=[h.replacementClass,a?"".concat(h.cssPrefix,"-").concat(a):""].filter(Q=>M.classes.indexOf(Q)===-1).filter(Q=>Q!==""||!!Q).concat(M.classes).join(" "),W={children:[],attributes:v(z({},M.attributes),{"data-prefix":s,"data-icon":a,class:J,role:M.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(g," ").concat(P)})},_=E&&!~M.classes.indexOf("fa-fw")?{width:"".concat(g/P*16*.0625,"em")}:{};N&&(W.attributes[E2]=""),m&&(W.children.push({tag:"title",attributes:{id:W.attributes["aria-labelledby"]||"title-".concat(d||d1())},children:[m]}),delete W.attributes.title);let F=v(z({},W),{prefix:s,iconName:a,main:c,mask:l,maskId:p,transform:o,symbol:f,styles:z(z({},_),M.styles)}),{children:R,attributes:a2}=l.found&&c.found?v2("generateAbstractMask",F)||{children:[],attributes:{}}:v2("generateAbstractIcon",F)||{children:[],attributes:{}};return F.children=R,F.attributes=a2,f?n7(F):s7(F)}function U0(e){let{content:c,width:l,height:s,transform:a,title:o,extra:f,watchable:m=!1}=e,p=v(z(z({},f.attributes),o?{title:o}:{}),{class:f.classes.join(" ")});m&&(p[E2]="");let d=z({},f.styles);Z3(a)&&(d.transform=I5({transform:a,startCentered:!0,width:l,height:s}),d["-webkit-transform"]=d.transform);let M=Q1(d);M.length>0&&(p.style=M);let N=[];return N.push({tag:"span",attributes:p,children:[c]}),o&&N.push({tag:"span",attributes:{class:"sr-only"},children:[o]}),N}function t7(e){let{content:c,title:l,extra:s}=e,a=v(z(z({},s.attributes),l?{title:l}:{}),{class:s.classes.join(" ")}),o=Q1(s.styles);o.length>0&&(a.style=o);let f=[];return f.push({tag:"span",attributes:a,children:[c]}),l&&f.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),f}var{styles:E3}=n2;function G3(e){let c=e[0],l=e[1],[s]=e.slice(4),a=null;return Array.isArray(s)?a={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(A3.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(A3.SECONDARY),fill:"currentColor",d:s[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(A3.PRIMARY),fill:"currentColor",d:s[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:s}},{found:!0,width:c,height:l,icon:a}}var a7={found:!1,width:512,height:512};function i7(e,c){!m6&&!h.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(c,'" is missing.'))}function q3(e,c){let l=c;return c==="fa"&&h.styleDefault!==null&&(c=N2()),new Promise((s,a)=>{if(l==="fa"){let o=S6(e)||{};e=o.iconName||e,c=o.prefix||c}if(e&&c&&E3[c]&&E3[c][e]){let o=E3[c][e];return s(G3(o))}i7(e,c),s(v(z({},a7),{icon:h.showMissingIcons&&e?v2("missingIconAbstract")||{}:{}}))})}var G0=()=>{},W3=h.measurePerformance&&j1&&j1.mark&&j1.measure?j1:{mark:G0,measure:G0},u1='FA "6.6.0"',o7=e=>(W3.mark("".concat(u1," ").concat(e," begins")),()=>A6(e)),A6=e=>{W3.mark("".concat(u1," ").concat(e," ends")),W3.measure("".concat(u1," ").concat(e),"".concat(u1," ").concat(e," begins"),"".concat(u1," ").concat(e," ends"))},s4={begin:o7,end:A6},Y1=()=>{};function q0(e){return typeof(e.getAttribute?e.getAttribute(E2):null)=="string"}function r7(e){let c=e.getAttribute?e.getAttribute($3):null,l=e.getAttribute?e.getAttribute(K3):null;return c&&l}function f7(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(h.replacementClass)}function m7(){return h.autoReplaceSvg===!0?X1.replace:X1[h.autoReplaceSvg]||X1.replace}function u7(e){return w.createElementNS("http://www.w3.org/2000/svg",e)}function z7(e){return w.createElement(e)}function _6(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:l=e.tag==="svg"?u7:z7}=c;if(typeof e=="string")return w.createTextNode(e);let s=l(e.tag);return Object.keys(e.attributes||[]).forEach(function(o){s.setAttribute(o,e.attributes[o])}),(e.children||[]).forEach(function(o){s.appendChild(_6(o,{ceFn:l}))}),s}function p7(e){let c=" ".concat(e.outerHTML," ");return c="".concat(c,"Font Awesome fontawesome.com "),c}var X1={replace:function(e){let c=e[0];if(c.parentNode)if(e[1].forEach(l=>{c.parentNode.insertBefore(_6(l),c)}),c.getAttribute(E2)===null&&h.keepOriginalSource){let l=w.createComment(p7(c));c.parentNode.replaceChild(l,c)}else c.remove()},nest:function(e){let c=e[0],l=e[1];if(~Q3(c).indexOf(h.replacementClass))return X1.replace(e);let s=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete l[0].attributes.id,l[0].attributes.class){let o=l[0].attributes.class.split(" ").reduce((f,m)=>(m===h.replacementClass||m.match(s)?f.toSvg.push(m):f.toNode.push(m),f),{toNode:[],toSvg:[]});l[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?c.removeAttribute("class"):c.setAttribute("class",o.toNode.join(" "))}let a=l.map(o=>M1(o)).join(`
`);c.setAttribute(E2,""),c.innerHTML=a}};function W0(e){e()}function k6(e,c){let l=typeof c=="function"?c:Y1;if(e.length===0)l();else{let s=W0;h.mutateApproach===x5&&(s=x2.requestAnimationFrame||W0),s(()=>{let a=m7(),o=s4.begin("mutate");e.map(a),o(),l()})}}var n4=!1;function E6(){n4=!0}function j3(){n4=!1}var K1=null;function j0(e){if(!P0||!h.observeMutations)return;let{treeCallback:c=Y1,nodeCallback:l=Y1,pseudoElementsCallback:s=Y1,observeMutationsRoot:a=w}=e;K1=new P0(o=>{if(n4)return;let f=N2();$2(o).forEach(m=>{if(m.type==="childList"&&m.addedNodes.length>0&&!q0(m.addedNodes[0])&&(h.searchPseudoElements&&s(m.target),c(m.target)),m.type==="attributes"&&m.target.parentNode&&h.searchPseudoElements&&s(m.target.parentNode),m.type==="attributes"&&q0(m.target)&&~w5.indexOf(m.attributeName))if(m.attributeName==="class"&&r7(m.target)){let{prefix:p,iconName:d}=J1(Q3(m.target));m.target.setAttribute($3,p||f),d&&m.target.setAttribute(K3,d)}else f7(m.target)&&l(m.target)})}),h2&&K1.observe(a,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function L7(){K1&&K1.disconnect()}function d7(e){let c=e.getAttribute("style"),l=[];return c&&(l=c.split(";").reduce((s,a)=>{let o=a.split(":"),f=o[0],m=o.slice(1);return f&&m.length>0&&(s[f]=m.join(":").trim()),s},{})),l}function h7(e){let c=e.getAttribute("data-prefix"),l=e.getAttribute("data-icon"),s=e.innerText!==void 0?e.innerText.trim():"",a=J1(Q3(e));return a.prefix||(a.prefix=N2()),c&&l&&(a.prefix=c,a.iconName=l),a.iconName&&a.prefix||(a.prefix&&s.length>0&&(a.iconName=X5(a.prefix,e.innerText)||c4(a.prefix,O3(e.innerText))),!a.iconName&&h.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(a.iconName=e.firstChild.data)),a}function M7(e){let c=$2(e.attributes).reduce((a,o)=>(a.name!=="class"&&a.name!=="style"&&(a[o.name]=o.value),a),{}),l=e.getAttribute("title"),s=e.getAttribute("data-fa-title-id");return h.autoA11y&&(l?c["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(s||d1()):(c["aria-hidden"]="true",c.focusable="false")),c}function C7(){return{iconName:null,title:null,titleId:null,prefix:null,transform:s2,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Y0(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:l,prefix:s,rest:a}=h7(e),o=M7(e),f=B3("parseNodeAttributes",{},e),m=c.styleParser?d7(e):[];return z({iconName:l,title:e.getAttribute("title"),titleId:e.getAttribute("data-fa-title-id"),prefix:s,transform:s2,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:m,attributes:o}},f)}var{styles:g7}=n2;function T6(e){let c=h.autoReplaceSvg==="nest"?Y0(e,{styleParser:!1}):Y0(e);return~c.extra.classes.indexOf(p6)?v2("generateLayersText",e,c):v2("generateSvgReplacementMutation",e,c)}var t2=new Set;u6.map(e=>{t2.add("fa-".concat(e))});Object.keys(_2[A]).map(t2.add.bind(t2));Object.keys(_2[j]).map(t2.add.bind(t2));Object.keys(_2[Y]).map(t2.add.bind(t2));t2=[...t2];function X0(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!h2)return Promise.resolve();let l=w.documentElement.classList,s=M=>l.add("".concat(V0,"-").concat(M)),a=M=>l.remove("".concat(V0,"-").concat(M)),o=h.autoFetchSvg?t2:u6.map(M=>"fa-".concat(M)).concat(Object.keys(g7));o.includes("fa")||o.push("fa");let f=[".".concat(p6,":not([").concat(E2,"])")].concat(o.map(M=>".".concat(M,":not([").concat(E2,"])"))).join(", ");if(f.length===0)return Promise.resolve();let m=[];try{m=$2(e.querySelectorAll(f))}catch{}if(m.length>0)s("pending"),a("complete");else return Promise.resolve();let p=s4.begin("onTree"),d=m.reduce((M,N)=>{try{let g=T6(N);g&&M.push(g)}catch(g){m6||g.name==="MissingIcon"&&console.error(g)}return M},[]);return new Promise((M,N)=>{Promise.all(d).then(g=>{k6(g,()=>{s("active"),s("complete"),a("pending"),typeof c=="function"&&c(),p(),M()})}).catch(g=>{p(),N(g)})})}function x7(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;T6(e).then(l=>{l&&k6([l],c)})}function N7(e){return function(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=(c||{}).icon?c:U3(c||{}),{mask:a}=l;return a&&(a=(a||{}).icon?a:U3(a||{})),e(s,v(z({},l),{mask:a}))}}var v7=function(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=s2,symbol:s=!1,mask:a=null,maskId:o=null,title:f=null,titleId:m=null,classes:p=[],attributes:d={},styles:M={}}=c;if(!e)return;let{prefix:N,iconName:g,icon:P}=e;return c3(z({type:"icon"},e),()=>(T2("beforeDOMElementCreation",{iconDefinition:e,params:c}),h.autoA11y&&(f?d["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(m||d1()):(d["aria-hidden"]="true",d.focusable="false")),l4({icons:{main:G3(P),mask:a?G3(a.icon):{found:!1,width:null,height:null,icon:{}}},prefix:N,iconName:g,transform:z(z({},s2),l),symbol:s,title:f,maskId:o,titleId:m,extra:{attributes:d,styles:M,classes:p}})))},y7={mixout(){return{icon:N7(v7)}},hooks(){return{mutationObserverCallbacks(e){return e.treeCallback=X0,e.nodeCallback=x7,e}}},provides(e){e.i2svg=function(c){let{node:l=w,callback:s=()=>{}}=c;return X0(l,s)},e.generateSvgReplacementMutation=function(c,l){let{iconName:s,title:a,titleId:o,prefix:f,transform:m,symbol:p,mask:d,maskId:M,extra:N}=l;return new Promise((g,P)=>{Promise.all([q3(s,f),d.iconName?q3(d.iconName,d.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(E=>{let[J,W]=E;g([c,l4({icons:{main:J,mask:W},prefix:f,iconName:s,transform:m,symbol:p,maskId:M,title:a,titleId:o,extra:N,watchable:!0})])}).catch(P)})},e.generateAbstractIcon=function(c){let{children:l,attributes:s,main:a,transform:o,styles:f}=c,m=Q1(f);m.length>0&&(s.style=m);let p;return Z3(o)&&(p=v2("generateAbstractTransformGrouping",{main:a,transform:o,containerWidth:a.width,iconWidth:a.width})),l.push(p||a.icon),{children:l,attributes:s}}}},b7={mixout(){return{layer(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:l=[]}=c;return c3({type:"layer"},()=>{T2("beforeDOMElementCreation",{assembler:e,params:c});let s=[];return e(a=>{Array.isArray(a)?a.map(o=>{s=s.concat(o.abstract)}):s=s.concat(a.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers"),...l].join(" ")},children:s}]})}}}},S7={mixout(){return{counter(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:l=null,classes:s=[],attributes:a={},styles:o={}}=c;return c3({type:"counter",content:e},()=>(T2("beforeDOMElementCreation",{content:e,params:c}),t7({content:e.toString(),title:l,extra:{attributes:a,styles:o,classes:["".concat(h.cssPrefix,"-layers-counter"),...s]}})))}}}},w7={mixout(){return{text(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=s2,title:s=null,classes:a=[],attributes:o={},styles:f={}}=c;return c3({type:"text",content:e},()=>(T2("beforeDOMElementCreation",{content:e,params:c}),U0({content:e,transform:z(z({},s2),l),title:s,extra:{attributes:o,styles:f,classes:["".concat(h.cssPrefix,"-layers-text"),...a]}})))}}},provides(e){e.generateLayersText=function(c,l){let{title:s,transform:a,extra:o}=l,f=null,m=null;if(t6){let p=parseInt(getComputedStyle(c).fontSize,10),d=c.getBoundingClientRect();f=d.width/p,m=d.height/p}return h.autoA11y&&!s&&(o.attributes["aria-hidden"]="true"),Promise.resolve([c,U0({content:c.innerHTML,width:f,height:m,transform:a,title:s,extra:o,watchable:!0})])}}},A7=new RegExp('"',"ug"),$0=[1105920,1112319],K0=z(z(z({FontAwesome:{normal:"fas",400:"fas"}},r5),o5),h5),Y3=Object.keys(K0).reduce((e,c)=>(e[c.toLowerCase()]=K0[c],e),{}),_7=Object.keys(Y3).reduce((e,c)=>{let l=Y3[c];return e[c]=l[900]||[...Object.entries(l)][0][1],e},{});function k7(e){let c=e.replace(A7,""),l=U5(c,0),s=l>=$0[0]&&l<=$0[1],a=c.length===2?c[0]===c[1]:!1;return{value:O3(a?c[0]:c),isSecondary:s||a}}function E7(e,c){let l=e.replace(/^['"]|['"]$/g,"").toLowerCase(),s=parseInt(c),a=isNaN(s)?"normal":s;return(Y3[l]||{})[a]||_7[l]}function Q0(e,c){let l="".concat(g5).concat(c.replace(":","-"));return new Promise((s,a)=>{if(e.getAttribute(l)!==null)return s();let f=$2(e.children).filter(g=>g.getAttribute(P3)===c)[0],m=x2.getComputedStyle(e,c),p=m.getPropertyValue("font-family"),d=p.match(b5),M=m.getPropertyValue("font-weight"),N=m.getPropertyValue("content");if(f&&!d)return e.removeChild(f),s();if(d&&N!=="none"&&N!==""){let g=m.getPropertyValue("content"),P=E7(p,M),{value:E,isSecondary:J}=k7(g),W=d[0].startsWith("FontAwesome"),_=c4(P,E),F=_;if(W){let R=$5(E);R.iconName&&R.prefix&&(_=R.iconName,P=R.prefix)}if(_&&!J&&(!f||f.getAttribute($3)!==P||f.getAttribute(K3)!==F)){e.setAttribute(l,F),f&&e.removeChild(f);let R=C7(),{extra:a2}=R;a2.attributes[P3]=c,q3(_,P).then(Q=>{let D2=l4(v(z({},R),{icons:{main:Q,mask:e4()},prefix:P,iconName:F,extra:a2,watchable:!0})),P2=w.createElementNS("http://www.w3.org/2000/svg","svg");c==="::before"?e.insertBefore(P2,e.firstChild):e.appendChild(P2),P2.outerHTML=D2.map(i2=>M1(i2)).join(`
`),e.removeAttribute(l),s()}).catch(a)}else s()}else s()})}function T7(e){return Promise.all([Q0(e,"::before"),Q0(e,"::after")])}function D7(e){return e.parentNode!==document.head&&!~N5.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(P3)&&(!e.parentNode||e.parentNode.tagName!=="svg")}function Z0(e){if(h2)return new Promise((c,l)=>{let s=$2(e.querySelectorAll("*")).filter(D7).map(T7),a=s4.begin("searchPseudoElements");E6(),Promise.all(s).then(()=>{a(),j3(),c()}).catch(()=>{a(),j3(),l()})})}var P7={hooks(){return{mutationObserverCallbacks(e){return e.pseudoElementsCallback=Z0,e}}},provides(e){e.pseudoElements2svg=function(c){let{node:l=w}=c;h.searchPseudoElements&&Z0(l)}}},J0=!1,F7={mixout(){return{dom:{unwatch(){E6(),J0=!0}}}},hooks(){return{bootstrap(){j0(B3("mutationObserverCallbacks",{}))},noAuto(){L7()},watch(e){let{observeMutationsRoot:c}=e;J0?j3():j0(B3("mutationObserverCallbacks",{observeMutationsRoot:c}))}}}},c6=e=>{let c={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce((l,s)=>{let a=s.toLowerCase().split("-"),o=a[0],f=a.slice(1).join("-");if(o&&f==="h")return l.flipX=!0,l;if(o&&f==="v")return l.flipY=!0,l;if(f=parseFloat(f),isNaN(f))return l;switch(o){case"grow":l.size=l.size+f;break;case"shrink":l.size=l.size-f;break;case"left":l.x=l.x-f;break;case"right":l.x=l.x+f;break;case"up":l.y=l.y-f;break;case"down":l.y=l.y+f;break;case"rotate":l.rotate=l.rotate+f;break}return l},c)},I7={mixout(){return{parse:{transform:e=>c6(e)}}},hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-transform");return l&&(e.transform=c6(l)),e}}},provides(e){e.generateAbstractTransformGrouping=function(c){let{main:l,transform:s,containerWidth:a,iconWidth:o}=c,f={transform:"translate(".concat(a/2," 256)")},m="translate(".concat(s.x*32,", ").concat(s.y*32,") "),p="scale(".concat(s.size/16*(s.flipX?-1:1),", ").concat(s.size/16*(s.flipY?-1:1),") "),d="rotate(".concat(s.rotate," 0 0)"),M={transform:"".concat(m," ").concat(p," ").concat(d)},N={transform:"translate(".concat(o/2*-1," -256)")},g={outer:f,inner:M,path:N};return{tag:"g",attributes:z({},g.outer),children:[{tag:"g",attributes:z({},g.inner),children:[{tag:l.icon.tag,children:l.icon.children,attributes:z(z({},l.icon.attributes),g.path)}]}]}}}},T3={x:0,y:0,width:"100%",height:"100%"};function e6(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||c)&&(e.attributes.fill="black"),e}function V7(e){return e.tag==="g"?e.children:[e]}var O7={hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-mask"),s=l?J1(l.split(" ").map(a=>a.trim())):e4();return s.prefix||(s.prefix=N2()),e.mask=s,e.maskId=c.getAttribute("data-fa-mask-id"),e}}},provides(e){e.generateAbstractMask=function(c){let{children:l,attributes:s,main:a,mask:o,maskId:f,transform:m}=c,{width:p,icon:d}=a,{width:M,icon:N}=o,g=F5({transform:m,containerWidth:M,iconWidth:p}),P={tag:"rect",attributes:v(z({},T3),{fill:"white"})},E=d.children?{children:d.children.map(e6)}:{},J={tag:"g",attributes:z({},g.inner),children:[e6(z({tag:d.tag,attributes:z(z({},d.attributes),g.path)},E))]},W={tag:"g",attributes:z({},g.outer),children:[J]},_="mask-".concat(f||d1()),F="clip-".concat(f||d1()),R={tag:"mask",attributes:v(z({},T3),{id:_,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[P,W]},a2={tag:"defs",children:[{tag:"clipPath",attributes:{id:F},children:V7(N)},R]};return l.push(a2,{tag:"rect",attributes:z({fill:"currentColor","clip-path":"url(#".concat(F,")"),mask:"url(#".concat(_,")")},T3)}),{children:l,attributes:s}}}},R7={provides(e){let c=!1;x2.matchMedia&&(c=x2.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){let l=[],s={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};l.push({tag:"path",attributes:v(z({},s),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let o=v(z({},a),{attributeName:"opacity"}),f={tag:"circle",attributes:v(z({},s),{cx:"256",cy:"364",r:"28"}),children:[]};return c||f.children.push({tag:"animate",attributes:v(z({},a),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:v(z({},o),{values:"1;0;1;1;0;1;"})}),l.push(f),l.push({tag:"path",attributes:v(z({},s),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:c?[]:[{tag:"animate",attributes:v(z({},o),{values:"1;0;0;0;0;1;"})}]}),c||l.push({tag:"path",attributes:v(z({},s),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:v(z({},o),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:l}}}},H7={hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-symbol"),s=l===null?!1:l===""?!0:l;return e.symbol=s,e}}}},B7=[O5,y7,b7,S7,w7,P7,F7,I7,O7,R7,H7];Z5(B7,{mixoutsTo:X});var Dc=X.noAuto,U7=X.config,Pc=X.library,G7=X.dom,q7=X.parse,Fc=X.findIconDefinition,Ic=X.toHtml,W7=X.icon,Vc=X.layer,j7=X.text,Y7=X.counter;var D6=(()=>{let c=class c{};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({});let e=c;return e})();var t4=class extends j4{override={swipe:{direction:Hammer.DIRECTION_ALL}}},e3=class e{static \u0275fac=function(l){return new(l||e)};static \u0275mod=u2({type:e,bootstrap:[W1]});static \u0275inj=m2({providers:[{provide:W4,useClass:t4}],imports:[q4,q1,D6,d0,Y4]})};G4().bootstrapModule(e3,{ngZoneEventCoalescing:!0}).catch(e=>console.error(e));
