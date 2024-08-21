import{$ as H4,A as L3,C as p3,D as g,E as y,F as V,G as k4,H as b,I as H,J as S,K as E4,M as T4,N as D4,O as P4,P as d3,Q as F4,R as I4,S as V4,T as D1,U as S2,V as h3,X as O4,Z as R4,_ as B4,a as z,aa as U4,b as v,ba as G4,c as u8,ca as q4,d as z8,da as W4,e as b4,ea as j4,f as S4,fa as M3,g as w4,h as A4,i as m3,j as m2,k as I2,l as c1,m as u2,n as b2,o as u3,p as G,q,r as z3,s as _1,t as k1,u as e1,v as I,w as E1,x as T1,y as V2,z as _4}from"./chunk-QW73LVRX.js";var Y4=u8((W7,P1)=>{"use strict";(function(e,c,l,s){"use strict";var a=["","webkit","Moz","MS","ms","o"],o=c.createElement("div"),f="function",m=Math.round,L=Math.abs,d=Date.now;function M(n,t,i){return setTimeout(P(n,i),t)}function N(n,t,i){return Array.isArray(n)?(C(n,i[t],i),!0):!1}function C(n,t,i){var r;if(n)if(n.forEach)n.forEach(t,i);else if(n.length!==s)for(r=0;r<n.length;)t.call(i,n[r],r,n),r++;else for(r in n)n.hasOwnProperty(r)&&t.call(i,n[r],r,n)}function D(n,t,i){var r="DEPRECATED METHOD: "+t+`
`+i+` AT 
`;return function(){var u=new Error("get-stack-trace"),p=u&&u.stack?u.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",x=e.console&&(e.console.warn||e.console.log);return x&&x.call(e.console,r,p),n.apply(this,arguments)}}var E;typeof Object.assign!="function"?E=function(t){if(t===s||t===null)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),r=1;r<arguments.length;r++){var u=arguments[r];if(u!==s&&u!==null)for(var p in u)u.hasOwnProperty(p)&&(i[p]=u[p])}return i}:E=Object.assign;var J=D(function(t,i,r){for(var u=Object.keys(i),p=0;p<u.length;)(!r||r&&t[u[p]]===s)&&(t[u[p]]=i[u[p]]),p++;return t},"extend","Use `assign`."),W=D(function(t,i){return J(t,i,!0)},"merge","Use `assign`.");function _(n,t,i){var r=t.prototype,u;u=n.prototype=Object.create(r),u.constructor=n,u._super=r,i&&E(u,i)}function P(n,t){return function(){return n.apply(t,arguments)}}function O(n,t){return typeof n==f?n.apply(t&&t[0]||s,t):n}function a2(n,t){return n===s?t:n}function Q(n,t,i){C(d1(t),function(r){n.addEventListener(r,i,!1)})}function T2(n,t,i){C(d1(t),function(r){n.removeEventListener(r,i,!1)})}function D2(n,t){for(;n;){if(n==t)return!0;n=n.parentNode}return!1}function i2(n,t){return n.indexOf(t)>-1}function d1(n){return n.trim().split(/\s+/g)}function P2(n,t,i){if(n.indexOf&&!i)return n.indexOf(t);for(var r=0;r<n.length;){if(i&&n[r][i]==t||!i&&n[r]===t)return r;r++}return-1}function h1(n){return Array.prototype.slice.call(n,0)}function s4(n,t,i){for(var r=[],u=[],p=0;p<n.length;){var x=t?n[p][t]:n[p];P2(u,x)<0&&r.push(n[p]),u[p]=x,p++}return i&&(t?r=r.sort(function(F,B){return F[t]>B[t]}):r=r.sort()),r}function M1(n,t){for(var i,r,u=t[0].toUpperCase()+t.slice(1),p=0;p<a.length;){if(i=a[p],r=i?i+u:t,r in n)return r;p++}return s}var E6=1;function T6(){return E6++}function n4(n){var t=n.ownerDocument||n;return t.defaultView||t.parentWindow||e}var D6=/mobile|tablet|ip(ad|hone|od)|android/i,t4="ontouchstart"in e,P6=M1(e,"PointerEvent")!==s,F6=t4&&D6.test(navigator.userAgent),j2="touch",I6="pen",c3="mouse",V6="kinect",O6=25,R=1,N2=2,k=4,U=8,C1=1,Y2=2,X2=4,$2=8,K2=16,c2=Y2|X2,v2=$2|K2,a4=c2|v2,i4=["x","y"],g1=["clientX","clientY"];function $(n,t){var i=this;this.manager=n,this.callback=t,this.element=n.element,this.target=n.options.inputTarget,this.domHandler=function(r){O(n.options.enable,[n])&&i.handler(r)},this.init()}$.prototype={handler:function(){},init:function(){this.evEl&&Q(this.element,this.evEl,this.domHandler),this.evTarget&&Q(this.target,this.evTarget,this.domHandler),this.evWin&&Q(n4(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&T2(this.element,this.evEl,this.domHandler),this.evTarget&&T2(this.target,this.evTarget,this.domHandler),this.evWin&&T2(n4(this.element),this.evWin,this.domHandler)}};function R6(n){var t,i=n.options.inputClass;return i?t=i:P6?t=l3:F6?t=v1:t4?t=s3:t=N1,new t(n,B6)}function B6(n,t,i){var r=i.pointers.length,u=i.changedPointers.length,p=t&R&&r-u===0,x=t&(k|U)&&r-u===0;i.isFirst=!!p,i.isFinal=!!x,p&&(n.session={}),i.eventType=t,H6(n,i),n.emit("hammer.input",i),n.recognize(i),n.session.prevInput=i}function H6(n,t){var i=n.session,r=t.pointers,u=r.length;i.firstInput||(i.firstInput=o4(t)),u>1&&!i.firstMultiple?i.firstMultiple=o4(t):u===1&&(i.firstMultiple=!1);var p=i.firstInput,x=i.firstMultiple,T=x?x.center:p.center,F=t.center=r4(r);t.timeStamp=d(),t.deltaTime=t.timeStamp-p.timeStamp,t.angle=e3(T,F),t.distance=x1(T,F),U6(i,t),t.offsetDirection=m4(t.deltaX,t.deltaY);var B=f4(t.deltaTime,t.deltaX,t.deltaY);t.overallVelocityX=B.x,t.overallVelocityY=B.y,t.overallVelocity=L(B.x)>L(B.y)?B.x:B.y,t.scale=x?W6(x.pointers,r):1,t.rotation=x?q6(x.pointers,r):0,t.maxPointers=i.prevInput?t.pointers.length>i.prevInput.maxPointers?t.pointers.length:i.prevInput.maxPointers:t.pointers.length,G6(i,t);var l2=n.element;D2(t.srcEvent.target,l2)&&(l2=t.srcEvent.target),t.target=l2}function U6(n,t){var i=t.center,r=n.offsetDelta||{},u=n.prevDelta||{},p=n.prevInput||{};(t.eventType===R||p.eventType===k)&&(u=n.prevDelta={x:p.deltaX||0,y:p.deltaY||0},r=n.offsetDelta={x:i.x,y:i.y}),t.deltaX=u.x+(i.x-r.x),t.deltaY=u.y+(i.y-r.y)}function G6(n,t){var i=n.lastInterval||t,r=t.timeStamp-i.timeStamp,u,p,x,T;if(t.eventType!=U&&(r>O6||i.velocity===s)){var F=t.deltaX-i.deltaX,B=t.deltaY-i.deltaY,l2=f4(r,F,B);p=l2.x,x=l2.y,u=L(l2.x)>L(l2.y)?l2.x:l2.y,T=m4(F,B),n.lastInterval=t}else u=i.velocity,p=i.velocityX,x=i.velocityY,T=i.direction;t.velocity=u,t.velocityX=p,t.velocityY=x,t.direction=T}function o4(n){for(var t=[],i=0;i<n.pointers.length;)t[i]={clientX:m(n.pointers[i].clientX),clientY:m(n.pointers[i].clientY)},i++;return{timeStamp:d(),pointers:t,center:r4(t),deltaX:n.deltaX,deltaY:n.deltaY}}function r4(n){var t=n.length;if(t===1)return{x:m(n[0].clientX),y:m(n[0].clientY)};for(var i=0,r=0,u=0;u<t;)i+=n[u].clientX,r+=n[u].clientY,u++;return{x:m(i/t),y:m(r/t)}}function f4(n,t,i){return{x:t/n||0,y:i/n||0}}function m4(n,t){return n===t?C1:L(n)>=L(t)?n<0?Y2:X2:t<0?$2:K2}function x1(n,t,i){i||(i=i4);var r=t[i[0]]-n[i[0]],u=t[i[1]]-n[i[1]];return Math.sqrt(r*r+u*u)}function e3(n,t,i){i||(i=i4);var r=t[i[0]]-n[i[0]],u=t[i[1]]-n[i[1]];return Math.atan2(u,r)*180/Math.PI}function q6(n,t){return e3(t[1],t[0],g1)+e3(n[1],n[0],g1)}function W6(n,t){return x1(t[0],t[1],g1)/x1(n[0],n[1],g1)}var j6={mousedown:R,mousemove:N2,mouseup:k},Y6="mousedown",X6="mousemove mouseup";function N1(){this.evEl=Y6,this.evWin=X6,this.pressed=!1,$.apply(this,arguments)}_(N1,$,{handler:function(t){var i=j6[t.type];i&R&&t.button===0&&(this.pressed=!0),i&N2&&t.which!==1&&(i=k),this.pressed&&(i&k&&(this.pressed=!1),this.callback(this.manager,i,{pointers:[t],changedPointers:[t],pointerType:c3,srcEvent:t}))}});var $6={pointerdown:R,pointermove:N2,pointerup:k,pointercancel:U,pointerout:U},K6={2:j2,3:I6,4:c3,5:V6},u4="pointerdown",z4="pointermove pointerup pointercancel";e.MSPointerEvent&&!e.PointerEvent&&(u4="MSPointerDown",z4="MSPointerMove MSPointerUp MSPointerCancel");function l3(){this.evEl=u4,this.evWin=z4,$.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}_(l3,$,{handler:function(t){var i=this.store,r=!1,u=t.type.toLowerCase().replace("ms",""),p=$6[u],x=K6[t.pointerType]||t.pointerType,T=x==j2,F=P2(i,t.pointerId,"pointerId");p&R&&(t.button===0||T)?F<0&&(i.push(t),F=i.length-1):p&(k|U)&&(r=!0),!(F<0)&&(i[F]=t,this.callback(this.manager,p,{pointers:i,changedPointers:[t],pointerType:x,srcEvent:t}),r&&i.splice(F,1))}});var Q6={touchstart:R,touchmove:N2,touchend:k,touchcancel:U},Z6="touchstart",J6="touchstart touchmove touchend touchcancel";function L4(){this.evTarget=Z6,this.evWin=J6,this.started=!1,$.apply(this,arguments)}_(L4,$,{handler:function(t){var i=Q6[t.type];if(i===R&&(this.started=!0),!!this.started){var r=c8.call(this,t,i);i&(k|U)&&r[0].length-r[1].length===0&&(this.started=!1),this.callback(this.manager,i,{pointers:r[0],changedPointers:r[1],pointerType:j2,srcEvent:t})}}});function c8(n,t){var i=h1(n.touches),r=h1(n.changedTouches);return t&(k|U)&&(i=s4(i.concat(r),"identifier",!0)),[i,r]}var e8={touchstart:R,touchmove:N2,touchend:k,touchcancel:U},l8="touchstart touchmove touchend touchcancel";function v1(){this.evTarget=l8,this.targetIds={},$.apply(this,arguments)}_(v1,$,{handler:function(t){var i=e8[t.type],r=s8.call(this,t,i);r&&this.callback(this.manager,i,{pointers:r[0],changedPointers:r[1],pointerType:j2,srcEvent:t})}});function s8(n,t){var i=h1(n.touches),r=this.targetIds;if(t&(R|N2)&&i.length===1)return r[i[0].identifier]=!0,[i,i];var u,p,x=h1(n.changedTouches),T=[],F=this.target;if(p=i.filter(function(B){return D2(B.target,F)}),t===R)for(u=0;u<p.length;)r[p[u].identifier]=!0,u++;for(u=0;u<x.length;)r[x[u].identifier]&&T.push(x[u]),t&(k|U)&&delete r[x[u].identifier],u++;if(T.length)return[s4(p.concat(T),"identifier",!0),T]}var n8=2500,p4=25;function s3(){$.apply(this,arguments);var n=P(this.handler,this);this.touch=new v1(this.manager,n),this.mouse=new N1(this.manager,n),this.primaryTouch=null,this.lastTouches=[]}_(s3,$,{handler:function(t,i,r){var u=r.pointerType==j2,p=r.pointerType==c3;if(!(p&&r.sourceCapabilities&&r.sourceCapabilities.firesTouchEvents)){if(u)t8.call(this,i,r);else if(p&&a8.call(this,r))return;this.callback(t,i,r)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function t8(n,t){n&R?(this.primaryTouch=t.changedPointers[0].identifier,d4.call(this,t)):n&(k|U)&&d4.call(this,t)}function d4(n){var t=n.changedPointers[0];if(t.identifier===this.primaryTouch){var i={x:t.clientX,y:t.clientY};this.lastTouches.push(i);var r=this.lastTouches,u=function(){var p=r.indexOf(i);p>-1&&r.splice(p,1)};setTimeout(u,n8)}}function a8(n){for(var t=n.srcEvent.clientX,i=n.srcEvent.clientY,r=0;r<this.lastTouches.length;r++){var u=this.lastTouches[r],p=Math.abs(t-u.x),x=Math.abs(i-u.y);if(p<=p4&&x<=p4)return!0}return!1}var h4=M1(o.style,"touchAction"),M4=h4!==s,C4="compute",g4="auto",n3="manipulation",y2="none",Q2="pan-x",Z2="pan-y",y1=o8();function t3(n,t){this.manager=n,this.set(t)}t3.prototype={set:function(n){n==C4&&(n=this.compute()),M4&&this.manager.element.style&&y1[n]&&(this.manager.element.style[h4]=n),this.actions=n.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var n=[];return C(this.manager.recognizers,function(t){O(t.options.enable,[t])&&(n=n.concat(t.getTouchAction()))}),i8(n.join(" "))},preventDefaults:function(n){var t=n.srcEvent,i=n.offsetDirection;if(this.manager.session.prevented){t.preventDefault();return}var r=this.actions,u=i2(r,y2)&&!y1[y2],p=i2(r,Z2)&&!y1[Z2],x=i2(r,Q2)&&!y1[Q2];if(u){var T=n.pointers.length===1,F=n.distance<2,B=n.deltaTime<250;if(T&&F&&B)return}if(!(x&&p)&&(u||p&&i&c2||x&&i&v2))return this.preventSrc(t)},preventSrc:function(n){this.manager.session.prevented=!0,n.preventDefault()}};function i8(n){if(i2(n,y2))return y2;var t=i2(n,Q2),i=i2(n,Z2);return t&&i?y2:t||i?t?Q2:Z2:i2(n,n3)?n3:g4}function o8(){if(!M4)return!1;var n={},t=e.CSS&&e.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(i){n[i]=t?e.CSS.supports("touch-action",i):!0}),n}var b1=1,K=2,F2=4,d2=8,o2=d2,J2=16,e2=32;function r2(n){this.options=E({},this.defaults,n||{}),this.id=T6(),this.manager=null,this.options.enable=a2(this.options.enable,!0),this.state=b1,this.simultaneous={},this.requireFail=[]}r2.prototype={defaults:{},set:function(n){return E(this.options,n),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(n){if(N(n,"recognizeWith",this))return this;var t=this.simultaneous;return n=S1(n,this),t[n.id]||(t[n.id]=n,n.recognizeWith(this)),this},dropRecognizeWith:function(n){return N(n,"dropRecognizeWith",this)?this:(n=S1(n,this),delete this.simultaneous[n.id],this)},requireFailure:function(n){if(N(n,"requireFailure",this))return this;var t=this.requireFail;return n=S1(n,this),P2(t,n)===-1&&(t.push(n),n.requireFailure(this)),this},dropRequireFailure:function(n){if(N(n,"dropRequireFailure",this))return this;n=S1(n,this);var t=P2(this.requireFail,n);return t>-1&&this.requireFail.splice(t,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(n){return!!this.simultaneous[n.id]},emit:function(n){var t=this,i=this.state;function r(u){t.manager.emit(u,n)}i<d2&&r(t.options.event+x4(i)),r(t.options.event),n.additionalEvent&&r(n.additionalEvent),i>=d2&&r(t.options.event+x4(i))},tryEmit:function(n){if(this.canEmit())return this.emit(n);this.state=e2},canEmit:function(){for(var n=0;n<this.requireFail.length;){if(!(this.requireFail[n].state&(e2|b1)))return!1;n++}return!0},recognize:function(n){var t=E({},n);if(!O(this.options.enable,[this,t])){this.reset(),this.state=e2;return}this.state&(o2|J2|e2)&&(this.state=b1),this.state=this.process(t),this.state&(K|F2|d2|J2)&&this.tryEmit(t)},process:function(n){},getTouchAction:function(){},reset:function(){}};function x4(n){return n&J2?"cancel":n&d2?"end":n&F2?"move":n&K?"start":""}function N4(n){return n==K2?"down":n==$2?"up":n==Y2?"left":n==X2?"right":""}function S1(n,t){var i=t.manager;return i?i.get(n):n}function Z(){r2.apply(this,arguments)}_(Z,r2,{defaults:{pointers:1},attrTest:function(n){var t=this.options.pointers;return t===0||n.pointers.length===t},process:function(n){var t=this.state,i=n.eventType,r=t&(K|F2),u=this.attrTest(n);return r&&(i&U||!u)?t|J2:r||u?i&k?t|d2:t&K?t|F2:K:e2}});function w1(){Z.apply(this,arguments),this.pX=null,this.pY=null}_(w1,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:a4},getTouchAction:function(){var n=this.options.direction,t=[];return n&c2&&t.push(Z2),n&v2&&t.push(Q2),t},directionTest:function(n){var t=this.options,i=!0,r=n.distance,u=n.direction,p=n.deltaX,x=n.deltaY;return u&t.direction||(t.direction&c2?(u=p===0?C1:p<0?Y2:X2,i=p!=this.pX,r=Math.abs(n.deltaX)):(u=x===0?C1:x<0?$2:K2,i=x!=this.pY,r=Math.abs(n.deltaY))),n.direction=u,i&&r>t.threshold&&u&t.direction},attrTest:function(n){return Z.prototype.attrTest.call(this,n)&&(this.state&K||!(this.state&K)&&this.directionTest(n))},emit:function(n){this.pX=n.deltaX,this.pY=n.deltaY;var t=N4(n.direction);t&&(n.additionalEvent=this.options.event+t),this._super.emit.call(this,n)}});function a3(){Z.apply(this,arguments)}_(a3,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[y2]},attrTest:function(n){return this._super.attrTest.call(this,n)&&(Math.abs(n.scale-1)>this.options.threshold||this.state&K)},emit:function(n){if(n.scale!==1){var t=n.scale<1?"in":"out";n.additionalEvent=this.options.event+t}this._super.emit.call(this,n)}});function i3(){r2.apply(this,arguments),this._timer=null,this._input=null}_(i3,r2,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[g4]},process:function(n){var t=this.options,i=n.pointers.length===t.pointers,r=n.distance<t.threshold,u=n.deltaTime>t.time;if(this._input=n,!r||!i||n.eventType&(k|U)&&!u)this.reset();else if(n.eventType&R)this.reset(),this._timer=M(function(){this.state=o2,this.tryEmit()},t.time,this);else if(n.eventType&k)return o2;return e2},reset:function(){clearTimeout(this._timer)},emit:function(n){this.state===o2&&(n&&n.eventType&k?this.manager.emit(this.options.event+"up",n):(this._input.timeStamp=d(),this.manager.emit(this.options.event,this._input)))}});function o3(){Z.apply(this,arguments)}_(o3,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[y2]},attrTest:function(n){return this._super.attrTest.call(this,n)&&(Math.abs(n.rotation)>this.options.threshold||this.state&K)}});function r3(){Z.apply(this,arguments)}_(r3,Z,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:c2|v2,pointers:1},getTouchAction:function(){return w1.prototype.getTouchAction.call(this)},attrTest:function(n){var t=this.options.direction,i;return t&(c2|v2)?i=n.overallVelocity:t&c2?i=n.overallVelocityX:t&v2&&(i=n.overallVelocityY),this._super.attrTest.call(this,n)&&t&n.offsetDirection&&n.distance>this.options.threshold&&n.maxPointers==this.options.pointers&&L(i)>this.options.velocity&&n.eventType&k},emit:function(n){var t=N4(n.offsetDirection);t&&this.manager.emit(this.options.event+t,n),this.manager.emit(this.options.event,n)}});function A1(){r2.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}_(A1,r2,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[n3]},process:function(n){var t=this.options,i=n.pointers.length===t.pointers,r=n.distance<t.threshold,u=n.deltaTime<t.time;if(this.reset(),n.eventType&R&&this.count===0)return this.failTimeout();if(r&&u&&i){if(n.eventType!=k)return this.failTimeout();var p=this.pTime?n.timeStamp-this.pTime<t.interval:!0,x=!this.pCenter||x1(this.pCenter,n.center)<t.posThreshold;this.pTime=n.timeStamp,this.pCenter=n.center,!x||!p?this.count=1:this.count+=1,this._input=n;var T=this.count%t.taps;if(T===0)return this.hasRequireFailures()?(this._timer=M(function(){this.state=o2,this.tryEmit()},t.interval,this),K):o2}return e2},failTimeout:function(){return this._timer=M(function(){this.state=e2},this.options.interval,this),e2},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==o2&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function f2(n,t){return t=t||{},t.recognizers=a2(t.recognizers,f2.defaults.preset),new f3(n,t)}f2.VERSION="2.0.7",f2.defaults={domEvents:!1,touchAction:C4,enable:!0,inputTarget:null,inputClass:null,preset:[[o3,{enable:!1}],[a3,{enable:!1},["rotate"]],[r3,{direction:c2}],[w1,{direction:c2},["swipe"]],[A1],[A1,{event:"doubletap",taps:2},["tap"]],[i3]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var r8=1,v4=2;function f3(n,t){this.options=E({},f2.defaults,t||{}),this.options.inputTarget=this.options.inputTarget||n,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=n,this.input=R6(this),this.touchAction=new t3(this,this.options.touchAction),y4(this,!0),C(this.options.recognizers,function(i){var r=this.add(new i[0](i[1]));i[2]&&r.recognizeWith(i[2]),i[3]&&r.requireFailure(i[3])},this)}f3.prototype={set:function(n){return E(this.options,n),n.touchAction&&this.touchAction.update(),n.inputTarget&&(this.input.destroy(),this.input.target=n.inputTarget,this.input.init()),this},stop:function(n){this.session.stopped=n?v4:r8},recognize:function(n){var t=this.session;if(!t.stopped){this.touchAction.preventDefaults(n);var i,r=this.recognizers,u=t.curRecognizer;(!u||u&&u.state&o2)&&(u=t.curRecognizer=null);for(var p=0;p<r.length;)i=r[p],t.stopped!==v4&&(!u||i==u||i.canRecognizeWith(u))?i.recognize(n):i.reset(),!u&&i.state&(K|F2|d2)&&(u=t.curRecognizer=i),p++}},get:function(n){if(n instanceof r2)return n;for(var t=this.recognizers,i=0;i<t.length;i++)if(t[i].options.event==n)return t[i];return null},add:function(n){if(N(n,"add",this))return this;var t=this.get(n.options.event);return t&&this.remove(t),this.recognizers.push(n),n.manager=this,this.touchAction.update(),n},remove:function(n){if(N(n,"remove",this))return this;if(n=this.get(n),n){var t=this.recognizers,i=P2(t,n);i!==-1&&(t.splice(i,1),this.touchAction.update())}return this},on:function(n,t){if(n!==s&&t!==s){var i=this.handlers;return C(d1(n),function(r){i[r]=i[r]||[],i[r].push(t)}),this}},off:function(n,t){if(n!==s){var i=this.handlers;return C(d1(n),function(r){t?i[r]&&i[r].splice(P2(i[r],t),1):delete i[r]}),this}},emit:function(n,t){this.options.domEvents&&f8(n,t);var i=this.handlers[n]&&this.handlers[n].slice();if(!(!i||!i.length)){t.type=n,t.preventDefault=function(){t.srcEvent.preventDefault()};for(var r=0;r<i.length;)i[r](t),r++}},destroy:function(){this.element&&y4(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function y4(n,t){var i=n.element;if(i.style){var r;C(n.options.cssProps,function(u,p){r=M1(i.style,p),t?(n.oldCssProps[r]=i.style[r],i.style[r]=u):i.style[r]=n.oldCssProps[r]||""}),t||(n.oldCssProps={})}}function f8(n,t){var i=c.createEvent("Event");i.initEvent(n,!0,!0),i.gesture=t,t.target.dispatchEvent(i)}E(f2,{INPUT_START:R,INPUT_MOVE:N2,INPUT_END:k,INPUT_CANCEL:U,STATE_POSSIBLE:b1,STATE_BEGAN:K,STATE_CHANGED:F2,STATE_ENDED:d2,STATE_RECOGNIZED:o2,STATE_CANCELLED:J2,STATE_FAILED:e2,DIRECTION_NONE:C1,DIRECTION_LEFT:Y2,DIRECTION_RIGHT:X2,DIRECTION_UP:$2,DIRECTION_DOWN:K2,DIRECTION_HORIZONTAL:c2,DIRECTION_VERTICAL:v2,DIRECTION_ALL:a4,Manager:f3,Input:$,TouchAction:t3,TouchInput:v1,MouseInput:N1,PointerEventInput:l3,TouchMouseInput:s3,SingleTouchInput:L4,Recognizer:r2,AttrRecognizer:Z,Tap:A1,Pan:w1,Swipe:r3,Pinch:a3,Rotate:o3,Press:i3,on:Q,off:T2,each:C,merge:W,extend:J,assign:E,inherit:_,bindFn:P,prefixed:M1});var m8=typeof e<"u"?e:typeof self<"u"?self:{};m8.Hammer=f2,typeof define=="function"&&define.amd?define(function(){return f2}):typeof P1<"u"&&P1.exports?P1.exports=f2:e[l]=f2})(window,document,"Hammer")});var jc=z8(Y4());var e0=(()=>{let c=class c{constructor(s,a){this._renderer=s,this._elementRef=a,this.onChange=o=>{},this.onTouched=()=>{}}setProperty(s,a){this._renderer.setProperty(this._elementRef.nativeElement,s,a)}registerOnTouched(s){this.onTouched=s}registerOnChange(s){this.onChange=s}setDisabledState(s){this.setProperty("disabled",s)}};c.\u0275fac=function(a){return new(a||c)(I(E1),I(k1))},c.\u0275dir=b2({type:c});let e=c;return e})(),d8=(()=>{let c=class c extends e0{};c.\u0275fac=(()=>{let s;return function(o){return(s||(s=z3(c)))(o||c)}})(),c.\u0275dir=b2({type:c,features:[V2]});let e=c;return e})(),l0=new I2("");var h8={provide:l0,useExisting:m3(()=>R1),multi:!0};function M8(){let e=h3()?h3().getUserAgent():"";return/android (\d+)/.test(e.toLowerCase())}var C8=new I2(""),R1=(()=>{let c=class c extends e0{constructor(s,a,o){super(s,a),this._compositionMode=o,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!M8())}writeValue(s){let a=s??"";this.setProperty("value",a)}_handleInput(s){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(s)}_compositionStart(){this._composing=!0}_compositionEnd(s){this._composing=!1,this._compositionMode&&this.onChange(s)}};c.\u0275fac=function(a){return new(a||c)(I(E1),I(k1),I(C8,8))},c.\u0275dir=b2({type:c,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(a,o){a&1&&b("input",function(m){return o._handleInput(m.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(m){return o._compositionEnd(m.target.value)})},features:[d3([h8]),V2]});let e=c;return e})();var g8=new I2(""),x8=new I2("");function s0(e){return e!=null}function n0(e){return F4(e)?S4(e):e}function t0(e){let c={};return e.forEach(l=>{c=l!=null?z(z({},c),l):c}),Object.keys(c).length===0?null:c}function a0(e,c){return c.map(l=>l(e))}function N8(e){return!e.validate}function i0(e){return e.map(c=>N8(c)?c:l=>c.validate(l))}function v8(e){if(!e)return null;let c=e.filter(s0);return c.length==0?null:function(l){return t0(a0(l,c))}}function o0(e){return e!=null?v8(i0(e)):null}function y8(e){if(!e)return null;let c=e.filter(s0);return c.length==0?null:function(l){let s=a0(l,c).map(n0);return A4(s).pipe(w4(t0))}}function r0(e){return e!=null?y8(i0(e)):null}function X4(e,c){return e===null?[c]:Array.isArray(e)?[...e,c]:[e,c]}function b8(e){return e._rawValidators}function S8(e){return e._rawAsyncValidators}function C3(e){return e?Array.isArray(e)?e:[e]:[]}function I1(e,c){return Array.isArray(e)?e.includes(c):e===c}function $4(e,c){let l=C3(c);return C3(e).forEach(a=>{I1(l,a)||l.push(a)}),l}function K4(e,c){return C3(c).filter(l=>!I1(e,l))}var V1=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(c){this._rawValidators=c||[],this._composedValidatorFn=o0(this._rawValidators)}_setAsyncValidators(c){this._rawAsyncValidators=c||[],this._composedAsyncValidatorFn=r0(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(c){this._onDestroyCallbacks.push(c)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(c=>c()),this._onDestroyCallbacks=[]}reset(c=void 0){this.control&&this.control.reset(c)}hasError(c,l){return this.control?this.control.hasError(c,l):!1}getError(c,l){return this.control?this.control.getError(c,l):null}},g3=class extends V1{get formDirective(){return null}get path(){return null}},a1=class extends V1{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},x3=class{constructor(c){this._cd=c}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},w8={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},mc=v(z({},w8),{"[class.ng-submitted]":"isSubmitted"}),f0=(()=>{let c=class c extends x3{constructor(s){super(s)}};c.\u0275fac=function(a){return new(a||c)(I(a1,2))},c.\u0275dir=b2({type:c,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(a,o){a&2&&p3("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},features:[V2]});let e=c;return e})();var l1="VALID",F1="INVALID",O2="PENDING",s1="DISABLED",B2=class{},O1=class extends B2{constructor(c,l){super(),this.value=c,this.source=l}},n1=class extends B2{constructor(c,l){super(),this.pristine=c,this.source=l}},t1=class extends B2{constructor(c,l){super(),this.touched=c,this.source=l}},R2=class extends B2{constructor(c,l){super(),this.status=c,this.source=l}};function A8(e){return(B1(e)?e.validators:e)||null}function _8(e){return Array.isArray(e)?o0(e):e||null}function k8(e,c){return(B1(c)?c.asyncValidators:e)||null}function E8(e){return Array.isArray(e)?r0(e):e||null}function B1(e){return e!=null&&!Array.isArray(e)&&typeof e=="object"}var N3=class{constructor(c,l){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=D1(()=>this.statusReactive()),this.statusReactive=T1(void 0),this._pristine=D1(()=>this.pristineReactive()),this.pristineReactive=T1(!0),this._touched=D1(()=>this.touchedReactive()),this.touchedReactive=T1(!1),this._events=new b4,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(c),this._assignAsyncValidators(l)}get validator(){return this._composedValidatorFn}set validator(c){this._rawValidators=this._composedValidatorFn=c}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(c){this._rawAsyncValidators=this._composedAsyncValidatorFn=c}get parent(){return this._parent}get status(){return S2(this.statusReactive)}set status(c){S2(()=>this.statusReactive.set(c))}get valid(){return this.status===l1}get invalid(){return this.status===F1}get pending(){return this.status==O2}get disabled(){return this.status===s1}get enabled(){return this.status!==s1}get pristine(){return S2(this.pristineReactive)}set pristine(c){S2(()=>this.pristineReactive.set(c))}get dirty(){return!this.pristine}get touched(){return S2(this.touchedReactive)}set touched(c){S2(()=>this.touchedReactive.set(c))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(c){this._assignValidators(c)}setAsyncValidators(c){this._assignAsyncValidators(c)}addValidators(c){this.setValidators($4(c,this._rawValidators))}addAsyncValidators(c){this.setAsyncValidators($4(c,this._rawAsyncValidators))}removeValidators(c){this.setValidators(K4(c,this._rawValidators))}removeAsyncValidators(c){this.setAsyncValidators(K4(c,this._rawAsyncValidators))}hasValidator(c){return I1(this._rawValidators,c)}hasAsyncValidator(c){return I1(this._rawAsyncValidators,c)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(c={}){let l=this.touched===!1;this.touched=!0;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsTouched(v(z({},c),{sourceControl:s})),l&&c.emitEvent!==!1&&this._events.next(new t1(!0,s))}markAllAsTouched(c={}){this.markAsTouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:this}),this._forEachChild(l=>l.markAllAsTouched(c))}markAsUntouched(c={}){let l=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let s=c.sourceControl??this;this._forEachChild(a=>{a.markAsUntouched({onlySelf:!0,emitEvent:c.emitEvent,sourceControl:s})}),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,s),l&&c.emitEvent!==!1&&this._events.next(new t1(!1,s))}markAsDirty(c={}){let l=this.pristine===!0;this.pristine=!1;let s=c.sourceControl??this;this._parent&&!c.onlySelf&&this._parent.markAsDirty(v(z({},c),{sourceControl:s})),l&&c.emitEvent!==!1&&this._events.next(new n1(!1,s))}markAsPristine(c={}){let l=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let s=c.sourceControl??this;this._forEachChild(a=>{a.markAsPristine({onlySelf:!0,emitEvent:c.emitEvent})}),this._parent&&!c.onlySelf&&this._parent._updatePristine(c,s),l&&c.emitEvent!==!1&&this._events.next(new n1(!0,s))}markAsPending(c={}){this.status=O2;let l=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new R2(this.status,l)),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.markAsPending(v(z({},c),{sourceControl:l}))}disable(c={}){let l=this._parentMarkedDirty(c.onlySelf);this.status=s1,this.errors=null,this._forEachChild(a=>{a.disable(v(z({},c),{onlySelf:!0}))}),this._updateValue();let s=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new O1(this.value,s)),this._events.next(new R2(this.status,s)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(v(z({},c),{skipPristineCheck:l}),this),this._onDisabledChange.forEach(a=>a(!0))}enable(c={}){let l=this._parentMarkedDirty(c.onlySelf);this.status=l1,this._forEachChild(s=>{s.enable(v(z({},c),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent}),this._updateAncestors(v(z({},c),{skipPristineCheck:l}),this),this._onDisabledChange.forEach(s=>s(!1))}_updateAncestors(c,l){this._parent&&!c.onlySelf&&(this._parent.updateValueAndValidity(c),c.skipPristineCheck||this._parent._updatePristine({},l),this._parent._updateTouched({},l))}setParent(c){this._parent=c}getRawValue(){return this.value}updateValueAndValidity(c={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let s=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===l1||this.status===O2)&&this._runAsyncValidator(s,c.emitEvent)}let l=c.sourceControl??this;c.emitEvent!==!1&&(this._events.next(new O1(this.value,l)),this._events.next(new R2(this.status,l)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!c.onlySelf&&this._parent.updateValueAndValidity(v(z({},c),{sourceControl:l}))}_updateTreeValidity(c={emitEvent:!0}){this._forEachChild(l=>l._updateTreeValidity(c)),this.updateValueAndValidity({onlySelf:!0,emitEvent:c.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?s1:l1}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(c,l){if(this.asyncValidator){this.status=O2,this._hasOwnPendingAsyncValidator={emitEvent:l!==!1};let s=n0(this.asyncValidator(this));this._asyncValidationSubscription=s.subscribe(a=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(a,{emitEvent:l,shouldHaveEmitted:c})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let c=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,c}return!1}setErrors(c,l={}){this.errors=c,this._updateControlsErrors(l.emitEvent!==!1,this,l.shouldHaveEmitted)}get(c){let l=c;return l==null||(Array.isArray(l)||(l=l.split(".")),l.length===0)?null:l.reduce((s,a)=>s&&s._find(a),this)}getError(c,l){let s=l?this.get(l):this;return s&&s.errors?s.errors[c]:null}hasError(c,l){return!!this.getError(c,l)}get root(){let c=this;for(;c._parent;)c=c._parent;return c}_updateControlsErrors(c,l,s){this.status=this._calculateStatus(),c&&this.statusChanges.emit(this.status),(c||s)&&this._events.next(new R2(this.status,l)),this._parent&&this._parent._updateControlsErrors(c,l,s)}_initObservables(){this.valueChanges=new _1,this.statusChanges=new _1}_calculateStatus(){return this._allControlsDisabled()?s1:this.errors?F1:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(O2)?O2:this._anyControlsHaveStatus(F1)?F1:l1}_anyControlsHaveStatus(c){return this._anyControls(l=>l.status===c)}_anyControlsDirty(){return this._anyControls(c=>c.dirty)}_anyControlsTouched(){return this._anyControls(c=>c.touched)}_updatePristine(c,l){let s=!this._anyControlsDirty(),a=this.pristine!==s;this.pristine=s,this._parent&&!c.onlySelf&&this._parent._updatePristine(c,l),a&&this._events.next(new n1(this.pristine,l))}_updateTouched(c={},l){this.touched=this._anyControlsTouched(),this._events.next(new t1(this.touched,l)),this._parent&&!c.onlySelf&&this._parent._updateTouched(c,l)}_registerOnCollectionChange(c){this._onCollectionChange=c}_setUpdateStrategy(c){B1(c)&&c.updateOn!=null&&(this._updateOn=c.updateOn)}_parentMarkedDirty(c){let l=this._parent&&this._parent.dirty;return!c&&!!l&&!this._parent._anyControlsDirty()}_find(c){return null}_assignValidators(c){this._rawValidators=Array.isArray(c)?c.slice():c,this._composedValidatorFn=_8(this._rawValidators)}_assignAsyncValidators(c){this._rawAsyncValidators=Array.isArray(c)?c.slice():c,this._composedAsyncValidatorFn=E8(this._rawAsyncValidators)}};var m0=new I2("CallSetDisabledState",{providedIn:"root",factory:()=>v3}),v3="always";function T8(e,c){return[...c.path,e]}function D8(e,c,l=v3){F8(e,c),c.valueAccessor.writeValue(e.value),(e.disabled||l==="always")&&c.valueAccessor.setDisabledState?.(e.disabled),I8(e,c),O8(e,c),V8(e,c),P8(e,c)}function Q4(e,c){e.forEach(l=>{l.registerOnValidatorChange&&l.registerOnValidatorChange(c)})}function P8(e,c){if(c.valueAccessor.setDisabledState){let l=s=>{c.valueAccessor.setDisabledState(s)};e.registerOnDisabledChange(l),c._registerOnDestroy(()=>{e._unregisterOnDisabledChange(l)})}}function F8(e,c){let l=b8(e);c.validator!==null?e.setValidators(X4(l,c.validator)):typeof l=="function"&&e.setValidators([l]);let s=S8(e);c.asyncValidator!==null?e.setAsyncValidators(X4(s,c.asyncValidator)):typeof s=="function"&&e.setAsyncValidators([s]);let a=()=>e.updateValueAndValidity();Q4(c._rawValidators,a),Q4(c._rawAsyncValidators,a)}function I8(e,c){c.valueAccessor.registerOnChange(l=>{e._pendingValue=l,e._pendingChange=!0,e._pendingDirty=!0,e.updateOn==="change"&&u0(e,c)})}function V8(e,c){c.valueAccessor.registerOnTouched(()=>{e._pendingTouched=!0,e.updateOn==="blur"&&e._pendingChange&&u0(e,c),e.updateOn!=="submit"&&e.markAsTouched()})}function u0(e,c){e._pendingDirty&&e.markAsDirty(),e.setValue(e._pendingValue,{emitModelToViewChange:!1}),c.viewToModelUpdate(e._pendingValue),e._pendingChange=!1}function O8(e,c){let l=(s,a)=>{c.valueAccessor.writeValue(s),a&&c.viewToModelUpdate(s)};e.registerOnChange(l),c._registerOnDestroy(()=>{e._unregisterOnChange(l)})}function R8(e,c){if(!e.hasOwnProperty("model"))return!1;let l=e.model;return l.isFirstChange()?!0:!Object.is(c,l.currentValue)}function B8(e){return Object.getPrototypeOf(e.constructor)===d8}function H8(e,c){if(!c)return null;Array.isArray(c);let l,s,a;return c.forEach(o=>{o.constructor===R1?l=o:B8(o)?s=o:a=o}),a||s||l||null}function Z4(e,c){let l=e.indexOf(c);l>-1&&e.splice(l,1)}function J4(e){return typeof e=="object"&&e!==null&&Object.keys(e).length===2&&"value"in e&&"disabled"in e}var U8=class extends N3{constructor(c=null,l,s){super(A8(l),k8(s,l)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(c),this._setUpdateStrategy(l),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),B1(l)&&(l.nonNullable||l.initialValueIsDefault)&&(J4(c)?this.defaultValue=c.value:this.defaultValue=c)}setValue(c,l={}){this.value=this._pendingValue=c,this._onChange.length&&l.emitModelToViewChange!==!1&&this._onChange.forEach(s=>s(this.value,l.emitViewToModelChange!==!1)),this.updateValueAndValidity(l)}patchValue(c,l={}){this.setValue(c,l)}reset(c=this.defaultValue,l={}){this._applyFormState(c),this.markAsPristine(l),this.markAsUntouched(l),this.setValue(this.value,l),this._pendingChange=!1}_updateValue(){}_anyControls(c){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(c){this._onChange.push(c)}_unregisterOnChange(c){Z4(this._onChange,c)}registerOnDisabledChange(c){this._onDisabledChange.push(c)}_unregisterOnDisabledChange(c){Z4(this._onDisabledChange,c)}_forEachChild(c){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(c){J4(c)?(this.value=this._pendingValue=c.value,c.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=c}};var G8={provide:a1,useExisting:m3(()=>y3)},c0=Promise.resolve(),y3=(()=>{let c=class c extends a1{constructor(s,a,o,f,m,L){super(),this._changeDetectorRef=m,this.callSetDisabledState=L,this.control=new U8,this._registered=!1,this.name="",this.update=new _1,this._parent=s,this._setValidators(a),this._setAsyncValidators(o),this.valueAccessor=H8(this,f)}ngOnChanges(s){if(this._checkForErrors(),!this._registered||"name"in s){if(this._registered&&(this._checkName(),this.formDirective)){let a=s.name.previousValue;this.formDirective.removeControl({name:a,path:this._getPath(a)})}this._setUpControl()}"isDisabled"in s&&this._updateDisabled(s),R8(s,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(s){this.viewModel=s,this.update.emit(s)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){D8(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(s){c0.then(()=>{this.control.setValue(s,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(s){let a=s.isDisabled.currentValue,o=a!==0&&V4(a);c0.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(s){return this._parent?T8(s,this._parent):[s]}};c.\u0275fac=function(a){return new(a||c)(I(g3,9),I(g8,10),I(x8,10),I(l0,10),I(I4,8),I(m0,8))},c.\u0275dir=b2({type:c,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[d3([G8]),V2,u3]});let e=c;return e})();var q8=(()=>{let c=class c{};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({});let e=c;return e})();var z0=(()=>{let c=class c{static withConfig(s){return{ngModule:c,providers:[{provide:m0,useValue:s.callSetDisabledState??v3}]}}};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({imports:[q8]});let e=c;return e})();var L0={prefix:"fas",iconName:"lightbulb",icon:[384,512,[128161],"f0eb","M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"]};var p0={prefix:"fas",iconName:"question",icon:[320,512,[10067,10068,61736],"3f","M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"]};var j8={prefix:"fas",iconName:"screwdriver-wrench",icon:[512,512,["tools"],"f7d9","M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"]},d0=j8;var Y8={prefix:"fas",iconName:"shirt",icon:[640,512,[128085,"t-shirt","tshirt"],"f553","M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0l12.6 0c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7 480 448c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-250.3-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0l12.6 0z"]};var h0=Y8;var M0={prefix:"fas",iconName:"dumbbell",icon:[640,512,[],"f44b","M96 64c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 160 0 64 0 160c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64-32 0c-17.7 0-32-14.3-32-32l0-64c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64c0-17.7 14.3-32 32-32l32 0 0-64zm448 0l0 64 32 0c17.7 0 32 14.3 32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 17.7-14.3 32-32 32l-32 0 0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-160 0-64 0-160c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32zM416 224l0 64-192 0 0-64 192 0z"]};var C0={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]};var X8={prefix:"fas",iconName:"delete-left",icon:[576,512,[9003,"backspace"],"f55a","M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]},g0=X8;var $8={prefix:"fas",iconName:"house",icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]},x0=$8;var N0={prefix:"fas",iconName:"utensils",icon:[448,512,[127860,61685,"cutlery"],"f2e7","M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"]};var v0={prefix:"fas",iconName:"credit-card",icon:[576,512,[128179,62083,"credit-card-alt"],"f09d","M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"]};var y0={prefix:"fas",iconName:"car",icon:[512,512,[128664,"automobile"],"f1b9","M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};var b0={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]};var S0={prefix:"fas",iconName:"baby",icon:[448,512,[],"f77c","M152 88a72 72 0 1 1 144 0A72 72 0 1 1 152 88zM39.7 144.5c13-17.9 38-21.8 55.9-8.8L131.8 162c26.8 19.5 59.1 30 92.2 30s65.4-10.5 92.2-30l36.2-26.4c17.9-13 42.9-9 55.9 8.8s9 42.9-8.8 55.9l-36.2 26.4c-13.6 9.9-28.1 18.2-43.3 25l0 36.3-192 0 0-36.3c-15.2-6.7-29.7-15.1-43.3-25L48.5 200.3c-17.9-13-21.8-38-8.8-55.9zm89.8 184.8l60.6 53-26 37.2 24.3 24.3c15.6 15.6 15.6 40.9 0 56.6s-40.9 15.6-56.6 0l-48-48C70 438.6 68.1 417 79.2 401.1l50.2-71.8zm128.5 53l60.6-53 50.2 71.8c11.1 15.9 9.2 37.5-4.5 51.2l-48 48c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6L284 419.4l-26-37.2z"]};var w0={prefix:"fas",iconName:"music",icon:[512,512,[127925],"f001","M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"]};var A0={prefix:"fas",iconName:"plane",icon:[576,512,[],"f072","M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"]};function Z8(e,c){if(e&1){let l=k4();g(0,"div",21)(1,"div",22)(2,"input",23),P4("ngModelChange",function(a){G(l);let o=H();return D4(o.enteredAmount,a)||(o.enteredAmount=a),q(a)}),y()(),g(3,"div",24)(4,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("1"))}),S(5,"1"),y(),g(6,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("2"))}),S(7,"2"),y(),g(8,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("3"))}),S(9,"3"),y(),g(10,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("4"))}),S(11,"4"),y(),g(12,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("5"))}),S(13,"5"),y(),g(14,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("6"))}),S(15,"6"),y(),g(16,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("7"))}),S(17,"7"),y(),g(18,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("8"))}),S(19,"8"),y(),g(20,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("9"))}),S(21,"9"),y(),g(22,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("."))}),S(23,"."),y(),g(24,"div",25),b("click",function(){G(l);let a=H();return q(a.onNumberClick("0"))}),S(25,"0"),y(),g(26,"div",25),b("click",function(){G(l);let a=H();return q(a.onDeleteClick())}),V(27,"i",26),y()()()}if(e&2){let l=H();e1(2),T4("ngModel",l.enteredAmount)}}var H1=class e{constructor(c){this.router=c}faClock=C0;faPlus=b0;faBackspace=g0;categories=[{name:"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438",icon:N0},{name:"\u041E\u0434\u0435\u0436\u0434\u0430",icon:h0},{name:"\u0420\u0435\u043C\u043E\u043D\u0442",icon:d0},{name:"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F",icon:w0},{name:"\u0421\u043F\u043E\u0440\u0442",icon:M0},{name:"\u0410\u0432\u0442\u043E",icon:y0},{name:"\u041A\u043E\u043C\u043C\u0443\u043D\u0430\u043B\u043A\u0430",icon:L0},{name:"\u0414\u0435\u0442\u0438",icon:S0},{name:"\u0414\u043E\u043C",icon:x0},{name:"\u0420\u0430\u0437\u043D\u043E\u0435",icon:p0},{name:"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F",icon:A0},{name:"\u041A\u0440\u0435\u0434\u0438\u0442",icon:v0}];numbers=[1,2,3,4,5,6,7,8,9,0];enteredAmount="";enteredAmountAsNumber=0;totalAmount=0;showKeyBoard=!0;ngOnInit(){let c=JSON.parse(localStorage.getItem("expenses")||"[]");this.totalAmount=c.reduce((l,s)=>l+s.amount,0)}onNumberClick(c){c==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=c):this.enteredAmount+=c,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(c){if(this.enteredAmountAsNumber>0){let l=localStorage.getItem("expenses"),s=l?JSON.parse(l):[];s.push({category:c,amount:this.enteredAmountAsNumber,currency:"EUR"}),localStorage.setItem("expenses",JSON.stringify(s)),this.totalAmount=s.reduce((a,o)=>a+o.amount,0),this.enteredAmount="",this.enteredAmountAsNumber=0}}onSwipeLeft(){this.router.navigate(["/history"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}static \u0275fac=function(l){return new(l||e)(I(W4))};static \u0275cmp=c1({type:e,selectors:[["app-expense"]],decls:56,vars:3,consts:[[1,"container",3,"swipeleft","swipeup","swipedown"],[1,"header"],[1,"menu-icon"],[1,"title"],[1,"expense-info"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],[1,"scrollable-content"],[1,"categories"],[1,"category",3,"click"],[1,"fas","fa-utensils"],[1,"fas","fa-tshirt"],[1,"fas","fa-paint-roller"],[1,"fas","fa-music"],[1,"fas","fa-dumbbell"],[1,"fas","fa-car"],[1,"fas","fa-home"],[1,"fas","fa-baby-carriage"],[1,"fas","fa-random"],[1,"fas","fa-plane"],["class","number-board",4,"ngIf"],[1,"number-board"],[1,"number-board-header"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(l,s){l&1&&(g(0,"div",0),b("swipeleft",function(){return s.onSwipeLeft()})("swipeup",function(){return s.onShowKeyboard()})("swipedown",function(){return s.onHideKeyboard()}),g(1,"div",1),V(2,"div",2),g(3,"div",3)(4,"span"),S(5,"\u041E\u0411\u0429\u0418\u0419 \u0420\u0410\u0421\u0425\u041E\u0414"),y()(),g(6,"div",4)(7,"span"),S(8),y(),g(9,"span"),S(10,"$"),y()(),g(11,"div",5),V(12,"i",6),y()(),g(13,"div",7)(14,"div",8)(15,"div",9),b("click",function(){return s.onCategoryClick("meal")}),V(16,"i",10),g(17,"span"),S(18,"\u0415\u0434\u0430 \u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0438"),y()(),g(19,"div",9),b("click",function(){return s.onCategoryClick("clothes")}),V(20,"i",11),g(21,"span"),S(22,"\u041E\u0434\u0435\u0436\u0434\u0430"),y()(),g(23,"div",9),b("click",function(){return s.onCategoryClick("repair")}),V(24,"i",12),g(25,"span"),S(26,"\u0420\u0435\u043C\u043E\u043D\u0442"),y()(),g(27,"div",9),b("click",function(){return s.onCategoryClick("entertainments")}),V(28,"i",13),g(29,"span"),S(30,"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F"),y()(),g(31,"div",9),b("click",function(){return s.onCategoryClick("sport")}),V(32,"i",14),g(33,"span"),S(34,"\u0421\u043F\u043E\u0440\u0442"),y()(),g(35,"div",9),b("click",function(){return s.onCategoryClick("car")}),V(36,"i",15),g(37,"span"),S(38,"\u0410\u0432\u0442\u043E"),y()(),g(39,"div",9),b("click",function(){return s.onCategoryClick("home")}),V(40,"i",16),g(41,"span"),S(42,"\u0414\u043E\u043C"),y()(),g(43,"div",9),b("click",function(){return s.onCategoryClick("children")}),V(44,"i",17),g(45,"span"),S(46,"\u0414\u0435\u0442\u0438"),y()(),g(47,"div",9),b("click",function(){return s.onCategoryClick("another")}),V(48,"i",18),g(49,"span"),S(50,"\u0420\u0430\u0437\u043D\u043E\u0435"),y()(),g(51,"div",9),b("click",function(){return s.onCategoryClick("travel")}),V(52,"i",19),g(53,"span"),S(54,"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F"),y()()()(),_4(55,Z8,28,1,"div",20),y()),l&2&&(e1(8),E4(s.totalAmount),e1(3),L3("routerLink","/history"),e1(44),L3("ngIf",s.showKeyBoard))},dependencies:[O4,j4,R1,f0,y3],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;-webkit-user-select:none;user-select:none;width:100%;height:100%;position:fixed}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.scrollable-content[_ngcontent-%COMP%]{flex:1;overflow-y:auto}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:60px;margin:10px;text-align:center}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:36px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding-bottom:10px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr)}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};var J8=[{path:"history",loadChildren:()=>import("./chunk-FVLRT3OG.js").then(e=>e.HistoryModule)},{path:"",pathMatch:"full",component:H1}],U1=class e{static \u0275fac=function(l){return new(l||e)};static \u0275mod=u2({type:e});static \u0275inj=m2({imports:[M3.forRoot(J8),M3]})};var G1=class e{title="expenses";static \u0275fac=function(l){return new(l||e)};static \u0275cmp=c1({type:e,selectors:[["app-root"]],decls:1,vars:0,template:function(l,s){l&1&&V(0,"router-outlet")},dependencies:[q4]})};var _0=()=>{},W3={},J0={},c6=null,e6={mark:_0,measure:_0};try{typeof window<"u"&&(W3=window),typeof document<"u"&&(J0=document),typeof MutationObserver<"u"&&(c6=MutationObserver),typeof performance<"u"&&(e6=performance)}catch{}var{userAgent:k0=""}=W3.navigator||{},C2=W3,w=J0,E0=c6,q1=e6,vc=!!C2.document,p2=!!w.documentElement&&!!w.head&&typeof w.addEventListener=="function"&&typeof w.createElement=="function",l6=~k0.indexOf("MSIE")||~k0.indexOf("Trident/"),A="classic",s6="duotone",j="sharp",Y="sharp-duotone",c5=[A,s6,j,Y],e5={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},T0={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},l5=["kit"],s5=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,n5=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,t5={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},a5={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},i5={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},o5={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},r5={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},f5={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},n6={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},m5=["solid","regular","light","thin","duotone","brands"],t6=[1,2,3,4,5,6,7,8,9,10],u5=t6.concat([11,12,13,14,15,16,17,18,19,20]),o1={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},z5=[...Object.keys(o5),...m5,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",o1.GROUP,o1.SWAP_OPACITY,o1.PRIMARY,o1.SECONDARY].concat(t6.map(e=>"".concat(e,"x"))).concat(u5.map(e=>"w-".concat(e))),L5={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},p5={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},d5={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},D0={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},z2="___FONT_AWESOME___",k3=16,a6="fa",i6="svg-inline--fa",k2="data-fa-i2svg",E3="data-fa-pseudo-element",h5="data-fa-pseudo-element-pending",j3="data-prefix",Y3="data-icon",P0="fontawesome-i2svg",M5="async",C5=["HTML","HEAD","STYLE","SCRIPT"],o6=(()=>{try{return!0}catch{return!1}})(),r6=[A,j,Y];function L1(e){return new Proxy(e,{get(c,l){return l in c?c[l]:c[A]}})}var f6=z({},n6);f6[A]=z(z(z({},n6[A]),T0.kit),T0["kit-duotone"]);var A2=L1(f6),T3=z({},f5);T3[A]=z(z(z({},T3[A]),D0.kit),D0["kit-duotone"]);var u1=L1(T3),D3=z({},r5);D3[A]=z(z({},D3[A]),d5.kit);var _2=L1(D3),P3=z({},i5);P3[A]=z(z({},P3[A]),p5.kit);var g5=L1(P3),x5=s5,m6="fa-layers-text",N5=n5,v5=z({},e5),yc=L1(v5),y5=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],b3=o1,G2=new Set;Object.keys(u1[A]).map(G2.add.bind(G2));Object.keys(u1[j]).map(G2.add.bind(G2));Object.keys(u1[Y]).map(G2.add.bind(G2));var b5=[...l5,...z5],f1=C2.FontAwesomeConfig||{};function S5(e){var c=w.querySelector("script["+e+"]");if(c)return c.getAttribute(e)}function w5(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}w&&typeof w.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(c=>{let[l,s]=c,a=w5(S5(l));a!=null&&(f1[s]=a)});var u6={styleDefault:"solid",familyDefault:"classic",cssPrefix:a6,replacementClass:i6,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};f1.familyPrefix&&(f1.cssPrefix=f1.familyPrefix);var q2=z(z({},u6),f1);q2.autoReplaceSvg||(q2.observeMutations=!1);var h={};Object.keys(u6).forEach(e=>{Object.defineProperty(h,e,{enumerable:!0,set:function(c){q2[e]=c,m1.forEach(l=>l(h))},get:function(){return q2[e]}})});Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(e){q2.cssPrefix=e,m1.forEach(c=>c(h))},get:function(){return q2.cssPrefix}});C2.FontAwesomeConfig=h;var m1=[];function A5(e){return m1.push(e),()=>{m1.splice(m1.indexOf(e),1)}}var h2=k3,s2={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function _5(e){if(!e||!p2)return;let c=w.createElement("style");c.setAttribute("type","text/css"),c.innerHTML=e;let l=w.head.childNodes,s=null;for(let a=l.length-1;a>-1;a--){let o=l[a],f=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(f)>-1&&(s=o)}return w.head.insertBefore(c,s),e}var k5="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function z1(){let e=12,c="";for(;e-- >0;)c+=k5[Math.random()*62|0];return c}function W2(e){let c=[];for(let l=(e||[]).length>>>0;l--;)c[l]=e[l];return c}function X3(e){return e.classList?W2(e.classList):(e.getAttribute("class")||"").split(" ").filter(c=>c)}function z6(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function E5(e){return Object.keys(e||{}).reduce((c,l)=>c+"".concat(l,'="').concat(z6(e[l]),'" '),"").trim()}function $1(e){return Object.keys(e||{}).reduce((c,l)=>c+"".concat(l,": ").concat(e[l].trim(),";"),"")}function $3(e){return e.size!==s2.size||e.x!==s2.x||e.y!==s2.y||e.rotate!==s2.rotate||e.flipX||e.flipY}function T5(e){let{transform:c,containerWidth:l,iconWidth:s}=e,a={transform:"translate(".concat(l/2," 256)")},o="translate(".concat(c.x*32,", ").concat(c.y*32,") "),f="scale(".concat(c.size/16*(c.flipX?-1:1),", ").concat(c.size/16*(c.flipY?-1:1),") "),m="rotate(".concat(c.rotate," 0 0)"),L={transform:"".concat(o," ").concat(f," ").concat(m)},d={transform:"translate(".concat(s/2*-1," -256)")};return{outer:a,inner:L,path:d}}function D5(e){let{transform:c,width:l=k3,height:s=k3,startCentered:a=!1}=e,o="";return a&&l6?o+="translate(".concat(c.x/h2-l/2,"em, ").concat(c.y/h2-s/2,"em) "):a?o+="translate(calc(-50% + ".concat(c.x/h2,"em), calc(-50% + ").concat(c.y/h2,"em)) "):o+="translate(".concat(c.x/h2,"em, ").concat(c.y/h2,"em) "),o+="scale(".concat(c.size/h2*(c.flipX?-1:1),", ").concat(c.size/h2*(c.flipY?-1:1),") "),o+="rotate(".concat(c.rotate,"deg) "),o}var P5=`:root, :host {
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
}`;function L6(){let e=a6,c=i6,l=h.cssPrefix,s=h.replacementClass,a=P5;if(l!==e||s!==c){let o=new RegExp("\\.".concat(e,"\\-"),"g"),f=new RegExp("\\--".concat(e,"\\-"),"g"),m=new RegExp("\\.".concat(c),"g");a=a.replace(o,".".concat(l,"-")).replace(f,"--".concat(l,"-")).replace(m,".".concat(s))}return a}var F0=!1;function S3(){h.autoAddCss&&!F0&&(_5(L6()),F0=!0)}var F5={mixout(){return{dom:{css:L6,insertCss:S3}}},hooks(){return{beforeDOMElementCreation(){S3()},beforeI2svg(){S3()}}}},L2=C2||{};L2[z2]||(L2[z2]={});L2[z2].styles||(L2[z2].styles={});L2[z2].hooks||(L2[z2].hooks={});L2[z2].shims||(L2[z2].shims=[]);var n2=L2[z2],p6=[],d6=function(){w.removeEventListener("DOMContentLoaded",d6),Y1=1,p6.map(e=>e())},Y1=!1;p2&&(Y1=(w.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(w.readyState),Y1||w.addEventListener("DOMContentLoaded",d6));function I5(e){p2&&(Y1?setTimeout(e,0):p6.push(e))}function p1(e){let{tag:c,attributes:l={},children:s=[]}=e;return typeof e=="string"?z6(e):"<".concat(c," ").concat(E5(l),">").concat(s.map(p1).join(""),"</").concat(c,">")}function I0(e,c,l){if(e&&e[c]&&e[c][l])return{prefix:c,iconName:l,icon:e[c][l]}}var V5=function(c,l){return function(s,a,o,f){return c.call(l,s,a,o,f)}},w3=function(c,l,s,a){var o=Object.keys(c),f=o.length,m=a!==void 0?V5(l,a):l,L,d,M;for(s===void 0?(L=1,M=c[o[0]]):(L=0,M=s);L<f;L++)d=o[L],M=m(M,c[d],d,c);return M};function O5(e){let c=[],l=0,s=e.length;for(;l<s;){let a=e.charCodeAt(l++);if(a>=55296&&a<=56319&&l<s){let o=e.charCodeAt(l++);(o&64512)==56320?c.push(((a&1023)<<10)+(o&1023)+65536):(c.push(a),l--)}else c.push(a)}return c}function F3(e){let c=O5(e);return c.length===1?c[0].toString(16):null}function R5(e,c){let l=e.length,s=e.charCodeAt(c),a;return s>=55296&&s<=56319&&l>c+1&&(a=e.charCodeAt(c+1),a>=56320&&a<=57343)?(s-55296)*1024+a-56320+65536:s}function V0(e){return Object.keys(e).reduce((c,l)=>{let s=e[l];return!!s.icon?c[s.iconName]=s.icon:c[l]=s,c},{})}function I3(e,c){let l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:s=!1}=l,a=V0(c);typeof n2.hooks.addPack=="function"&&!s?n2.hooks.addPack(e,V0(c)):n2.styles[e]=z(z({},n2.styles[e]||{}),a),e==="fas"&&I3("fa",c)}var{styles:w2,shims:B5}=n2,H5={[A]:Object.values(_2[A]),[j]:Object.values(_2[j]),[Y]:Object.values(_2[Y])},K3=null,h6={},M6={},C6={},g6={},x6={},U5={[A]:Object.keys(A2[A]),[j]:Object.keys(A2[j]),[Y]:Object.keys(A2[Y])};function G5(e){return~b5.indexOf(e)}function q5(e,c){let l=c.split("-"),s=l[0],a=l.slice(1).join("-");return s===e&&a!==""&&!G5(a)?a:null}var N6=()=>{let e=s=>w3(w2,(a,o,f)=>(a[f]=w3(o,s,{}),a),{});h6=e((s,a,o)=>(a[3]&&(s[a[3]]=o),a[2]&&a[2].filter(m=>typeof m=="number").forEach(m=>{s[m.toString(16)]=o}),s)),M6=e((s,a,o)=>(s[o]=o,a[2]&&a[2].filter(m=>typeof m=="string").forEach(m=>{s[m]=o}),s)),x6=e((s,a,o)=>{let f=a[2];return s[o]=o,f.forEach(m=>{s[m]=o}),s});let c="far"in w2||h.autoFetchSvg,l=w3(B5,(s,a)=>{let o=a[0],f=a[1],m=a[2];return f==="far"&&!c&&(f="fas"),typeof o=="string"&&(s.names[o]={prefix:f,iconName:m}),typeof o=="number"&&(s.unicodes[o.toString(16)]={prefix:f,iconName:m}),s},{names:{},unicodes:{}});C6=l.names,g6=l.unicodes,K3=K1(h.styleDefault,{family:h.familyDefault})};A5(e=>{K3=K1(e.styleDefault,{family:h.familyDefault})});N6();function Q3(e,c){return(h6[e]||{})[c]}function W5(e,c){return(M6[e]||{})[c]}function M2(e,c){return(x6[e]||{})[c]}function v6(e){return C6[e]||{prefix:null,iconName:null}}function j5(e){let c=g6[e],l=Q3("fas",e);return c||(l?{prefix:"fas",iconName:l}:null)||{prefix:null,iconName:null}}function g2(){return K3}var Z3=()=>({prefix:null,iconName:null,rest:[]});function K1(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:l=A}=c,s=A2[l][e],a=u1[l][e]||u1[l][s],o=e in n2.styles?e:null;return a||o||null}var Y5={[A]:Object.keys(_2[A]),[j]:Object.keys(_2[j]),[Y]:Object.keys(_2[Y])};function Q1(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:l=!1}=c,s={[A]:"".concat(h.cssPrefix,"-").concat(A),[j]:"".concat(h.cssPrefix,"-").concat(j),[Y]:"".concat(h.cssPrefix,"-").concat(Y)},a=null,o=A,f=c5.filter(L=>L!==s6);f.forEach(L=>{(e.includes(s[L])||e.some(d=>Y5[L].includes(d)))&&(o=L)});let m=e.reduce((L,d)=>{let M=q5(h.cssPrefix,d);if(w2[d]?(d=H5[o].includes(d)?g5[o][d]:d,a=d,L.prefix=d):U5[o].indexOf(d)>-1?(a=d,L.prefix=K1(d,{family:o})):M?L.iconName=M:d!==h.replacementClass&&!f.some(N=>d===s[N])&&L.rest.push(d),!l&&L.prefix&&L.iconName){let N=a==="fa"?v6(L.iconName):{},C=M2(L.prefix,L.iconName);N.prefix&&(a=null),L.iconName=N.iconName||C||L.iconName,L.prefix=N.prefix||L.prefix,L.prefix==="far"&&!w2.far&&w2.fas&&!h.autoFetchSvg&&(L.prefix="fas")}return L},Z3());return(e.includes("fa-brands")||e.includes("fab"))&&(m.prefix="fab"),(e.includes("fa-duotone")||e.includes("fad"))&&(m.prefix="fad"),!m.prefix&&o===j&&(w2.fass||h.autoFetchSvg)&&(m.prefix="fass",m.iconName=M2(m.prefix,m.iconName)||m.iconName),!m.prefix&&o===Y&&(w2.fasds||h.autoFetchSvg)&&(m.prefix="fasds",m.iconName=M2(m.prefix,m.iconName)||m.iconName),(m.prefix==="fa"||a==="fa")&&(m.prefix=g2()||"fas"),m}var V3=class{constructor(){this.definitions={}}add(){for(var c=arguments.length,l=new Array(c),s=0;s<c;s++)l[s]=arguments[s];let a=l.reduce(this._pullDefinitions,{});Object.keys(a).forEach(o=>{this.definitions[o]=z(z({},this.definitions[o]||{}),a[o]),I3(o,a[o]);let f=_2[A][o];f&&I3(f,a[o]),N6()})}reset(){this.definitions={}}_pullDefinitions(c,l){let s=l.prefix&&l.iconName&&l.icon?{0:l}:l;return Object.keys(s).map(a=>{let{prefix:o,iconName:f,icon:m}=s[a],L=m[2];c[o]||(c[o]={}),L.length>0&&L.forEach(d=>{typeof d=="string"&&(c[o][d]=m)}),c[o][f]=m}),c}},O0=[],H2={},U2={},X5=Object.keys(U2);function $5(e,c){let{mixoutsTo:l}=c;return O0=e,H2={},Object.keys(U2).forEach(s=>{X5.indexOf(s)===-1&&delete U2[s]}),O0.forEach(s=>{let a=s.mixout?s.mixout():{};if(Object.keys(a).forEach(o=>{typeof a[o]=="function"&&(l[o]=a[o]),typeof a[o]=="object"&&Object.keys(a[o]).forEach(f=>{l[o]||(l[o]={}),l[o][f]=a[o][f]})}),s.hooks){let o=s.hooks();Object.keys(o).forEach(f=>{H2[f]||(H2[f]=[]),H2[f].push(o[f])})}s.provides&&s.provides(U2)}),l}function O3(e,c){for(var l=arguments.length,s=new Array(l>2?l-2:0),a=2;a<l;a++)s[a-2]=arguments[a];return(H2[e]||[]).forEach(f=>{c=f.apply(null,[c,...s])}),c}function E2(e){for(var c=arguments.length,l=new Array(c>1?c-1:0),s=1;s<c;s++)l[s-1]=arguments[s];(H2[e]||[]).forEach(o=>{o.apply(null,l)})}function x2(){let e=arguments[0],c=Array.prototype.slice.call(arguments,1);return U2[e]?U2[e].apply(null,c):void 0}function R3(e){e.prefix==="fa"&&(e.prefix="fas");let{iconName:c}=e,l=e.prefix||g2();if(c)return c=M2(l,c)||c,I0(y6.definitions,l,c)||I0(n2.styles,l,c)}var y6=new V3,K5=()=>{h.autoReplaceSvg=!1,h.observeMutations=!1,E2("noAuto")},Q5={i2svg:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return p2?(E2("beforeI2svg",e),x2("pseudoElements2svg",e),x2("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c}=e;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,I5(()=>{J5({autoReplaceSvgRoot:c}),E2("watch",e)})}},Z5={icon:e=>{if(e===null)return null;if(typeof e=="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:M2(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){let c=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],l=K1(e[0]);return{prefix:l,iconName:M2(l,c)||c}}if(typeof e=="string"&&(e.indexOf("".concat(h.cssPrefix,"-"))>-1||e.match(x5))){let c=Q1(e.split(" "),{skipLookups:!0});return{prefix:c.prefix||g2(),iconName:M2(c.prefix,c.iconName)||c.iconName}}if(typeof e=="string"){let c=g2();return{prefix:c,iconName:M2(c,e)||e}}}},X={noAuto:K5,config:h,dom:Q5,parse:Z5,library:y6,findIconDefinition:R3,toHtml:p1},J5=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:c=w}=e;(Object.keys(n2.styles).length>0||h.autoFetchSvg)&&p2&&h.autoReplaceSvg&&X.dom.i2svg({node:c})};function Z1(e,c){return Object.defineProperty(e,"abstract",{get:c}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(l=>p1(l))}}),Object.defineProperty(e,"node",{get:function(){if(!p2)return;let l=w.createElement("div");return l.innerHTML=e.html,l.children}}),e}function c7(e){let{children:c,main:l,mask:s,attributes:a,styles:o,transform:f}=e;if($3(f)&&l.found&&!s.found){let{width:m,height:L}=l,d={x:m/L/2,y:.5};a.style=$1(v(z({},o),{"transform-origin":"".concat(d.x+f.x/16,"em ").concat(d.y+f.y/16,"em")}))}return[{tag:"svg",attributes:a,children:c}]}function e7(e){let{prefix:c,iconName:l,children:s,attributes:a,symbol:o}=e,f=o===!0?"".concat(c,"-").concat(h.cssPrefix,"-").concat(l):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:v(z({},a),{id:f}),children:s}]}]}function J3(e){let{icons:{main:c,mask:l},prefix:s,iconName:a,transform:o,symbol:f,title:m,maskId:L,titleId:d,extra:M,watchable:N=!1}=e,{width:C,height:D}=l.found?l:c,E=s==="fak",J=[h.replacementClass,a?"".concat(h.cssPrefix,"-").concat(a):""].filter(Q=>M.classes.indexOf(Q)===-1).filter(Q=>Q!==""||!!Q).concat(M.classes).join(" "),W={children:[],attributes:v(z({},M.attributes),{"data-prefix":s,"data-icon":a,class:J,role:M.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(C," ").concat(D)})},_=E&&!~M.classes.indexOf("fa-fw")?{width:"".concat(C/D*16*.0625,"em")}:{};N&&(W.attributes[k2]=""),m&&(W.children.push({tag:"title",attributes:{id:W.attributes["aria-labelledby"]||"title-".concat(d||z1())},children:[m]}),delete W.attributes.title);let P=v(z({},W),{prefix:s,iconName:a,main:c,mask:l,maskId:L,transform:o,symbol:f,styles:z(z({},_),M.styles)}),{children:O,attributes:a2}=l.found&&c.found?x2("generateAbstractMask",P)||{children:[],attributes:{}}:x2("generateAbstractIcon",P)||{children:[],attributes:{}};return P.children=O,P.attributes=a2,f?e7(P):c7(P)}function R0(e){let{content:c,width:l,height:s,transform:a,title:o,extra:f,watchable:m=!1}=e,L=v(z(z({},f.attributes),o?{title:o}:{}),{class:f.classes.join(" ")});m&&(L[k2]="");let d=z({},f.styles);$3(a)&&(d.transform=D5({transform:a,startCentered:!0,width:l,height:s}),d["-webkit-transform"]=d.transform);let M=$1(d);M.length>0&&(L.style=M);let N=[];return N.push({tag:"span",attributes:L,children:[c]}),o&&N.push({tag:"span",attributes:{class:"sr-only"},children:[o]}),N}function l7(e){let{content:c,title:l,extra:s}=e,a=v(z(z({},s.attributes),l?{title:l}:{}),{class:s.classes.join(" ")}),o=$1(s.styles);o.length>0&&(a.style=o);let f=[];return f.push({tag:"span",attributes:a,children:[c]}),l&&f.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),f}var{styles:A3}=n2;function B3(e){let c=e[0],l=e[1],[s]=e.slice(4),a=null;return Array.isArray(s)?a={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(b3.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(b3.SECONDARY),fill:"currentColor",d:s[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(b3.PRIMARY),fill:"currentColor",d:s[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:s}},{found:!0,width:c,height:l,icon:a}}var s7={found:!1,width:512,height:512};function n7(e,c){!o6&&!h.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(c,'" is missing.'))}function H3(e,c){let l=c;return c==="fa"&&h.styleDefault!==null&&(c=g2()),new Promise((s,a)=>{if(l==="fa"){let o=v6(e)||{};e=o.iconName||e,c=o.prefix||c}if(e&&c&&A3[c]&&A3[c][e]){let o=A3[c][e];return s(B3(o))}n7(e,c),s(v(z({},s7),{icon:h.showMissingIcons&&e?x2("missingIconAbstract")||{}:{}}))})}var B0=()=>{},U3=h.measurePerformance&&q1&&q1.mark&&q1.measure?q1:{mark:B0,measure:B0},r1='FA "6.6.0"',t7=e=>(U3.mark("".concat(r1," ").concat(e," begins")),()=>b6(e)),b6=e=>{U3.mark("".concat(r1," ").concat(e," ends")),U3.measure("".concat(r1," ").concat(e),"".concat(r1," ").concat(e," begins"),"".concat(r1," ").concat(e," ends"))},c4={begin:t7,end:b6},W1=()=>{};function H0(e){return typeof(e.getAttribute?e.getAttribute(k2):null)=="string"}function a7(e){let c=e.getAttribute?e.getAttribute(j3):null,l=e.getAttribute?e.getAttribute(Y3):null;return c&&l}function i7(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(h.replacementClass)}function o7(){return h.autoReplaceSvg===!0?j1.replace:j1[h.autoReplaceSvg]||j1.replace}function r7(e){return w.createElementNS("http://www.w3.org/2000/svg",e)}function f7(e){return w.createElement(e)}function S6(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:l=e.tag==="svg"?r7:f7}=c;if(typeof e=="string")return w.createTextNode(e);let s=l(e.tag);return Object.keys(e.attributes||[]).forEach(function(o){s.setAttribute(o,e.attributes[o])}),(e.children||[]).forEach(function(o){s.appendChild(S6(o,{ceFn:l}))}),s}function m7(e){let c=" ".concat(e.outerHTML," ");return c="".concat(c,"Font Awesome fontawesome.com "),c}var j1={replace:function(e){let c=e[0];if(c.parentNode)if(e[1].forEach(l=>{c.parentNode.insertBefore(S6(l),c)}),c.getAttribute(k2)===null&&h.keepOriginalSource){let l=w.createComment(m7(c));c.parentNode.replaceChild(l,c)}else c.remove()},nest:function(e){let c=e[0],l=e[1];if(~X3(c).indexOf(h.replacementClass))return j1.replace(e);let s=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete l[0].attributes.id,l[0].attributes.class){let o=l[0].attributes.class.split(" ").reduce((f,m)=>(m===h.replacementClass||m.match(s)?f.toSvg.push(m):f.toNode.push(m),f),{toNode:[],toSvg:[]});l[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?c.removeAttribute("class"):c.setAttribute("class",o.toNode.join(" "))}let a=l.map(o=>p1(o)).join(`
`);c.setAttribute(k2,""),c.innerHTML=a}};function U0(e){e()}function w6(e,c){let l=typeof c=="function"?c:W1;if(e.length===0)l();else{let s=U0;h.mutateApproach===M5&&(s=C2.requestAnimationFrame||U0),s(()=>{let a=o7(),o=c4.begin("mutate");e.map(a),o(),l()})}}var e4=!1;function A6(){e4=!0}function G3(){e4=!1}var X1=null;function G0(e){if(!E0||!h.observeMutations)return;let{treeCallback:c=W1,nodeCallback:l=W1,pseudoElementsCallback:s=W1,observeMutationsRoot:a=w}=e;X1=new E0(o=>{if(e4)return;let f=g2();W2(o).forEach(m=>{if(m.type==="childList"&&m.addedNodes.length>0&&!H0(m.addedNodes[0])&&(h.searchPseudoElements&&s(m.target),c(m.target)),m.type==="attributes"&&m.target.parentNode&&h.searchPseudoElements&&s(m.target.parentNode),m.type==="attributes"&&H0(m.target)&&~y5.indexOf(m.attributeName))if(m.attributeName==="class"&&a7(m.target)){let{prefix:L,iconName:d}=Q1(X3(m.target));m.target.setAttribute(j3,L||f),d&&m.target.setAttribute(Y3,d)}else i7(m.target)&&l(m.target)})}),p2&&X1.observe(a,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function u7(){X1&&X1.disconnect()}function z7(e){let c=e.getAttribute("style"),l=[];return c&&(l=c.split(";").reduce((s,a)=>{let o=a.split(":"),f=o[0],m=o.slice(1);return f&&m.length>0&&(s[f]=m.join(":").trim()),s},{})),l}function L7(e){let c=e.getAttribute("data-prefix"),l=e.getAttribute("data-icon"),s=e.innerText!==void 0?e.innerText.trim():"",a=Q1(X3(e));return a.prefix||(a.prefix=g2()),c&&l&&(a.prefix=c,a.iconName=l),a.iconName&&a.prefix||(a.prefix&&s.length>0&&(a.iconName=W5(a.prefix,e.innerText)||Q3(a.prefix,F3(e.innerText))),!a.iconName&&h.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(a.iconName=e.firstChild.data)),a}function p7(e){let c=W2(e.attributes).reduce((a,o)=>(a.name!=="class"&&a.name!=="style"&&(a[o.name]=o.value),a),{}),l=e.getAttribute("title"),s=e.getAttribute("data-fa-title-id");return h.autoA11y&&(l?c["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(s||z1()):(c["aria-hidden"]="true",c.focusable="false")),c}function d7(){return{iconName:null,title:null,titleId:null,prefix:null,transform:s2,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function q0(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:l,prefix:s,rest:a}=L7(e),o=p7(e),f=O3("parseNodeAttributes",{},e),m=c.styleParser?z7(e):[];return z({iconName:l,title:e.getAttribute("title"),titleId:e.getAttribute("data-fa-title-id"),prefix:s,transform:s2,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:m,attributes:o}},f)}var{styles:h7}=n2;function _6(e){let c=h.autoReplaceSvg==="nest"?q0(e,{styleParser:!1}):q0(e);return~c.extra.classes.indexOf(m6)?x2("generateLayersText",e,c):x2("generateSvgReplacementMutation",e,c)}var t2=new Set;r6.map(e=>{t2.add("fa-".concat(e))});Object.keys(A2[A]).map(t2.add.bind(t2));Object.keys(A2[j]).map(t2.add.bind(t2));Object.keys(A2[Y]).map(t2.add.bind(t2));t2=[...t2];function W0(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!p2)return Promise.resolve();let l=w.documentElement.classList,s=M=>l.add("".concat(P0,"-").concat(M)),a=M=>l.remove("".concat(P0,"-").concat(M)),o=h.autoFetchSvg?t2:r6.map(M=>"fa-".concat(M)).concat(Object.keys(h7));o.includes("fa")||o.push("fa");let f=[".".concat(m6,":not([").concat(k2,"])")].concat(o.map(M=>".".concat(M,":not([").concat(k2,"])"))).join(", ");if(f.length===0)return Promise.resolve();let m=[];try{m=W2(e.querySelectorAll(f))}catch{}if(m.length>0)s("pending"),a("complete");else return Promise.resolve();let L=c4.begin("onTree"),d=m.reduce((M,N)=>{try{let C=_6(N);C&&M.push(C)}catch(C){o6||C.name==="MissingIcon"&&console.error(C)}return M},[]);return new Promise((M,N)=>{Promise.all(d).then(C=>{w6(C,()=>{s("active"),s("complete"),a("pending"),typeof c=="function"&&c(),L(),M()})}).catch(C=>{L(),N(C)})})}function M7(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;_6(e).then(l=>{l&&w6([l],c)})}function C7(e){return function(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=(c||{}).icon?c:R3(c||{}),{mask:a}=l;return a&&(a=(a||{}).icon?a:R3(a||{})),e(s,v(z({},l),{mask:a}))}}var g7=function(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=s2,symbol:s=!1,mask:a=null,maskId:o=null,title:f=null,titleId:m=null,classes:L=[],attributes:d={},styles:M={}}=c;if(!e)return;let{prefix:N,iconName:C,icon:D}=e;return Z1(z({type:"icon"},e),()=>(E2("beforeDOMElementCreation",{iconDefinition:e,params:c}),h.autoA11y&&(f?d["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(m||z1()):(d["aria-hidden"]="true",d.focusable="false")),J3({icons:{main:B3(D),mask:a?B3(a.icon):{found:!1,width:null,height:null,icon:{}}},prefix:N,iconName:C,transform:z(z({},s2),l),symbol:s,title:f,maskId:o,titleId:m,extra:{attributes:d,styles:M,classes:L}})))},x7={mixout(){return{icon:C7(g7)}},hooks(){return{mutationObserverCallbacks(e){return e.treeCallback=W0,e.nodeCallback=M7,e}}},provides(e){e.i2svg=function(c){let{node:l=w,callback:s=()=>{}}=c;return W0(l,s)},e.generateSvgReplacementMutation=function(c,l){let{iconName:s,title:a,titleId:o,prefix:f,transform:m,symbol:L,mask:d,maskId:M,extra:N}=l;return new Promise((C,D)=>{Promise.all([H3(s,f),d.iconName?H3(d.iconName,d.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(E=>{let[J,W]=E;C([c,J3({icons:{main:J,mask:W},prefix:f,iconName:s,transform:m,symbol:L,maskId:M,title:a,titleId:o,extra:N,watchable:!0})])}).catch(D)})},e.generateAbstractIcon=function(c){let{children:l,attributes:s,main:a,transform:o,styles:f}=c,m=$1(f);m.length>0&&(s.style=m);let L;return $3(o)&&(L=x2("generateAbstractTransformGrouping",{main:a,transform:o,containerWidth:a.width,iconWidth:a.width})),l.push(L||a.icon),{children:l,attributes:s}}}},N7={mixout(){return{layer(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:l=[]}=c;return Z1({type:"layer"},()=>{E2("beforeDOMElementCreation",{assembler:e,params:c});let s=[];return e(a=>{Array.isArray(a)?a.map(o=>{s=s.concat(o.abstract)}):s=s.concat(a.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers"),...l].join(" ")},children:s}]})}}}},v7={mixout(){return{counter(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:l=null,classes:s=[],attributes:a={},styles:o={}}=c;return Z1({type:"counter",content:e},()=>(E2("beforeDOMElementCreation",{content:e,params:c}),l7({content:e.toString(),title:l,extra:{attributes:a,styles:o,classes:["".concat(h.cssPrefix,"-layers-counter"),...s]}})))}}}},y7={mixout(){return{text(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=s2,title:s=null,classes:a=[],attributes:o={},styles:f={}}=c;return Z1({type:"text",content:e},()=>(E2("beforeDOMElementCreation",{content:e,params:c}),R0({content:e,transform:z(z({},s2),l),title:s,extra:{attributes:o,styles:f,classes:["".concat(h.cssPrefix,"-layers-text"),...a]}})))}}},provides(e){e.generateLayersText=function(c,l){let{title:s,transform:a,extra:o}=l,f=null,m=null;if(l6){let L=parseInt(getComputedStyle(c).fontSize,10),d=c.getBoundingClientRect();f=d.width/L,m=d.height/L}return h.autoA11y&&!s&&(o.attributes["aria-hidden"]="true"),Promise.resolve([c,R0({content:c.innerHTML,width:f,height:m,transform:a,title:s,extra:o,watchable:!0})])}}},b7=new RegExp('"',"ug"),j0=[1105920,1112319],Y0=z(z(z({FontAwesome:{normal:"fas",400:"fas"}},a5),t5),L5),q3=Object.keys(Y0).reduce((e,c)=>(e[c.toLowerCase()]=Y0[c],e),{}),S7=Object.keys(q3).reduce((e,c)=>{let l=q3[c];return e[c]=l[900]||[...Object.entries(l)][0][1],e},{});function w7(e){let c=e.replace(b7,""),l=R5(c,0),s=l>=j0[0]&&l<=j0[1],a=c.length===2?c[0]===c[1]:!1;return{value:F3(a?c[0]:c),isSecondary:s||a}}function A7(e,c){let l=e.replace(/^['"]|['"]$/g,"").toLowerCase(),s=parseInt(c),a=isNaN(s)?"normal":s;return(q3[l]||{})[a]||S7[l]}function X0(e,c){let l="".concat(h5).concat(c.replace(":","-"));return new Promise((s,a)=>{if(e.getAttribute(l)!==null)return s();let f=W2(e.children).filter(C=>C.getAttribute(E3)===c)[0],m=C2.getComputedStyle(e,c),L=m.getPropertyValue("font-family"),d=L.match(N5),M=m.getPropertyValue("font-weight"),N=m.getPropertyValue("content");if(f&&!d)return e.removeChild(f),s();if(d&&N!=="none"&&N!==""){let C=m.getPropertyValue("content"),D=A7(L,M),{value:E,isSecondary:J}=w7(C),W=d[0].startsWith("FontAwesome"),_=Q3(D,E),P=_;if(W){let O=j5(E);O.iconName&&O.prefix&&(_=O.iconName,D=O.prefix)}if(_&&!J&&(!f||f.getAttribute(j3)!==D||f.getAttribute(Y3)!==P)){e.setAttribute(l,P),f&&e.removeChild(f);let O=d7(),{extra:a2}=O;a2.attributes[E3]=c,H3(_,D).then(Q=>{let T2=J3(v(z({},O),{icons:{main:Q,mask:Z3()},prefix:D,iconName:P,extra:a2,watchable:!0})),D2=w.createElementNS("http://www.w3.org/2000/svg","svg");c==="::before"?e.insertBefore(D2,e.firstChild):e.appendChild(D2),D2.outerHTML=T2.map(i2=>p1(i2)).join(`
`),e.removeAttribute(l),s()}).catch(a)}else s()}else s()})}function _7(e){return Promise.all([X0(e,"::before"),X0(e,"::after")])}function k7(e){return e.parentNode!==document.head&&!~C5.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(E3)&&(!e.parentNode||e.parentNode.tagName!=="svg")}function $0(e){if(p2)return new Promise((c,l)=>{let s=W2(e.querySelectorAll("*")).filter(k7).map(_7),a=c4.begin("searchPseudoElements");A6(),Promise.all(s).then(()=>{a(),G3(),c()}).catch(()=>{a(),G3(),l()})})}var E7={hooks(){return{mutationObserverCallbacks(e){return e.pseudoElementsCallback=$0,e}}},provides(e){e.pseudoElements2svg=function(c){let{node:l=w}=c;h.searchPseudoElements&&$0(l)}}},K0=!1,T7={mixout(){return{dom:{unwatch(){A6(),K0=!0}}}},hooks(){return{bootstrap(){G0(O3("mutationObserverCallbacks",{}))},noAuto(){u7()},watch(e){let{observeMutationsRoot:c}=e;K0?G3():G0(O3("mutationObserverCallbacks",{observeMutationsRoot:c}))}}}},Q0=e=>{let c={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce((l,s)=>{let a=s.toLowerCase().split("-"),o=a[0],f=a.slice(1).join("-");if(o&&f==="h")return l.flipX=!0,l;if(o&&f==="v")return l.flipY=!0,l;if(f=parseFloat(f),isNaN(f))return l;switch(o){case"grow":l.size=l.size+f;break;case"shrink":l.size=l.size-f;break;case"left":l.x=l.x-f;break;case"right":l.x=l.x+f;break;case"up":l.y=l.y-f;break;case"down":l.y=l.y+f;break;case"rotate":l.rotate=l.rotate+f;break}return l},c)},D7={mixout(){return{parse:{transform:e=>Q0(e)}}},hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-transform");return l&&(e.transform=Q0(l)),e}}},provides(e){e.generateAbstractTransformGrouping=function(c){let{main:l,transform:s,containerWidth:a,iconWidth:o}=c,f={transform:"translate(".concat(a/2," 256)")},m="translate(".concat(s.x*32,", ").concat(s.y*32,") "),L="scale(".concat(s.size/16*(s.flipX?-1:1),", ").concat(s.size/16*(s.flipY?-1:1),") "),d="rotate(".concat(s.rotate," 0 0)"),M={transform:"".concat(m," ").concat(L," ").concat(d)},N={transform:"translate(".concat(o/2*-1," -256)")},C={outer:f,inner:M,path:N};return{tag:"g",attributes:z({},C.outer),children:[{tag:"g",attributes:z({},C.inner),children:[{tag:l.icon.tag,children:l.icon.children,attributes:z(z({},l.icon.attributes),C.path)}]}]}}}},_3={x:0,y:0,width:"100%",height:"100%"};function Z0(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||c)&&(e.attributes.fill="black"),e}function P7(e){return e.tag==="g"?e.children:[e]}var F7={hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-mask"),s=l?Q1(l.split(" ").map(a=>a.trim())):Z3();return s.prefix||(s.prefix=g2()),e.mask=s,e.maskId=c.getAttribute("data-fa-mask-id"),e}}},provides(e){e.generateAbstractMask=function(c){let{children:l,attributes:s,main:a,mask:o,maskId:f,transform:m}=c,{width:L,icon:d}=a,{width:M,icon:N}=o,C=T5({transform:m,containerWidth:M,iconWidth:L}),D={tag:"rect",attributes:v(z({},_3),{fill:"white"})},E=d.children?{children:d.children.map(Z0)}:{},J={tag:"g",attributes:z({},C.inner),children:[Z0(z({tag:d.tag,attributes:z(z({},d.attributes),C.path)},E))]},W={tag:"g",attributes:z({},C.outer),children:[J]},_="mask-".concat(f||z1()),P="clip-".concat(f||z1()),O={tag:"mask",attributes:v(z({},_3),{id:_,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[D,W]},a2={tag:"defs",children:[{tag:"clipPath",attributes:{id:P},children:P7(N)},O]};return l.push(a2,{tag:"rect",attributes:z({fill:"currentColor","clip-path":"url(#".concat(P,")"),mask:"url(#".concat(_,")")},_3)}),{children:l,attributes:s}}}},I7={provides(e){let c=!1;C2.matchMedia&&(c=C2.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){let l=[],s={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};l.push({tag:"path",attributes:v(z({},s),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let o=v(z({},a),{attributeName:"opacity"}),f={tag:"circle",attributes:v(z({},s),{cx:"256",cy:"364",r:"28"}),children:[]};return c||f.children.push({tag:"animate",attributes:v(z({},a),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:v(z({},o),{values:"1;0;1;1;0;1;"})}),l.push(f),l.push({tag:"path",attributes:v(z({},s),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:c?[]:[{tag:"animate",attributes:v(z({},o),{values:"1;0;0;0;0;1;"})}]}),c||l.push({tag:"path",attributes:v(z({},s),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:v(z({},o),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:l}}}},V7={hooks(){return{parseNodeAttributes(e,c){let l=c.getAttribute("data-fa-symbol"),s=l===null?!1:l===""?!0:l;return e.symbol=s,e}}}},O7=[F5,x7,N7,v7,y7,E7,T7,D7,F7,I7,V7];$5(O7,{mixoutsTo:X});var bc=X.noAuto,R7=X.config,Sc=X.library,B7=X.dom,H7=X.parse,wc=X.findIconDefinition,Ac=X.toHtml,U7=X.icon,_c=X.layer,G7=X.text,q7=X.counter;var k6=(()=>{let c=class c{};c.\u0275fac=function(a){return new(a||c)},c.\u0275mod=u2({type:c}),c.\u0275inj=m2({});let e=c;return e})();var l4=class extends U4{override={swipe:{direction:Hammer.DIRECTION_ALL}}},J1=class e{static \u0275fac=function(l){return new(l||e)};static \u0275mod=u2({type:e,bootstrap:[G1]});static \u0275inj=m2({providers:[{provide:H4,useClass:l4}],imports:[B4,U1,k6,z0,G4]})};R4().bootstrapModule(J1,{ngZoneEventCoalescing:!0}).catch(e=>console.error(e));
