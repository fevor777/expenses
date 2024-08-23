import{$ as ur,A as Xe,B as De,C as X,D as kn,E as nr,F as _,G as C,H as Y,I as qe,J as I,K as S,L as E,M as re,N as ce,O as ir,P as rr,Q as sr,R as Rn,S as or,V as ar,W as lr,X as cr,Y as Gt,Z as Pe,_ as Ln,a as h,aa as Wt,b as D,ba as dr,c as Ao,d as Zi,e as Ji,ea as fr,f as Qi,fa as hr,g as er,ga as mr,h as tr,ha as Un,i as Fn,ia as pr,j as Ht,ja as gr,k as _e,ka as vr,l as We,la as Ke,m as ie,ma as yr,n as Ce,na as jn,o as be,oa as Yt,p as Pn,pa as $t,q as M,r as V,s as mt,t as W,u as Ye,v as A,w as F,x as zt,y as Bt,z as $e}from"./chunk-5ZUFUI6A.js";var Hn=Ao((rc,Xt)=>{(function(t,e,n,i){"use strict";var s=["","webkit","Moz","MS","ms","o"],l=e.createElement("div"),u="function",d=Math.round,m=Math.abs,p=Date.now;function y(r,o,a){return setTimeout(U(r,a),o)}function w(r,o,a){return Array.isArray(r)?(b(r,a[o],a),!0):!1}function b(r,o,a){var c;if(r)if(r.forEach)r.forEach(o,a);else if(r.length!==i)for(c=0;c<r.length;)o.call(a,r[c],c,r),c++;else for(c in r)r.hasOwnProperty(c)&&o.call(a,r[c],c,r)}function L(r,o,a){var c="DEPRECATED METHOD: "+o+`
`+a+` AT 
`;return function(){var f=new Error("get-stack-trace"),g=f&&f.stack?f.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",x=t.console&&(t.console.warn||t.console.log);return x&&x.call(t.console,c,g),r.apply(this,arguments)}}var k;typeof Object.assign!="function"?k=function(o){if(o===i||o===null)throw new TypeError("Cannot convert undefined or null to object");for(var a=Object(o),c=1;c<arguments.length;c++){var f=arguments[c];if(f!==i&&f!==null)for(var g in f)f.hasOwnProperty(g)&&(a[g]=f[g])}return a}:k=Object.assign;var se=L(function(o,a,c){for(var f=Object.keys(a),g=0;g<f.length;)(!c||c&&o[f[g]]===i)&&(o[f[g]]=a[f[g]]),g++;return o},"extend","Use `assign`."),q=L(function(o,a){return se(o,a,!0)},"merge","Use `assign`.");function N(r,o,a){var c=o.prototype,f;f=r.prototype=Object.create(c),f.constructor=r,f._super=c,a&&k(f,a)}function U(r,o){return function(){return r.apply(o,arguments)}}function z(r,o){return typeof r==u?r.apply(o&&o[0]||i,o):r}function me(r,o){return r===i?o:r}function te(r,o,a){b(St(o),function(c){r.addEventListener(c,a,!1)})}function He(r,o,a){b(St(o),function(c){r.removeEventListener(c,a,!1)})}function ze(r,o){for(;r;){if(r==o)return!0;r=r.parentNode}return!1}function pe(r,o){return r.indexOf(o)>-1}function St(r){return r.trim().split(/\s+/g)}function Be(r,o,a){if(r.indexOf&&!a)return r.indexOf(o);for(var c=0;c<r.length;){if(a&&r[c][a]==o||!a&&r[c]===o)return c;c++}return-1}function Tt(r){return Array.prototype.slice.call(r,0)}function Ti(r,o,a){for(var c=[],f=[],g=0;g<r.length;){var x=o?r[g][o]:r[g];Be(f,x)<0&&c.push(r[g]),f[g]=x,g++}return a&&(o?c=c.sort(function(j,G){return j[o]>G[o]}):c=c.sort()),c}function Mt(r,o){for(var a,c,f=o[0].toUpperCase()+o.slice(1),g=0;g<s.length;){if(a=s[g],c=a?a+f:o,c in r)return c;g++}return i}var Bs=1;function Gs(){return Bs++}function Mi(r){var o=r.ownerDocument||r;return o.defaultView||o.parentWindow||t}var Ws=/mobile|tablet|ip(ad|hone|od)|android/i,Vi="ontouchstart"in t,Ys=Mt(t,"PointerEvent")!==i,$s=Vi&&Ws.test(navigator.userAgent),ot="touch",Xs="pen",xn="mouse",qs="kinect",Ks=25,B=1,Oe=2,P=4,$=8,Vt=1,at=2,lt=4,ct=8,ut=16,oe=at|lt,Ne=ct|ut,Oi=oe|Ne,Ni=["x","y"],Ot=["clientX","clientY"];function Q(r,o){var a=this;this.manager=r,this.callback=o,this.element=r.element,this.target=r.options.inputTarget,this.domHandler=function(c){z(r.options.enable,[r])&&a.handler(c)},this.init()}Q.prototype={handler:function(){},init:function(){this.evEl&&te(this.element,this.evEl,this.domHandler),this.evTarget&&te(this.target,this.evTarget,this.domHandler),this.evWin&&te(Mi(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&He(this.element,this.evEl,this.domHandler),this.evTarget&&He(this.target,this.evTarget,this.domHandler),this.evWin&&He(Mi(this.element),this.evWin,this.domHandler)}};function Zs(r){var o,a=r.options.inputClass;return a?o=a:Ys?o=An:$s?o=Pt:Vi?o=Dn:o=Ft,new o(r,Js)}function Js(r,o,a){var c=a.pointers.length,f=a.changedPointers.length,g=o&B&&c-f===0,x=o&(P|$)&&c-f===0;a.isFirst=!!g,a.isFinal=!!x,g&&(r.session={}),a.eventType=o,Qs(r,a),r.emit("hammer.input",a),r.recognize(a),r.session.prevInput=a}function Qs(r,o){var a=r.session,c=o.pointers,f=c.length;a.firstInput||(a.firstInput=Fi(o)),f>1&&!a.firstMultiple?a.firstMultiple=Fi(o):f===1&&(a.firstMultiple=!1);var g=a.firstInput,x=a.firstMultiple,R=x?x.center:g.center,j=o.center=Pi(c);o.timeStamp=p(),o.deltaTime=o.timeStamp-g.timeStamp,o.angle=wn(R,j),o.distance=Nt(R,j),eo(a,o),o.offsetDirection=Ri(o.deltaX,o.deltaY);var G=ki(o.deltaTime,o.deltaX,o.deltaY);o.overallVelocityX=G.x,o.overallVelocityY=G.y,o.overallVelocity=m(G.x)>m(G.y)?G.x:G.y,o.scale=x?io(x.pointers,c):1,o.rotation=x?no(x.pointers,c):0,o.maxPointers=a.prevInput?o.pointers.length>a.prevInput.maxPointers?o.pointers.length:a.prevInput.maxPointers:o.pointers.length,to(a,o);var le=r.element;ze(o.srcEvent.target,le)&&(le=o.srcEvent.target),o.target=le}function eo(r,o){var a=o.center,c=r.offsetDelta||{},f=r.prevDelta||{},g=r.prevInput||{};(o.eventType===B||g.eventType===P)&&(f=r.prevDelta={x:g.deltaX||0,y:g.deltaY||0},c=r.offsetDelta={x:a.x,y:a.y}),o.deltaX=f.x+(a.x-c.x),o.deltaY=f.y+(a.y-c.y)}function to(r,o){var a=r.lastInterval||o,c=o.timeStamp-a.timeStamp,f,g,x,R;if(o.eventType!=$&&(c>Ks||a.velocity===i)){var j=o.deltaX-a.deltaX,G=o.deltaY-a.deltaY,le=ki(c,j,G);g=le.x,x=le.y,f=m(le.x)>m(le.y)?le.x:le.y,R=Ri(j,G),r.lastInterval=o}else f=a.velocity,g=a.velocityX,x=a.velocityY,R=a.direction;o.velocity=f,o.velocityX=g,o.velocityY=x,o.direction=R}function Fi(r){for(var o=[],a=0;a<r.pointers.length;)o[a]={clientX:d(r.pointers[a].clientX),clientY:d(r.pointers[a].clientY)},a++;return{timeStamp:p(),pointers:o,center:Pi(o),deltaX:r.deltaX,deltaY:r.deltaY}}function Pi(r){var o=r.length;if(o===1)return{x:d(r[0].clientX),y:d(r[0].clientY)};for(var a=0,c=0,f=0;f<o;)a+=r[f].clientX,c+=r[f].clientY,f++;return{x:d(a/o),y:d(c/o)}}function ki(r,o,a){return{x:o/r||0,y:a/r||0}}function Ri(r,o){return r===o?Vt:m(r)>=m(o)?r<0?at:lt:o<0?ct:ut}function Nt(r,o,a){a||(a=Ni);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.sqrt(c*c+f*f)}function wn(r,o,a){a||(a=Ni);var c=o[a[0]]-r[a[0]],f=o[a[1]]-r[a[1]];return Math.atan2(f,c)*180/Math.PI}function no(r,o){return wn(o[1],o[0],Ot)+wn(r[1],r[0],Ot)}function io(r,o){return Nt(o[0],o[1],Ot)/Nt(r[0],r[1],Ot)}var ro={mousedown:B,mousemove:Oe,mouseup:P},so="mousedown",oo="mousemove mouseup";function Ft(){this.evEl=so,this.evWin=oo,this.pressed=!1,Q.apply(this,arguments)}N(Ft,Q,{handler:function(o){var a=ro[o.type];a&B&&o.button===0&&(this.pressed=!0),a&Oe&&o.which!==1&&(a=P),this.pressed&&(a&P&&(this.pressed=!1),this.callback(this.manager,a,{pointers:[o],changedPointers:[o],pointerType:xn,srcEvent:o}))}});var ao={pointerdown:B,pointermove:Oe,pointerup:P,pointercancel:$,pointerout:$},lo={2:ot,3:Xs,4:xn,5:qs},Li="pointerdown",Ui="pointermove pointerup pointercancel";t.MSPointerEvent&&!t.PointerEvent&&(Li="MSPointerDown",Ui="MSPointerMove MSPointerUp MSPointerCancel");function An(){this.evEl=Li,this.evWin=Ui,Q.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}N(An,Q,{handler:function(o){var a=this.store,c=!1,f=o.type.toLowerCase().replace("ms",""),g=ao[f],x=lo[o.pointerType]||o.pointerType,R=x==ot,j=Be(a,o.pointerId,"pointerId");g&B&&(o.button===0||R)?j<0&&(a.push(o),j=a.length-1):g&(P|$)&&(c=!0),!(j<0)&&(a[j]=o,this.callback(this.manager,g,{pointers:a,changedPointers:[o],pointerType:x,srcEvent:o}),c&&a.splice(j,1))}});var co={touchstart:B,touchmove:Oe,touchend:P,touchcancel:$},uo="touchstart",fo="touchstart touchmove touchend touchcancel";function ji(){this.evTarget=uo,this.evWin=fo,this.started=!1,Q.apply(this,arguments)}N(ji,Q,{handler:function(o){var a=co[o.type];if(a===B&&(this.started=!0),!!this.started){var c=ho.call(this,o,a);a&(P|$)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:ot,srcEvent:o})}}});function ho(r,o){var a=Tt(r.touches),c=Tt(r.changedTouches);return o&(P|$)&&(a=Ti(a.concat(c),"identifier",!0)),[a,c]}var mo={touchstart:B,touchmove:Oe,touchend:P,touchcancel:$},po="touchstart touchmove touchend touchcancel";function Pt(){this.evTarget=po,this.targetIds={},Q.apply(this,arguments)}N(Pt,Q,{handler:function(o){var a=mo[o.type],c=go.call(this,o,a);c&&this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:ot,srcEvent:o})}});function go(r,o){var a=Tt(r.touches),c=this.targetIds;if(o&(B|Oe)&&a.length===1)return c[a[0].identifier]=!0,[a,a];var f,g,x=Tt(r.changedTouches),R=[],j=this.target;if(g=a.filter(function(G){return ze(G.target,j)}),o===B)for(f=0;f<g.length;)c[g[f].identifier]=!0,f++;for(f=0;f<x.length;)c[x[f].identifier]&&R.push(x[f]),o&(P|$)&&delete c[x[f].identifier],f++;if(R.length)return[Ti(g.concat(R),"identifier",!0),R]}var vo=2500,Hi=25;function Dn(){Q.apply(this,arguments);var r=U(this.handler,this);this.touch=new Pt(this.manager,r),this.mouse=new Ft(this.manager,r),this.primaryTouch=null,this.lastTouches=[]}N(Dn,Q,{handler:function(o,a,c){var f=c.pointerType==ot,g=c.pointerType==xn;if(!(g&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(f)yo.call(this,a,c);else if(g&&_o.call(this,c))return;this.callback(o,a,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function yo(r,o){r&B?(this.primaryTouch=o.changedPointers[0].identifier,zi.call(this,o)):r&(P|$)&&zi.call(this,o)}function zi(r){var o=r.changedPointers[0];if(o.identifier===this.primaryTouch){var a={x:o.clientX,y:o.clientY};this.lastTouches.push(a);var c=this.lastTouches,f=function(){var g=c.indexOf(a);g>-1&&c.splice(g,1)};setTimeout(f,vo)}}function _o(r){for(var o=r.srcEvent.clientX,a=r.srcEvent.clientY,c=0;c<this.lastTouches.length;c++){var f=this.lastTouches[c],g=Math.abs(o-f.x),x=Math.abs(a-f.y);if(g<=Hi&&x<=Hi)return!0}return!1}var Bi=Mt(l.style,"touchAction"),Gi=Bi!==i,Wi="compute",Yi="auto",In="manipulation",Fe="none",dt="pan-x",ft="pan-y",kt=bo();function Sn(r,o){this.manager=r,this.set(o)}Sn.prototype={set:function(r){r==Wi&&(r=this.compute()),Gi&&this.manager.element.style&&kt[r]&&(this.manager.element.style[Bi]=r),this.actions=r.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var r=[];return b(this.manager.recognizers,function(o){z(o.options.enable,[o])&&(r=r.concat(o.getTouchAction()))}),Co(r.join(" "))},preventDefaults:function(r){var o=r.srcEvent,a=r.offsetDirection;if(this.manager.session.prevented){o.preventDefault();return}var c=this.actions,f=pe(c,Fe)&&!kt[Fe],g=pe(c,ft)&&!kt[ft],x=pe(c,dt)&&!kt[dt];if(f){var R=r.pointers.length===1,j=r.distance<2,G=r.deltaTime<250;if(R&&j&&G)return}if(!(x&&g)&&(f||g&&a&oe||x&&a&Ne))return this.preventSrc(o)},preventSrc:function(r){this.manager.session.prevented=!0,r.preventDefault()}};function Co(r){if(pe(r,Fe))return Fe;var o=pe(r,dt),a=pe(r,ft);return o&&a?Fe:o||a?o?dt:ft:pe(r,In)?In:Yi}function bo(){if(!Gi)return!1;var r={},o=t.CSS&&t.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(a){r[a]=o?t.CSS.supports("touch-action",a):!0}),r}var Rt=1,ee=2,Ge=4,Ae=8,ge=Ae,ht=16,ae=32;function ve(r){this.options=k({},this.defaults,r||{}),this.id=Gs(),this.manager=null,this.options.enable=me(this.options.enable,!0),this.state=Rt,this.simultaneous={},this.requireFail=[]}ve.prototype={defaults:{},set:function(r){return k(this.options,r),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(r){if(w(r,"recognizeWith",this))return this;var o=this.simultaneous;return r=Lt(r,this),o[r.id]||(o[r.id]=r,r.recognizeWith(this)),this},dropRecognizeWith:function(r){return w(r,"dropRecognizeWith",this)?this:(r=Lt(r,this),delete this.simultaneous[r.id],this)},requireFailure:function(r){if(w(r,"requireFailure",this))return this;var o=this.requireFail;return r=Lt(r,this),Be(o,r)===-1&&(o.push(r),r.requireFailure(this)),this},dropRequireFailure:function(r){if(w(r,"dropRequireFailure",this))return this;r=Lt(r,this);var o=Be(this.requireFail,r);return o>-1&&this.requireFail.splice(o,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(r){return!!this.simultaneous[r.id]},emit:function(r){var o=this,a=this.state;function c(f){o.manager.emit(f,r)}a<Ae&&c(o.options.event+$i(a)),c(o.options.event),r.additionalEvent&&c(r.additionalEvent),a>=Ae&&c(o.options.event+$i(a))},tryEmit:function(r){if(this.canEmit())return this.emit(r);this.state=ae},canEmit:function(){for(var r=0;r<this.requireFail.length;){if(!(this.requireFail[r].state&(ae|Rt)))return!1;r++}return!0},recognize:function(r){var o=k({},r);if(!z(this.options.enable,[this,o])){this.reset(),this.state=ae;return}this.state&(ge|ht|ae)&&(this.state=Rt),this.state=this.process(o),this.state&(ee|Ge|Ae|ht)&&this.tryEmit(o)},process:function(r){},getTouchAction:function(){},reset:function(){}};function $i(r){return r&ht?"cancel":r&Ae?"end":r&Ge?"move":r&ee?"start":""}function Xi(r){return r==ut?"down":r==ct?"up":r==at?"left":r==lt?"right":""}function Lt(r,o){var a=o.manager;return a?a.get(r):r}function ne(){ve.apply(this,arguments)}N(ne,ve,{defaults:{pointers:1},attrTest:function(r){var o=this.options.pointers;return o===0||r.pointers.length===o},process:function(r){var o=this.state,a=r.eventType,c=o&(ee|Ge),f=this.attrTest(r);return c&&(a&$||!f)?o|ht:c||f?a&P?o|Ae:o&ee?o|Ge:ee:ae}});function Ut(){ne.apply(this,arguments),this.pX=null,this.pY=null}N(Ut,ne,{defaults:{event:"pan",threshold:10,pointers:1,direction:Oi},getTouchAction:function(){var r=this.options.direction,o=[];return r&oe&&o.push(ft),r&Ne&&o.push(dt),o},directionTest:function(r){var o=this.options,a=!0,c=r.distance,f=r.direction,g=r.deltaX,x=r.deltaY;return f&o.direction||(o.direction&oe?(f=g===0?Vt:g<0?at:lt,a=g!=this.pX,c=Math.abs(r.deltaX)):(f=x===0?Vt:x<0?ct:ut,a=x!=this.pY,c=Math.abs(r.deltaY))),r.direction=f,a&&c>o.threshold&&f&o.direction},attrTest:function(r){return ne.prototype.attrTest.call(this,r)&&(this.state&ee||!(this.state&ee)&&this.directionTest(r))},emit:function(r){this.pX=r.deltaX,this.pY=r.deltaY;var o=Xi(r.direction);o&&(r.additionalEvent=this.options.event+o),this._super.emit.call(this,r)}});function Tn(){ne.apply(this,arguments)}N(Tn,ne,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Fe]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.scale-1)>this.options.threshold||this.state&ee)},emit:function(r){if(r.scale!==1){var o=r.scale<1?"in":"out";r.additionalEvent=this.options.event+o}this._super.emit.call(this,r)}});function Mn(){ve.apply(this,arguments),this._timer=null,this._input=null}N(Mn,ve,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[Yi]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime>o.time;if(this._input=r,!c||!a||r.eventType&(P|$)&&!f)this.reset();else if(r.eventType&B)this.reset(),this._timer=y(function(){this.state=ge,this.tryEmit()},o.time,this);else if(r.eventType&P)return ge;return ae},reset:function(){clearTimeout(this._timer)},emit:function(r){this.state===ge&&(r&&r.eventType&P?this.manager.emit(this.options.event+"up",r):(this._input.timeStamp=p(),this.manager.emit(this.options.event,this._input)))}});function Vn(){ne.apply(this,arguments)}N(Vn,ne,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Fe]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.rotation)>this.options.threshold||this.state&ee)}});function On(){ne.apply(this,arguments)}N(On,ne,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:oe|Ne,pointers:1},getTouchAction:function(){return Ut.prototype.getTouchAction.call(this)},attrTest:function(r){var o=this.options.direction,a;return o&(oe|Ne)?a=r.overallVelocity:o&oe?a=r.overallVelocityX:o&Ne&&(a=r.overallVelocityY),this._super.attrTest.call(this,r)&&o&r.offsetDirection&&r.distance>this.options.threshold&&r.maxPointers==this.options.pointers&&m(a)>this.options.velocity&&r.eventType&P},emit:function(r){var o=Xi(r.offsetDirection);o&&this.manager.emit(this.options.event+o,r),this.manager.emit(this.options.event,r)}});function jt(){ve.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}N(jt,ve,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[In]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,f=r.deltaTime<o.time;if(this.reset(),r.eventType&B&&this.count===0)return this.failTimeout();if(c&&f&&a){if(r.eventType!=P)return this.failTimeout();var g=this.pTime?r.timeStamp-this.pTime<o.interval:!0,x=!this.pCenter||Nt(this.pCenter,r.center)<o.posThreshold;this.pTime=r.timeStamp,this.pCenter=r.center,!x||!g?this.count=1:this.count+=1,this._input=r;var R=this.count%o.taps;if(R===0)return this.hasRequireFailures()?(this._timer=y(function(){this.state=ge,this.tryEmit()},o.interval,this),ee):ge}return ae},failTimeout:function(){return this._timer=y(function(){this.state=ae},this.options.interval,this),ae},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ge&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function ye(r,o){return o=o||{},o.recognizers=me(o.recognizers,ye.defaults.preset),new Nn(r,o)}ye.VERSION="2.0.7",ye.defaults={domEvents:!1,touchAction:Wi,enable:!0,inputTarget:null,inputClass:null,preset:[[Vn,{enable:!1}],[Tn,{enable:!1},["rotate"]],[On,{direction:oe}],[Ut,{direction:oe},["swipe"]],[jt],[jt,{event:"doubletap",taps:2},["tap"]],[Mn]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var Eo=1,qi=2;function Nn(r,o){this.options=k({},ye.defaults,o||{}),this.options.inputTarget=this.options.inputTarget||r,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=r,this.input=Zs(this),this.touchAction=new Sn(this,this.options.touchAction),Ki(this,!0),b(this.options.recognizers,function(a){var c=this.add(new a[0](a[1]));a[2]&&c.recognizeWith(a[2]),a[3]&&c.requireFailure(a[3])},this)}Nn.prototype={set:function(r){return k(this.options,r),r.touchAction&&this.touchAction.update(),r.inputTarget&&(this.input.destroy(),this.input.target=r.inputTarget,this.input.init()),this},stop:function(r){this.session.stopped=r?qi:Eo},recognize:function(r){var o=this.session;if(!o.stopped){this.touchAction.preventDefaults(r);var a,c=this.recognizers,f=o.curRecognizer;(!f||f&&f.state&ge)&&(f=o.curRecognizer=null);for(var g=0;g<c.length;)a=c[g],o.stopped!==qi&&(!f||a==f||a.canRecognizeWith(f))?a.recognize(r):a.reset(),!f&&a.state&(ee|Ge|Ae)&&(f=o.curRecognizer=a),g++}},get:function(r){if(r instanceof ve)return r;for(var o=this.recognizers,a=0;a<o.length;a++)if(o[a].options.event==r)return o[a];return null},add:function(r){if(w(r,"add",this))return this;var o=this.get(r.options.event);return o&&this.remove(o),this.recognizers.push(r),r.manager=this,this.touchAction.update(),r},remove:function(r){if(w(r,"remove",this))return this;if(r=this.get(r),r){var o=this.recognizers,a=Be(o,r);a!==-1&&(o.splice(a,1),this.touchAction.update())}return this},on:function(r,o){if(r!==i&&o!==i){var a=this.handlers;return b(St(r),function(c){a[c]=a[c]||[],a[c].push(o)}),this}},off:function(r,o){if(r!==i){var a=this.handlers;return b(St(r),function(c){o?a[c]&&a[c].splice(Be(a[c],o),1):delete a[c]}),this}},emit:function(r,o){this.options.domEvents&&xo(r,o);var a=this.handlers[r]&&this.handlers[r].slice();if(!(!a||!a.length)){o.type=r,o.preventDefault=function(){o.srcEvent.preventDefault()};for(var c=0;c<a.length;)a[c](o),c++}},destroy:function(){this.element&&Ki(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function Ki(r,o){var a=r.element;if(a.style){var c;b(r.options.cssProps,function(f,g){c=Mt(a.style,g),o?(r.oldCssProps[c]=a.style[c],a.style[c]=f):a.style[c]=r.oldCssProps[c]||""}),o||(r.oldCssProps={})}}function xo(r,o){var a=e.createEvent("Event");a.initEvent(r,!0,!0),a.gesture=o,o.target.dispatchEvent(a)}k(ye,{INPUT_START:B,INPUT_MOVE:Oe,INPUT_END:P,INPUT_CANCEL:$,STATE_POSSIBLE:Rt,STATE_BEGAN:ee,STATE_CHANGED:Ge,STATE_ENDED:Ae,STATE_RECOGNIZED:ge,STATE_CANCELLED:ht,STATE_FAILED:ae,DIRECTION_NONE:Vt,DIRECTION_LEFT:at,DIRECTION_RIGHT:lt,DIRECTION_UP:ct,DIRECTION_DOWN:ut,DIRECTION_HORIZONTAL:oe,DIRECTION_VERTICAL:Ne,DIRECTION_ALL:Oi,Manager:Nn,Input:Q,TouchAction:Sn,TouchInput:Pt,MouseInput:Ft,PointerEventInput:An,TouchMouseInput:Dn,SingleTouchInput:ji,Recognizer:ve,AttrRecognizer:ne,Tap:jt,Pan:Ut,Swipe:On,Pinch:Tn,Rotate:Vn,Press:Mn,on:te,off:He,each:b,merge:q,extend:se,assign:k,inherit:N,bindFn:U,prefixed:Mt});var wo=typeof t<"u"?t:typeof self<"u"?self:{};wo.Hammer=ye,typeof define=="function"&&define.amd?define(function(){return ye}):typeof Xt<"u"&&Xt.exports?Xt.exports=ye:t[n]=ye})(window,document,"Hammer")});var Fu=Zi(Hn());var Dr=(()=>{let e=class e{constructor(i,s){this._renderer=i,this._elementRef=s,this.onChange=l=>{},this.onTouched=()=>{}}setProperty(i,s){this._renderer.setProperty(this._elementRef.nativeElement,i,s)}registerOnTouched(i){this.onTouched=i}registerOnChange(i){this.onChange=i}setDisabledState(i){this.setProperty("disabled",i)}};e.\u0275fac=function(s){return new(s||e)(F(zt),F(Ye))},e.\u0275dir=be({type:e});let t=e;return t})(),Io=(()=>{let e=class e extends Dr{};e.\u0275fac=(()=>{let i;return function(l){return(i||(i=mt(e)))(l||e)}})(),e.\u0275dir=be({type:e,features:[$e]});let t=e;return t})(),Ir=new We("");var So={provide:Ir,useExisting:Fn(()=>Qt),multi:!0};function To(){let t=Ln()?Ln().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var Mo=new We(""),Qt=(()=>{let e=class e extends Dr{constructor(i,s,l){super(i,s),this._compositionMode=l,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!To())}writeValue(i){let s=i??"";this.setProperty("value",s)}_handleInput(i){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(i)}_compositionStart(){this._composing=!0}_compositionEnd(i){this._composing=!1,this._compositionMode&&this.onChange(i)}};e.\u0275fac=function(s){return new(s||e)(F(zt),F(Ye),F(Mo,8))},e.\u0275dir=be({type:e,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(s,l){s&1&&I("input",function(d){return l._handleInput(d.target.value)})("blur",function(){return l.onTouched()})("compositionstart",function(){return l._compositionStart()})("compositionend",function(d){return l._compositionEnd(d.target.value)})},features:[Rn([So]),$e]});let t=e;return t})();var Vo=new We(""),Oo=new We("");function Sr(t){return t!=null}function Tr(t){return ar(t)?Qi(t):t}function Mr(t){let e={};return t.forEach(n=>{e=n!=null?h(h({},e),n):e}),Object.keys(e).length===0?null:e}function Vr(t,e){return e.map(n=>n(t))}function No(t){return!t.validate}function Or(t){return t.map(e=>No(e)?e:n=>e.validate(n))}function Fo(t){if(!t)return null;let e=t.filter(Sr);return e.length==0?null:function(n){return Mr(Vr(n,e))}}function Nr(t){return t!=null?Fo(Or(t)):null}function Po(t){if(!t)return null;let e=t.filter(Sr);return e.length==0?null:function(n){let i=Vr(n,e).map(Tr);return tr(i).pipe(er(Mr))}}function Fr(t){return t!=null?Po(Or(t)):null}function _r(t,e){return t===null?[e]:Array.isArray(t)?[...t,e]:[t,e]}function ko(t){return t._rawValidators}function Ro(t){return t._rawAsyncValidators}function zn(t){return t?Array.isArray(t)?t:[t]:[]}function Kt(t,e){return Array.isArray(t)?t.includes(e):t===e}function Cr(t,e){let n=zn(e);return zn(t).forEach(s=>{Kt(n,s)||n.push(s)}),n}function br(t,e){return zn(e).filter(n=>!Kt(t,n))}var Zt=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=Nr(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=Fr(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control&&this.control.reset(e)}hasError(e,n){return this.control?this.control.hasError(e,n):!1}getError(e,n){return this.control?this.control.getError(e,n):null}},Bn=class extends Zt{get formDirective(){return null}get path(){return null}},_t=class extends Zt{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},Gn=class{constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},Lo={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},wc=D(h({},Lo),{"[class.ng-submitted]":"isSubmitted"}),Pr=(()=>{let e=class e extends Gn{constructor(i){super(i)}};e.\u0275fac=function(s){return new(s||e)(F(_t,2))},e.\u0275dir=be({type:e,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(s,l){s&2&&kn("ng-untouched",l.isUntouched)("ng-touched",l.isTouched)("ng-pristine",l.isPristine)("ng-dirty",l.isDirty)("ng-valid",l.isValid)("ng-invalid",l.isInvalid)("ng-pending",l.isPending)},features:[$e]});let t=e;return t})();var pt="VALID",qt="INVALID",Ze="PENDING",gt="DISABLED",Qe=class{},Jt=class extends Qe{constructor(e,n){super(),this.value=e,this.source=n}},vt=class extends Qe{constructor(e,n){super(),this.pristine=e,this.source=n}},yt=class extends Qe{constructor(e,n){super(),this.touched=e,this.source=n}},Je=class extends Qe{constructor(e,n){super(),this.status=e,this.source=n}};function Uo(t){return(en(t)?t.validators:t)||null}function jo(t){return Array.isArray(t)?Nr(t):t||null}function Ho(t,e){return(en(e)?e.asyncValidators:t)||null}function zo(t){return Array.isArray(t)?Fr(t):t||null}function en(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}var Wn=class{constructor(e,n){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=Gt(()=>this.statusReactive()),this.statusReactive=Bt(void 0),this._pristine=Gt(()=>this.pristineReactive()),this.pristineReactive=Bt(!0),this._touched=Gt(()=>this.touchedReactive()),this.touchedReactive=Bt(!1),this._events=new Ji,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(e),this._assignAsyncValidators(n)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return Pe(this.statusReactive)}set status(e){Pe(()=>this.statusReactive.set(e))}get valid(){return this.status===pt}get invalid(){return this.status===qt}get pending(){return this.status==Ze}get disabled(){return this.status===gt}get enabled(){return this.status!==gt}get pristine(){return Pe(this.pristineReactive)}set pristine(e){Pe(()=>this.pristineReactive.set(e))}get dirty(){return!this.pristine}get touched(){return Pe(this.touchedReactive)}set touched(e){Pe(()=>this.touchedReactive.set(e))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(Cr(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(Cr(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(br(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(br(e,this._rawAsyncValidators))}hasValidator(e){return Kt(this._rawValidators,e)}hasAsyncValidator(e){return Kt(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let n=this.touched===!1;this.touched=!0;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsTouched(D(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new yt(!0,i))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(n=>n.markAllAsTouched(e))}markAsUntouched(e={}){let n=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:i})}),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,i),n&&e.emitEvent!==!1&&this._events.next(new yt(!1,i))}markAsDirty(e={}){let n=this.pristine===!0;this.pristine=!1;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsDirty(D(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new vt(!1,i))}markAsPristine(e={}){let n=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),this._parent&&!e.onlySelf&&this._parent._updatePristine(e,i),n&&e.emitEvent!==!1&&this._events.next(new vt(!0,i))}markAsPending(e={}){this.status=Ze;let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Je(this.status,n)),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.markAsPending(D(h({},e),{sourceControl:n}))}disable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=gt,this.errors=null,this._forEachChild(s=>{s.disable(D(h({},e),{onlySelf:!0}))}),this._updateValue();let i=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Jt(this.value,i)),this._events.next(new Je(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(D(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(s=>s(!0))}enable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=pt,this._forEachChild(i=>{i.enable(D(h({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(D(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(e,n){this._parent&&!e.onlySelf&&(this._parent.updateValueAndValidity(e),e.skipPristineCheck||this._parent._updatePristine({},n),this._parent._updateTouched({},n))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===pt||this.status===Ze)&&this._runAsyncValidator(i,e.emitEvent)}let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Jt(this.value,n)),this._events.next(new Je(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.updateValueAndValidity(D(h({},e),{sourceControl:n}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(n=>n._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?gt:pt}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,n){if(this.asyncValidator){this.status=Ze,this._hasOwnPendingAsyncValidator={emitEvent:n!==!1};let i=Tr(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(s=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(s,{emitEvent:n,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,n={}){this.errors=e,this._updateControlsErrors(n.emitEvent!==!1,this,n.shouldHaveEmitted)}get(e){let n=e;return n==null||(Array.isArray(n)||(n=n.split(".")),n.length===0)?null:n.reduce((i,s)=>i&&i._find(s),this)}getError(e,n){let i=n?this.get(n):this;return i&&i.errors?i.errors[e]:null}hasError(e,n){return!!this.getError(e,n)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,n,i){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||i)&&this._events.next(new Je(this.status,n)),this._parent&&this._parent._updateControlsErrors(e,n,i)}_initObservables(){this.valueChanges=new W,this.statusChanges=new W}_calculateStatus(){return this._allControlsDisabled()?gt:this.errors?qt:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Ze)?Ze:this._anyControlsHaveStatus(qt)?qt:pt}_anyControlsHaveStatus(e){return this._anyControls(n=>n.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,n){let i=!this._anyControlsDirty(),s=this.pristine!==i;this.pristine=i,this._parent&&!e.onlySelf&&this._parent._updatePristine(e,n),s&&this._events.next(new vt(this.pristine,n))}_updateTouched(e={},n){this.touched=this._anyControlsTouched(),this._events.next(new yt(this.touched,n)),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,n)}_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){en(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){let n=this._parent&&this._parent.dirty;return!e&&!!n&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=jo(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=zo(this._rawAsyncValidators)}};var kr=new We("CallSetDisabledState",{providedIn:"root",factory:()=>Yn}),Yn="always";function Bo(t,e){return[...e.path,t]}function Go(t,e,n=Yn){Yo(t,e),e.valueAccessor.writeValue(t.value),(t.disabled||n==="always")&&e.valueAccessor.setDisabledState?.(t.disabled),$o(t,e),qo(t,e),Xo(t,e),Wo(t,e)}function Er(t,e){t.forEach(n=>{n.registerOnValidatorChange&&n.registerOnValidatorChange(e)})}function Wo(t,e){if(e.valueAccessor.setDisabledState){let n=i=>{e.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(n),e._registerOnDestroy(()=>{t._unregisterOnDisabledChange(n)})}}function Yo(t,e){let n=ko(t);e.validator!==null?t.setValidators(_r(n,e.validator)):typeof n=="function"&&t.setValidators([n]);let i=Ro(t);e.asyncValidator!==null?t.setAsyncValidators(_r(i,e.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let s=()=>t.updateValueAndValidity();Er(e._rawValidators,s),Er(e._rawAsyncValidators,s)}function $o(t,e){e.valueAccessor.registerOnChange(n=>{t._pendingValue=n,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Rr(t,e)})}function Xo(t,e){e.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Rr(t,e),t.updateOn!=="submit"&&t.markAsTouched()})}function Rr(t,e){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function qo(t,e){let n=(i,s)=>{e.valueAccessor.writeValue(i),s&&e.viewToModelUpdate(i)};t.registerOnChange(n),e._registerOnDestroy(()=>{t._unregisterOnChange(n)})}function Ko(t,e){if(!t.hasOwnProperty("model"))return!1;let n=t.model;return n.isFirstChange()?!0:!Object.is(e,n.currentValue)}function Zo(t){return Object.getPrototypeOf(t.constructor)===Io}function Jo(t,e){if(!e)return null;Array.isArray(e);let n,i,s;return e.forEach(l=>{l.constructor===Qt?n=l:Zo(l)?i=l:s=l}),s||i||n||null}function xr(t,e){let n=t.indexOf(e);n>-1&&t.splice(n,1)}function wr(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var Qo=class extends Wn{constructor(e=null,n,i){super(Uo(n),Ho(i,n)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(e),this._setUpdateStrategy(n),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),en(n)&&(n.nonNullable||n.initialValueIsDefault)&&(wr(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,n={}){this.value=this._pendingValue=e,this._onChange.length&&n.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,n.emitViewToModelChange!==!1)),this.updateValueAndValidity(n)}patchValue(e,n={}){this.setValue(e,n)}reset(e=this.defaultValue,n={}){this._applyFormState(e),this.markAsPristine(n),this.markAsUntouched(n),this.setValue(this.value,n),this._pendingChange=!1}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){xr(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){xr(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){wr(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var ea={provide:_t,useExisting:Fn(()=>$n)},Ar=Promise.resolve(),$n=(()=>{let e=class e extends _t{constructor(i,s,l,u,d,m){super(),this._changeDetectorRef=d,this.callSetDisabledState=m,this.control=new Qo,this._registered=!1,this.name="",this.update=new W,this._parent=i,this._setValidators(s),this._setAsyncValidators(l),this.valueAccessor=Jo(this,u)}ngOnChanges(i){if(this._checkForErrors(),!this._registered||"name"in i){if(this._registered&&(this._checkName(),this.formDirective)){let s=i.name.previousValue;this.formDirective.removeControl({name:s,path:this._getPath(s)})}this._setUpControl()}"isDisabled"in i&&this._updateDisabled(i),Ko(i,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(i){this.viewModel=i,this.update.emit(i)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){Go(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(i){Ar.then(()=>{this.control.setValue(i,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(i){let s=i.isDisabled.currentValue,l=s!==0&&cr(s);Ar.then(()=>{l&&!this.control.disabled?this.control.disable():!l&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(i){return this._parent?Bo(i,this._parent):[i]}};e.\u0275fac=function(s){return new(s||e)(F(Bn,9),F(Vo,10),F(Oo,10),F(Ir,10),F(lr,8),F(kr,8))},e.\u0275dir=be({type:e,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[Rn([ea]),$e,Pn]});let t=e;return t})();var ta=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=Ce({type:e}),e.\u0275inj=_e({});let t=e;return t})();var Lr=(()=>{let e=class e{static withConfig(i){return{ngModule:e,providers:[{provide:kr,useValue:i.callSetDisabledState??Yn}]}}};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=Ce({type:e}),e.\u0275inj=_e({imports:[ta]});let t=e;return t})();var H=[];for(tn=0;tn<256;++tn)H.push((tn+256).toString(16).slice(1));var tn;function Ur(t,e=0){return(H[t[e+0]]+H[t[e+1]]+H[t[e+2]]+H[t[e+3]]+"-"+H[t[e+4]]+H[t[e+5]]+"-"+H[t[e+6]]+H[t[e+7]]+"-"+H[t[e+8]]+H[t[e+9]]+"-"+H[t[e+10]]+H[t[e+11]]+H[t[e+12]]+H[t[e+13]]+H[t[e+14]]+H[t[e+15]]).toLowerCase()}var nn,ia=new Uint8Array(16);function Xn(){if(!nn&&(nn=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!nn))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return nn(ia)}var ra=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),qn={randomUUID:ra};function sa(t,e,n){if(qn.randomUUID&&!e&&!t)return qn.randomUUID();t=t||{};var i=t.random||(t.rng||Xn)();if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,e){n=n||0;for(var s=0;s<16;++s)e[n+s]=i[s];return e}return Ur(i)}var Kn=sa;var et=Zi(Hn());var rn=class t{constructor(e){this.el=e}swipeLeft=new W;swipeRight=new W;swipeDown=new W;swipeUp=new W;hammer;ngOnInit(){this.hammer=new et.Manager(this.el.nativeElement),this.hammer.add(new et.Swipe({direction:et.DIRECTION_ALL})),this.hammer.on("swipeleft",()=>this.onSwipeLeft()),this.hammer.on("swiperight",()=>this.onSwipeRight()),this.hammer.on("swipeup",()=>this.onSwipeUp()),this.hammer.on("swipedown",()=>this.onSwipeDown())}onSwipeLeft(){this.swipeLeft.emit()}onSwipeRight(){this.swipeRight.emit()}onSwipeDown(){this.swipeDown.emit()}onSwipeUp(){this.swipeUp.emit()}ngOnDestroy(){this.hammer&&this.hammer.destroy()}static \u0275fac=function(n){return new(n||t)(F(Ye))};static \u0275dir=be({type:t,selectors:[["","appSwipe",""]],outputs:{swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeDown:"swipeDown",swipeUp:"swipeUp"}})};var aa=t=>({"scrollable-content-down":t});function la(t,e){if(t&1){let n=qe();_(0,"div",3),I("click",function(){let s=M(n).$implicit,l=S();return V(l.onCategoryClick(s.id))}),Y(1,"i"),_(2,"span"),E(3),C()()}if(t&2){let n=e.$implicit;A(),nr(n.icon),X("color","#DB872C"),A(2),re(n.name)}}var sn=class t{isContentDown;categoryClick=new W;categorySwipeDown=new W;categorySwipeUp=new W;categorySwipeLeft=new W;categorySwipeRight=new W;categories=$t;onCategoryClick(e){this.categoryClick.emit(e)}onSwipeDown(){this.categorySwipeDown.emit()}onSwipeUp(){this.categorySwipeUp.emit()}onSwipeLeft(){this.categorySwipeLeft.emit()}onSwipeRight(){this.categorySwipeRight.emit()}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=ie({type:t,selectors:[["app-categories"]],inputs:{isContentDown:"isContentDown"},outputs:{categoryClick:"categoryClick",categorySwipeDown:"categorySwipeDown",categorySwipeUp:"categorySwipeUp",categorySwipeLeft:"categorySwipeLeft",categorySwipeRight:"categorySwipeRight"},decls:3,vars:4,consts:[["appSwipe","",1,"scrollable-content",3,"swipeDown","swipeUp","swipeLeft","swipeRight","ngClass"],[1,"categories"],["class","category",3,"click",4,"ngFor","ngForOf"],[1,"category",3,"click"]],template:function(n,i){n&1&&(_(0,"div",0),I("swipeDown",function(){return i.onSwipeDown()})("swipeUp",function(){return i.onSwipeUp()})("swipeLeft",function(){return i.onSwipeLeft()})("swipeRight",function(){return i.onSwipeRight()}),_(1,"div",1),Xe(2,la,4,5,"div",2),C()()),n&2&&(De("ngClass",or(2,aa,i.isContentDown)),A(2),De("ngForOf",i.categories))},dependencies:[ur,Wt,rn],styles:[".scrollable-content[_ngcontent-%COMP%]{display:flex}.scrollable-content[_ngcontent-%COMP%]   .scrollable-content-down[_ngcontent-%COMP%]{align-items:end}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:70px;margin:10px;text-align:center;font-size:15px}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:25px;margin-bottom:5px}"]})};function ua(t,e){if(t&1){let n=qe();_(0,"div",10)(1,"div",11),I("swipeleft",function(){M(n);let s=S();return V(s.onDeleteClick())})("swiperight",function(){M(n);let s=S();return V(s.onDeleteClick())}),_(2,"input",12),sr("ngModelChange",function(s){M(n);let l=S();return rr(l.enteredAmount,s)||(l.enteredAmount=s),V(s)}),C()(),_(3,"div",13),I("swipedown",function(s){M(n);let l=S();return V(l.onDisableRefresh(s))})("swipeleft",function(){M(n);let s=S();return V(s.onSwipeLeft())})("swiperight",function(){M(n);let s=S();return V(s.onSwipeRight())}),_(4,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("1"))}),E(5,"1"),C(),_(6,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("2"))}),E(7,"2"),C(),_(8,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("3"))}),E(9,"3"),C(),_(10,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("4"))}),E(11,"4"),C(),_(12,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("5"))}),E(13,"5"),C(),_(14,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("6"))}),E(15,"6"),C(),_(16,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("7"))}),E(17,"7"),C(),_(18,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("8"))}),E(19,"8"),C(),_(20,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("9"))}),E(21,"9"),C(),_(22,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("."))}),E(23,"."),C(),_(24,"div",14),I("click",function(){M(n);let s=S();return V(s.onNumberClick("0"))}),E(25,"0"),C(),_(26,"div",14),I("click",function(){M(n);let s=S();return V(s.onDeleteClick())}),Y(27,"i",15),C()()()}if(t&2){let n=S();A(2),ir("ngModel",n.enteredAmount)}}var an=class t{constructor(e){this.router=e}enteredAmount="";enteredAmountAsNumber=0;currentAmount=0;monthAmount=0;balance=0;balanceDate="";showKeyBoard=!0;currentDate=new Date().toLocaleDateString("ru-RU",{weekday:"short",month:"short",day:"numeric"});categories=$t;ngOnInit(){let e=JSON.parse(localStorage.getItem("expenses")||"[]");console.log("expenses",e),this.sumValues(e),console.log("currentAmount",this.currentAmount),this.balance=Number(localStorage.getItem("balance"))||0,this.balanceDate=localStorage.getItem("balanceDate")}onNumberClick(e){e==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=e):this.enteredAmount+=e,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(e){if(this.enteredAmountAsNumber>0){let n=localStorage.getItem("expenses"),i=n?JSON.parse(n):[];i.unshift({id:Kn(),category:e,amount:this.enteredAmountAsNumber,currency:"EUR",date:Date.now()});let s=Number(localStorage.getItem("balance")||0),l=Math.round((s-this.enteredAmountAsNumber)*100)/100;localStorage.setItem("balance",l.toString()),this.balance=l,localStorage.setItem("expenses",JSON.stringify(i)),this.sumValues(i),this.enteredAmount="",this.enteredAmountAsNumber=0,this.showKeyBoard=!0}}onBalanceChange(){let e=prompt("Enter new balance",this.balance.toString());e&&(localStorage.setItem("balance",e),this.balance=Number(e))}onBalanceDateChange(){let e=prompt("Enter new balance date",this.balanceDate||"");e&&(localStorage.setItem("balanceDate",e),this.balanceDate=e)}onDisableRefresh(e){e.stopPropagation()}onSwipeLeft(){this.router.navigate(["/history"])}onSwipeRight(){this.router.navigate(["/statistics"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}sumValues(e){this.currentAmount=0,this.monthAmount=0,e.forEach(n=>{if(new Date(n.date).toDateString()===new Date().toDateString()){let d=this.currentAmount+n.amount;this.currentAmount=Math.round(d*100)/100}let i=new Date().getMonth(),s=new Date().getFullYear(),l=new Date(n.date).getMonth(),u=new Date(n.date).getFullYear();if(i===l&&s===u){let d=this.monthAmount+n.amount;this.monthAmount=Math.round(d*100)/100}})}static \u0275fac=function(n){return new(n||t)(F(Ke))};static \u0275cmp=ie({type:t,selectors:[["app-expense"]],decls:30,vars:19,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[1,"title-total"],[3,"click"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],[3,"categorySwipeDown","categorySwipeUp","categorySwipeLeft","categorySwipeRight"],["class","number-board",4,"ngIf"],[1,"number-board"],[1,"number-board-header",3,"swipeleft","swiperight"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body",3,"swipedown","swipeleft","swiperight"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div",1),Y(2,"div",2),_(3,"div",3)(4,"span"),E(5),C(),_(6,"span"),E(7,"\u20AC"),C()(),_(8,"div",3),E(9,"-"),C(),_(10,"div",3)(11,"div"),E(12),C(),_(13,"span",4),E(14),C(),_(15,"span"),E(16,"\u20AC"),C()(),_(17,"div",3),E(18,"-"),C(),_(19,"div",3)(20,"div",5),I("click",function(){return i.onBalanceDateChange()}),E(21),C(),_(22,"span",5),I("click",function(){return i.onBalanceChange()}),E(23),C(),_(24,"span",5),I("click",function(){return i.onBalanceChange()}),E(25,"\u20AC "),C()(),_(26,"div",6),Y(27,"i",7),C()(),_(28,"app-categories",8),I("categorySwipeDown",function(){return i.onHideKeyboard()})("categorySwipeUp",function(){return i.onShowKeyboard()})("categorySwipeLeft",function(){return i.onSwipeLeft()})("categorySwipeRight",function(){return i.onSwipeRight()}),C(),Xe(29,ua,28,1,"div",9),C()),n&2&&(A(4),X("color","#ff6f61"),A(),re(i.monthAmount),A(),X("color","#ff6f61"),A(6),re(i.currentDate),A(),X("color","#DB2C07"),A(),re(i.currentAmount),A(),X("color","#DB2C07"),A(6),ce("\u0434\u043E ",i.balanceDate,""),A(),X("color","green"),A(),re(i.balance),A(),X("color","green"),A(2),De("routerLink","/history"),A(3),De("ngIf",i.showKeyBoard))},dependencies:[dr,yr,Qt,Pr,$n,sn],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none;overflow:hidden}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.title-total[_ngcontent-%COMP%]{font-size:27px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da;overflow:hidden}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding:12px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px;overflow:hidden}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};function da(t,e){if(t&1){let n=qe();_(0,"div",3)(1,"div",4),I("click",function(){let s=M(n).$implicit,l=S();return V(l.showCategoryDetails(s.category))}),_(2,"span"),E(3),C(),_(4,"span"),E(5),C()(),_(6,"div",5),I("click",function(){let s=M(n).$implicit,l=S();return V(l.showCategoryDetails(s.category))}),_(7,"div",6),E(8),C()()()}if(t&2){let n=e.$implicit,i=S();A(2),X("color","blue"),A(),re(i.getCategoryNameByIdFunc(n.category)),A(2),ce("",n.amount,"\u20AC"),A(2),X("width",n.percentage,"%")("background-color",n.color),A(),ce(" ",n.percentage.toFixed(2),"% ")}}var ln=class t{constructor(e){this.router=e}categoryTotals=[];totalAmount=0;getCategoryNameByIdFunc=Yt;ngOnInit(){this.calculateCategoryTotals()}showCategoryDetails(e){this.router.navigate(["/details"],{queryParams:{"category-id":e,"back-url":"/statistics"}})}calculateCategoryTotals(){let e=JSON.parse(localStorage.getItem("expenses")||"[]"),n={};e.filter(i=>{let s=new Date(i.date),l=new Date;return s.getDate()===l.getDate()&&s.getMonth()===l.getMonth()&&s.getFullYear()===l.getFullYear()}).forEach(i=>{n[i.category]||(n[i.category]=0),n[i.category]+=i.amount,this.totalAmount+=i.amount});for(let i in n){let s=n[i],l=s/this.totalAmount*100,u=this.getColor(l);this.categoryTotals.push({category:i,amount:s,percentage:l,color:u}),this.categoryTotals.sort((d,m)=>d.amount-m.amount)}}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(e){this.touchStartX=e.changedTouches[0].screenX,this.touchStartY=e.changedTouches[0].screenY}onTouchEnd(e){this.touchEndX=e.changedTouches[0].screenX,this.touchEndY=e.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let e=this.touchEndX-this.touchStartX,n=this.touchEndY-this.touchStartY;Math.abs(e)>Math.abs(n)&&(e>50?this.onSwipeRight():e<-50&&this.onSwipeLeft())}onSwipeLeft(){this.router.navigate(["/"])}onSwipeRight(){this.router.navigate(["/history"])}getColor(e){let n=Math.min(255,Math.round((100-e)*2.55));return`rgb(${Math.min(255,Math.round(e*2.55))}, ${n}, 0)`}static \u0275fac=function(n){return new(n||t)(F(Ke))};static \u0275cmp=ie({type:t,selectors:[["app-statistics"]],hostBindings:function(n,i){n&1&&I("touchstart",function(l){return i.onTouchStart(l)})("touchend",function(l){return i.onTouchEnd(l)})},decls:7,vars:2,consts:[[1,"statistics"],[1,"statistics-title"],["class","category-summary",4,"ngFor","ngForOf"],[1,"category-summary"],[1,"category-header",3,"click"],[1,"progress-bar-container",3,"click"],[1,"progress-bar"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div",1),E(2,"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043F\u043E \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C \u0437\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:"),C(),E(3),Y(4,"br")(5,"br"),Xe(6,da,9,9,"div",2),C()),n&2&&(A(3),ce(" \u0412\u0441\u0435\u0433\u043E \u043F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E: ",i.totalAmount,"\u20AC"),A(3),De("ngForOf",i.categoryTotals))},dependencies:[Wt],styles:[".category-summary[_ngcontent-%COMP%]{margin-bottom:20px}.category-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;font-weight:700;margin-bottom:5px}.progress-bar-container[_ngcontent-%COMP%]{background-color:#e0e0e0;border-radius:5px;overflow:hidden}.progress-bar[_ngcontent-%COMP%]{background-color:#4caf50;height:25px;line-height:25px;color:#fff;text-align:center;border-radius:5px}.statistics[_ngcontent-%COMP%]{padding:15px;height:100dvh}.statistics-title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:15px}"]})};var cn=class t{constructor(e,n){this.activatedRoute=e;this.router=n}amountForDay=0;amountForMonth=0;amountForYear=0;backUrl="";selectedCategory="";ngOnInit(){this.initDetails()}initDetails(){let e=this.activatedRoute.snapshot.queryParamMap.get("category-id");this.selectedCategory=Yt(e),this.backUrl=this.activatedRoute.snapshot.queryParamMap.get("back-url");let n=JSON.parse(localStorage.getItem("expenses")||"[]"),i=new Date().getDate(),s=new Date().getMonth(),l=new Date().getFullYear();n.forEach(u=>{let d=new Date(u.date),m=d.getDate(),p=d.getMonth(),y=d.getFullYear();e===u.category&&(i===m&&s===p&&l===y&&(this.amountForDay+=u.amount),s===p&&l===y&&(this.amountForMonth+=u.amount),l===y&&(this.amountForYear+=u.amount))})}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(e){this.touchStartX=e.changedTouches[0].screenX,this.touchStartY=e.changedTouches[0].screenY}onTouchEnd(e){this.touchEndX=e.changedTouches[0].screenX,this.touchEndY=e.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let e=this.touchEndX-this.touchStartX,n=this.touchEndY-this.touchStartY;Math.abs(e)>Math.abs(n)&&(e>50?this.navigateBack():e<-50&&this.navigateBack())}navigateBack(){this.router.navigate([this.backUrl])}static \u0275fac=function(n){return new(n||t)(F(gr),F(Ke))};static \u0275cmp=ie({type:t,selectors:[["app-details"]],hostBindings:function(n,i){n&1&&I("touchstart",function(l){return i.onTouchStart(l)})("touchend",function(l){return i.onTouchEnd(l)})},decls:21,vars:6,consts:[[1,"details"],[1,"details-item"],[1,"amount"]],template:function(n,i){n&1&&(_(0,"div",0)(1,"div"),E(2," \u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: "),_(3,"span"),E(4),C()(),Y(5,"hr"),_(6,"div",1),E(7," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F: "),_(8,"span",2),E(9),C()(),Y(10,"hr"),_(11,"div",1),E(12," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0437\u0430 \u043C\u0435\u0441\u044F\u0446: "),_(13,"span",2),E(14),C()(),Y(15,"hr"),_(16,"div",1),E(17," \u041F\u043E\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0437\u0430 \u0433\u043E\u0434: "),_(18,"span",2),E(19),C()(),Y(20,"hr"),C()),n&2&&(A(3),X("color","#DB654D"),A(),re(i.selectedCategory),A(5),ce("",i.amountForDay,"\u20AC"),A(5),ce("",i.amountForMonth,"\u20AC"),A(5),ce("",i.amountForYear,"\u20AC"))},styles:[".details[_ngcontent-%COMP%]{height:100dvh;margin:15px}.details-item[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin:10px 0}.details[_ngcontent-%COMP%]   .amount[_ngcontent-%COMP%]{font-size:18px;color:#ff6f61}"]})};var fa=[{path:"history",loadChildren:()=>import("./chunk-E476VZLM.js").then(t=>t.HistoryModule)},{path:"statistics",component:ln},{path:"details",component:cn},{path:"",pathMatch:"full",component:an}],un=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=Ce({type:t});static \u0275inj=_e({imports:[jn.forRoot(fa),jn]})};var dn=class t{title="expenses";static \u0275fac=function(n){return new(n||t)};static \u0275cmp=ie({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(n,i){n&1&&Y(0,"router-outlet")},dependencies:[vr]})};var Hr=()=>{},yi={},ds={},fs=null,hs={mark:Hr,measure:Hr};try{typeof window<"u"&&(yi=window),typeof document<"u"&&(ds=document),typeof MutationObserver<"u"&&(fs=MutationObserver),typeof performance<"u"&&(hs=performance)}catch{}var{userAgent:zr=""}=yi.navigator||{},Te=yi,T=ds,Br=fs,fn=hs,lu=!!Te.document,we=!!T.documentElement&&!!T.head&&typeof T.addEventListener=="function"&&typeof T.createElement=="function",ms=~zr.indexOf("MSIE")||~zr.indexOf("Trident/"),O="classic",ps="duotone",K="sharp",Z="sharp-duotone",ha=[O,ps,K,Z],ma={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},Gr={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},pa=["kit"],ga=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,va=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,ya={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},_a={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},Ca={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},ba={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},Ea={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},xa={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},gs={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},wa=["solid","regular","light","thin","duotone","brands"],vs=[1,2,3,4,5,6,7,8,9,10],Aa=vs.concat([11,12,13,14,15,16,17,18,19,20]),Ct={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Da=[...Object.keys(ba),...wa,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",Ct.GROUP,Ct.SWAP_OPACITY,Ct.PRIMARY,Ct.SECONDARY].concat(vs.map(t=>"".concat(t,"x"))).concat(Aa.map(t=>"w-".concat(t))),Ia={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Sa={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},Ta={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},Wr={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Ee="___FONT_AWESOME___",ii=16,ys="fa",_s="svg-inline--fa",Ue="data-fa-i2svg",ri="data-fa-pseudo-element",Ma="data-fa-pseudo-element-pending",_i="data-prefix",Ci="data-icon",Yr="fontawesome-i2svg",Va="async",Oa=["HTML","HEAD","STYLE","SCRIPT"],Cs=(()=>{try{return!0}catch{return!1}})(),bs=[O,K,Z];function Dt(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[O]}})}var Es=h({},gs);Es[O]=h(h(h({},gs[O]),Gr.kit),Gr["kit-duotone"]);var Re=Dt(Es),si=h({},xa);si[O]=h(h(h({},si[O]),Wr.kit),Wr["kit-duotone"]);var wt=Dt(si),oi=h({},Ea);oi[O]=h(h({},oi[O]),Ta.kit);var Le=Dt(oi),ai=h({},Ca);ai[O]=h(h({},ai[O]),Sa.kit);var Na=Dt(ai),Fa=ga,xs="fa-layers-text",Pa=va,ka=h({},ma),cu=Dt(ka),Ra=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Jn=Ct,it=new Set;Object.keys(wt[O]).map(it.add.bind(it));Object.keys(wt[K]).map(it.add.bind(it));Object.keys(wt[Z]).map(it.add.bind(it));var La=[...pa,...Da],Et=Te.FontAwesomeConfig||{};function Ua(t){var e=T.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function ja(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}T&&typeof T.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,i]=e,s=ja(Ua(n));s!=null&&(Et[i]=s)});var ws={styleDefault:"solid",familyDefault:"classic",cssPrefix:ys,replacementClass:_s,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Et.familyPrefix&&(Et.cssPrefix=Et.familyPrefix);var rt=h(h({},ws),Et);rt.autoReplaceSvg||(rt.observeMutations=!1);var v={};Object.keys(ws).forEach(t=>{Object.defineProperty(v,t,{enumerable:!0,set:function(e){rt[t]=e,xt.forEach(n=>n(v))},get:function(){return rt[t]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(t){rt.cssPrefix=t,xt.forEach(e=>e(v))},get:function(){return rt.cssPrefix}});Te.FontAwesomeConfig=v;var xt=[];function Ha(t){return xt.push(t),()=>{xt.splice(xt.indexOf(t),1)}}var Ie=ii,de={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function za(t){if(!t||!we)return;let e=T.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;let n=T.head.childNodes,i=null;for(let s=n.length-1;s>-1;s--){let l=n[s],u=(l.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(u)>-1&&(i=l)}return T.head.insertBefore(e,i),t}var Ba="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function At(){let t=12,e="";for(;t-- >0;)e+=Ba[Math.random()*62|0];return e}function st(t){let e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function bi(t){return t.classList?st(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function As(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ga(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(As(t[n]),'" '),"").trim()}function vn(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Ei(t){return t.size!==de.size||t.x!==de.x||t.y!==de.y||t.rotate!==de.rotate||t.flipX||t.flipY}function Wa(t){let{transform:e,containerWidth:n,iconWidth:i}=t,s={transform:"translate(".concat(n/2," 256)")},l="translate(".concat(e.x*32,", ").concat(e.y*32,") "),u="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),d="rotate(".concat(e.rotate," 0 0)"),m={transform:"".concat(l," ").concat(u," ").concat(d)},p={transform:"translate(".concat(i/2*-1," -256)")};return{outer:s,inner:m,path:p}}function Ya(t){let{transform:e,width:n=ii,height:i=ii,startCentered:s=!1}=t,l="";return s&&ms?l+="translate(".concat(e.x/Ie-n/2,"em, ").concat(e.y/Ie-i/2,"em) "):s?l+="translate(calc(-50% + ".concat(e.x/Ie,"em), calc(-50% + ").concat(e.y/Ie,"em)) "):l+="translate(".concat(e.x/Ie,"em, ").concat(e.y/Ie,"em) "),l+="scale(".concat(e.size/Ie*(e.flipX?-1:1),", ").concat(e.size/Ie*(e.flipY?-1:1),") "),l+="rotate(".concat(e.rotate,"deg) "),l}var $a=`:root, :host {
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
}`;function Ds(){let t=ys,e=_s,n=v.cssPrefix,i=v.replacementClass,s=$a;if(n!==t||i!==e){let l=new RegExp("\\.".concat(t,"\\-"),"g"),u=new RegExp("\\--".concat(t,"\\-"),"g"),d=new RegExp("\\.".concat(e),"g");s=s.replace(l,".".concat(n,"-")).replace(u,"--".concat(n,"-")).replace(d,".".concat(i))}return s}var $r=!1;function Qn(){v.autoAddCss&&!$r&&(za(Ds()),$r=!0)}var Xa={mixout(){return{dom:{css:Ds,insertCss:Qn}}},hooks(){return{beforeDOMElementCreation(){Qn()},beforeI2svg(){Qn()}}}},xe=Te||{};xe[Ee]||(xe[Ee]={});xe[Ee].styles||(xe[Ee].styles={});xe[Ee].hooks||(xe[Ee].hooks={});xe[Ee].shims||(xe[Ee].shims=[]);var fe=xe[Ee],Is=[],Ss=function(){T.removeEventListener("DOMContentLoaded",Ss),pn=1,Is.map(t=>t())},pn=!1;we&&(pn=(T.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(T.readyState),pn||T.addEventListener("DOMContentLoaded",Ss));function qa(t){we&&(pn?setTimeout(t,0):Is.push(t))}function It(t){let{tag:e,attributes:n={},children:i=[]}=t;return typeof t=="string"?As(t):"<".concat(e," ").concat(Ga(n),">").concat(i.map(It).join(""),"</").concat(e,">")}function Xr(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Ka=function(e,n){return function(i,s,l,u){return e.call(n,i,s,l,u)}},ei=function(e,n,i,s){var l=Object.keys(e),u=l.length,d=s!==void 0?Ka(n,s):n,m,p,y;for(i===void 0?(m=1,y=e[l[0]]):(m=0,y=i);m<u;m++)p=l[m],y=d(y,e[p],p,e);return y};function Za(t){let e=[],n=0,i=t.length;for(;n<i;){let s=t.charCodeAt(n++);if(s>=55296&&s<=56319&&n<i){let l=t.charCodeAt(n++);(l&64512)==56320?e.push(((s&1023)<<10)+(l&1023)+65536):(e.push(s),n--)}else e.push(s)}return e}function li(t){let e=Za(t);return e.length===1?e[0].toString(16):null}function Ja(t,e){let n=t.length,i=t.charCodeAt(e),s;return i>=55296&&i<=56319&&n>e+1&&(s=t.charCodeAt(e+1),s>=56320&&s<=57343)?(i-55296)*1024+s-56320+65536:i}function qr(t){return Object.keys(t).reduce((e,n)=>{let i=t[n];return!!i.icon?e[i.iconName]=i.icon:e[n]=i,e},{})}function ci(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:i=!1}=n,s=qr(e);typeof fe.hooks.addPack=="function"&&!i?fe.hooks.addPack(t,qr(e)):fe.styles[t]=h(h({},fe.styles[t]||{}),s),t==="fas"&&ci("fa",e)}var{styles:ke,shims:Qa}=fe,el={[O]:Object.values(Le[O]),[K]:Object.values(Le[K]),[Z]:Object.values(Le[Z])},xi=null,Ts={},Ms={},Vs={},Os={},Ns={},tl={[O]:Object.keys(Re[O]),[K]:Object.keys(Re[K]),[Z]:Object.keys(Re[Z])};function nl(t){return~La.indexOf(t)}function il(t,e){let n=e.split("-"),i=n[0],s=n.slice(1).join("-");return i===t&&s!==""&&!nl(s)?s:null}var Fs=()=>{let t=i=>ei(ke,(s,l,u)=>(s[u]=ei(l,i,{}),s),{});Ts=t((i,s,l)=>(s[3]&&(i[s[3]]=l),s[2]&&s[2].filter(d=>typeof d=="number").forEach(d=>{i[d.toString(16)]=l}),i)),Ms=t((i,s,l)=>(i[l]=l,s[2]&&s[2].filter(d=>typeof d=="string").forEach(d=>{i[d]=l}),i)),Ns=t((i,s,l)=>{let u=s[2];return i[l]=l,u.forEach(d=>{i[d]=l}),i});let e="far"in ke||v.autoFetchSvg,n=ei(Qa,(i,s)=>{let l=s[0],u=s[1],d=s[2];return u==="far"&&!e&&(u="fas"),typeof l=="string"&&(i.names[l]={prefix:u,iconName:d}),typeof l=="number"&&(i.unicodes[l.toString(16)]={prefix:u,iconName:d}),i},{names:{},unicodes:{}});Vs=n.names,Os=n.unicodes,xi=yn(v.styleDefault,{family:v.familyDefault})};Ha(t=>{xi=yn(t.styleDefault,{family:v.familyDefault})});Fs();function wi(t,e){return(Ts[t]||{})[e]}function rl(t,e){return(Ms[t]||{})[e]}function Se(t,e){return(Ns[t]||{})[e]}function Ps(t){return Vs[t]||{prefix:null,iconName:null}}function sl(t){let e=Os[t],n=wi("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function Me(){return xi}var Ai=()=>({prefix:null,iconName:null,rest:[]});function yn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:n=O}=e,i=Re[n][t],s=wt[n][t]||wt[n][i],l=t in fe.styles?t:null;return s||l||null}var ol={[O]:Object.keys(Le[O]),[K]:Object.keys(Le[K]),[Z]:Object.keys(Le[Z])};function _n(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:n=!1}=e,i={[O]:"".concat(v.cssPrefix,"-").concat(O),[K]:"".concat(v.cssPrefix,"-").concat(K),[Z]:"".concat(v.cssPrefix,"-").concat(Z)},s=null,l=O,u=ha.filter(m=>m!==ps);u.forEach(m=>{(t.includes(i[m])||t.some(p=>ol[m].includes(p)))&&(l=m)});let d=t.reduce((m,p)=>{let y=il(v.cssPrefix,p);if(ke[p]?(p=el[l].includes(p)?Na[l][p]:p,s=p,m.prefix=p):tl[l].indexOf(p)>-1?(s=p,m.prefix=yn(p,{family:l})):y?m.iconName=y:p!==v.replacementClass&&!u.some(w=>p===i[w])&&m.rest.push(p),!n&&m.prefix&&m.iconName){let w=s==="fa"?Ps(m.iconName):{},b=Se(m.prefix,m.iconName);w.prefix&&(s=null),m.iconName=w.iconName||b||m.iconName,m.prefix=w.prefix||m.prefix,m.prefix==="far"&&!ke.far&&ke.fas&&!v.autoFetchSvg&&(m.prefix="fas")}return m},Ai());return(t.includes("fa-brands")||t.includes("fab"))&&(d.prefix="fab"),(t.includes("fa-duotone")||t.includes("fad"))&&(d.prefix="fad"),!d.prefix&&l===K&&(ke.fass||v.autoFetchSvg)&&(d.prefix="fass",d.iconName=Se(d.prefix,d.iconName)||d.iconName),!d.prefix&&l===Z&&(ke.fasds||v.autoFetchSvg)&&(d.prefix="fasds",d.iconName=Se(d.prefix,d.iconName)||d.iconName),(d.prefix==="fa"||s==="fa")&&(d.prefix=Me()||"fas"),d}var ui=class{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];let s=n.reduce(this._pullDefinitions,{});Object.keys(s).forEach(l=>{this.definitions[l]=h(h({},this.definitions[l]||{}),s[l]),ci(l,s[l]);let u=Le[O][l];u&&ci(u,s[l]),Fs()})}reset(){this.definitions={}}_pullDefinitions(e,n){let i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(s=>{let{prefix:l,iconName:u,icon:d}=i[s],m=d[2];e[l]||(e[l]={}),m.length>0&&m.forEach(p=>{typeof p=="string"&&(e[l][p]=d)}),e[l][u]=d}),e}},Kr=[],tt={},nt={},al=Object.keys(nt);function ll(t,e){let{mixoutsTo:n}=e;return Kr=t,tt={},Object.keys(nt).forEach(i=>{al.indexOf(i)===-1&&delete nt[i]}),Kr.forEach(i=>{let s=i.mixout?i.mixout():{};if(Object.keys(s).forEach(l=>{typeof s[l]=="function"&&(n[l]=s[l]),typeof s[l]=="object"&&Object.keys(s[l]).forEach(u=>{n[l]||(n[l]={}),n[l][u]=s[l][u]})}),i.hooks){let l=i.hooks();Object.keys(l).forEach(u=>{tt[u]||(tt[u]=[]),tt[u].push(l[u])})}i.provides&&i.provides(nt)}),n}function di(t,e){for(var n=arguments.length,i=new Array(n>2?n-2:0),s=2;s<n;s++)i[s-2]=arguments[s];return(tt[t]||[]).forEach(u=>{e=u.apply(null,[e,...i])}),e}function je(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];(tt[t]||[]).forEach(l=>{l.apply(null,n)})}function Ve(){let t=arguments[0],e=Array.prototype.slice.call(arguments,1);return nt[t]?nt[t].apply(null,e):void 0}function fi(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t,n=t.prefix||Me();if(e)return e=Se(n,e)||e,Xr(ks.definitions,n,e)||Xr(fe.styles,n,e)}var ks=new ui,cl=()=>{v.autoReplaceSvg=!1,v.observeMutations=!1,je("noAuto")},ul={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return we?(je("beforeI2svg",t),Ve("pseudoElements2svg",t),Ve("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e}=t;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,qa(()=>{fl({autoReplaceSvgRoot:e}),je("watch",t)})}},dl={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:Se(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){let e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=yn(t[0]);return{prefix:n,iconName:Se(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(v.cssPrefix,"-"))>-1||t.match(Fa))){let e=_n(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||Me(),iconName:Se(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){let e=Me();return{prefix:e,iconName:Se(e,t)||t}}}},J={noAuto:cl,config:v,dom:ul,parse:dl,library:ks,findIconDefinition:fi,toHtml:It},fl=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e=T}=t;(Object.keys(fe.styles).length>0||v.autoFetchSvg)&&we&&v.autoReplaceSvg&&J.dom.i2svg({node:e})};function Cn(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>It(n))}}),Object.defineProperty(t,"node",{get:function(){if(!we)return;let n=T.createElement("div");return n.innerHTML=t.html,n.children}}),t}function hl(t){let{children:e,main:n,mask:i,attributes:s,styles:l,transform:u}=t;if(Ei(u)&&n.found&&!i.found){let{width:d,height:m}=n,p={x:d/m/2,y:.5};s.style=vn(D(h({},l),{"transform-origin":"".concat(p.x+u.x/16,"em ").concat(p.y+u.y/16,"em")}))}return[{tag:"svg",attributes:s,children:e}]}function ml(t){let{prefix:e,iconName:n,children:i,attributes:s,symbol:l}=t,u=l===!0?"".concat(e,"-").concat(v.cssPrefix,"-").concat(n):l;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:D(h({},s),{id:u}),children:i}]}]}function Di(t){let{icons:{main:e,mask:n},prefix:i,iconName:s,transform:l,symbol:u,title:d,maskId:m,titleId:p,extra:y,watchable:w=!1}=t,{width:b,height:L}=n.found?n:e,k=i==="fak",se=[v.replacementClass,s?"".concat(v.cssPrefix,"-").concat(s):""].filter(te=>y.classes.indexOf(te)===-1).filter(te=>te!==""||!!te).concat(y.classes).join(" "),q={children:[],attributes:D(h({},y.attributes),{"data-prefix":i,"data-icon":s,class:se,role:y.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(b," ").concat(L)})},N=k&&!~y.classes.indexOf("fa-fw")?{width:"".concat(b/L*16*.0625,"em")}:{};w&&(q.attributes[Ue]=""),d&&(q.children.push({tag:"title",attributes:{id:q.attributes["aria-labelledby"]||"title-".concat(p||At())},children:[d]}),delete q.attributes.title);let U=D(h({},q),{prefix:i,iconName:s,main:e,mask:n,maskId:m,transform:l,symbol:u,styles:h(h({},N),y.styles)}),{children:z,attributes:me}=n.found&&e.found?Ve("generateAbstractMask",U)||{children:[],attributes:{}}:Ve("generateAbstractIcon",U)||{children:[],attributes:{}};return U.children=z,U.attributes=me,u?ml(U):hl(U)}function Zr(t){let{content:e,width:n,height:i,transform:s,title:l,extra:u,watchable:d=!1}=t,m=D(h(h({},u.attributes),l?{title:l}:{}),{class:u.classes.join(" ")});d&&(m[Ue]="");let p=h({},u.styles);Ei(s)&&(p.transform=Ya({transform:s,startCentered:!0,width:n,height:i}),p["-webkit-transform"]=p.transform);let y=vn(p);y.length>0&&(m.style=y);let w=[];return w.push({tag:"span",attributes:m,children:[e]}),l&&w.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),w}function pl(t){let{content:e,title:n,extra:i}=t,s=D(h(h({},i.attributes),n?{title:n}:{}),{class:i.classes.join(" ")}),l=vn(i.styles);l.length>0&&(s.style=l);let u=[];return u.push({tag:"span",attributes:s,children:[e]}),n&&u.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),u}var{styles:ti}=fe;function hi(t){let e=t[0],n=t[1],[i]=t.slice(4),s=null;return Array.isArray(i)?s={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat(Jn.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Jn.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Jn.PRIMARY),fill:"currentColor",d:i[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:e,height:n,icon:s}}var gl={found:!1,width:512,height:512};function vl(t,e){!Cs&&!v.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function mi(t,e){let n=e;return e==="fa"&&v.styleDefault!==null&&(e=Me()),new Promise((i,s)=>{if(n==="fa"){let l=Ps(t)||{};t=l.iconName||t,e=l.prefix||e}if(t&&e&&ti[e]&&ti[e][t]){let l=ti[e][t];return i(hi(l))}vl(t,e),i(D(h({},gl),{icon:v.showMissingIcons&&t?Ve("missingIconAbstract")||{}:{}}))})}var Jr=()=>{},pi=v.measurePerformance&&fn&&fn.mark&&fn.measure?fn:{mark:Jr,measure:Jr},bt='FA "6.6.0"',yl=t=>(pi.mark("".concat(bt," ").concat(t," begins")),()=>Rs(t)),Rs=t=>{pi.mark("".concat(bt," ").concat(t," ends")),pi.measure("".concat(bt," ").concat(t),"".concat(bt," ").concat(t," begins"),"".concat(bt," ").concat(t," ends"))},Ii={begin:yl,end:Rs},hn=()=>{};function Qr(t){return typeof(t.getAttribute?t.getAttribute(Ue):null)=="string"}function _l(t){let e=t.getAttribute?t.getAttribute(_i):null,n=t.getAttribute?t.getAttribute(Ci):null;return e&&n}function Cl(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(v.replacementClass)}function bl(){return v.autoReplaceSvg===!0?mn.replace:mn[v.autoReplaceSvg]||mn.replace}function El(t){return T.createElementNS("http://www.w3.org/2000/svg",t)}function xl(t){return T.createElement(t)}function Ls(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:n=t.tag==="svg"?El:xl}=e;if(typeof t=="string")return T.createTextNode(t);let i=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(l){i.setAttribute(l,t.attributes[l])}),(t.children||[]).forEach(function(l){i.appendChild(Ls(l,{ceFn:n}))}),i}function wl(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var mn={replace:function(t){let e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(Ls(n),e)}),e.getAttribute(Ue)===null&&v.keepOriginalSource){let n=T.createComment(wl(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){let e=t[0],n=t[1];if(~bi(e).indexOf(v.replacementClass))return mn.replace(t);let i=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){let l=n[0].attributes.class.split(" ").reduce((u,d)=>(d===v.replacementClass||d.match(i)?u.toSvg.push(d):u.toNode.push(d),u),{toNode:[],toSvg:[]});n[0].attributes.class=l.toSvg.join(" "),l.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",l.toNode.join(" "))}let s=n.map(l=>It(l)).join(`
`);e.setAttribute(Ue,""),e.innerHTML=s}};function es(t){t()}function Us(t,e){let n=typeof e=="function"?e:hn;if(t.length===0)n();else{let i=es;v.mutateApproach===Va&&(i=Te.requestAnimationFrame||es),i(()=>{let s=bl(),l=Ii.begin("mutate");t.map(s),l(),n()})}}var Si=!1;function js(){Si=!0}function gi(){Si=!1}var gn=null;function ts(t){if(!Br||!v.observeMutations)return;let{treeCallback:e=hn,nodeCallback:n=hn,pseudoElementsCallback:i=hn,observeMutationsRoot:s=T}=t;gn=new Br(l=>{if(Si)return;let u=Me();st(l).forEach(d=>{if(d.type==="childList"&&d.addedNodes.length>0&&!Qr(d.addedNodes[0])&&(v.searchPseudoElements&&i(d.target),e(d.target)),d.type==="attributes"&&d.target.parentNode&&v.searchPseudoElements&&i(d.target.parentNode),d.type==="attributes"&&Qr(d.target)&&~Ra.indexOf(d.attributeName))if(d.attributeName==="class"&&_l(d.target)){let{prefix:m,iconName:p}=_n(bi(d.target));d.target.setAttribute(_i,m||u),p&&d.target.setAttribute(Ci,p)}else Cl(d.target)&&n(d.target)})}),we&&gn.observe(s,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Al(){gn&&gn.disconnect()}function Dl(t){let e=t.getAttribute("style"),n=[];return e&&(n=e.split(";").reduce((i,s)=>{let l=s.split(":"),u=l[0],d=l.slice(1);return u&&d.length>0&&(i[u]=d.join(":").trim()),i},{})),n}function Il(t){let e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),i=t.innerText!==void 0?t.innerText.trim():"",s=_n(bi(t));return s.prefix||(s.prefix=Me()),e&&n&&(s.prefix=e,s.iconName=n),s.iconName&&s.prefix||(s.prefix&&i.length>0&&(s.iconName=rl(s.prefix,t.innerText)||wi(s.prefix,li(t.innerText))),!s.iconName&&v.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=t.firstChild.data)),s}function Sl(t){let e=st(t.attributes).reduce((s,l)=>(s.name!=="class"&&s.name!=="style"&&(s[l.name]=l.value),s),{}),n=t.getAttribute("title"),i=t.getAttribute("data-fa-title-id");return v.autoA11y&&(n?e["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(i||At()):(e["aria-hidden"]="true",e.focusable="false")),e}function Tl(){return{iconName:null,title:null,titleId:null,prefix:null,transform:de,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function ns(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:n,prefix:i,rest:s}=Il(t),l=Sl(t),u=di("parseNodeAttributes",{},t),d=e.styleParser?Dl(t):[];return h({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:i,transform:de,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:d,attributes:l}},u)}var{styles:Ml}=fe;function Hs(t){let e=v.autoReplaceSvg==="nest"?ns(t,{styleParser:!1}):ns(t);return~e.extra.classes.indexOf(xs)?Ve("generateLayersText",t,e):Ve("generateSvgReplacementMutation",t,e)}var he=new Set;bs.map(t=>{he.add("fa-".concat(t))});Object.keys(Re[O]).map(he.add.bind(he));Object.keys(Re[K]).map(he.add.bind(he));Object.keys(Re[Z]).map(he.add.bind(he));he=[...he];function is(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!we)return Promise.resolve();let n=T.documentElement.classList,i=y=>n.add("".concat(Yr,"-").concat(y)),s=y=>n.remove("".concat(Yr,"-").concat(y)),l=v.autoFetchSvg?he:bs.map(y=>"fa-".concat(y)).concat(Object.keys(Ml));l.includes("fa")||l.push("fa");let u=[".".concat(xs,":not([").concat(Ue,"])")].concat(l.map(y=>".".concat(y,":not([").concat(Ue,"])"))).join(", ");if(u.length===0)return Promise.resolve();let d=[];try{d=st(t.querySelectorAll(u))}catch{}if(d.length>0)i("pending"),s("complete");else return Promise.resolve();let m=Ii.begin("onTree"),p=d.reduce((y,w)=>{try{let b=Hs(w);b&&y.push(b)}catch(b){Cs||b.name==="MissingIcon"&&console.error(b)}return y},[]);return new Promise((y,w)=>{Promise.all(p).then(b=>{Us(b,()=>{i("active"),i("complete"),s("pending"),typeof e=="function"&&e(),m(),y()})}).catch(b=>{m(),w(b)})})}function Vl(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Hs(t).then(n=>{n&&Us([n],e)})}function Ol(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=(e||{}).icon?e:fi(e||{}),{mask:s}=n;return s&&(s=(s||{}).icon?s:fi(s||{})),t(i,D(h({},n),{mask:s}))}}var Nl=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=de,symbol:i=!1,mask:s=null,maskId:l=null,title:u=null,titleId:d=null,classes:m=[],attributes:p={},styles:y={}}=e;if(!t)return;let{prefix:w,iconName:b,icon:L}=t;return Cn(h({type:"icon"},t),()=>(je("beforeDOMElementCreation",{iconDefinition:t,params:e}),v.autoA11y&&(u?p["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(d||At()):(p["aria-hidden"]="true",p.focusable="false")),Di({icons:{main:hi(L),mask:s?hi(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:w,iconName:b,transform:h(h({},de),n),symbol:i,title:u,maskId:l,titleId:d,extra:{attributes:p,styles:y,classes:m}})))},Fl={mixout(){return{icon:Ol(Nl)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=is,t.nodeCallback=Vl,t}}},provides(t){t.i2svg=function(e){let{node:n=T,callback:i=()=>{}}=e;return is(n,i)},t.generateSvgReplacementMutation=function(e,n){let{iconName:i,title:s,titleId:l,prefix:u,transform:d,symbol:m,mask:p,maskId:y,extra:w}=n;return new Promise((b,L)=>{Promise.all([mi(i,u),p.iconName?mi(p.iconName,p.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(k=>{let[se,q]=k;b([e,Di({icons:{main:se,mask:q},prefix:u,iconName:i,transform:d,symbol:m,maskId:y,title:s,titleId:l,extra:w,watchable:!0})])}).catch(L)})},t.generateAbstractIcon=function(e){let{children:n,attributes:i,main:s,transform:l,styles:u}=e,d=vn(u);d.length>0&&(i.style=d);let m;return Ei(l)&&(m=Ve("generateAbstractTransformGrouping",{main:s,transform:l,containerWidth:s.width,iconWidth:s.width})),n.push(m||s.icon),{children:n,attributes:i}}}},Pl={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:n=[]}=e;return Cn({type:"layer"},()=>{je("beforeDOMElementCreation",{assembler:t,params:e});let i=[];return t(s=>{Array.isArray(s)?s.map(l=>{i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers"),...n].join(" ")},children:i}]})}}}},kl={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:n=null,classes:i=[],attributes:s={},styles:l={}}=e;return Cn({type:"counter",content:t},()=>(je("beforeDOMElementCreation",{content:t,params:e}),pl({content:t.toString(),title:n,extra:{attributes:s,styles:l,classes:["".concat(v.cssPrefix,"-layers-counter"),...i]}})))}}}},Rl={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=de,title:i=null,classes:s=[],attributes:l={},styles:u={}}=e;return Cn({type:"text",content:t},()=>(je("beforeDOMElementCreation",{content:t,params:e}),Zr({content:t,transform:h(h({},de),n),title:i,extra:{attributes:l,styles:u,classes:["".concat(v.cssPrefix,"-layers-text"),...s]}})))}}},provides(t){t.generateLayersText=function(e,n){let{title:i,transform:s,extra:l}=n,u=null,d=null;if(ms){let m=parseInt(getComputedStyle(e).fontSize,10),p=e.getBoundingClientRect();u=p.width/m,d=p.height/m}return v.autoA11y&&!i&&(l.attributes["aria-hidden"]="true"),Promise.resolve([e,Zr({content:e.innerHTML,width:u,height:d,transform:s,title:i,extra:l,watchable:!0})])}}},Ll=new RegExp('"',"ug"),rs=[1105920,1112319],ss=h(h(h({FontAwesome:{normal:"fas",400:"fas"}},_a),ya),Ia),vi=Object.keys(ss).reduce((t,e)=>(t[e.toLowerCase()]=ss[e],t),{}),Ul=Object.keys(vi).reduce((t,e)=>{let n=vi[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function jl(t){let e=t.replace(Ll,""),n=Ja(e,0),i=n>=rs[0]&&n<=rs[1],s=e.length===2?e[0]===e[1]:!1;return{value:li(s?e[0]:e),isSecondary:i||s}}function Hl(t,e){let n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),i=parseInt(e),s=isNaN(i)?"normal":i;return(vi[n]||{})[s]||Ul[n]}function os(t,e){let n="".concat(Ma).concat(e.replace(":","-"));return new Promise((i,s)=>{if(t.getAttribute(n)!==null)return i();let u=st(t.children).filter(b=>b.getAttribute(ri)===e)[0],d=Te.getComputedStyle(t,e),m=d.getPropertyValue("font-family"),p=m.match(Pa),y=d.getPropertyValue("font-weight"),w=d.getPropertyValue("content");if(u&&!p)return t.removeChild(u),i();if(p&&w!=="none"&&w!==""){let b=d.getPropertyValue("content"),L=Hl(m,y),{value:k,isSecondary:se}=jl(b),q=p[0].startsWith("FontAwesome"),N=wi(L,k),U=N;if(q){let z=sl(k);z.iconName&&z.prefix&&(N=z.iconName,L=z.prefix)}if(N&&!se&&(!u||u.getAttribute(_i)!==L||u.getAttribute(Ci)!==U)){t.setAttribute(n,U),u&&t.removeChild(u);let z=Tl(),{extra:me}=z;me.attributes[ri]=e,mi(N,L).then(te=>{let He=Di(D(h({},z),{icons:{main:te,mask:Ai()},prefix:L,iconName:U,extra:me,watchable:!0})),ze=T.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(ze,t.firstChild):t.appendChild(ze),ze.outerHTML=He.map(pe=>It(pe)).join(`
`),t.removeAttribute(n),i()}).catch(s)}else i()}else i()})}function zl(t){return Promise.all([os(t,"::before"),os(t,"::after")])}function Bl(t){return t.parentNode!==document.head&&!~Oa.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(ri)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function as(t){if(we)return new Promise((e,n)=>{let i=st(t.querySelectorAll("*")).filter(Bl).map(zl),s=Ii.begin("searchPseudoElements");js(),Promise.all(i).then(()=>{s(),gi(),e()}).catch(()=>{s(),gi(),n()})})}var Gl={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=as,t}}},provides(t){t.pseudoElements2svg=function(e){let{node:n=T}=e;v.searchPseudoElements&&as(n)}}},ls=!1,Wl={mixout(){return{dom:{unwatch(){js(),ls=!0}}}},hooks(){return{bootstrap(){ts(di("mutationObserverCallbacks",{}))},noAuto(){Al()},watch(t){let{observeMutationsRoot:e}=t;ls?gi():ts(di("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},cs=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,i)=>{let s=i.toLowerCase().split("-"),l=s[0],u=s.slice(1).join("-");if(l&&u==="h")return n.flipX=!0,n;if(l&&u==="v")return n.flipY=!0,n;if(u=parseFloat(u),isNaN(u))return n;switch(l){case"grow":n.size=n.size+u;break;case"shrink":n.size=n.size-u;break;case"left":n.x=n.x-u;break;case"right":n.x=n.x+u;break;case"up":n.y=n.y-u;break;case"down":n.y=n.y+u;break;case"rotate":n.rotate=n.rotate+u;break}return n},e)},Yl={mixout(){return{parse:{transform:t=>cs(t)}}},hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-transform");return n&&(t.transform=cs(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:i,containerWidth:s,iconWidth:l}=e,u={transform:"translate(".concat(s/2," 256)")},d="translate(".concat(i.x*32,", ").concat(i.y*32,") "),m="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),p="rotate(".concat(i.rotate," 0 0)"),y={transform:"".concat(d," ").concat(m," ").concat(p)},w={transform:"translate(".concat(l/2*-1," -256)")},b={outer:u,inner:y,path:w};return{tag:"g",attributes:h({},b.outer),children:[{tag:"g",attributes:h({},b.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:h(h({},n.icon.attributes),b.path)}]}]}}}},ni={x:0,y:0,width:"100%",height:"100%"};function us(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function $l(t){return t.tag==="g"?t.children:[t]}var Xl={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-mask"),i=n?_n(n.split(" ").map(s=>s.trim())):Ai();return i.prefix||(i.prefix=Me()),t.mask=i,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:i,main:s,mask:l,maskId:u,transform:d}=e,{width:m,icon:p}=s,{width:y,icon:w}=l,b=Wa({transform:d,containerWidth:y,iconWidth:m}),L={tag:"rect",attributes:D(h({},ni),{fill:"white"})},k=p.children?{children:p.children.map(us)}:{},se={tag:"g",attributes:h({},b.inner),children:[us(h({tag:p.tag,attributes:h(h({},p.attributes),b.path)},k))]},q={tag:"g",attributes:h({},b.outer),children:[se]},N="mask-".concat(u||At()),U="clip-".concat(u||At()),z={tag:"mask",attributes:D(h({},ni),{id:N,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[L,q]},me={tag:"defs",children:[{tag:"clipPath",attributes:{id:U},children:$l(w)},z]};return n.push(me,{tag:"rect",attributes:h({fill:"currentColor","clip-path":"url(#".concat(U,")"),mask:"url(#".concat(N,")")},ni)}),{children:n,attributes:i}}}},ql={provides(t){let e=!1;Te.matchMedia&&(e=Te.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){let n=[],i={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:D(h({},i),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let l=D(h({},s),{attributeName:"opacity"}),u={tag:"circle",attributes:D(h({},i),{cx:"256",cy:"364",r:"28"}),children:[]};return e||u.children.push({tag:"animate",attributes:D(h({},s),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:D(h({},l),{values:"1;0;1;1;0;1;"})}),n.push(u),n.push({tag:"path",attributes:D(h({},i),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:D(h({},l),{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:D(h({},i),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:D(h({},l),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Kl={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-symbol"),i=n===null?!1:n===""?!0:n;return t.symbol=i,t}}}},Zl=[Xa,Fl,Pl,kl,Rl,Gl,Wl,Yl,Xl,ql,Kl];ll(Zl,{mixoutsTo:J});var uu=J.noAuto,Jl=J.config,du=J.library,Ql=J.dom,ec=J.parse,fu=J.findIconDefinition,hu=J.toHtml,tc=J.icon,mu=J.layer,nc=J.text,ic=J.counter;var zs=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=Ce({type:e}),e.\u0275inj=_e({});let t=e;return t})();var bn=class t extends Un{override={swipe:{direction:Hammer.DIRECTION_HORIZONTAL,threshold:10,velocity:.3}};static \u0275fac=(()=>{let e;return function(i){return(e||(e=mt(t)))(i||t)}})();static \u0275prov=Ht({token:t,factory:t.\u0275fac})};var En=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=Ce({type:t,bootstrap:[dn]});static \u0275inj=_e({providers:[{provide:mr,useClass:bn}],imports:[hr,un,zs,Lr,pr]})};fr().bootstrapModule(En,{ngZoneEventCoalescing:!0}).catch(t=>console.error(t));
