import{$ as Nn,A as dt,B as Oe,C as re,D as Sn,E as Ki,F as C,G as E,H as Ne,I as Vn,J as M,K as F,L as w,M as Ce,N as ft,O as Zi,P as Ji,Q as Qi,R as On,S as er,T as tr,U as nr,W as ir,X as rr,Y as sr,Z as zt,_ as Fe,a as h,aa as or,b as A,ba as Gt,c as xo,ca as ar,d as Wi,e as Yi,ea as lr,f as $i,g as Xi,ga as cr,h as qi,ha as ur,i as Mn,ia as dr,j as Ut,ja as Fn,k as he,ka as fr,l as Be,la as hr,m as Ve,ma as Bt,n as me,na as mr,o as pe,oa as Pn,p as Tn,q as k,r as R,s as ut,t as ge,u as We,v as D,w as O,x as jt,y as Ht,z as Ye}from"./chunk-ERUNHZLC.js";var kn=xo((nc,Wt)=>{(function(t,e,n,i){"use strict";var s=["","webkit","Moz","MS","ms","o"],l=e.createElement("div"),u="function",d=Math.round,m=Math.abs,g=Date.now;function y(r,o,a){return setTimeout(U(r,a),o)}function x(r,o,a){return Array.isArray(r)?(_(r,a[o],a),!0):!1}function _(r,o,a){var c;if(r)if(r.forEach)r.forEach(o,a);else if(r.length!==i)for(c=0;c<r.length;)o.call(a,r[c],c,r),c++;else for(c in r)r.hasOwnProperty(c)&&o.call(a,r[c],c,r)}function L(r,o,a){var c="DEPRECATED METHOD: "+o+`
`+a+` AT 
`;return function(){var f=new Error("get-stack-trace"),p=f&&f.stack?f.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",b=t.console&&(t.console.warn||t.console.log);return b&&b.call(t.console,c,p),r.apply(this,arguments)}}var N;typeof Object.assign!="function"?N=function(o){if(o===i||o===null)throw new TypeError("Cannot convert undefined or null to object");for(var a=Object(o),c=1;c<arguments.length;c++){var f=arguments[c];if(f!==i&&f!==null)for(var p in f)f.hasOwnProperty(p)&&(a[p]=f[p])}return a}:N=Object.assign;var ee=L(function(o,a,c){for(var f=Object.keys(a),p=0;p<f.length;)(!c||c&&o[f[p]]===i)&&(o[f[p]]=a[f[p]]),p++;return o},"extend","Use `assign`."),Y=L(function(o,a){return ee(o,a,!0)},"merge","Use `assign`.");function S(r,o,a){var c=o.prototype,f;f=r.prototype=Object.create(c),f.constructor=r,f._super=c,a&&N(f,a)}function U(r,o){return function(){return r.apply(o,arguments)}}function z(r,o){return typeof r==u?r.apply(o&&o[0]||i,o):r}function le(r,o){return r===i?o:r}function J(r,o,a){_(Dt(o),function(c){r.addEventListener(c,a,!1)})}function je(r,o,a){_(Dt(o),function(c){r.removeEventListener(c,a,!1)})}function He(r,o){for(;r;){if(r==o)return!0;r=r.parentNode}return!1}function ce(r,o){return r.indexOf(o)>-1}function Dt(r){return r.trim().split(/\s+/g)}function ze(r,o,a){if(r.indexOf&&!a)return r.indexOf(o);for(var c=0;c<r.length;){if(a&&r[c][a]==o||!a&&r[c]===o)return c;c++}return-1}function It(r){return Array.prototype.slice.call(r,0)}function xi(r,o,a){for(var c=[],f=[],p=0;p<r.length;){var b=o?r[p][o]:r[p];ze(f,b)<0&&c.push(r[p]),f[p]=b,p++}return a&&(o?c=c.sort(function(j,B){return j[o]>B[o]}):c=c.sort()),c}function Mt(r,o){for(var a,c,f=o[0].toUpperCase()+o.slice(1),p=0;p<s.length;){if(a=s[p],c=a?a+f:o,c in r)return c;p++}return i}var Hs=1;function zs(){return Hs++}function Ai(r){var o=r.ownerDocument||r;return o.defaultView||o.parentWindow||t}var Gs=/mobile|tablet|ip(ad|hone|od)|android/i,wi="ontouchstart"in t,Bs=Mt(t,"PointerEvent")!==i,Ws=wi&&Gs.test(navigator.userAgent),nt="touch",Ys="pen",vn="mouse",$s="kinect",Xs=25,G=1,Me=2,V=4,W=8,Tt=1,it=2,rt=4,st=8,ot=16,te=it|rt,Te=st|ot,Di=te|Te,Ii=["x","y"],St=["clientX","clientY"];function K(r,o){var a=this;this.manager=r,this.callback=o,this.element=r.element,this.target=r.options.inputTarget,this.domHandler=function(c){z(r.options.enable,[r])&&a.handler(c)},this.init()}K.prototype={handler:function(){},init:function(){this.evEl&&J(this.element,this.evEl,this.domHandler),this.evTarget&&J(this.target,this.evTarget,this.domHandler),this.evWin&&J(Ai(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&je(this.element,this.evEl,this.domHandler),this.evTarget&&je(this.target,this.evTarget,this.domHandler),this.evWin&&je(Ai(this.element),this.evWin,this.domHandler)}};function qs(r){var o,a=r.options.inputClass;return a?o=a:Bs?o=_n:Ws?o=Nt:wi?o=bn:o=Ot,new o(r,Ks)}function Ks(r,o,a){var c=a.pointers.length,f=a.changedPointers.length,p=o&G&&c-f===0,b=o&(V|W)&&c-f===0;a.isFirst=!!p,a.isFinal=!!b,p&&(r.session={}),a.eventType=o,Zs(r,a),r.emit("hammer.input",a),r.recognize(a),r.session.prevInput=a}function Zs(r,o){var a=r.session,c=o.pointers,f=c.length;a.firstInput||(a.firstInput=Mi(o)),f>1&&!a.firstMultiple?a.firstMultiple=Mi(o):f===1&&(a.firstMultiple=!1);var p=a.firstInput,b=a.firstMultiple,P=b?b.center:p.center,j=o.center=Ti(c);o.timeStamp=g(),o.deltaTime=o.timeStamp-p.timeStamp,o.angle=yn(P,j),o.distance=Vt(P,j),Js(a,o),o.offsetDirection=Vi(o.deltaX,o.deltaY);var B=Si(o.deltaTime,o.deltaX,o.deltaY);o.overallVelocityX=B.x,o.overallVelocityY=B.y,o.overallVelocity=m(B.x)>m(B.y)?B.x:B.y,o.scale=b?to(b.pointers,c):1,o.rotation=b?eo(b.pointers,c):0,o.maxPointers=a.prevInput?o.pointers.length>a.prevInput.maxPointers?o.pointers.length:a.prevInput.maxPointers:o.pointers.length,Qs(a,o);var ie=r.element;He(o.srcEvent.target,ie)&&(ie=o.srcEvent.target),o.target=ie}function Js(r,o){var a=o.center,c=r.offsetDelta||{},f=r.prevDelta||{},p=r.prevInput||{};(o.eventType===G||p.eventType===V)&&(f=r.prevDelta={x:p.deltaX||0,y:p.deltaY||0},c=r.offsetDelta={x:a.x,y:a.y}),o.deltaX=f.x+(a.x-c.x),o.deltaY=f.y+(a.y-c.y)}function Qs(r,o){var a=r.lastInterval||o,c=o.timeStamp-a.timeStamp,f,p,b,P;if(o.eventType!=W&&(c>Xs||a.velocity===i)){var j=o.deltaX-a.deltaX,B=o.deltaY-a.deltaY,ie=Si(c,j,B);p=ie.x,b=ie.y,f=m(ie.x)>m(ie.y)?ie.x:ie.y,P=Vi(j,B),r.lastInterval=o}else f=a.velocity,p=a.velocityX,b=a.velocityY,P=a.direction;o.velocity=f,o.velocityX=p,o.velocityY=b,o.direction=P}function Mi(r){for(var o=[],a=0;a<r.pointers.length;)o[a]={clientX:d(r.pointers[a].clientX),clientY:d(r.pointers[a].clientY)},a++;return{timeStamp:g(),pointers:o,center:Ti(o),deltaX:r.deltaX,deltaY:r.deltaY}}function Ti(r){var o=r.length;if(o===1)return{x:d(r[0].clientX),y:d(r[0].clientY)};for(var a=0,c=0,f=0;f<o;)a+=r[f].clientX,c+=r[f].clientY,f++;return{x:d(a/o),y:d(c/o)}}function Si(r,o,a){return{x:o/r||0,y:a/r||0}}function Vi(r,o){return r===o?Tt:m(r)>=m(o)?r<0?it:rt:o<0?st:ot}function Vt(r,o,a){a||(a=Ii);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.sqrt(c*c+f*f)}function yn(r,o,a){a||(a=Ii);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.atan2(f,c)*180/Math.PI}function eo(r,o){return yn(o[1],o[0],St)+yn(r[1],r[0],St)}function to(r,o){return Vt(o[0],o[1],St)/Vt(r[0],r[1],St)}var no={mousedown:G,mousemove:Me,mouseup:V},io="mousedown",ro="mousemove mouseup";function Ot(){this.evEl=io,this.evWin=ro,this.pressed=!1,K.apply(this,arguments)}S(Ot,K,{handler:function(o){var a=no[o.type];a&G&&o.button===0&&(this.pressed=!0),a&Me&&o.which!==1&&(a=V),this.pressed&&(a&V&&(this.pressed=!1),this.callback(this.manager,a,{pointers:[o],changedPointers:[o],pointerType:vn,srcEvent:o}))}});var so={pointerdown:G,pointermove:Me,pointerup:V,pointercancel:W,pointerout:W},oo={2:nt,3:Ys,4:vn,5:$s},Oi="pointerdown",Ni="pointermove pointerup pointercancel";t.MSPointerEvent&&!t.PointerEvent&&(Oi="MSPointerDown",Ni="MSPointerMove MSPointerUp MSPointerCancel");function _n(){this.evEl=Oi,this.evWin=Ni,K.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}S(_n,K,{handler:function(o){var a=this.store,c=!1,f=o.type.toLowerCase().replace("ms",""),p=so[f],b=oo[o.pointerType]||o.pointerType,P=b==nt,j=ze(a,o.pointerId,"pointerId");p&G&&(o.button===0||P)?j<0&&(a.push(o),j=a.length-1):p&(V|W)&&(c=!0),!(j<0)&&(a[j]=o,this.callback(this.manager,p,{pointers:a,changedPointers:[o],pointerType:b,srcEvent:o}),c&&a.splice(j,1))}});var ao={touchstart:G,touchmove:Me,touchend:V,touchcancel:W},lo="touchstart",co="touchstart touchmove touchend touchcancel";function Fi(){this.evTarget=lo,this.evWin=co,this.started=!1,K.apply(this,arguments)}S(Fi,K,{handler:function(o){var a=ao[o.type];if(a===G&&(this.started=!0),!!this.started){var c=uo.call(this,o,a);a&(V|W)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:nt,srcEvent:o})}}});function uo(r,o){var a=It(r.touches),c=It(r.changedTouches);return o&(V|W)&&(a=xi(a.concat(c),"identifier",!0)),[a,c]}var fo={touchstart:G,touchmove:Me,touchend:V,touchcancel:W},ho="touchstart touchmove touchend touchcancel";function Nt(){this.evTarget=ho,this.targetIds={},K.apply(this,arguments)}S(Nt,K,{handler:function(o){var a=fo[o.type],c=mo.call(this,o,a);c&&this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:nt,srcEvent:o})}});function mo(r,o){var a=It(r.touches),c=this.targetIds;if(o&(G|Me)&&a.length===1)return c[a[0].identifier]=!0,[a,a];var f,p,b=It(r.changedTouches),P=[],j=this.target;if(p=a.filter(function(B){return He(B.target,j)}),o===G)for(f=0;f<p.length;)c[p[f].identifier]=!0,f++;for(f=0;f<b.length;)c[b[f].identifier]&&P.push(b[f]),o&(V|W)&&delete c[b[f].identifier],f++;if(P.length)return[xi(p.concat(P),"identifier",!0),P]}var po=2500,Pi=25;function bn(){K.apply(this,arguments);var r=U(this.handler,this);this.touch=new Nt(this.manager,r),this.mouse=new Ot(this.manager,r),this.primaryTouch=null,this.lastTouches=[]}S(bn,K,{handler:function(o,a,c){var f=c.pointerType==nt,p=c.pointerType==vn;if(!(p&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(f)go.call(this,a,c);else if(p&&vo.call(this,c))return;this.callback(o,a,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function go(r,o){r&G?(this.primaryTouch=o.changedPointers[0].identifier,ki.call(this,o)):r&(V|W)&&ki.call(this,o)}function ki(r){var o=r.changedPointers[0];if(o.identifier===this.primaryTouch){var a={x:o.clientX,y:o.clientY};this.lastTouches.push(a);var c=this.lastTouches,f=function(){var p=c.indexOf(a);p>-1&&c.splice(p,1)};setTimeout(f,po)}}function vo(r){for(var o=r.srcEvent.clientX,a=r.srcEvent.clientY,c=0;c<this.lastTouches.length;c++){var f=this.lastTouches[c],p=Math.abs(o-f.x),b=Math.abs(a-f.y);if(p<=Pi&&b<=Pi)return!0}return!1}var Ri=Mt(l.style,"touchAction"),Li=Ri!==i,Ui="compute",ji="auto",Cn="manipulation",Se="none",at="pan-x",lt="pan-y",Ft=_o();function En(r,o){this.manager=r,this.set(o)}En.prototype={set:function(r){r==Ui&&(r=this.compute()),Li&&this.manager.element.style&&Ft[r]&&(this.manager.element.style[Ri]=r),this.actions=r.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var r=[];return _(this.manager.recognizers,function(o){z(o.options.enable,[o])&&(r=r.concat(o.getTouchAction()))}),yo(r.join(" "))},preventDefaults:function(r){var o=r.srcEvent,a=r.offsetDirection;if(this.manager.session.prevented){o.preventDefault();return}var c=this.actions,f=ce(c,Se)&&!Ft[Se],p=ce(c,lt)&&!Ft[lt],b=ce(c,at)&&!Ft[at];if(f){var P=r.pointers.length===1,j=r.distance<2,B=r.deltaTime<250;if(P&&j&&B)return}if(!(b&&p)&&(f||p&&a&te||b&&a&Te))return this.preventSrc(o)},preventSrc:function(r){this.manager.session.prevented=!0,r.preventDefault()}};function yo(r){if(ce(r,Se))return Se;var o=ce(r,at),a=ce(r,lt);return o&&a?Se:o||a?o?at:lt:ce(r,Cn)?Cn:ji}function _o(){if(!Li)return!1;var r={},o=t.CSS&&t.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(a){r[a]=o?t.CSS.supports("touch-action",a):!0}),r}var Pt=1,Z=2,Ge=4,be=8,ue=be,ct=16,ne=32;function de(r){this.options=N({},this.defaults,r||{}),this.id=zs(),this.manager=null,this.options.enable=le(this.options.enable,!0),this.state=Pt,this.simultaneous={},this.requireFail=[]}de.prototype={defaults:{},set:function(r){return N(this.options,r),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(r){if(x(r,"recognizeWith",this))return this;var o=this.simultaneous;return r=kt(r,this),o[r.id]||(o[r.id]=r,r.recognizeWith(this)),this},dropRecognizeWith:function(r){return x(r,"dropRecognizeWith",this)?this:(r=kt(r,this),delete this.simultaneous[r.id],this)},requireFailure:function(r){if(x(r,"requireFailure",this))return this;var o=this.requireFail;return r=kt(r,this),ze(o,r)===-1&&(o.push(r),r.requireFailure(this)),this},dropRequireFailure:function(r){if(x(r,"dropRequireFailure",this))return this;r=kt(r,this);var o=ze(this.requireFail,r);return o>-1&&this.requireFail.splice(o,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(r){return!!this.simultaneous[r.id]},emit:function(r){var o=this,a=this.state;function c(f){o.manager.emit(f,r)}a<be&&c(o.options.event+Hi(a)),c(o.options.event),r.additionalEvent&&c(r.additionalEvent),a>=be&&c(o.options.event+Hi(a))},tryEmit:function(r){if(this.canEmit())return this.emit(r);this.state=ne},canEmit:function(){for(var r=0;r<this.requireFail.length;){if(!(this.requireFail[r].state&(ne|Pt)))return!1;r++}return!0},recognize:function(r){var o=N({},r);if(!z(this.options.enable,[this,o])){this.reset(),this.state=ne;return}this.state&(ue|ct|ne)&&(this.state=Pt),this.state=this.process(o),this.state&(Z|Ge|be|ct)&&this.tryEmit(o)},process:function(r){},getTouchAction:function(){},reset:function(){}};function Hi(r){return r&ct?"cancel":r&be?"end":r&Ge?"move":r&Z?"start":""}function zi(r){return r==ot?"down":r==st?"up":r==it?"left":r==rt?"right":""}function kt(r,o){var a=o.manager;return a?a.get(r):r}function Q(){de.apply(this,arguments)}S(Q,de,{defaults:{pointers:1},attrTest:function(r){var o=this.options.pointers;return o===0||r.pointers.length===o},process:function(r){var o=this.state,a=r.eventType,c=o&(Z|Ge),f=this.attrTest(r);return c&&(a&W||!f)?o|ct:c||f?a&V?o|be:o&Z?o|Ge:Z:ne}});function Rt(){Q.apply(this,arguments),this.pX=null,this.pY=null}S(Rt,Q,{defaults:{event:"pan",threshold:10,pointers:1,direction:Di},getTouchAction:function(){var r=this.options.direction,o=[];return r&te&&o.push(lt),r&Te&&o.push(at),o},directionTest:function(r){var o=this.options,a=!0,c=r.distance,f=r.direction,p=r.deltaX,b=r.deltaY;return f&o.direction||(o.direction&te?(f=p===0?Tt:p<0?it:rt,a=p!=this.pX,c=Math.abs(r.deltaX)):(f=b===0?Tt:b<0?st:ot,a=b!=this.pY,c=Math.abs(r.deltaY))),r.direction=f,a&&c>o.threshold&&f&o.direction},attrTest:function(r){return Q.prototype.attrTest.call(this,r)&&(this.state&Z||!(this.state&Z)&&this.directionTest(r))},emit:function(r){this.pX=r.deltaX,this.pY=r.deltaY;var o=zi(r.direction);o&&(r.additionalEvent=this.options.event+o),this._super.emit.call(this,r)}});function xn(){Q.apply(this,arguments)}S(xn,Q,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Se]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.scale-1)>this.options.threshold||this.state&Z)},emit:function(r){if(r.scale!==1){var o=r.scale<1?"in":"out";r.additionalEvent=this.options.event+o}this._super.emit.call(this,r)}});function An(){de.apply(this,arguments),this._timer=null,this._input=null}S(An,de,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[ji]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime>o.time;if(this._input=r,!c||!a||r.eventType&(V|W)&&!f)this.reset();else if(r.eventType&G)this.reset(),this._timer=y(function(){this.state=ue,this.tryEmit()},o.time,this);else if(r.eventType&V)return ue;return ne},reset:function(){clearTimeout(this._timer)},emit:function(r){this.state===ue&&(r&&r.eventType&V?this.manager.emit(this.options.event+"up",r):(this._input.timeStamp=g(),this.manager.emit(this.options.event,this._input)))}});function wn(){Q.apply(this,arguments)}S(wn,Q,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Se]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.rotation)>this.options.threshold||this.state&Z)}});function Dn(){Q.apply(this,arguments)}S(Dn,Q,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:te|Te,pointers:1},getTouchAction:function(){return Rt.prototype.getTouchAction.call(this)},attrTest:function(r){var o=this.options.direction,a;return o&(te|Te)?a=r.overallVelocity:o&te?a=r.overallVelocityX:o&Te&&(a=r.overallVelocityY),this._super.attrTest.call(this,r)&&o&r.offsetDirection&&r.distance>this.options.threshold&&r.maxPointers==this.options.pointers&&m(a)>this.options.velocity&&r.eventType&V},emit:function(r){var o=zi(r.offsetDirection);o&&this.manager.emit(this.options.event+o,r),this.manager.emit(this.options.event,r)}});function Lt(){de.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}S(Lt,de,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[Cn]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime<o.time;if(this.reset(),r.eventType&G&&this.count===0)return this.failTimeout();if(c&&f&&a){if(r.eventType!=V)return this.failTimeout();var p=this.pTime?r.timeStamp-this.pTime<o.interval:!0,b=!this.pCenter||Vt(this.pCenter,r.center)<o.posThreshold;this.pTime=r.timeStamp,this.pCenter=r.center,!b||!p?this.count=1:this.count+=1,this._input=r;var P=this.count%o.taps;if(P===0)return this.hasRequireFailures()?(this._timer=y(function(){this.state=ue,this.tryEmit()},o.interval,this),Z):ue}return ne},failTimeout:function(){return this._timer=y(function(){this.state=ne},this.options.interval,this),ne},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ue&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function fe(r,o){return o=o||{},o.recognizers=le(o.recognizers,fe.defaults.preset),new In(r,o)}fe.VERSION="2.0.7",fe.defaults={domEvents:!1,touchAction:Ui,enable:!0,inputTarget:null,inputClass:null,preset:[[wn,{enable:!1}],[xn,{enable:!1},["rotate"]],[Dn,{direction:te}],[Rt,{direction:te},["swipe"]],[Lt],[Lt,{event:"doubletap",taps:2},["tap"]],[An]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var bo=1,Gi=2;function In(r,o){this.options=N({},fe.defaults,o||{}),this.options.inputTarget=this.options.inputTarget||r,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=r,this.input=qs(this),this.touchAction=new En(this,this.options.touchAction),Bi(this,!0),_(this.options.recognizers,function(a){var c=this.add(new a[0](a[1]));a[2]&&c.recognizeWith(a[2]),a[3]&&c.requireFailure(a[3])},this)}In.prototype={set:function(r){return N(this.options,r),r.touchAction&&this.touchAction.update(),r.inputTarget&&(this.input.destroy(),this.input.target=r.inputTarget,this.input.init()),this},stop:function(r){this.session.stopped=r?Gi:bo},recognize:function(r){var o=this.session;if(!o.stopped){this.touchAction.preventDefaults(r);var a,c=this.recognizers,f=o.curRecognizer;(!f||f&&f.state&ue)&&(f=o.curRecognizer=null);for(var p=0;p<c.length;)a=c[p],o.stopped!==Gi&&(!f||a==f||a.canRecognizeWith(f))?a.recognize(r):a.reset(),!f&&a.state&(Z|Ge|be)&&(f=o.curRecognizer=a),p++}},get:function(r){if(r instanceof de)return r;for(var o=this.recognizers,a=0;a<o.length;a++)if(o[a].options.event==r)return o[a];return null},add:function(r){if(x(r,"add",this))return this;var o=this.get(r.options.event);return o&&this.remove(o),this.recognizers.push(r),r.manager=this,this.touchAction.update(),r},remove:function(r){if(x(r,"remove",this))return this;if(r=this.get(r),r){var o=this.recognizers,a=ze(o,r);a!==-1&&(o.splice(a,1),this.touchAction.update())}return this},on:function(r,o){if(r!==i&&o!==i){var a=this.handlers;return _(Dt(r),function(c){a[c]=a[c]||[],a[c].push(o)}),this}},off:function(r,o){if(r!==i){var a=this.handlers;return _(Dt(r),function(c){o?a[c]&&a[c].splice(ze(a[c],o),1):delete a[c]}),this}},emit:function(r,o){this.options.domEvents&&Co(r,o);var a=this.handlers[r]&&this.handlers[r].slice();if(!(!a||!a.length)){o.type=r,o.preventDefault=function(){o.srcEvent.preventDefault()};for(var c=0;c<a.length;)a[c](o),c++}},destroy:function(){this.element&&Bi(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function Bi(r,o){var a=r.element;if(a.style){var c;_(r.options.cssProps,function(f,p){c=Mt(a.style,p),o?(r.oldCssProps[c]=a.style[c],a.style[c]=f):a.style[c]=r.oldCssProps[c]||""}),o||(r.oldCssProps={})}}function Co(r,o){var a=e.createEvent("Event");a.initEvent(r,!0,!0),a.gesture=o,o.target.dispatchEvent(a)}N(fe,{INPUT_START:G,INPUT_MOVE:Me,INPUT_END:V,INPUT_CANCEL:W,STATE_POSSIBLE:Pt,STATE_BEGAN:Z,STATE_CHANGED:Ge,STATE_ENDED:be,STATE_RECOGNIZED:ue,STATE_CANCELLED:ct,STATE_FAILED:ne,DIRECTION_NONE:Tt,DIRECTION_LEFT:it,DIRECTION_RIGHT:rt,DIRECTION_UP:st,DIRECTION_DOWN:ot,DIRECTION_HORIZONTAL:te,DIRECTION_VERTICAL:Te,DIRECTION_ALL:Di,Manager:In,Input:K,TouchAction:En,TouchInput:Nt,MouseInput:Ot,PointerEventInput:_n,TouchMouseInput:bn,SingleTouchInput:Fi,Recognizer:de,AttrRecognizer:Q,Tap:Lt,Pan:Rt,Swipe:Dn,Pinch:xn,Rotate:wn,Press:An,on:J,off:je,each:_,merge:Y,extend:ee,assign:N,inherit:S,bindFn:U,prefixed:Mt});var Eo=typeof t<"u"?t:typeof self<"u"?self:{};Eo.Hammer=fe,typeof define=="function"&&define.amd?define(function(){return fe}):typeof Wt<"u"&&Wt.exports?Wt.exports=fe:t[n]=fe})(window,document,"Hammer")});var xu=Wi(kn());var Er=(()=>{let e=class e{constructor(i,s){this._renderer=i,this._elementRef=s,this.onChange=l=>{},this.onTouched=()=>{}}setProperty(i,s){this._renderer.setProperty(this._elementRef.nativeElement,i,s)}registerOnTouched(i){this.onTouched=i}registerOnChange(i){this.onChange=i}setDisabledState(i){this.setProperty("disabled",i)}};e.\u0275fac=function(s){return new(s||e)(O(jt),O(We))},e.\u0275dir=pe({type:e});let t=e;return t})(),wo=(()=>{let e=class e extends Er{};e.\u0275fac=(()=>{let i;return function(l){return(i||(i=ut(e)))(l||e)}})(),e.\u0275dir=pe({type:e,features:[Ye]});let t=e;return t})(),xr=new Be("");var Do={provide:xr,useExisting:Mn(()=>Kt),multi:!0};function Io(){let t=Nn()?Nn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var Mo=new Be(""),Kt=(()=>{let e=class e extends Er{constructor(i,s,l){super(i,s),this._compositionMode=l,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!Io())}writeValue(i){let s=i??"";this.setProperty("value",s)}_handleInput(i){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(i)}_compositionStart(){this._composing=!0}_compositionEnd(i){this._composing=!1,this._compositionMode&&this.onChange(i)}};e.\u0275fac=function(s){return new(s||e)(O(jt),O(We),O(Mo,8))},e.\u0275dir=pe({type:e,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(s,l){s&1&&M("input",function(d){return l._handleInput(d.target.value)})("blur",function(){return l.onTouched()})("compositionstart",function(){return l._compositionStart()})("compositionend",function(d){return l._compositionEnd(d.target.value)})},features:[On([Do]),Ye]});let t=e;return t})();var To=new Be(""),So=new Be("");function Ar(t){return t!=null}function wr(t){return ir(t)?$i(t):t}function Dr(t){let e={};return t.forEach(n=>{e=n!=null?h(h({},e),n):e}),Object.keys(e).length===0?null:e}function Ir(t,e){return e.map(n=>n(t))}function Vo(t){return!t.validate}function Mr(t){return t.map(e=>Vo(e)?e:n=>e.validate(n))}function Oo(t){if(!t)return null;let e=t.filter(Ar);return e.length==0?null:function(n){return Dr(Ir(n,e))}}function Tr(t){return t!=null?Oo(Mr(t)):null}function No(t){if(!t)return null;let e=t.filter(Ar);return e.length==0?null:function(n){let i=Ir(n,e).map(wr);return qi(i).pipe(Xi(Dr))}}function Sr(t){return t!=null?No(Mr(t)):null}function pr(t,e){return t===null?[e]:Array.isArray(t)?[...t,e]:[t,e]}function Fo(t){return t._rawValidators}function Po(t){return t._rawAsyncValidators}function Rn(t){return t?Array.isArray(t)?t:[t]:[]}function $t(t,e){return Array.isArray(t)?t.includes(e):t===e}function gr(t,e){let n=Rn(e);return Rn(t).forEach(s=>{$t(n,s)||n.push(s)}),n}function vr(t,e){return Rn(e).filter(n=>!$t(t,n))}var Xt=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=Tr(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=Sr(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control&&this.control.reset(e)}hasError(e,n){return this.control?this.control.hasError(e,n):!1}getError(e,n){return this.control?this.control.getError(e,n):null}},Ln=class extends Xt{get formDirective(){return null}get path(){return null}},vt=class extends Xt{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},Un=class{constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},ko={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},Ec=A(h({},ko),{"[class.ng-submitted]":"isSubmitted"}),Vr=(()=>{let e=class e extends Un{constructor(i){super(i)}};e.\u0275fac=function(s){return new(s||e)(O(vt,2))},e.\u0275dir=pe({type:e,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(s,l){s&2&&Sn("ng-untouched",l.isUntouched)("ng-touched",l.isTouched)("ng-pristine",l.isPristine)("ng-dirty",l.isDirty)("ng-valid",l.isValid)("ng-invalid",l.isInvalid)("ng-pending",l.isPending)},features:[Ye]});let t=e;return t})();var ht="VALID",Yt="INVALID",$e="PENDING",mt="DISABLED",qe=class{},qt=class extends qe{constructor(e,n){super(),this.value=e,this.source=n}},pt=class extends qe{constructor(e,n){super(),this.pristine=e,this.source=n}},gt=class extends qe{constructor(e,n){super(),this.touched=e,this.source=n}},Xe=class extends qe{constructor(e,n){super(),this.status=e,this.source=n}};function Ro(t){return(Zt(t)?t.validators:t)||null}function Lo(t){return Array.isArray(t)?Tr(t):t||null}function Uo(t,e){return(Zt(e)?e.asyncValidators:t)||null}function jo(t){return Array.isArray(t)?Sr(t):t||null}function Zt(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}var jn=class{constructor(e,n){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=zt(()=>this.statusReactive()),this.statusReactive=Ht(void 0),this._pristine=zt(()=>this.pristineReactive()),this.pristineReactive=Ht(!0),this._touched=zt(()=>this.touchedReactive()),this.touchedReactive=Ht(!1),this._events=new Yi,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(e),this._assignAsyncValidators(n)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return Fe(this.statusReactive)}set status(e){Fe(()=>this.statusReactive.set(e))}get valid(){return this.status===ht}get invalid(){return this.status===Yt}get pending(){return this.status==$e}get disabled(){return this.status===mt}get enabled(){return this.status!==mt}get pristine(){return Fe(this.pristineReactive)}set pristine(e){Fe(()=>this.pristineReactive.set(e))}get dirty(){return!this.pristine}get touched(){return Fe(this.touchedReactive)}set touched(e){Fe(()=>this.touchedReactive.set(e))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(gr(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(gr(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(vr(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(vr(e,this._rawAsyncValidators))}hasValidator(e){return $t(this._rawValidators,e)}hasAsyncValidator(e){return $t(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let n=this.touched===!1;this.touched=!0;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsTouched(A(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new gt(!0,i))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(n=>n.markAllAsTouched(e))}markAsUntouched(e={}){let n=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:i})}),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,i),n&&e.emitEvent!==!1&&this._events.next(new gt(!1,i))}markAsDirty(e={}){let n=this.pristine===!0;this.pristine=!1;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsDirty(A(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new pt(!1,i))}markAsPristine(e={}){let n=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),this._parent&&!e.onlySelf&&this._parent._updatePristine(e,i),n&&e.emitEvent!==!1&&this._events.next(new pt(!0,i))}markAsPending(e={}){this.status=$e;let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Xe(this.status,n)),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.markAsPending(A(h({},e),{sourceControl:n}))}disable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=mt,this.errors=null,this._forEachChild(s=>{s.disable(A(h({},e),{onlySelf:!0}))}),this._updateValue();let i=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new qt(this.value,i)),this._events.next(new Xe(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(A(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(s=>s(!0))}enable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=ht,this._forEachChild(i=>{i.enable(A(h({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(A(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(e,n){this._parent&&!e.onlySelf&&(this._parent.updateValueAndValidity(e),e.skipPristineCheck||this._parent._updatePristine({},n),this._parent._updateTouched({},n))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===ht||this.status===$e)&&this._runAsyncValidator(i,e.emitEvent)}let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new qt(this.value,n)),this._events.next(new Xe(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.updateValueAndValidity(A(h({},e),{sourceControl:n}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(n=>n._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?mt:ht}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,n){if(this.asyncValidator){this.status=$e,this._hasOwnPendingAsyncValidator={emitEvent:n!==!1};let i=wr(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(s=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(s,{emitEvent:n,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,n={}){this.errors=e,this._updateControlsErrors(n.emitEvent!==!1,this,n.shouldHaveEmitted)}get(e){let n=e;return n==null||(Array.isArray(n)||(n=n.split(".")),n.length===0)?null:n.reduce((i,s)=>i&&i._find(s),this)}getError(e,n){let i=n?this.get(n):this;return i&&i.errors?i.errors[e]:null}hasError(e,n){return!!this.getError(e,n)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,n,i){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||i)&&this._events.next(new Xe(this.status,n)),this._parent&&this._parent._updateControlsErrors(e,n,i)}_initObservables(){this.valueChanges=new ge,this.statusChanges=new ge}_calculateStatus(){return this._allControlsDisabled()?mt:this.errors?Yt:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus($e)?$e:this._anyControlsHaveStatus(Yt)?Yt:ht}_anyControlsHaveStatus(e){return this._anyControls(n=>n.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,n){let i=!this._anyControlsDirty(),s=this.pristine!==i;this.pristine=i,this._parent&&!e.onlySelf&&this._parent._updatePristine(e,n),s&&this._events.next(new pt(this.pristine,n))}_updateTouched(e={},n){this.touched=this._anyControlsTouched(),this._events.next(new gt(this.touched,n)),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,n)}_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){Zt(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){let n=this._parent&&this._parent.dirty;return!e&&!!n&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=Lo(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=jo(this._rawAsyncValidators)}};var Or=new Be("CallSetDisabledState",{providedIn:"root",factory:()=>Hn}),Hn="always";function Ho(t,e){return[...e.path,t]}function zo(t,e,n=Hn){Bo(t,e),e.valueAccessor.writeValue(t.value),(t.disabled||n==="always")&&e.valueAccessor.setDisabledState?.(t.disabled),Wo(t,e),$o(t,e),Yo(t,e),Go(t,e)}function yr(t,e){t.forEach(n=>{n.registerOnValidatorChange&&n.registerOnValidatorChange(e)})}function Go(t,e){if(e.valueAccessor.setDisabledState){let n=i=>{e.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(n),e._registerOnDestroy(()=>{t._unregisterOnDisabledChange(n)})}}function Bo(t,e){let n=Fo(t);e.validator!==null?t.setValidators(pr(n,e.validator)):typeof n=="function"&&t.setValidators([n]);let i=Po(t);e.asyncValidator!==null?t.setAsyncValidators(pr(i,e.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let s=()=>t.updateValueAndValidity();yr(e._rawValidators,s),yr(e._rawAsyncValidators,s)}function Wo(t,e){e.valueAccessor.registerOnChange(n=>{t._pendingValue=n,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Nr(t,e)})}function Yo(t,e){e.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Nr(t,e),t.updateOn!=="submit"&&t.markAsTouched()})}function Nr(t,e){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function $o(t,e){let n=(i,s)=>{e.valueAccessor.writeValue(i),s&&e.viewToModelUpdate(i)};t.registerOnChange(n),e._registerOnDestroy(()=>{t._unregisterOnChange(n)})}function Xo(t,e){if(!t.hasOwnProperty("model"))return!1;let n=t.model;return n.isFirstChange()?!0:!Object.is(e,n.currentValue)}function qo(t){return Object.getPrototypeOf(t.constructor)===wo}function Ko(t,e){if(!e)return null;Array.isArray(e);let n,i,s;return e.forEach(l=>{l.constructor===Kt?n=l:qo(l)?i=l:s=l}),s||i||n||null}function _r(t,e){let n=t.indexOf(e);n>-1&&t.splice(n,1)}function br(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var Zo=class extends jn{constructor(e=null,n,i){super(Ro(n),Uo(i,n)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(e),this._setUpdateStrategy(n),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Zt(n)&&(n.nonNullable||n.initialValueIsDefault)&&(br(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,n={}){this.value=this._pendingValue=e,this._onChange.length&&n.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,n.emitViewToModelChange!==!1)),this.updateValueAndValidity(n)}patchValue(e,n={}){this.setValue(e,n)}reset(e=this.defaultValue,n={}){this._applyFormState(e),this.markAsPristine(n),this.markAsUntouched(n),this.setValue(this.value,n),this._pendingChange=!1}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){_r(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){_r(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){br(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var Jo={provide:vt,useExisting:Mn(()=>zn)},Cr=Promise.resolve(),zn=(()=>{let e=class e extends vt{constructor(i,s,l,u,d,m){super(),this._changeDetectorRef=d,this.callSetDisabledState=m,this.control=new Zo,this._registered=!1,this.name="",this.update=new ge,this._parent=i,this._setValidators(s),this._setAsyncValidators(l),this.valueAccessor=Ko(this,u)}ngOnChanges(i){if(this._checkForErrors(),!this._registered||"name"in i){if(this._registered&&(this._checkName(),this.formDirective)){let s=i.name.previousValue;this.formDirective.removeControl({name:s,path:this._getPath(s)})}this._setUpControl()}"isDisabled"in i&&this._updateDisabled(i),Xo(i,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(i){this.viewModel=i,this.update.emit(i)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){zo(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(i){Cr.then(()=>{this.control.setValue(i,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(i){let s=i.isDisabled.currentValue,l=s!==0&&sr(s);Cr.then(()=>{l&&!this.control.disabled?this.control.disable():!l&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(i){return this._parent?Ho(i,this._parent):[i]}};e.\u0275fac=function(s){return new(s||e)(O(Ln,9),O(To,10),O(So,10),O(xr,10),O(rr,8),O(Or,8))},e.\u0275dir=pe({type:e,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[On([Jo]),Ye,Tn]});let t=e;return t})();var Qo=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({});let t=e;return t})();var Fr=(()=>{let e=class e{static withConfig(i){return{ngModule:e,providers:[{provide:Or,useValue:i.callSetDisabledState??Hn}]}}};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({imports:[Qo]});let t=e;return t})();var H=[];for(Jt=0;Jt<256;++Jt)H.push((Jt+256).toString(16).slice(1));var Jt;function Pr(t,e=0){return(H[t[e+0]]+H[t[e+1]]+H[t[e+2]]+H[t[e+3]]+"-"+H[t[e+4]]+H[t[e+5]]+"-"+H[t[e+6]]+H[t[e+7]]+"-"+H[t[e+8]]+H[t[e+9]]+"-"+H[t[e+10]]+H[t[e+11]]+H[t[e+12]]+H[t[e+13]]+H[t[e+14]]+H[t[e+15]]).toLowerCase()}var Qt,ta=new Uint8Array(16);function Gn(){if(!Qt&&(Qt=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!Qt))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Qt(ta)}var na=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Bn={randomUUID:na};function ia(t,e,n){if(Bn.randomUUID&&!e&&!t)return Bn.randomUUID();t=t||{};var i=t.random||(t.rng||Gn)();if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,e){n=n||0;for(var s=0;s<16;++s)e[n+s]=i[s];return e}return Pr(i)}var Wn=ia;var kr=[{id:"meal",name:"\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u044B",icon:"fas fa-apple-alt",color:"#4CAF50"},{id:"canteen",name:"\u0421\u0442\u043E\u043B\u043E\u0432\u0430\u044F",icon:"fas fa-utensils",color:"#FF9800"},{id:"clothes",name:"\u041E\u0434\u0435\u0436\u0434\u0430",icon:"fas fa-tshirt",color:"#FF5722"},{id:"entertainments",name:"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u0435",icon:"fas fa-film",color:"#795548"},{id:"sport",name:"\u0421\u043F\u043E\u0440\u0442",icon:"fas fa-dumbbell",color:"#607D8B"},{id:"utility-bills",name:"\u041A\u043E\u043C\u043C\u0443\u043D\u0430\u043B\u043A\u0430",icon:"fas fa-water",color:"#2196F3"},{id:"home",name:"\u0414\u043B\u044F \u0434\u043E\u043C\u0430",icon:"fas fa-home",color:"#9C27B0"},{id:"rental-payment",name:"\u0410\u0440\u0435\u043D\u0434\u0430 \u0436\u0438\u043B\u044C\u044F",icon:"fas fa-building",color:"#673AB7"},{id:"bus",name:"\u041E\u0431\u0449. \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442",icon:"fas fa-bus",color:"#3F51B5"},{id:"pharmacy",name:"\u0410\u043F\u0442\u0435\u043A\u0430",icon:"fas fa-pills",color:"#2196F3"},{id:"travel",name:"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435",icon:"fas fa-plane",color:"#009688"},{id:"barbershop",name:"\u041F\u0430\u0440\u0438\u043A\u043C\u0430\u0445\u0435\u0440\u0441\u043A\u0430\u044F",icon:"fas fa-cut",color:"#FFC107"},{id:"bar",name:"\u0411\u0430\u0440(\u043A\u0430\u0444\u0435)",icon:"fas fa-coffee",color:"#FF5722"},{id:"alcohol",name:"\u0412\u044B\u043F\u0438\u0432\u043A\u0430",icon:"fas fa-wine-bottle",color:"#FF5722"},{id:"nicotine",name:"\u0421\u0438\u0433\u0430\u0440\u0435\u0442\u044B",icon:"fas fa-smoking",color:"#FF5722"},{id:"subscriptions",name:"\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430",icon:"fas fa-newspaper",color:"#FF5722"},{id:"another",name:"\u0420\u0430\u0437\u043D\u043E\u0435",icon:"fas fa-random",color:"#FF5722"}];var Ke=Wi(kn());var en=class t{constructor(e){this.el=e}swipeLeft=new ge;swipeRight=new ge;swipeDown=new ge;swipeUp=new ge;hammer;ngOnInit(){this.hammer=new Ke.Manager(this.el.nativeElement),this.hammer.add(new Ke.Swipe({direction:Ke.DIRECTION_ALL})),this.hammer.on("swipeleft",()=>this.onSwipeLeft()),this.hammer.on("swiperight",()=>this.onSwipeRight()),this.hammer.on("swipeup",()=>this.onSwipeUp()),this.hammer.on("swipedown",()=>this.onSwipeDown())}onSwipeLeft(){this.swipeLeft.emit()}onSwipeRight(){this.swipeRight.emit()}onSwipeDown(){this.swipeDown.emit()}onSwipeUp(){this.swipeUp.emit()}ngOnDestroy(){this.hammer&&this.hammer.destroy()}static \u0275fac=function(n){return new(n||t)(O(We))};static \u0275dir=pe({type:t,selectors:[["","appSwipe",""]],outputs:{swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeDown:"swipeDown",swipeUp:"swipeUp"}})};var oa=t=>({"scrollable-content-down":t});function aa(t,e){if(t&1){let n=Vn();C(0,"div",11),M("click",function(){let s=k(n).$implicit,l=F();return R(l.onCategoryClick(s.id))}),Ne(1,"i"),C(2,"span"),w(3),E()()}if(t&2){let n=e.$implicit;D(),Ki(n.icon),re("color",n.color),D(2),Ce(n.name)}}function la(t,e){if(t&1){let n=Vn();C(0,"div",12)(1,"div",13),M("swipeleft",function(){k(n);let s=F();return R(s.onDeleteClick())})("swiperight",function(){k(n);let s=F();return R(s.onDeleteClick())}),C(2,"input",14),Qi("ngModelChange",function(s){k(n);let l=F();return Ji(l.enteredAmount,s)||(l.enteredAmount=s),R(s)}),E()(),C(3,"div",15),M("swipedown",function(s){k(n);let l=F();return R(l.onDisableRefresh(s))}),C(4,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("1"))}),w(5,"1"),E(),C(6,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("2"))}),w(7,"2"),E(),C(8,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("3"))}),w(9,"3"),E(),C(10,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("4"))}),w(11,"4"),E(),C(12,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("5"))}),w(13,"5"),E(),C(14,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("6"))}),w(15,"6"),E(),C(16,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("7"))}),w(17,"7"),E(),C(18,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("8"))}),w(19,"8"),E(),C(20,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("9"))}),w(21,"9"),E(),C(22,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("."))}),w(23,"."),E(),C(24,"div",16),M("click",function(){k(n);let s=F();return R(s.onNumberClick("0"))}),w(25,"0"),E(),C(26,"div",16),M("click",function(){k(n);let s=F();return R(s.onDeleteClick())}),Ne(27,"i",17),E()()()}if(t&2){let n=F();D(2),Zi("ngModel",n.enteredAmount)}}var tn=class t{constructor(e){this.router=e}enteredAmount="";enteredAmountAsNumber=0;currentAmount=0;monthAmount=0;balance=0;balanceDate="";showKeyBoard=!0;currentDate=new Date().toLocaleDateString("ru-RU",{weekday:"short",month:"short",day:"numeric"});categories=kr;ngOnInit(){let e=JSON.parse(localStorage.getItem("expenses")||"[]");console.log("expenses",e),this.sumValues(e),console.log("currentAmount",this.currentAmount),this.balance=Number(localStorage.getItem("balance"))||0,this.balanceDate=localStorage.getItem("balanceDate")}onNumberClick(e){e==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=e):this.enteredAmount+=e,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(e){if(this.enteredAmountAsNumber>0){let n=localStorage.getItem("expenses"),i=n?JSON.parse(n):[];i.unshift({id:Wn(),category:e,amount:this.enteredAmountAsNumber,currency:"EUR",date:Date.now()});let s=Number(localStorage.getItem("balance")||0),l=Math.round((s-this.enteredAmountAsNumber)*100)/100;localStorage.setItem("balance",l.toString()),this.balance=l,localStorage.setItem("expenses",JSON.stringify(i)),this.sumValues(i),this.enteredAmount="",this.enteredAmountAsNumber=0,this.showKeyBoard=!0}}onBalanceChange(){let e=prompt("Enter new balance",this.balance.toString());e&&(localStorage.setItem("balance",e),this.balance=Number(e))}onBalanceDateChange(){let e=prompt("Enter new balance date",this.balanceDate||"");e&&(localStorage.setItem("balanceDate",e),this.balanceDate=e)}onDisableRefresh(e){e.stopPropagation()}onSwipeLeft(){this.router.navigate(["/history"])}onSwipeRight(){this.router.navigate(["/statistics"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}sumValues(e){this.currentAmount=0,this.monthAmount=0,e.forEach(n=>{if(new Date(n.date).toDateString()===new Date().toDateString()){let d=this.currentAmount+n.amount;this.currentAmount=Math.round(d*100)/100}let i=new Date().getMonth(),s=new Date().getFullYear(),l=new Date(n.date).getMonth(),u=new Date(n.date).getFullYear();if(i===l&&s===u){let d=this.monthAmount+n.amount;this.monthAmount=Math.round(d*100)/100}})}static \u0275fac=function(n){return new(n||t)(O(Bt))};static \u0275cmp=Ve({type:t,selectors:[["app-expense"]],decls:32,vars:23,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[3,"click"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],["appSwipe","",1,"scrollable-content",3,"swipeDown","swipeUp","swipeLeft","swipeRight","ngClass"],[1,"categories"],["class","category",3,"click",4,"ngFor","ngForOf"],["class","number-board",4,"ngIf"],[1,"category",3,"click"],[1,"number-board"],[1,"number-board-header",3,"swipeleft","swiperight"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body",3,"swipedown"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(n,i){n&1&&(C(0,"div",0)(1,"div",1),Ne(2,"div",2),C(3,"div",3)(4,"span"),w(5),E(),C(6,"span"),w(7,"\u20AC"),E()(),C(8,"div",3),w(9,"-"),E(),C(10,"div",3)(11,"div"),w(12),E(),C(13,"span"),w(14),E(),C(15,"span"),w(16,"\u20AC"),E()(),C(17,"div",3),w(18,"-"),E(),C(19,"div",3)(20,"div",4),M("click",function(){return i.onBalanceDateChange()}),w(21),E(),C(22,"span",4),M("click",function(){return i.onBalanceChange()}),w(23),E(),C(24,"span",4),M("click",function(){return i.onBalanceChange()}),w(25,"\u20AC "),E()(),C(26,"div",5),Ne(27,"i",6),E()(),C(28,"div",7),M("swipeDown",function(){return i.onHideKeyboard()})("swipeUp",function(){return i.onShowKeyboard()})("swipeLeft",function(){return i.onSwipeLeft()})("swipeRight",function(){return i.onSwipeRight()}),C(29,"div",8),dt(30,aa,4,5,"div",9),E()(),dt(31,la,28,1,"div",10),E()),n&2&&(D(4),re("color","#ff6f61"),D(),Ce(i.monthAmount),D(),re("color","#ff6f61"),D(6),ft("",i.currentDate," "),D(),re("color","red"),D(),Ce(i.currentAmount),D(),re("color","red"),D(6),ft("\u0434\u043E ",i.balanceDate," "),D(),re("color","green"),D(),Ce(i.balance),D(),re("color","green"),D(2),Oe("routerLink","/history"),D(2),Oe("ngClass",er(21,oa,!i.showKeyBoard)),D(2),Oe("ngForOf",i.categories),D(),Oe("ngIf",i.showKeyBoard))},dependencies:[or,Gt,ar,mr,Kt,Vr,zn,en],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none;overflow:hidden}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.scrollable-content[_ngcontent-%COMP%]{display:flex}.scrollable-content[_ngcontent-%COMP%]   .scrollable-content-down[_ngcontent-%COMP%]{align-items:end}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:70px;margin:10px;text-align:center;font-size:15px}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:25px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da;overflow:hidden}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding:12px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px;overflow:hidden}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};function ca(t,e){if(t&1&&(C(0,"div",3)(1,"div",4)(2,"span"),w(3),E(),C(4,"span"),w(5),tr(6,"currency"),E()(),C(7,"div",5)(8,"div",6),w(9),E()()()),t&2){let n=e.$implicit;D(3),Ce(n.category),D(2),Ce(nr(6,7,n.amount)),D(3),re("width",n.percentage,"%")("background-color",n.color),D(),ft(" ",n.percentage.toFixed(2),"% ")}}var nn=class t{constructor(e){this.router=e}categoryTotals=[];totalAmount=0;ngOnInit(){this.calculateCategoryTotals()}calculateCategoryTotals(){let e=JSON.parse(localStorage.getItem("expenses")||"[]"),n={};e.filter(i=>{let s=new Date(i.date),l=new Date;return s.getDate()===l.getDate()&&s.getMonth()===l.getMonth()&&s.getFullYear()===l.getFullYear()}).forEach(i=>{n[i.category]||(n[i.category]=0),n[i.category]+=i.amount,this.totalAmount+=i.amount});for(let i in n){let s=n[i],l=s/this.totalAmount*100,u=this.getColor(l);this.categoryTotals.push({category:i,amount:s,percentage:l,color:u})}}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(e){this.touchStartX=e.changedTouches[0].screenX,this.touchStartY=e.changedTouches[0].screenY}onTouchEnd(e){this.touchEndX=e.changedTouches[0].screenX,this.touchEndY=e.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let e=this.touchEndX-this.touchStartX,n=this.touchEndY-this.touchStartY;Math.abs(e)>Math.abs(n)&&(e>50?this.onSwipeRight():e<-50&&this.onSwipeLeft())}onSwipeLeft(){this.router.navigate(["/"])}onSwipeRight(){this.router.navigate(["/history"])}getColor(e){let n=Math.min(255,Math.round((100-e)*2.55));return`rgb(${Math.min(255,Math.round(e*2.55))}, ${n}, 0)`}static \u0275fac=function(n){return new(n||t)(O(Bt))};static \u0275cmp=Ve({type:t,selectors:[["app-statistics"]],hostBindings:function(n,i){n&1&&M("touchstart",function(l){return i.onTouchStart(l)})("touchend",function(l){return i.onTouchEnd(l)})},decls:4,vars:1,consts:[[1,"statistics"],[1,"statistics-title"],["class","category-summary",4,"ngFor","ngForOf"],[1,"category-summary"],[1,"category-header"],[1,"progress-bar-container"],[1,"progress-bar"]],template:function(n,i){n&1&&(C(0,"div",0)(1,"div",1),w(2,"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043F\u043E \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C \u0437\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:"),E(),dt(3,ca,10,9,"div",2),E()),n&2&&(D(3),Oe("ngForOf",i.categoryTotals))},dependencies:[Gt,lr],styles:[".category-summary[_ngcontent-%COMP%]{margin-bottom:20px}.category-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;font-weight:700;margin-bottom:5px}.progress-bar-container[_ngcontent-%COMP%]{background-color:#e0e0e0;border-radius:5px;overflow:hidden}.progress-bar[_ngcontent-%COMP%]{background-color:#4caf50;height:25px;line-height:25px;color:#fff;text-align:center;border-radius:5px}.statistics[_ngcontent-%COMP%]{padding:15px;height:100dvh}.statistics-title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:15px}"]})};var ua=[{path:"history",loadChildren:()=>import("./chunk-FGPC2ZTK.js").then(t=>t.HistoryModule)},{path:"statistics",component:nn},{path:"",pathMatch:"full",component:tn}],rn=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=me({type:t});static \u0275inj=he({imports:[Pn.forRoot(ua),Pn]})};var sn=class t{title="expenses";static \u0275fac=function(n){return new(n||t)};static \u0275cmp=Ve({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(n,i){n&1&&Ne(0,"router-outlet")},dependencies:[hr]})};var Ur=()=>{},fi={},cs={},us=null,ds={mark:Ur,measure:Ur};try{typeof window<"u"&&(fi=window),typeof document<"u"&&(cs=document),typeof MutationObserver<"u"&&(us=MutationObserver),typeof performance<"u"&&(ds=performance)}catch{}var{userAgent:jr=""}=fi.navigator||{},we=fi,I=cs,Hr=us,on=ds,Zc=!!we.document,_e=!!I.documentElement&&!!I.head&&typeof I.addEventListener=="function"&&typeof I.createElement=="function",fs=~jr.indexOf("MSIE")||~jr.indexOf("Trident/"),T="classic",hs="duotone",$="sharp",X="sharp-duotone",da=[T,hs,$,X],fa={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},zr={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ha=["kit"],ma=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,pa=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,ga={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},va={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},ya={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},_a={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},ba={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},Ca={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},ms={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},Ea=["solid","regular","light","thin","duotone","brands"],ps=[1,2,3,4,5,6,7,8,9,10],xa=ps.concat([11,12,13,14,15,16,17,18,19,20]),yt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Aa=[...Object.keys(_a),...Ea,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",yt.GROUP,yt.SWAP_OPACITY,yt.PRIMARY,yt.SECONDARY].concat(ps.map(t=>"".concat(t,"x"))).concat(xa.map(t=>"w-".concat(t))),wa={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Da={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},Ia={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},Gr={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},ve="___FONT_AWESOME___",Zn=16,gs="fa",vs="svg-inline--fa",Le="data-fa-i2svg",Jn="data-fa-pseudo-element",Ma="data-fa-pseudo-element-pending",hi="data-prefix",mi="data-icon",Br="fontawesome-i2svg",Ta="async",Sa=["HTML","HEAD","STYLE","SCRIPT"],ys=(()=>{try{return!0}catch{return!1}})(),_s=[T,$,X];function At(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[T]}})}var bs=h({},ms);bs[T]=h(h(h({},ms[T]),zr.kit),zr["kit-duotone"]);var ke=At(bs),Qn=h({},Ca);Qn[T]=h(h(h({},Qn[T]),Gr.kit),Gr["kit-duotone"]);var Et=At(Qn),ei=h({},ba);ei[T]=h(h({},ei[T]),Ia.kit);var Re=At(ei),ti=h({},ya);ti[T]=h(h({},ti[T]),Da.kit);var Va=At(ti),Oa=ma,Cs="fa-layers-text",Na=pa,Fa=h({},fa),Jc=At(Fa),Pa=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Yn=yt,Qe=new Set;Object.keys(Et[T]).map(Qe.add.bind(Qe));Object.keys(Et[$]).map(Qe.add.bind(Qe));Object.keys(Et[X]).map(Qe.add.bind(Qe));var ka=[...ha,...Aa],bt=we.FontAwesomeConfig||{};function Ra(t){var e=I.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function La(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}I&&typeof I.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,i]=e,s=La(Ra(n));s!=null&&(bt[i]=s)});var Es={styleDefault:"solid",familyDefault:"classic",cssPrefix:gs,replacementClass:vs,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};bt.familyPrefix&&(bt.cssPrefix=bt.familyPrefix);var et=h(h({},Es),bt);et.autoReplaceSvg||(et.observeMutations=!1);var v={};Object.keys(Es).forEach(t=>{Object.defineProperty(v,t,{enumerable:!0,set:function(e){et[t]=e,Ct.forEach(n=>n(v))},get:function(){return et[t]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(t){et.cssPrefix=t,Ct.forEach(e=>e(v))},get:function(){return et.cssPrefix}});we.FontAwesomeConfig=v;var Ct=[];function Ua(t){return Ct.push(t),()=>{Ct.splice(Ct.indexOf(t),1)}}var xe=Zn,se={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function ja(t){if(!t||!_e)return;let e=I.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;let n=I.head.childNodes,i=null;for(let s=n.length-1;s>-1;s--){let l=n[s],u=(l.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(u)>-1&&(i=l)}return I.head.insertBefore(e,i),t}var Ha="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function xt(){let t=12,e="";for(;t-- >0;)e+=Ha[Math.random()*62|0];return e}function tt(t){let e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function pi(t){return t.classList?tt(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function xs(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function za(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(xs(t[n]),'" '),"").trim()}function dn(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function gi(t){return t.size!==se.size||t.x!==se.x||t.y!==se.y||t.rotate!==se.rotate||t.flipX||t.flipY}function Ga(t){let{transform:e,containerWidth:n,iconWidth:i}=t,s={transform:"translate(".concat(n/2," 256)")},l="translate(".concat(e.x*32,", ").concat(e.y*32,") "),u="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),d="rotate(".concat(e.rotate," 0 0)"),m={transform:"".concat(l," ").concat(u," ").concat(d)},g={transform:"translate(".concat(i/2*-1," -256)")};return{outer:s,inner:m,path:g}}function Ba(t){let{transform:e,width:n=Zn,height:i=Zn,startCentered:s=!1}=t,l="";return s&&fs?l+="translate(".concat(e.x/xe-n/2,"em, ").concat(e.y/xe-i/2,"em) "):s?l+="translate(calc(-50% + ".concat(e.x/xe,"em), calc(-50% + ").concat(e.y/xe,"em)) "):l+="translate(".concat(e.x/xe,"em, ").concat(e.y/xe,"em) "),l+="scale(".concat(e.size/xe*(e.flipX?-1:1),", ").concat(e.size/xe*(e.flipY?-1:1),") "),l+="rotate(".concat(e.rotate,"deg) "),l}var Wa=`:root, :host {
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
}`;function As(){let t=gs,e=vs,n=v.cssPrefix,i=v.replacementClass,s=Wa;if(n!==t||i!==e){let l=new RegExp("\\.".concat(t,"\\-"),"g"),u=new RegExp("\\--".concat(t,"\\-"),"g"),d=new RegExp("\\.".concat(e),"g");s=s.replace(l,".".concat(n,"-")).replace(u,"--".concat(n,"-")).replace(d,".".concat(i))}return s}var Wr=!1;function $n(){v.autoAddCss&&!Wr&&(ja(As()),Wr=!0)}var Ya={mixout(){return{dom:{css:As,insertCss:$n}}},hooks(){return{beforeDOMElementCreation(){$n()},beforeI2svg(){$n()}}}},ye=we||{};ye[ve]||(ye[ve]={});ye[ve].styles||(ye[ve].styles={});ye[ve].hooks||(ye[ve].hooks={});ye[ve].shims||(ye[ve].shims=[]);var oe=ye[ve],ws=[],Ds=function(){I.removeEventListener("DOMContentLoaded",Ds),cn=1,ws.map(t=>t())},cn=!1;_e&&(cn=(I.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(I.readyState),cn||I.addEventListener("DOMContentLoaded",Ds));function $a(t){_e&&(cn?setTimeout(t,0):ws.push(t))}function wt(t){let{tag:e,attributes:n={},children:i=[]}=t;return typeof t=="string"?xs(t):"<".concat(e," ").concat(za(n),">").concat(i.map(wt).join(""),"</").concat(e,">")}function Yr(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Xa=function(e,n){return function(i,s,l,u){return e.call(n,i,s,l,u)}},Xn=function(e,n,i,s){var l=Object.keys(e),u=l.length,d=s!==void 0?Xa(n,s):n,m,g,y;for(i===void 0?(m=1,y=e[l[0]]):(m=0,y=i);m<u;m++)g=l[m],y=d(y,e[g],g,e);return y};function qa(t){let e=[],n=0,i=t.length;for(;n<i;){let s=t.charCodeAt(n++);if(s>=55296&&s<=56319&&n<i){let l=t.charCodeAt(n++);(l&64512)==56320?e.push(((s&1023)<<10)+(l&1023)+65536):(e.push(s),n--)}else e.push(s)}return e}function ni(t){let e=qa(t);return e.length===1?e[0].toString(16):null}function Ka(t,e){let n=t.length,i=t.charCodeAt(e),s;return i>=55296&&i<=56319&&n>e+1&&(s=t.charCodeAt(e+1),s>=56320&&s<=57343)?(i-55296)*1024+s-56320+65536:i}function $r(t){return Object.keys(t).reduce((e,n)=>{let i=t[n];return!!i.icon?e[i.iconName]=i.icon:e[n]=i,e},{})}function ii(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:i=!1}=n,s=$r(e);typeof oe.hooks.addPack=="function"&&!i?oe.hooks.addPack(t,$r(e)):oe.styles[t]=h(h({},oe.styles[t]||{}),s),t==="fas"&&ii("fa",e)}var{styles:Pe,shims:Za}=oe,Ja={[T]:Object.values(Re[T]),[$]:Object.values(Re[$]),[X]:Object.values(Re[X])},vi=null,Is={},Ms={},Ts={},Ss={},Vs={},Qa={[T]:Object.keys(ke[T]),[$]:Object.keys(ke[$]),[X]:Object.keys(ke[X])};function el(t){return~ka.indexOf(t)}function tl(t,e){let n=e.split("-"),i=n[0],s=n.slice(1).join("-");return i===t&&s!==""&&!el(s)?s:null}var Os=()=>{let t=i=>Xn(Pe,(s,l,u)=>(s[u]=Xn(l,i,{}),s),{});Is=t((i,s,l)=>(s[3]&&(i[s[3]]=l),s[2]&&s[2].filter(d=>typeof d=="number").forEach(d=>{i[d.toString(16)]=l}),i)),Ms=t((i,s,l)=>(i[l]=l,s[2]&&s[2].filter(d=>typeof d=="string").forEach(d=>{i[d]=l}),i)),Vs=t((i,s,l)=>{let u=s[2];return i[l]=l,u.forEach(d=>{i[d]=l}),i});let e="far"in Pe||v.autoFetchSvg,n=Xn(Za,(i,s)=>{let l=s[0],u=s[1],d=s[2];return u==="far"&&!e&&(u="fas"),typeof l=="string"&&(i.names[l]={prefix:u,iconName:d}),typeof l=="number"&&(i.unicodes[l.toString(16)]={prefix:u,iconName:d}),i},{names:{},unicodes:{}});Ts=n.names,Ss=n.unicodes,vi=fn(v.styleDefault,{family:v.familyDefault})};Ua(t=>{vi=fn(t.styleDefault,{family:v.familyDefault})});Os();function yi(t,e){return(Is[t]||{})[e]}function nl(t,e){return(Ms[t]||{})[e]}function Ae(t,e){return(Vs[t]||{})[e]}function Ns(t){return Ts[t]||{prefix:null,iconName:null}}function il(t){let e=Ss[t],n=yi("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function De(){return vi}var _i=()=>({prefix:null,iconName:null,rest:[]});function fn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:n=T}=e,i=ke[n][t],s=Et[n][t]||Et[n][i],l=t in oe.styles?t:null;return s||l||null}var rl={[T]:Object.keys(Re[T]),[$]:Object.keys(Re[$]),[X]:Object.keys(Re[X])};function hn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:n=!1}=e,i={[T]:"".concat(v.cssPrefix,"-").concat(T),[$]:"".concat(v.cssPrefix,"-").concat($),[X]:"".concat(v.cssPrefix,"-").concat(X)},s=null,l=T,u=da.filter(m=>m!==hs);u.forEach(m=>{(t.includes(i[m])||t.some(g=>rl[m].includes(g)))&&(l=m)});let d=t.reduce((m,g)=>{let y=tl(v.cssPrefix,g);if(Pe[g]?(g=Ja[l].includes(g)?Va[l][g]:g,s=g,m.prefix=g):Qa[l].indexOf(g)>-1?(s=g,m.prefix=fn(g,{family:l})):y?m.iconName=y:g!==v.replacementClass&&!u.some(x=>g===i[x])&&m.rest.push(g),!n&&m.prefix&&m.iconName){let x=s==="fa"?Ns(m.iconName):{},_=Ae(m.prefix,m.iconName);x.prefix&&(s=null),m.iconName=x.iconName||_||m.iconName,m.prefix=x.prefix||m.prefix,m.prefix==="far"&&!Pe.far&&Pe.fas&&!v.autoFetchSvg&&(m.prefix="fas")}return m},_i());return(t.includes("fa-brands")||t.includes("fab"))&&(d.prefix="fab"),(t.includes("fa-duotone")||t.includes("fad"))&&(d.prefix="fad"),!d.prefix&&l===$&&(Pe.fass||v.autoFetchSvg)&&(d.prefix="fass",d.iconName=Ae(d.prefix,d.iconName)||d.iconName),!d.prefix&&l===X&&(Pe.fasds||v.autoFetchSvg)&&(d.prefix="fasds",d.iconName=Ae(d.prefix,d.iconName)||d.iconName),(d.prefix==="fa"||s==="fa")&&(d.prefix=De()||"fas"),d}var ri=class{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];let s=n.reduce(this._pullDefinitions,{});Object.keys(s).forEach(l=>{this.definitions[l]=h(h({},this.definitions[l]||{}),s[l]),ii(l,s[l]);let u=Re[T][l];u&&ii(u,s[l]),Os()})}reset(){this.definitions={}}_pullDefinitions(e,n){let i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(s=>{let{prefix:l,iconName:u,icon:d}=i[s],m=d[2];e[l]||(e[l]={}),m.length>0&&m.forEach(g=>{typeof g=="string"&&(e[l][g]=d)}),e[l][u]=d}),e}},Xr=[],Ze={},Je={},sl=Object.keys(Je);function ol(t,e){let{mixoutsTo:n}=e;return Xr=t,Ze={},Object.keys(Je).forEach(i=>{sl.indexOf(i)===-1&&delete Je[i]}),Xr.forEach(i=>{let s=i.mixout?i.mixout():{};if(Object.keys(s).forEach(l=>{typeof s[l]=="function"&&(n[l]=s[l]),typeof s[l]=="object"&&Object.keys(s[l]).forEach(u=>{n[l]||(n[l]={}),n[l][u]=s[l][u]})}),i.hooks){let l=i.hooks();Object.keys(l).forEach(u=>{Ze[u]||(Ze[u]=[]),Ze[u].push(l[u])})}i.provides&&i.provides(Je)}),n}function si(t,e){for(var n=arguments.length,i=new Array(n>2?n-2:0),s=2;s<n;s++)i[s-2]=arguments[s];return(Ze[t]||[]).forEach(u=>{e=u.apply(null,[e,...i])}),e}function Ue(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];(Ze[t]||[]).forEach(l=>{l.apply(null,n)})}function Ie(){let t=arguments[0],e=Array.prototype.slice.call(arguments,1);return Je[t]?Je[t].apply(null,e):void 0}function oi(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t,n=t.prefix||De();if(e)return e=Ae(n,e)||e,Yr(Fs.definitions,n,e)||Yr(oe.styles,n,e)}var Fs=new ri,al=()=>{v.autoReplaceSvg=!1,v.observeMutations=!1,Ue("noAuto")},ll={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return _e?(Ue("beforeI2svg",t),Ie("pseudoElements2svg",t),Ie("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e}=t;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,$a(()=>{ul({autoReplaceSvgRoot:e}),Ue("watch",t)})}},cl={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:Ae(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){let e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=fn(t[0]);return{prefix:n,iconName:Ae(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(v.cssPrefix,"-"))>-1||t.match(Oa))){let e=hn(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||De(),iconName:Ae(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){let e=De();return{prefix:e,iconName:Ae(e,t)||t}}}},q={noAuto:al,config:v,dom:ll,parse:cl,library:Fs,findIconDefinition:oi,toHtml:wt},ul=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e=I}=t;(Object.keys(oe.styles).length>0||v.autoFetchSvg)&&_e&&v.autoReplaceSvg&&q.dom.i2svg({node:e})};function mn(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>wt(n))}}),Object.defineProperty(t,"node",{get:function(){if(!_e)return;let n=I.createElement("div");return n.innerHTML=t.html,n.children}}),t}function dl(t){let{children:e,main:n,mask:i,attributes:s,styles:l,transform:u}=t;if(gi(u)&&n.found&&!i.found){let{width:d,height:m}=n,g={x:d/m/2,y:.5};s.style=dn(A(h({},l),{"transform-origin":"".concat(g.x+u.x/16,"em ").concat(g.y+u.y/16,"em")}))}return[{tag:"svg",attributes:s,children:e}]}function fl(t){let{prefix:e,iconName:n,children:i,attributes:s,symbol:l}=t,u=l===!0?"".concat(e,"-").concat(v.cssPrefix,"-").concat(n):l;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:A(h({},s),{id:u}),children:i}]}]}function bi(t){let{icons:{main:e,mask:n},prefix:i,iconName:s,transform:l,symbol:u,title:d,maskId:m,titleId:g,extra:y,watchable:x=!1}=t,{width:_,height:L}=n.found?n:e,N=i==="fak",ee=[v.replacementClass,s?"".concat(v.cssPrefix,"-").concat(s):""].filter(J=>y.classes.indexOf(J)===-1).filter(J=>J!==""||!!J).concat(y.classes).join(" "),Y={children:[],attributes:A(h({},y.attributes),{"data-prefix":i,"data-icon":s,class:ee,role:y.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(_," ").concat(L)})},S=N&&!~y.classes.indexOf("fa-fw")?{width:"".concat(_/L*16*.0625,"em")}:{};x&&(Y.attributes[Le]=""),d&&(Y.children.push({tag:"title",attributes:{id:Y.attributes["aria-labelledby"]||"title-".concat(g||xt())},children:[d]}),delete Y.attributes.title);let U=A(h({},Y),{prefix:i,iconName:s,main:e,mask:n,maskId:m,transform:l,symbol:u,styles:h(h({},S),y.styles)}),{children:z,attributes:le}=n.found&&e.found?Ie("generateAbstractMask",U)||{children:[],attributes:{}}:Ie("generateAbstractIcon",U)||{children:[],attributes:{}};return U.children=z,U.attributes=le,u?fl(U):dl(U)}function qr(t){let{content:e,width:n,height:i,transform:s,title:l,extra:u,watchable:d=!1}=t,m=A(h(h({},u.attributes),l?{title:l}:{}),{class:u.classes.join(" ")});d&&(m[Le]="");let g=h({},u.styles);gi(s)&&(g.transform=Ba({transform:s,startCentered:!0,width:n,height:i}),g["-webkit-transform"]=g.transform);let y=dn(g);y.length>0&&(m.style=y);let x=[];return x.push({tag:"span",attributes:m,children:[e]}),l&&x.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),x}function hl(t){let{content:e,title:n,extra:i}=t,s=A(h(h({},i.attributes),n?{title:n}:{}),{class:i.classes.join(" ")}),l=dn(i.styles);l.length>0&&(s.style=l);let u=[];return u.push({tag:"span",attributes:s,children:[e]}),n&&u.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),u}var{styles:qn}=oe;function ai(t){let e=t[0],n=t[1],[i]=t.slice(4),s=null;return Array.isArray(i)?s={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat(Yn.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Yn.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Yn.PRIMARY),fill:"currentColor",d:i[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:e,height:n,icon:s}}var ml={found:!1,width:512,height:512};function pl(t,e){!ys&&!v.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function li(t,e){let n=e;return e==="fa"&&v.styleDefault!==null&&(e=De()),new Promise((i,s)=>{if(n==="fa"){let l=Ns(t)||{};t=l.iconName||t,e=l.prefix||e}if(t&&e&&qn[e]&&qn[e][t]){let l=qn[e][t];return i(ai(l))}pl(t,e),i(A(h({},ml),{icon:v.showMissingIcons&&t?Ie("missingIconAbstract")||{}:{}}))})}var Kr=()=>{},ci=v.measurePerformance&&on&&on.mark&&on.measure?on:{mark:Kr,measure:Kr},_t='FA "6.6.0"',gl=t=>(ci.mark("".concat(_t," ").concat(t," begins")),()=>Ps(t)),Ps=t=>{ci.mark("".concat(_t," ").concat(t," ends")),ci.measure("".concat(_t," ").concat(t),"".concat(_t," ").concat(t," begins"),"".concat(_t," ").concat(t," ends"))},Ci={begin:gl,end:Ps},an=()=>{};function Zr(t){return typeof(t.getAttribute?t.getAttribute(Le):null)=="string"}function vl(t){let e=t.getAttribute?t.getAttribute(hi):null,n=t.getAttribute?t.getAttribute(mi):null;return e&&n}function yl(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(v.replacementClass)}function _l(){return v.autoReplaceSvg===!0?ln.replace:ln[v.autoReplaceSvg]||ln.replace}function bl(t){return I.createElementNS("http://www.w3.org/2000/svg",t)}function Cl(t){return I.createElement(t)}function ks(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:n=t.tag==="svg"?bl:Cl}=e;if(typeof t=="string")return I.createTextNode(t);let i=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(l){i.setAttribute(l,t.attributes[l])}),(t.children||[]).forEach(function(l){i.appendChild(ks(l,{ceFn:n}))}),i}function El(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var ln={replace:function(t){let e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(ks(n),e)}),e.getAttribute(Le)===null&&v.keepOriginalSource){let n=I.createComment(El(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){let e=t[0],n=t[1];if(~pi(e).indexOf(v.replacementClass))return ln.replace(t);let i=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){let l=n[0].attributes.class.split(" ").reduce((u,d)=>(d===v.replacementClass||d.match(i)?u.toSvg.push(d):u.toNode.push(d),u),{toNode:[],toSvg:[]});n[0].attributes.class=l.toSvg.join(" "),l.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",l.toNode.join(" "))}let s=n.map(l=>wt(l)).join(`
`);e.setAttribute(Le,""),e.innerHTML=s}};function Jr(t){t()}function Rs(t,e){let n=typeof e=="function"?e:an;if(t.length===0)n();else{let i=Jr;v.mutateApproach===Ta&&(i=we.requestAnimationFrame||Jr),i(()=>{let s=_l(),l=Ci.begin("mutate");t.map(s),l(),n()})}}var Ei=!1;function Ls(){Ei=!0}function ui(){Ei=!1}var un=null;function Qr(t){if(!Hr||!v.observeMutations)return;let{treeCallback:e=an,nodeCallback:n=an,pseudoElementsCallback:i=an,observeMutationsRoot:s=I}=t;un=new Hr(l=>{if(Ei)return;let u=De();tt(l).forEach(d=>{if(d.type==="childList"&&d.addedNodes.length>0&&!Zr(d.addedNodes[0])&&(v.searchPseudoElements&&i(d.target),e(d.target)),d.type==="attributes"&&d.target.parentNode&&v.searchPseudoElements&&i(d.target.parentNode),d.type==="attributes"&&Zr(d.target)&&~Pa.indexOf(d.attributeName))if(d.attributeName==="class"&&vl(d.target)){let{prefix:m,iconName:g}=hn(pi(d.target));d.target.setAttribute(hi,m||u),g&&d.target.setAttribute(mi,g)}else yl(d.target)&&n(d.target)})}),_e&&un.observe(s,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function xl(){un&&un.disconnect()}function Al(t){let e=t.getAttribute("style"),n=[];return e&&(n=e.split(";").reduce((i,s)=>{let l=s.split(":"),u=l[0],d=l.slice(1);return u&&d.length>0&&(i[u]=d.join(":").trim()),i},{})),n}function wl(t){let e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),i=t.innerText!==void 0?t.innerText.trim():"",s=hn(pi(t));return s.prefix||(s.prefix=De()),e&&n&&(s.prefix=e,s.iconName=n),s.iconName&&s.prefix||(s.prefix&&i.length>0&&(s.iconName=nl(s.prefix,t.innerText)||yi(s.prefix,ni(t.innerText))),!s.iconName&&v.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=t.firstChild.data)),s}function Dl(t){let e=tt(t.attributes).reduce((s,l)=>(s.name!=="class"&&s.name!=="style"&&(s[l.name]=l.value),s),{}),n=t.getAttribute("title"),i=t.getAttribute("data-fa-title-id");return v.autoA11y&&(n?e["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(i||xt()):(e["aria-hidden"]="true",e.focusable="false")),e}function Il(){return{iconName:null,title:null,titleId:null,prefix:null,transform:se,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function es(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:n,prefix:i,rest:s}=wl(t),l=Dl(t),u=si("parseNodeAttributes",{},t),d=e.styleParser?Al(t):[];return h({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:i,transform:se,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:d,attributes:l}},u)}var{styles:Ml}=oe;function Us(t){let e=v.autoReplaceSvg==="nest"?es(t,{styleParser:!1}):es(t);return~e.extra.classes.indexOf(Cs)?Ie("generateLayersText",t,e):Ie("generateSvgReplacementMutation",t,e)}var ae=new Set;_s.map(t=>{ae.add("fa-".concat(t))});Object.keys(ke[T]).map(ae.add.bind(ae));Object.keys(ke[$]).map(ae.add.bind(ae));Object.keys(ke[X]).map(ae.add.bind(ae));ae=[...ae];function ts(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!_e)return Promise.resolve();let n=I.documentElement.classList,i=y=>n.add("".concat(Br,"-").concat(y)),s=y=>n.remove("".concat(Br,"-").concat(y)),l=v.autoFetchSvg?ae:_s.map(y=>"fa-".concat(y)).concat(Object.keys(Ml));l.includes("fa")||l.push("fa");let u=[".".concat(Cs,":not([").concat(Le,"])")].concat(l.map(y=>".".concat(y,":not([").concat(Le,"])"))).join(", ");if(u.length===0)return Promise.resolve();let d=[];try{d=tt(t.querySelectorAll(u))}catch{}if(d.length>0)i("pending"),s("complete");else return Promise.resolve();let m=Ci.begin("onTree"),g=d.reduce((y,x)=>{try{let _=Us(x);_&&y.push(_)}catch(_){ys||_.name==="MissingIcon"&&console.error(_)}return y},[]);return new Promise((y,x)=>{Promise.all(g).then(_=>{Rs(_,()=>{i("active"),i("complete"),s("pending"),typeof e=="function"&&e(),m(),y()})}).catch(_=>{m(),x(_)})})}function Tl(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Us(t).then(n=>{n&&Rs([n],e)})}function Sl(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=(e||{}).icon?e:oi(e||{}),{mask:s}=n;return s&&(s=(s||{}).icon?s:oi(s||{})),t(i,A(h({},n),{mask:s}))}}var Vl=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=se,symbol:i=!1,mask:s=null,maskId:l=null,title:u=null,titleId:d=null,classes:m=[],attributes:g={},styles:y={}}=e;if(!t)return;let{prefix:x,iconName:_,icon:L}=t;return mn(h({type:"icon"},t),()=>(Ue("beforeDOMElementCreation",{iconDefinition:t,params:e}),v.autoA11y&&(u?g["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(d||xt()):(g["aria-hidden"]="true",g.focusable="false")),bi({icons:{main:ai(L),mask:s?ai(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:x,iconName:_,transform:h(h({},se),n),symbol:i,title:u,maskId:l,titleId:d,extra:{attributes:g,styles:y,classes:m}})))},Ol={mixout(){return{icon:Sl(Vl)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=ts,t.nodeCallback=Tl,t}}},provides(t){t.i2svg=function(e){let{node:n=I,callback:i=()=>{}}=e;return ts(n,i)},t.generateSvgReplacementMutation=function(e,n){let{iconName:i,title:s,titleId:l,prefix:u,transform:d,symbol:m,mask:g,maskId:y,extra:x}=n;return new Promise((_,L)=>{Promise.all([li(i,u),g.iconName?li(g.iconName,g.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(N=>{let[ee,Y]=N;_([e,bi({icons:{main:ee,mask:Y},prefix:u,iconName:i,transform:d,symbol:m,maskId:y,title:s,titleId:l,extra:x,watchable:!0})])}).catch(L)})},t.generateAbstractIcon=function(e){let{children:n,attributes:i,main:s,transform:l,styles:u}=e,d=dn(u);d.length>0&&(i.style=d);let m;return gi(l)&&(m=Ie("generateAbstractTransformGrouping",{main:s,transform:l,containerWidth:s.width,iconWidth:s.width})),n.push(m||s.icon),{children:n,attributes:i}}}},Nl={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:n=[]}=e;return mn({type:"layer"},()=>{Ue("beforeDOMElementCreation",{assembler:t,params:e});let i=[];return t(s=>{Array.isArray(s)?s.map(l=>{i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers"),...n].join(" ")},children:i}]})}}}},Fl={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:n=null,classes:i=[],attributes:s={},styles:l={}}=e;return mn({type:"counter",content:t},()=>(Ue("beforeDOMElementCreation",{content:t,params:e}),hl({content:t.toString(),title:n,extra:{attributes:s,styles:l,classes:["".concat(v.cssPrefix,"-layers-counter"),...i]}})))}}}},Pl={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=se,title:i=null,classes:s=[],attributes:l={},styles:u={}}=e;return mn({type:"text",content:t},()=>(Ue("beforeDOMElementCreation",{content:t,params:e}),qr({content:t,transform:h(h({},se),n),title:i,extra:{attributes:l,styles:u,classes:["".concat(v.cssPrefix,"-layers-text"),...s]}})))}}},provides(t){t.generateLayersText=function(e,n){let{title:i,transform:s,extra:l}=n,u=null,d=null;if(fs){let m=parseInt(getComputedStyle(e).fontSize,10),g=e.getBoundingClientRect();u=g.width/m,d=g.height/m}return v.autoA11y&&!i&&(l.attributes["aria-hidden"]="true"),Promise.resolve([e,qr({content:e.innerHTML,width:u,height:d,transform:s,title:i,extra:l,watchable:!0})])}}},kl=new RegExp('"',"ug"),ns=[1105920,1112319],is=h(h(h({FontAwesome:{normal:"fas",400:"fas"}},va),ga),wa),di=Object.keys(is).reduce((t,e)=>(t[e.toLowerCase()]=is[e],t),{}),Rl=Object.keys(di).reduce((t,e)=>{let n=di[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Ll(t){let e=t.replace(kl,""),n=Ka(e,0),i=n>=ns[0]&&n<=ns[1],s=e.length===2?e[0]===e[1]:!1;return{value:ni(s?e[0]:e),isSecondary:i||s}}function Ul(t,e){let n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),i=parseInt(e),s=isNaN(i)?"normal":i;return(di[n]||{})[s]||Rl[n]}function rs(t,e){let n="".concat(Ma).concat(e.replace(":","-"));return new Promise((i,s)=>{if(t.getAttribute(n)!==null)return i();let u=tt(t.children).filter(_=>_.getAttribute(Jn)===e)[0],d=we.getComputedStyle(t,e),m=d.getPropertyValue("font-family"),g=m.match(Na),y=d.getPropertyValue("font-weight"),x=d.getPropertyValue("content");if(u&&!g)return t.removeChild(u),i();if(g&&x!=="none"&&x!==""){let _=d.getPropertyValue("content"),L=Ul(m,y),{value:N,isSecondary:ee}=Ll(_),Y=g[0].startsWith("FontAwesome"),S=yi(L,N),U=S;if(Y){let z=il(N);z.iconName&&z.prefix&&(S=z.iconName,L=z.prefix)}if(S&&!ee&&(!u||u.getAttribute(hi)!==L||u.getAttribute(mi)!==U)){t.setAttribute(n,U),u&&t.removeChild(u);let z=Il(),{extra:le}=z;le.attributes[Jn]=e,li(S,L).then(J=>{let je=bi(A(h({},z),{icons:{main:J,mask:_i()},prefix:L,iconName:U,extra:le,watchable:!0})),He=I.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(He,t.firstChild):t.appendChild(He),He.outerHTML=je.map(ce=>wt(ce)).join(`
`),t.removeAttribute(n),i()}).catch(s)}else i()}else i()})}function jl(t){return Promise.all([rs(t,"::before"),rs(t,"::after")])}function Hl(t){return t.parentNode!==document.head&&!~Sa.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Jn)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function ss(t){if(_e)return new Promise((e,n)=>{let i=tt(t.querySelectorAll("*")).filter(Hl).map(jl),s=Ci.begin("searchPseudoElements");Ls(),Promise.all(i).then(()=>{s(),ui(),e()}).catch(()=>{s(),ui(),n()})})}var zl={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=ss,t}}},provides(t){t.pseudoElements2svg=function(e){let{node:n=I}=e;v.searchPseudoElements&&ss(n)}}},os=!1,Gl={mixout(){return{dom:{unwatch(){Ls(),os=!0}}}},hooks(){return{bootstrap(){Qr(si("mutationObserverCallbacks",{}))},noAuto(){xl()},watch(t){let{observeMutationsRoot:e}=t;os?ui():Qr(si("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},as=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,i)=>{let s=i.toLowerCase().split("-"),l=s[0],u=s.slice(1).join("-");if(l&&u==="h")return n.flipX=!0,n;if(l&&u==="v")return n.flipY=!0,n;if(u=parseFloat(u),isNaN(u))return n;switch(l){case"grow":n.size=n.size+u;break;case"shrink":n.size=n.size-u;break;case"left":n.x=n.x-u;break;case"right":n.x=n.x+u;break;case"up":n.y=n.y-u;break;case"down":n.y=n.y+u;break;case"rotate":n.rotate=n.rotate+u;break}return n},e)},Bl={mixout(){return{parse:{transform:t=>as(t)}}},hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-transform");return n&&(t.transform=as(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:i,containerWidth:s,iconWidth:l}=e,u={transform:"translate(".concat(s/2," 256)")},d="translate(".concat(i.x*32,", ").concat(i.y*32,") "),m="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),g="rotate(".concat(i.rotate," 0 0)"),y={transform:"".concat(d," ").concat(m," ").concat(g)},x={transform:"translate(".concat(l/2*-1," -256)")},_={outer:u,inner:y,path:x};return{tag:"g",attributes:h({},_.outer),children:[{tag:"g",attributes:h({},_.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:h(h({},n.icon.attributes),_.path)}]}]}}}},Kn={x:0,y:0,width:"100%",height:"100%"};function ls(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Wl(t){return t.tag==="g"?t.children:[t]}var Yl={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-mask"),i=n?hn(n.split(" ").map(s=>s.trim())):_i();return i.prefix||(i.prefix=De()),t.mask=i,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:i,main:s,mask:l,maskId:u,transform:d}=e,{width:m,icon:g}=s,{width:y,icon:x}=l,_=Ga({transform:d,containerWidth:y,iconWidth:m}),L={tag:"rect",attributes:A(h({},Kn),{fill:"white"})},N=g.children?{children:g.children.map(ls)}:{},ee={tag:"g",attributes:h({},_.inner),children:[ls(h({tag:g.tag,attributes:h(h({},g.attributes),_.path)},N))]},Y={tag:"g",attributes:h({},_.outer),children:[ee]},S="mask-".concat(u||xt()),U="clip-".concat(u||xt()),z={tag:"mask",attributes:A(h({},Kn),{id:S,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[L,Y]},le={tag:"defs",children:[{tag:"clipPath",attributes:{id:U},children:Wl(x)},z]};return n.push(le,{tag:"rect",attributes:h({fill:"currentColor","clip-path":"url(#".concat(U,")"),mask:"url(#".concat(S,")")},Kn)}),{children:n,attributes:i}}}},$l={provides(t){let e=!1;we.matchMedia&&(e=we.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){let n=[],i={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:A(h({},i),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let l=A(h({},s),{attributeName:"opacity"}),u={tag:"circle",attributes:A(h({},i),{cx:"256",cy:"364",r:"28"}),children:[]};return e||u.children.push({tag:"animate",attributes:A(h({},s),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:A(h({},l),{values:"1;0;1;1;0;1;"})}),n.push(u),n.push({tag:"path",attributes:A(h({},i),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:A(h({},l),{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:A(h({},i),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:A(h({},l),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Xl={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-symbol"),i=n===null?!1:n===""?!0:n;return t.symbol=i,t}}}},ql=[Ya,Ol,Nl,Fl,Pl,zl,Gl,Bl,Yl,$l,Xl];ol(ql,{mixoutsTo:q});var Qc=q.noAuto,Kl=q.config,eu=q.library,Zl=q.dom,Jl=q.parse,tu=q.findIconDefinition,nu=q.toHtml,Ql=q.icon,iu=q.layer,ec=q.text,tc=q.counter;var js=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({});let t=e;return t})();var pn=class t extends Fn{override={swipe:{direction:Hammer.DIRECTION_HORIZONTAL,threshold:10,velocity:.3}};static \u0275fac=(()=>{let e;return function(i){return(e||(e=ut(t)))(i||t)}})();static \u0275prov=Ut({token:t,factory:t.\u0275fac})};var gn=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=me({type:t,bootstrap:[sn]});static \u0275inj=he({providers:[{provide:dr,useClass:pn}],imports:[ur,rn,js,Fr,fr]})};cr().bootstrapModule(gn,{ngZoneEventCoalescing:!0}).catch(t=>console.error(t));
