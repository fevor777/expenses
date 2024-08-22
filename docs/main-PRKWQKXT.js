import{A as Wi,B as Lt,C as Me,D as wn,E as v,F as C,G as S,H as Yi,I as x,J as F,K as E,L as Ut,M as Dn,N as $i,O as Xi,P as qi,Q as In,R as Ki,U as Zi,V as Ji,W as Qi,X as jt,Y as Se,Z as Tn,_ as er,a as h,aa as tr,b as D,c as mo,d as ji,da as nr,e as Hi,ea as ir,f as zi,fa as rr,g as Gi,ga as Mn,h as Bi,ha as sr,i as xn,ia as or,j as Ft,ja as ar,k as he,ka as lr,l as He,la as Sn,m as at,n as me,o as pe,p as An,q as U,r as j,s as lt,t as ge,u as ze,v as z,w as k,x as Pt,y as Rt,z as Ge}from"./chunk-C4AJC3S4.js";var Vn=mo((Yl,Ht)=>{(function(t,e,n,i){"use strict";var s=["","webkit","Moz","MS","ms","o"],l=e.createElement("div"),u="function",f=Math.round,m=Math.abs,g=Date.now;function _(r,o,a){return setTimeout(R(r,a),o)}function w(r,o,a){return Array.isArray(r)?(b(r,a[o],a),!0):!1}function b(r,o,a){var c;if(r)if(r.forEach)r.forEach(o,a);else if(r.length!==i)for(c=0;c<r.length;)o.call(a,r[c],c,r),c++;else for(c in r)r.hasOwnProperty(c)&&o.call(a,r[c],c,r)}function P(r,o,a){var c="DEPRECATED METHOD: "+o+`
`+a+` AT 
`;return function(){var d=new Error("get-stack-trace"),p=d&&d.stack?d.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",A=t.console&&(t.console.warn||t.console.log);return A&&A.call(t.console,c,p),r.apply(this,arguments)}}var O;typeof Object.assign!="function"?O=function(o){if(o===i||o===null)throw new TypeError("Cannot convert undefined or null to object");for(var a=Object(o),c=1;c<arguments.length;c++){var d=arguments[c];if(d!==i&&d!==null)for(var p in d)d.hasOwnProperty(p)&&(a[p]=d[p])}return a}:O=Object.assign;var te=P(function(o,a,c){for(var d=Object.keys(a),p=0;p<d.length;)(!c||c&&o[d[p]]===i)&&(o[d[p]]=a[d[p]]),p++;return o},"extend","Use `assign`."),$=P(function(o,a){return te(o,a,!0)},"merge","Use `assign`.");function M(r,o,a){var c=o.prototype,d;d=r.prototype=Object.create(c),d.constructor=r,d._super=c,a&&O(d,a)}function R(r,o){return function(){return r.apply(o,arguments)}}function G(r,o){return typeof r==u?r.apply(o&&o[0]||i,o):r}function le(r,o){return r===i?o:r}function Q(r,o,a){b(Et(o),function(c){r.addEventListener(c,a,!1)})}function Re(r,o,a){b(Et(o),function(c){r.removeEventListener(c,a,!1)})}function Le(r,o){for(;r;){if(r==o)return!0;r=r.parentNode}return!1}function ce(r,o){return r.indexOf(o)>-1}function Et(r){return r.trim().split(/\s+/g)}function Ue(r,o,a){if(r.indexOf&&!a)return r.indexOf(o);for(var c=0;c<r.length;){if(a&&r[c][a]==o||!a&&r[c]===o)return c;c++}return-1}function xt(r){return Array.prototype.slice.call(r,0)}function yi(r,o,a){for(var c=[],d=[],p=0;p<r.length;){var A=o?r[p][o]:r[p];Ue(d,A)<0&&c.push(r[p]),d[p]=A,p++}return a&&(o?c=c.sort(function(L,W){return L[o]>W[o]}):c=c.sort()),c}function At(r,o){for(var a,c,d=o[0].toUpperCase()+o.slice(1),p=0;p<s.length;){if(a=s[p],c=a?a+d:o,c in r)return c;p++}return i}var Os=1;function Ns(){return Os++}function _i(r){var o=r.ownerDocument||r;return o.defaultView||o.parentWindow||t}var ks=/mobile|tablet|ip(ad|hone|od)|android/i,Ci="ontouchstart"in t,Fs=At(t,"PointerEvent")!==i,Ps=Ci&&ks.test(navigator.userAgent),Qe="touch",Rs="pen",dn="mouse",Ls="kinect",Us=25,B=1,De=2,V=4,Y=8,wt=1,et=2,tt=4,nt=8,it=16,ne=et|tt,Ie=nt|it,bi=ne|Ie,Ei=["x","y"],Dt=["clientX","clientY"];function Z(r,o){var a=this;this.manager=r,this.callback=o,this.element=r.element,this.target=r.options.inputTarget,this.domHandler=function(c){G(r.options.enable,[r])&&a.handler(c)},this.init()}Z.prototype={handler:function(){},init:function(){this.evEl&&Q(this.element,this.evEl,this.domHandler),this.evTarget&&Q(this.target,this.evTarget,this.domHandler),this.evWin&&Q(_i(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&Re(this.element,this.evEl,this.domHandler),this.evTarget&&Re(this.target,this.evTarget,this.domHandler),this.evWin&&Re(_i(this.element),this.evWin,this.domHandler)}};function js(r){var o,a=r.options.inputClass;return a?o=a:Fs?o=mn:Ps?o=Mt:Ci?o=pn:o=Tt,new o(r,Hs)}function Hs(r,o,a){var c=a.pointers.length,d=a.changedPointers.length,p=o&B&&c-d===0,A=o&(V|Y)&&c-d===0;a.isFirst=!!p,a.isFinal=!!A,p&&(r.session={}),a.eventType=o,zs(r,a),r.emit("hammer.input",a),r.recognize(a),r.session.prevInput=a}function zs(r,o){var a=r.session,c=o.pointers,d=c.length;a.firstInput||(a.firstInput=xi(o)),d>1&&!a.firstMultiple?a.firstMultiple=xi(o):d===1&&(a.firstMultiple=!1);var p=a.firstInput,A=a.firstMultiple,N=A?A.center:p.center,L=o.center=Ai(c);o.timeStamp=g(),o.deltaTime=o.timeStamp-p.timeStamp,o.angle=hn(N,L),o.distance=It(N,L),Gs(a,o),o.offsetDirection=Di(o.deltaX,o.deltaY);var W=wi(o.deltaTime,o.deltaX,o.deltaY);o.overallVelocityX=W.x,o.overallVelocityY=W.y,o.overallVelocity=m(W.x)>m(W.y)?W.x:W.y,o.scale=A?Ys(A.pointers,c):1,o.rotation=A?Ws(A.pointers,c):0,o.maxPointers=a.prevInput?o.pointers.length>a.prevInput.maxPointers?o.pointers.length:a.prevInput.maxPointers:o.pointers.length,Bs(a,o);var re=r.element;Le(o.srcEvent.target,re)&&(re=o.srcEvent.target),o.target=re}function Gs(r,o){var a=o.center,c=r.offsetDelta||{},d=r.prevDelta||{},p=r.prevInput||{};(o.eventType===B||p.eventType===V)&&(d=r.prevDelta={x:p.deltaX||0,y:p.deltaY||0},c=r.offsetDelta={x:a.x,y:a.y}),o.deltaX=d.x+(a.x-c.x),o.deltaY=d.y+(a.y-c.y)}function Bs(r,o){var a=r.lastInterval||o,c=o.timeStamp-a.timeStamp,d,p,A,N;if(o.eventType!=Y&&(c>Us||a.velocity===i)){var L=o.deltaX-a.deltaX,W=o.deltaY-a.deltaY,re=wi(c,L,W);p=re.x,A=re.y,d=m(re.x)>m(re.y)?re.x:re.y,N=Di(L,W),r.lastInterval=o}else d=a.velocity,p=a.velocityX,A=a.velocityY,N=a.direction;o.velocity=d,o.velocityX=p,o.velocityY=A,o.direction=N}function xi(r){for(var o=[],a=0;a<r.pointers.length;)o[a]={clientX:f(r.pointers[a].clientX),clientY:f(r.pointers[a].clientY)},a++;return{timeStamp:g(),pointers:o,center:Ai(o),deltaX:r.deltaX,deltaY:r.deltaY}}function Ai(r){var o=r.length;if(o===1)return{x:f(r[0].clientX),y:f(r[0].clientY)};for(var a=0,c=0,d=0;d<o;)a+=r[d].clientX,c+=r[d].clientY,d++;return{x:f(a/o),y:f(c/o)}}function wi(r,o,a){return{x:o/r||0,y:a/r||0}}function Di(r,o){return r===o?wt:m(r)>=m(o)?r<0?et:tt:o<0?nt:it}function It(r,o,a){a||(a=Ei);var c=o[a[0]]-r[a[0]],d=o[a[1]]-r[a[1]];return Math.sqrt(c*c+d*d)}function hn(r,o,a){a||(a=Ei);var c=o[a[0]]-r[a[0]],d=o[a[1]]-r[a[1]];return Math.atan2(d,c)*180/Math.PI}function Ws(r,o){return hn(o[1],o[0],Dt)+hn(r[1],r[0],Dt)}function Ys(r,o){return It(o[0],o[1],Dt)/It(r[0],r[1],Dt)}var $s={mousedown:B,mousemove:De,mouseup:V},Xs="mousedown",qs="mousemove mouseup";function Tt(){this.evEl=Xs,this.evWin=qs,this.pressed=!1,Z.apply(this,arguments)}M(Tt,Z,{handler:function(o){var a=$s[o.type];a&B&&o.button===0&&(this.pressed=!0),a&De&&o.which!==1&&(a=V),this.pressed&&(a&V&&(this.pressed=!1),this.callback(this.manager,a,{pointers:[o],changedPointers:[o],pointerType:dn,srcEvent:o}))}});var Ks={pointerdown:B,pointermove:De,pointerup:V,pointercancel:Y,pointerout:Y},Zs={2:Qe,3:Rs,4:dn,5:Ls},Ii="pointerdown",Ti="pointermove pointerup pointercancel";t.MSPointerEvent&&!t.PointerEvent&&(Ii="MSPointerDown",Ti="MSPointerMove MSPointerUp MSPointerCancel");function mn(){this.evEl=Ii,this.evWin=Ti,Z.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}M(mn,Z,{handler:function(o){var a=this.store,c=!1,d=o.type.toLowerCase().replace("ms",""),p=Ks[d],A=Zs[o.pointerType]||o.pointerType,N=A==Qe,L=Ue(a,o.pointerId,"pointerId");p&B&&(o.button===0||N)?L<0&&(a.push(o),L=a.length-1):p&(V|Y)&&(c=!0),!(L<0)&&(a[L]=o,this.callback(this.manager,p,{pointers:a,changedPointers:[o],pointerType:A,srcEvent:o}),c&&a.splice(L,1))}});var Js={touchstart:B,touchmove:De,touchend:V,touchcancel:Y},Qs="touchstart",eo="touchstart touchmove touchend touchcancel";function Mi(){this.evTarget=Qs,this.evWin=eo,this.started=!1,Z.apply(this,arguments)}M(Mi,Z,{handler:function(o){var a=Js[o.type];if(a===B&&(this.started=!0),!!this.started){var c=to.call(this,o,a);a&(V|Y)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:Qe,srcEvent:o})}}});function to(r,o){var a=xt(r.touches),c=xt(r.changedTouches);return o&(V|Y)&&(a=yi(a.concat(c),"identifier",!0)),[a,c]}var no={touchstart:B,touchmove:De,touchend:V,touchcancel:Y},io="touchstart touchmove touchend touchcancel";function Mt(){this.evTarget=io,this.targetIds={},Z.apply(this,arguments)}M(Mt,Z,{handler:function(o){var a=no[o.type],c=ro.call(this,o,a);c&&this.callback(this.manager,a,{pointers:c[0],changedPointers:c[1],pointerType:Qe,srcEvent:o})}});function ro(r,o){var a=xt(r.touches),c=this.targetIds;if(o&(B|De)&&a.length===1)return c[a[0].identifier]=!0,[a,a];var d,p,A=xt(r.changedTouches),N=[],L=this.target;if(p=a.filter(function(W){return Le(W.target,L)}),o===B)for(d=0;d<p.length;)c[p[d].identifier]=!0,d++;for(d=0;d<A.length;)c[A[d].identifier]&&N.push(A[d]),o&(V|Y)&&delete c[A[d].identifier],d++;if(N.length)return[yi(p.concat(N),"identifier",!0),N]}var so=2500,Si=25;function pn(){Z.apply(this,arguments);var r=R(this.handler,this);this.touch=new Mt(this.manager,r),this.mouse=new Tt(this.manager,r),this.primaryTouch=null,this.lastTouches=[]}M(pn,Z,{handler:function(o,a,c){var d=c.pointerType==Qe,p=c.pointerType==dn;if(!(p&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)oo.call(this,a,c);else if(p&&ao.call(this,c))return;this.callback(o,a,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});function oo(r,o){r&B?(this.primaryTouch=o.changedPointers[0].identifier,Vi.call(this,o)):r&(V|Y)&&Vi.call(this,o)}function Vi(r){var o=r.changedPointers[0];if(o.identifier===this.primaryTouch){var a={x:o.clientX,y:o.clientY};this.lastTouches.push(a);var c=this.lastTouches,d=function(){var p=c.indexOf(a);p>-1&&c.splice(p,1)};setTimeout(d,so)}}function ao(r){for(var o=r.srcEvent.clientX,a=r.srcEvent.clientY,c=0;c<this.lastTouches.length;c++){var d=this.lastTouches[c],p=Math.abs(o-d.x),A=Math.abs(a-d.y);if(p<=Si&&A<=Si)return!0}return!1}var Oi=At(l.style,"touchAction"),Ni=Oi!==i,ki="compute",Fi="auto",gn="manipulation",Te="none",rt="pan-x",st="pan-y",St=co();function vn(r,o){this.manager=r,this.set(o)}vn.prototype={set:function(r){r==ki&&(r=this.compute()),Ni&&this.manager.element.style&&St[r]&&(this.manager.element.style[Oi]=r),this.actions=r.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var r=[];return b(this.manager.recognizers,function(o){G(o.options.enable,[o])&&(r=r.concat(o.getTouchAction()))}),lo(r.join(" "))},preventDefaults:function(r){var o=r.srcEvent,a=r.offsetDirection;if(this.manager.session.prevented){o.preventDefault();return}var c=this.actions,d=ce(c,Te)&&!St[Te],p=ce(c,st)&&!St[st],A=ce(c,rt)&&!St[rt];if(d){var N=r.pointers.length===1,L=r.distance<2,W=r.deltaTime<250;if(N&&L&&W)return}if(!(A&&p)&&(d||p&&a&ne||A&&a&Ie))return this.preventSrc(o)},preventSrc:function(r){this.manager.session.prevented=!0,r.preventDefault()}};function lo(r){if(ce(r,Te))return Te;var o=ce(r,rt),a=ce(r,st);return o&&a?Te:o||a?o?rt:st:ce(r,gn)?gn:Fi}function co(){if(!Ni)return!1;var r={},o=t.CSS&&t.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(a){r[a]=o?t.CSS.supports("touch-action",a):!0}),r}var Vt=1,J=2,je=4,Ce=8,ue=Ce,ot=16,ie=32;function fe(r){this.options=O({},this.defaults,r||{}),this.id=Ns(),this.manager=null,this.options.enable=le(this.options.enable,!0),this.state=Vt,this.simultaneous={},this.requireFail=[]}fe.prototype={defaults:{},set:function(r){return O(this.options,r),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(r){if(w(r,"recognizeWith",this))return this;var o=this.simultaneous;return r=Ot(r,this),o[r.id]||(o[r.id]=r,r.recognizeWith(this)),this},dropRecognizeWith:function(r){return w(r,"dropRecognizeWith",this)?this:(r=Ot(r,this),delete this.simultaneous[r.id],this)},requireFailure:function(r){if(w(r,"requireFailure",this))return this;var o=this.requireFail;return r=Ot(r,this),Ue(o,r)===-1&&(o.push(r),r.requireFailure(this)),this},dropRequireFailure:function(r){if(w(r,"dropRequireFailure",this))return this;r=Ot(r,this);var o=Ue(this.requireFail,r);return o>-1&&this.requireFail.splice(o,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(r){return!!this.simultaneous[r.id]},emit:function(r){var o=this,a=this.state;function c(d){o.manager.emit(d,r)}a<Ce&&c(o.options.event+Pi(a)),c(o.options.event),r.additionalEvent&&c(r.additionalEvent),a>=Ce&&c(o.options.event+Pi(a))},tryEmit:function(r){if(this.canEmit())return this.emit(r);this.state=ie},canEmit:function(){for(var r=0;r<this.requireFail.length;){if(!(this.requireFail[r].state&(ie|Vt)))return!1;r++}return!0},recognize:function(r){var o=O({},r);if(!G(this.options.enable,[this,o])){this.reset(),this.state=ie;return}this.state&(ue|ot|ie)&&(this.state=Vt),this.state=this.process(o),this.state&(J|je|Ce|ot)&&this.tryEmit(o)},process:function(r){},getTouchAction:function(){},reset:function(){}};function Pi(r){return r&ot?"cancel":r&Ce?"end":r&je?"move":r&J?"start":""}function Ri(r){return r==it?"down":r==nt?"up":r==et?"left":r==tt?"right":""}function Ot(r,o){var a=o.manager;return a?a.get(r):r}function ee(){fe.apply(this,arguments)}M(ee,fe,{defaults:{pointers:1},attrTest:function(r){var o=this.options.pointers;return o===0||r.pointers.length===o},process:function(r){var o=this.state,a=r.eventType,c=o&(J|je),d=this.attrTest(r);return c&&(a&Y||!d)?o|ot:c||d?a&V?o|Ce:o&J?o|je:J:ie}});function Nt(){ee.apply(this,arguments),this.pX=null,this.pY=null}M(Nt,ee,{defaults:{event:"pan",threshold:10,pointers:1,direction:bi},getTouchAction:function(){var r=this.options.direction,o=[];return r&ne&&o.push(st),r&Ie&&o.push(rt),o},directionTest:function(r){var o=this.options,a=!0,c=r.distance,d=r.direction,p=r.deltaX,A=r.deltaY;return d&o.direction||(o.direction&ne?(d=p===0?wt:p<0?et:tt,a=p!=this.pX,c=Math.abs(r.deltaX)):(d=A===0?wt:A<0?nt:it,a=A!=this.pY,c=Math.abs(r.deltaY))),r.direction=d,a&&c>o.threshold&&d&o.direction},attrTest:function(r){return ee.prototype.attrTest.call(this,r)&&(this.state&J||!(this.state&J)&&this.directionTest(r))},emit:function(r){this.pX=r.deltaX,this.pY=r.deltaY;var o=Ri(r.direction);o&&(r.additionalEvent=this.options.event+o),this._super.emit.call(this,r)}});function yn(){ee.apply(this,arguments)}M(yn,ee,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Te]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.scale-1)>this.options.threshold||this.state&J)},emit:function(r){if(r.scale!==1){var o=r.scale<1?"in":"out";r.additionalEvent=this.options.event+o}this._super.emit.call(this,r)}});function _n(){fe.apply(this,arguments),this._timer=null,this._input=null}M(_n,fe,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[Fi]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,d=r.deltaTime>o.time;if(this._input=r,!c||!a||r.eventType&(V|Y)&&!d)this.reset();else if(r.eventType&B)this.reset(),this._timer=_(function(){this.state=ue,this.tryEmit()},o.time,this);else if(r.eventType&V)return ue;return ie},reset:function(){clearTimeout(this._timer)},emit:function(r){this.state===ue&&(r&&r.eventType&V?this.manager.emit(this.options.event+"up",r):(this._input.timeStamp=g(),this.manager.emit(this.options.event,this._input)))}});function Cn(){ee.apply(this,arguments)}M(Cn,ee,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Te]},attrTest:function(r){return this._super.attrTest.call(this,r)&&(Math.abs(r.rotation)>this.options.threshold||this.state&J)}});function bn(){ee.apply(this,arguments)}M(bn,ee,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:ne|Ie,pointers:1},getTouchAction:function(){return Nt.prototype.getTouchAction.call(this)},attrTest:function(r){var o=this.options.direction,a;return o&(ne|Ie)?a=r.overallVelocity:o&ne?a=r.overallVelocityX:o&Ie&&(a=r.overallVelocityY),this._super.attrTest.call(this,r)&&o&r.offsetDirection&&r.distance>this.options.threshold&&r.maxPointers==this.options.pointers&&m(a)>this.options.velocity&&r.eventType&V},emit:function(r){var o=Ri(r.offsetDirection);o&&this.manager.emit(this.options.event+o,r),this.manager.emit(this.options.event,r)}});function kt(){fe.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}M(kt,fe,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[gn]},process:function(r){var o=this.options,a=r.pointers.length===o.pointers,c=r.distance<o.threshold,d=r.deltaTime<o.time;if(this.reset(),r.eventType&B&&this.count===0)return this.failTimeout();if(c&&d&&a){if(r.eventType!=V)return this.failTimeout();var p=this.pTime?r.timeStamp-this.pTime<o.interval:!0,A=!this.pCenter||It(this.pCenter,r.center)<o.posThreshold;this.pTime=r.timeStamp,this.pCenter=r.center,!A||!p?this.count=1:this.count+=1,this._input=r;var N=this.count%o.taps;if(N===0)return this.hasRequireFailures()?(this._timer=_(function(){this.state=ue,this.tryEmit()},o.interval,this),J):ue}return ie},failTimeout:function(){return this._timer=_(function(){this.state=ie},this.options.interval,this),ie},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ue&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}});function de(r,o){return o=o||{},o.recognizers=le(o.recognizers,de.defaults.preset),new En(r,o)}de.VERSION="2.0.7",de.defaults={domEvents:!1,touchAction:ki,enable:!0,inputTarget:null,inputClass:null,preset:[[Cn,{enable:!1}],[yn,{enable:!1},["rotate"]],[bn,{direction:ne}],[Nt,{direction:ne},["swipe"]],[kt],[kt,{event:"doubletap",taps:2},["tap"]],[_n]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var uo=1,Li=2;function En(r,o){this.options=O({},de.defaults,o||{}),this.options.inputTarget=this.options.inputTarget||r,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=r,this.input=js(this),this.touchAction=new vn(this,this.options.touchAction),Ui(this,!0),b(this.options.recognizers,function(a){var c=this.add(new a[0](a[1]));a[2]&&c.recognizeWith(a[2]),a[3]&&c.requireFailure(a[3])},this)}En.prototype={set:function(r){return O(this.options,r),r.touchAction&&this.touchAction.update(),r.inputTarget&&(this.input.destroy(),this.input.target=r.inputTarget,this.input.init()),this},stop:function(r){this.session.stopped=r?Li:uo},recognize:function(r){var o=this.session;if(!o.stopped){this.touchAction.preventDefaults(r);var a,c=this.recognizers,d=o.curRecognizer;(!d||d&&d.state&ue)&&(d=o.curRecognizer=null);for(var p=0;p<c.length;)a=c[p],o.stopped!==Li&&(!d||a==d||a.canRecognizeWith(d))?a.recognize(r):a.reset(),!d&&a.state&(J|je|Ce)&&(d=o.curRecognizer=a),p++}},get:function(r){if(r instanceof fe)return r;for(var o=this.recognizers,a=0;a<o.length;a++)if(o[a].options.event==r)return o[a];return null},add:function(r){if(w(r,"add",this))return this;var o=this.get(r.options.event);return o&&this.remove(o),this.recognizers.push(r),r.manager=this,this.touchAction.update(),r},remove:function(r){if(w(r,"remove",this))return this;if(r=this.get(r),r){var o=this.recognizers,a=Ue(o,r);a!==-1&&(o.splice(a,1),this.touchAction.update())}return this},on:function(r,o){if(r!==i&&o!==i){var a=this.handlers;return b(Et(r),function(c){a[c]=a[c]||[],a[c].push(o)}),this}},off:function(r,o){if(r!==i){var a=this.handlers;return b(Et(r),function(c){o?a[c]&&a[c].splice(Ue(a[c],o),1):delete a[c]}),this}},emit:function(r,o){this.options.domEvents&&fo(r,o);var a=this.handlers[r]&&this.handlers[r].slice();if(!(!a||!a.length)){o.type=r,o.preventDefault=function(){o.srcEvent.preventDefault()};for(var c=0;c<a.length;)a[c](o),c++}},destroy:function(){this.element&&Ui(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}};function Ui(r,o){var a=r.element;if(a.style){var c;b(r.options.cssProps,function(d,p){c=At(a.style,p),o?(r.oldCssProps[c]=a.style[c],a.style[c]=d):a.style[c]=r.oldCssProps[c]||""}),o||(r.oldCssProps={})}}function fo(r,o){var a=e.createEvent("Event");a.initEvent(r,!0,!0),a.gesture=o,o.target.dispatchEvent(a)}O(de,{INPUT_START:B,INPUT_MOVE:De,INPUT_END:V,INPUT_CANCEL:Y,STATE_POSSIBLE:Vt,STATE_BEGAN:J,STATE_CHANGED:je,STATE_ENDED:Ce,STATE_RECOGNIZED:ue,STATE_CANCELLED:ot,STATE_FAILED:ie,DIRECTION_NONE:wt,DIRECTION_LEFT:et,DIRECTION_RIGHT:tt,DIRECTION_UP:nt,DIRECTION_DOWN:it,DIRECTION_HORIZONTAL:ne,DIRECTION_VERTICAL:Ie,DIRECTION_ALL:bi,Manager:En,Input:Z,TouchAction:vn,TouchInput:Mt,MouseInput:Tt,PointerEventInput:mn,TouchMouseInput:pn,SingleTouchInput:Mi,Recognizer:fe,AttrRecognizer:ee,Tap:kt,Pan:Nt,Swipe:bn,Pinch:yn,Rotate:Cn,Press:_n,on:Q,off:Re,each:b,merge:$,extend:te,assign:O,inherit:M,bindFn:R,prefixed:At});var ho=typeof t<"u"?t:typeof self<"u"?self:{};ho.Hammer=de,typeof define=="function"&&define.amd?define(function(){return de}):typeof Ht<"u"&&Ht.exports?Ht.exports=de:t[n]=de})(window,document,"Hammer")});var cu=ji(Vn());var gr=(()=>{let e=class e{constructor(i,s){this._renderer=i,this._elementRef=s,this.onChange=l=>{},this.onTouched=()=>{}}setProperty(i,s){this._renderer.setProperty(this._elementRef.nativeElement,i,s)}registerOnTouched(i){this.onTouched=i}registerOnChange(i){this.onChange=i}setDisabledState(i){this.setProperty("disabled",i)}};e.\u0275fac=function(s){return new(s||e)(k(Pt),k(ze))},e.\u0275dir=pe({type:e});let t=e;return t})(),go=(()=>{let e=class e extends gr{};e.\u0275fac=(()=>{let i;return function(l){return(i||(i=lt(e)))(l||e)}})(),e.\u0275dir=pe({type:e,features:[Ge]});let t=e;return t})(),vr=new He("");var vo={provide:vr,useExisting:xn(()=>Yt),multi:!0};function yo(){let t=Tn()?Tn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var _o=new He(""),Yt=(()=>{let e=class e extends gr{constructor(i,s,l){super(i,s),this._compositionMode=l,this._composing=!1,this._compositionMode==null&&(this._compositionMode=!yo())}writeValue(i){let s=i??"";this.setProperty("value",s)}_handleInput(i){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(i)}_compositionStart(){this._composing=!0}_compositionEnd(i){this._composing=!1,this._compositionMode&&this.onChange(i)}};e.\u0275fac=function(s){return new(s||e)(k(Pt),k(ze),k(_o,8))},e.\u0275dir=pe({type:e,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(s,l){s&1&&x("input",function(f){return l._handleInput(f.target.value)})("blur",function(){return l.onTouched()})("compositionstart",function(){return l._compositionStart()})("compositionend",function(f){return l._compositionEnd(f.target.value)})},features:[In([vo]),Ge]});let t=e;return t})();var Co=new He(""),bo=new He("");function yr(t){return t!=null}function _r(t){return Zi(t)?zi(t):t}function Cr(t){let e={};return t.forEach(n=>{e=n!=null?h(h({},e),n):e}),Object.keys(e).length===0?null:e}function br(t,e){return e.map(n=>n(t))}function Eo(t){return!t.validate}function Er(t){return t.map(e=>Eo(e)?e:n=>e.validate(n))}function xo(t){if(!t)return null;let e=t.filter(yr);return e.length==0?null:function(n){return Cr(br(n,e))}}function xr(t){return t!=null?xo(Er(t)):null}function Ao(t){if(!t)return null;let e=t.filter(yr);return e.length==0?null:function(n){let i=br(n,e).map(_r);return Bi(i).pipe(Gi(Cr))}}function Ar(t){return t!=null?Ao(Er(t)):null}function cr(t,e){return t===null?[e]:Array.isArray(t)?[...t,e]:[t,e]}function wo(t){return t._rawValidators}function Do(t){return t._rawAsyncValidators}function On(t){return t?Array.isArray(t)?t:[t]:[]}function Gt(t,e){return Array.isArray(t)?t.includes(e):t===e}function ur(t,e){let n=On(e);return On(t).forEach(s=>{Gt(n,s)||n.push(s)}),n}function fr(t,e){return On(e).filter(n=>!Gt(t,n))}var Bt=class{constructor(){this._rawValidators=[],this._rawAsyncValidators=[],this._onDestroyCallbacks=[]}get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=xr(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=Ar(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control&&this.control.reset(e)}hasError(e,n){return this.control?this.control.hasError(e,n):!1}getError(e,n){return this.control?this.control.getError(e,n):null}},Nn=class extends Bt{get formDirective(){return null}get path(){return null}},ht=class extends Bt{constructor(){super(...arguments),this._parent=null,this.name=null,this.valueAccessor=null}},kn=class{constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},Io={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},dc=D(h({},Io),{"[class.ng-submitted]":"isSubmitted"}),wr=(()=>{let e=class e extends kn{constructor(i){super(i)}};e.\u0275fac=function(s){return new(s||e)(k(ht,2))},e.\u0275dir=pe({type:e,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(s,l){s&2&&wn("ng-untouched",l.isUntouched)("ng-touched",l.isTouched)("ng-pristine",l.isPristine)("ng-dirty",l.isDirty)("ng-valid",l.isValid)("ng-invalid",l.isInvalid)("ng-pending",l.isPending)},features:[Ge]});let t=e;return t})();var ct="VALID",zt="INVALID",Be="PENDING",ut="DISABLED",Ye=class{},Wt=class extends Ye{constructor(e,n){super(),this.value=e,this.source=n}},ft=class extends Ye{constructor(e,n){super(),this.pristine=e,this.source=n}},dt=class extends Ye{constructor(e,n){super(),this.touched=e,this.source=n}},We=class extends Ye{constructor(e,n){super(),this.status=e,this.source=n}};function To(t){return($t(t)?t.validators:t)||null}function Mo(t){return Array.isArray(t)?xr(t):t||null}function So(t,e){return($t(e)?e.asyncValidators:t)||null}function Vo(t){return Array.isArray(t)?Ar(t):t||null}function $t(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}var Fn=class{constructor(e,n){this._pendingDirty=!1,this._hasOwnPendingAsyncValidator=null,this._pendingTouched=!1,this._onCollectionChange=()=>{},this._parent=null,this._status=jt(()=>this.statusReactive()),this.statusReactive=Rt(void 0),this._pristine=jt(()=>this.pristineReactive()),this.pristineReactive=Rt(!0),this._touched=jt(()=>this.touchedReactive()),this.touchedReactive=Rt(!1),this._events=new Hi,this.events=this._events.asObservable(),this._onDisabledChange=[],this._assignValidators(e),this._assignAsyncValidators(n)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return Se(this.statusReactive)}set status(e){Se(()=>this.statusReactive.set(e))}get valid(){return this.status===ct}get invalid(){return this.status===zt}get pending(){return this.status==Be}get disabled(){return this.status===ut}get enabled(){return this.status!==ut}get pristine(){return Se(this.pristineReactive)}set pristine(e){Se(()=>this.pristineReactive.set(e))}get dirty(){return!this.pristine}get touched(){return Se(this.touchedReactive)}set touched(e){Se(()=>this.touchedReactive.set(e))}get untouched(){return!this.touched}get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(ur(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(ur(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(fr(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(fr(e,this._rawAsyncValidators))}hasValidator(e){return Gt(this._rawValidators,e)}hasAsyncValidator(e){return Gt(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let n=this.touched===!1;this.touched=!0;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsTouched(D(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new dt(!0,i))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(n=>n.markAllAsTouched(e))}markAsUntouched(e={}){let n=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:i})}),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,i),n&&e.emitEvent!==!1&&this._events.next(new dt(!1,i))}markAsDirty(e={}){let n=this.pristine===!0;this.pristine=!1;let i=e.sourceControl??this;this._parent&&!e.onlySelf&&this._parent.markAsDirty(D(h({},e),{sourceControl:i})),n&&e.emitEvent!==!1&&this._events.next(new ft(!1,i))}markAsPristine(e={}){let n=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=e.sourceControl??this;this._forEachChild(s=>{s.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),this._parent&&!e.onlySelf&&this._parent._updatePristine(e,i),n&&e.emitEvent!==!1&&this._events.next(new ft(!0,i))}markAsPending(e={}){this.status=Be;let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new We(this.status,n)),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.markAsPending(D(h({},e),{sourceControl:n}))}disable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=ut,this.errors=null,this._forEachChild(s=>{s.disable(D(h({},e),{onlySelf:!0}))}),this._updateValue();let i=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Wt(this.value,i)),this._events.next(new We(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(D(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(s=>s(!0))}enable(e={}){let n=this._parentMarkedDirty(e.onlySelf);this.status=ct,this._forEachChild(i=>{i.enable(D(h({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(D(h({},e),{skipPristineCheck:n}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(e,n){this._parent&&!e.onlySelf&&(this._parent.updateValueAndValidity(e),e.skipPristineCheck||this._parent._updatePristine({},n),this._parent._updateTouched({},n))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===ct||this.status===Be)&&this._runAsyncValidator(i,e.emitEvent)}let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Wt(this.value,n)),this._events.next(new We(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!e.onlySelf&&this._parent.updateValueAndValidity(D(h({},e),{sourceControl:n}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(n=>n._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?ut:ct}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,n){if(this.asyncValidator){this.status=Be,this._hasOwnPendingAsyncValidator={emitEvent:n!==!1};let i=_r(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(s=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(s,{emitEvent:n,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,n={}){this.errors=e,this._updateControlsErrors(n.emitEvent!==!1,this,n.shouldHaveEmitted)}get(e){let n=e;return n==null||(Array.isArray(n)||(n=n.split(".")),n.length===0)?null:n.reduce((i,s)=>i&&i._find(s),this)}getError(e,n){let i=n?this.get(n):this;return i&&i.errors?i.errors[e]:null}hasError(e,n){return!!this.getError(e,n)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,n,i){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||i)&&this._events.next(new We(this.status,n)),this._parent&&this._parent._updateControlsErrors(e,n,i)}_initObservables(){this.valueChanges=new ge,this.statusChanges=new ge}_calculateStatus(){return this._allControlsDisabled()?ut:this.errors?zt:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Be)?Be:this._anyControlsHaveStatus(zt)?zt:ct}_anyControlsHaveStatus(e){return this._anyControls(n=>n.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,n){let i=!this._anyControlsDirty(),s=this.pristine!==i;this.pristine=i,this._parent&&!e.onlySelf&&this._parent._updatePristine(e,n),s&&this._events.next(new ft(this.pristine,n))}_updateTouched(e={},n){this.touched=this._anyControlsTouched(),this._events.next(new dt(this.touched,n)),this._parent&&!e.onlySelf&&this._parent._updateTouched(e,n)}_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){$t(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){let n=this._parent&&this._parent.dirty;return!e&&!!n&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=Mo(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=Vo(this._rawAsyncValidators)}};var Dr=new He("CallSetDisabledState",{providedIn:"root",factory:()=>Pn}),Pn="always";function Oo(t,e){return[...e.path,t]}function No(t,e,n=Pn){Fo(t,e),e.valueAccessor.writeValue(t.value),(t.disabled||n==="always")&&e.valueAccessor.setDisabledState?.(t.disabled),Po(t,e),Lo(t,e),Ro(t,e),ko(t,e)}function dr(t,e){t.forEach(n=>{n.registerOnValidatorChange&&n.registerOnValidatorChange(e)})}function ko(t,e){if(e.valueAccessor.setDisabledState){let n=i=>{e.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(n),e._registerOnDestroy(()=>{t._unregisterOnDisabledChange(n)})}}function Fo(t,e){let n=wo(t);e.validator!==null?t.setValidators(cr(n,e.validator)):typeof n=="function"&&t.setValidators([n]);let i=Do(t);e.asyncValidator!==null?t.setAsyncValidators(cr(i,e.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let s=()=>t.updateValueAndValidity();dr(e._rawValidators,s),dr(e._rawAsyncValidators,s)}function Po(t,e){e.valueAccessor.registerOnChange(n=>{t._pendingValue=n,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Ir(t,e)})}function Ro(t,e){e.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Ir(t,e),t.updateOn!=="submit"&&t.markAsTouched()})}function Ir(t,e){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function Lo(t,e){let n=(i,s)=>{e.valueAccessor.writeValue(i),s&&e.viewToModelUpdate(i)};t.registerOnChange(n),e._registerOnDestroy(()=>{t._unregisterOnChange(n)})}function Uo(t,e){if(!t.hasOwnProperty("model"))return!1;let n=t.model;return n.isFirstChange()?!0:!Object.is(e,n.currentValue)}function jo(t){return Object.getPrototypeOf(t.constructor)===go}function Ho(t,e){if(!e)return null;Array.isArray(e);let n,i,s;return e.forEach(l=>{l.constructor===Yt?n=l:jo(l)?i=l:s=l}),s||i||n||null}function hr(t,e){let n=t.indexOf(e);n>-1&&t.splice(n,1)}function mr(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var zo=class extends Fn{constructor(e=null,n,i){super(To(n),So(i,n)),this.defaultValue=null,this._onChange=[],this._pendingChange=!1,this._applyFormState(e),this._setUpdateStrategy(n),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),$t(n)&&(n.nonNullable||n.initialValueIsDefault)&&(mr(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,n={}){this.value=this._pendingValue=e,this._onChange.length&&n.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,n.emitViewToModelChange!==!1)),this.updateValueAndValidity(n)}patchValue(e,n={}){this.setValue(e,n)}reset(e=this.defaultValue,n={}){this._applyFormState(e),this.markAsPristine(n),this.markAsUntouched(n),this.setValue(this.value,n),this._pendingChange=!1}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){hr(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){hr(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){mr(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var Go={provide:ht,useExisting:xn(()=>Rn)},pr=Promise.resolve(),Rn=(()=>{let e=class e extends ht{constructor(i,s,l,u,f,m){super(),this._changeDetectorRef=f,this.callSetDisabledState=m,this.control=new zo,this._registered=!1,this.name="",this.update=new ge,this._parent=i,this._setValidators(s),this._setAsyncValidators(l),this.valueAccessor=Ho(this,u)}ngOnChanges(i){if(this._checkForErrors(),!this._registered||"name"in i){if(this._registered&&(this._checkName(),this.formDirective)){let s=i.name.previousValue;this.formDirective.removeControl({name:s,path:this._getPath(s)})}this._setUpControl()}"isDisabled"in i&&this._updateDisabled(i),Uo(i,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(i){this.viewModel=i,this.update.emit(i)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){No(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._isStandalone()||this._checkParentType(),this._checkName()}_checkParentType(){}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(i){pr.then(()=>{this.control.setValue(i,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(i){let s=i.isDisabled.currentValue,l=s!==0&&Qi(s);pr.then(()=>{l&&!this.control.disabled?this.control.disable():!l&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(i){return this._parent?Oo(i,this._parent):[i]}};e.\u0275fac=function(s){return new(s||e)(k(Nn,9),k(Co,10),k(bo,10),k(vr,10),k(Ji,8),k(Dr,8))},e.\u0275dir=pe({type:e,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],features:[In([Go]),Ge,An]});let t=e;return t})();var Bo=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({});let t=e;return t})();var Tr=(()=>{let e=class e{static withConfig(i){return{ngModule:e,providers:[{provide:Dr,useValue:i.callSetDisabledState??Pn}]}}};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({imports:[Bo]});let t=e;return t})();var H=[];for(Xt=0;Xt<256;++Xt)H.push((Xt+256).toString(16).slice(1));var Xt;function Mr(t,e=0){return(H[t[e+0]]+H[t[e+1]]+H[t[e+2]]+H[t[e+3]]+"-"+H[t[e+4]]+H[t[e+5]]+"-"+H[t[e+6]]+H[t[e+7]]+"-"+H[t[e+8]]+H[t[e+9]]+"-"+H[t[e+10]]+H[t[e+11]]+H[t[e+12]]+H[t[e+13]]+H[t[e+14]]+H[t[e+15]]).toLowerCase()}var qt,Yo=new Uint8Array(16);function Ln(){if(!qt&&(qt=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!qt))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return qt(Yo)}var $o=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Un={randomUUID:$o};function Xo(t,e,n){if(Un.randomUUID&&!e&&!t)return Un.randomUUID();t=t||{};var i=t.random||(t.rng||Ln)();if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,e){n=n||0;for(var s=0;s<16;++s)e[n+s]=i[s];return e}return Mr(i)}var jn=Xo;var $e=ji(Vn());var Kt=class t{constructor(e){this.el=e}swipeLeft=new ge;swipeRight=new ge;swipeDown=new ge;swipeUp=new ge;hammer;ngOnInit(){this.hammer=new $e.Manager(this.el.nativeElement),this.hammer.add(new $e.Swipe({direction:$e.DIRECTION_ALL})),this.hammer.on("swipeleft",()=>this.onSwipeLeft()),this.hammer.on("swiperight",()=>this.onSwipeRight()),this.hammer.on("swipeup",()=>this.onSwipeUp()),this.hammer.on("swipedown",()=>this.onSwipeDown())}onSwipeLeft(){this.swipeLeft.emit()}onSwipeRight(){this.swipeRight.emit()}onSwipeDown(){this.swipeDown.emit()}onSwipeUp(){this.swipeUp.emit()}ngOnDestroy(){this.hammer&&this.hammer.destroy()}static \u0275fac=function(n){return new(n||t)(k(ze))};static \u0275dir=pe({type:t,selectors:[["","appSwipe",""]],outputs:{swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeDown:"swipeDown",swipeUp:"swipeUp"}})};var Jo=t=>({"scrollable-content-down":t});function Qo(t,e){if(t&1){let n=Yi();v(0,"div",28)(1,"div",29),x("swipeleft",function(){U(n);let s=F();return j(s.onDeleteClick())})("swiperight",function(){U(n);let s=F();return j(s.onDeleteClick())}),v(2,"input",30),qi("ngModelChange",function(s){U(n);let l=F();return Xi(l.enteredAmount,s)||(l.enteredAmount=s),j(s)}),C()(),v(3,"div",31),x("swipedown",function(s){U(n);let l=F();return j(l.onDisableRefresh(s))}),v(4,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("1"))}),E(5,"1"),C(),v(6,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("2"))}),E(7,"2"),C(),v(8,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("3"))}),E(9,"3"),C(),v(10,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("4"))}),E(11,"4"),C(),v(12,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("5"))}),E(13,"5"),C(),v(14,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("6"))}),E(15,"6"),C(),v(16,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("7"))}),E(17,"7"),C(),v(18,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("8"))}),E(19,"8"),C(),v(20,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("9"))}),E(21,"9"),C(),v(22,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("."))}),E(23,"."),C(),v(24,"div",32),x("click",function(){U(n);let s=F();return j(s.onNumberClick("0"))}),E(25,"0"),C(),v(26,"div",32),x("click",function(){U(n);let s=F();return j(s.onDeleteClick())}),S(27,"i",33),C()()()}if(t&2){let n=F();z(2),$i("ngModel",n.enteredAmount)}}var Zt=class t{constructor(e){this.router=e}enteredAmount="";enteredAmountAsNumber=0;currentAmount=0;monthAmount=0;balance=0;balanceDate="";showKeyBoard=!0;currentDate=new Date().toLocaleDateString("ru-RU",{weekday:"short",month:"short",day:"numeric"});ngOnInit(){let e=JSON.parse(localStorage.getItem("expenses")||"[]");console.log("expenses",e),this.sumValues(e),console.log("currentAmount",this.currentAmount),this.balance=Number(localStorage.getItem("balance"))||0,this.balanceDate=localStorage.getItem("balanceDate")}onNumberClick(e){e==="."?this.enteredAmount.length===0?this.enteredAmount="0.":this.enteredAmount.includes(".")||(this.enteredAmount+=e):this.enteredAmount+=e,this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount),console.log(Number(this.enteredAmount))}onDeleteClick(){this.enteredAmount.length>0&&(this.enteredAmount=this.enteredAmount.slice(0,-1)),this.enteredAmountAsNumber=Number(this.enteredAmount),console.log(this.enteredAmount)}onCategoryClick(e){if(this.enteredAmountAsNumber>0){let n=localStorage.getItem("expenses"),i=n?JSON.parse(n):[];i.unshift({id:jn(),category:e,amount:this.enteredAmountAsNumber,currency:"EUR",date:Date.now()});let l=Number(localStorage.getItem("balance")||0)-this.enteredAmountAsNumber;localStorage.setItem("balance",l.toString()),this.balance=l,localStorage.setItem("expenses",JSON.stringify(i)),this.sumValues(i),this.enteredAmount="",this.enteredAmountAsNumber=0,this.showKeyBoard=!0}}onBalanceChange(){let e=prompt("Enter new balance",this.balance.toString());e&&(localStorage.setItem("balance",e),this.balance=Number(e))}onBalanceDateChange(){let e=prompt("Enter new balance date",this.balanceDate||"");e&&(localStorage.setItem("balanceDate",e),this.balanceDate=e)}onDisableRefresh(e){e.stopPropagation()}onSwipeLeft(){this.router.navigate(["/history"])}onShowKeyboard(){this.showKeyBoard=!0}onHideKeyboard(){this.showKeyBoard=!1}sumValues(e){this.currentAmount=0,this.monthAmount=0,e.forEach(n=>{if(new Date(n.date).toDateString()===new Date().toDateString()){let f=this.currentAmount+n.amount;this.currentAmount=Math.round(f*100)/100}let i=new Date().getMonth(),s=new Date().getFullYear(),l=new Date(n.date).getMonth(),u=new Date(n.date).getFullYear();if(i===l&&s===u){let f=this.monthAmount+n.amount;this.monthAmount=Math.round(f*100)/100}})}static \u0275fac=function(n){return new(n||t)(k(ar))};static \u0275cmp=at({type:t,selectors:[["app-expense"]],decls:99,vars:22,consts:[[1,"container"],[1,"header"],[1,"menu-icon"],[1,"title"],[3,"click"],[1,"clock-icon",3,"routerLink"],[1,"fas","fa-clock"],["appSwipe","",1,"scrollable-content",3,"swipeDown","swipeUp","swipeLeft","ngClass"],[1,"categories"],[1,"category",3,"click"],[1,"fas","fa-apple-alt"],[1,"fas","fa-utensils"],[1,"fas","fa-tshirt"],[1,"fas","fa-film"],[1,"fas","fa-dumbbell"],[1,"fas","fa-water"],[1,"fas","fa-home"],[1,"fas","fa-building"],[1,"fas","fa-bus"],[1,"fas","fa-pills"],[1,"fas","fa-plane"],[1,"fas","fa-cut"],[1,"fas","fa-coffee"],[1,"fas","fa-wine-bottle"],[1,"fas","fa-smoking"],[1,"fas","fa-newspaper"],[1,"fas","fa-random"],["class","number-board",4,"ngIf"],[1,"number-board"],[1,"number-board-header",3,"swipeleft","swiperight"],["type","text","name","input","placeholder","\u0412\u0412\u0415\u0414\u0418\u0422\u0415 \u0420\u0410\u0421\u0425\u041E\u0414",3,"ngModelChange","ngModel"],[1,"number-board-body",3,"swipedown"],[1,"number",3,"click"],[1,"fas","fa-backspace"]],template:function(n,i){n&1&&(v(0,"div",0)(1,"div",1),S(2,"div",2),v(3,"div",3)(4,"span"),E(5),C(),v(6,"span"),E(7,"\u20AC"),C()(),v(8,"div",3),E(9,"-"),C(),v(10,"div",3)(11,"div"),E(12),C(),v(13,"span"),E(14),C(),v(15,"span"),E(16,"\u20AC"),C()(),v(17,"div",3),E(18,"-"),C(),v(19,"div",3)(20,"div",4),x("click",function(){return i.onBalanceDateChange()}),E(21),C(),v(22,"span",4),x("click",function(){return i.onBalanceChange()}),E(23),C(),v(24,"span",4),x("click",function(){return i.onBalanceChange()}),E(25,"\u20AC "),C()(),v(26,"div",5),S(27,"i",6),C()(),v(28,"div",7),x("swipeDown",function(){return i.onHideKeyboard()})("swipeUp",function(){return i.onShowKeyboard()})("swipeLeft",function(){return i.onSwipeLeft()}),v(29,"div",8)(30,"div",9),x("click",function(){return i.onCategoryClick("meal")}),S(31,"i",10),v(32,"span"),E(33,"\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u044B"),C()(),v(34,"div",9),x("click",function(){return i.onCategoryClick("canteen")}),S(35,"i",11),v(36,"span"),E(37,"\u0421\u0442\u043E\u043B\u043E\u0432\u0430\u044F"),C()(),v(38,"div",9),x("click",function(){return i.onCategoryClick("clothes")}),S(39,"i",12),v(40,"span"),E(41,"\u041E\u0434\u0435\u0436\u0434\u0430"),C()(),v(42,"div",9),x("click",function(){return i.onCategoryClick("entertainments")}),S(43,"i",13),v(44,"span"),E(45,"\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u0435"),C()(),v(46,"div",9),x("click",function(){return i.onCategoryClick("sport")}),S(47,"i",14),v(48,"span"),E(49,"\u0421\u043F\u043E\u0440\u0442"),C()(),v(50,"div",9),x("click",function(){return i.onCategoryClick("utility-bills")}),S(51,"i",15),v(52,"span"),E(53,"\u041A\u043E\u043C\u043C\u0443\u043D\u0430\u043B\u043A\u0430"),C()(),v(54,"div",9),x("click",function(){return i.onCategoryClick("home")}),S(55,"i",16),v(56,"span"),E(57,"\u0414\u043B\u044F \u0434\u043E\u043C\u0430"),C()(),v(58,"div",9),x("click",function(){return i.onCategoryClick("rental-payment")}),S(59,"i",17),v(60,"span"),E(61,"\u0410\u0440\u0435\u043D\u0434\u0430 \u0436\u0438\u043B\u044C\u044F"),C()(),v(62,"div",9),x("click",function(){return i.onCategoryClick("bus")}),S(63,"i",18),v(64,"span"),E(65,"\u041E\u0431\u0449. \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442"),C()(),v(66,"div",9),x("click",function(){return i.onCategoryClick("pharmacy")}),S(67,"i",19),v(68,"span"),E(69,"\u0410\u043F\u0442\u0435\u043A\u0430"),C()(),v(70,"div",9),x("click",function(){return i.onCategoryClick("travel")}),S(71,"i",20),v(72,"span"),E(73,"\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435"),C()(),v(74,"div",9),x("click",function(){return i.onCategoryClick("barbershop")}),S(75,"i",21),v(76,"span"),E(77,"\u041F\u0430\u0440\u0438\u043A\u043C\u0430\u0445\u0435\u0440\u0441\u043A\u0430\u044F"),C()(),v(78,"div",9),x("click",function(){return i.onCategoryClick("bar")}),S(79,"i",22),v(80,"span"),E(81,"\u0411\u0430\u0440(\u043A\u0430\u0444\u0435)"),C()(),v(82,"div",9),x("click",function(){return i.onCategoryClick("alcohol")}),S(83,"i",23),v(84,"span"),E(85,"\u0412\u044B\u043F\u0438\u0432\u043A\u0430"),C()(),v(86,"div",9),x("click",function(){return i.onCategoryClick("nicotine")}),S(87,"i",24),v(88,"span"),E(89,"\u0421\u0438\u0433\u0430\u0440\u0435\u0442\u044B"),C()(),v(90,"div",9),x("click",function(){return i.onCategoryClick("subscriptions")}),S(91,"i",25),v(92,"span"),E(93,"\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430"),C()(),v(94,"div",9),x("click",function(){return i.onCategoryClick("another")}),S(95,"i",26),v(96,"span"),E(97,"\u0420\u0430\u0437\u043D\u043E\u0435"),C()()()(),Wi(98,Qo,28,1,"div",27),C()),n&2&&(z(4),Me("color","#ff6f61"),z(),Ut(i.monthAmount),z(),Me("color","#ff6f61"),z(6),Dn("",i.currentDate," "),z(),Me("color","red"),z(),Ut(i.currentAmount),z(),Me("color","red"),z(6),Dn("\u0434\u043E ",i.balanceDate," "),z(),Me("color","green"),z(),Ut(i.balance),z(),Me("color","green"),z(2),Lt("routerLink","/history"),z(2),Lt("ngClass",Ki(20,Jo,!i.showKeyBoard)),z(70),Lt("ngIf",i.showKeyBoard))},dependencies:[er,tr,lr,Yt,wr,Rn,Kt],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100dvh;justify-content:space-between;-webkit-user-select:none;user-select:none;overflow:hidden}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#fff}.menu-icon[_ngcontent-%COMP%], .clock-icon[_ngcontent-%COMP%]{font-size:24px}.expense-info[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:24px;color:#ff6f61}.title[_ngcontent-%COMP%]{text-align:center;font-size:18px;margin:10px 0}.scrollable-content[_ngcontent-%COMP%]{display:flex}.scrollable-content[_ngcontent-%COMP%]   .scrollable-content-down[_ngcontent-%COMP%]{align-items:end}.categories[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-around;padding:10px}.category[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;width:70px;margin:10px;text-align:center;font-size:15px}.category[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:25px;margin-bottom:5px}.add-expense[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-size:36px;background-color:#ff6f61;color:#fff;width:60px;height:60px;border-radius:50%;align-self:center;margin:20px 0}.number-board[_ngcontent-%COMP%]{background-color:#f8d7da;overflow:hidden}.number-board-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:18px;padding:12px;position:relative;border:#fff 1px solid}.number-board-header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;text-align:center;border:none;background:none;font-size:18px;outline:none}.number-board-body[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden}.number[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background-color:#f8d7da;border:#fff 1px solid;font-size:24px;padding:15px;overflow:hidden}.number[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:24px}"]})};var ea=[{path:"history",loadChildren:()=>import("./chunk-GZSQZDTT.js").then(t=>t.HistoryModule)},{path:"",pathMatch:"full",component:Zt}],Jt=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=me({type:t});static \u0275inj=he({imports:[Sn.forRoot(ea),Sn]})};var Qt=class t{title="expenses";static \u0275fac=function(n){return new(n||t)};static \u0275cmp=at({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(n,i){n&1&&S(0,"router-outlet")},dependencies:[or]})};var Sr=()=>{},ai={},es={},ts=null,ns={mark:Sr,measure:Sr};try{typeof window<"u"&&(ai=window),typeof document<"u"&&(es=document),typeof MutationObserver<"u"&&(ts=MutationObserver),typeof performance<"u"&&(ns=performance)}catch{}var{userAgent:Vr=""}=ai.navigator||{},xe=ai,I=es,Or=ts,en=ns,Rc=!!xe.document,_e=!!I.documentElement&&!!I.head&&typeof I.addEventListener=="function"&&typeof I.createElement=="function",is=~Vr.indexOf("MSIE")||~Vr.indexOf("Trident/"),T="classic",rs="duotone",X="sharp",q="sharp-duotone",ta=[T,rs,X,q],na={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},Nr={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ia=["kit"],ra=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,sa=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,oa={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},aa={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},la={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},ca={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},ua={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},fa={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},ss={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},da=["solid","regular","light","thin","duotone","brands"],os=[1,2,3,4,5,6,7,8,9,10],ha=os.concat([11,12,13,14,15,16,17,18,19,20]),mt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},ma=[...Object.keys(ca),...da,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",mt.GROUP,mt.SWAP_OPACITY,mt.PRIMARY,mt.SECONDARY].concat(os.map(t=>"".concat(t,"x"))).concat(ha.map(t=>"w-".concat(t))),pa={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},ga={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},va={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},kr={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},ve="___FONT_AWESOME___",Yn=16,as="fa",ls="svg-inline--fa",Fe="data-fa-i2svg",$n="data-fa-pseudo-element",ya="data-fa-pseudo-element-pending",li="data-prefix",ci="data-icon",Fr="fontawesome-i2svg",_a="async",Ca=["HTML","HEAD","STYLE","SCRIPT"],cs=(()=>{try{return!0}catch{return!1}})(),us=[T,X,q];function Ct(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[T]}})}var fs=h({},ss);fs[T]=h(h(h({},ss[T]),Nr.kit),Nr["kit-duotone"]);var Ne=Ct(fs),Xn=h({},fa);Xn[T]=h(h(h({},Xn[T]),kr.kit),kr["kit-duotone"]);var yt=Ct(Xn),qn=h({},ua);qn[T]=h(h({},qn[T]),va.kit);var ke=Ct(qn),Kn=h({},la);Kn[T]=h(h({},Kn[T]),ga.kit);var ba=Ct(Kn),Ea=ra,ds="fa-layers-text",xa=sa,Aa=h({},na),Lc=Ct(Aa),wa=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Hn=mt,Ke=new Set;Object.keys(yt[T]).map(Ke.add.bind(Ke));Object.keys(yt[X]).map(Ke.add.bind(Ke));Object.keys(yt[q]).map(Ke.add.bind(Ke));var Da=[...ia,...ma],gt=xe.FontAwesomeConfig||{};function Ia(t){var e=I.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function Ta(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}I&&typeof I.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,i]=e,s=Ta(Ia(n));s!=null&&(gt[i]=s)});var hs={styleDefault:"solid",familyDefault:"classic",cssPrefix:as,replacementClass:ls,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};gt.familyPrefix&&(gt.cssPrefix=gt.familyPrefix);var Ze=h(h({},hs),gt);Ze.autoReplaceSvg||(Ze.observeMutations=!1);var y={};Object.keys(hs).forEach(t=>{Object.defineProperty(y,t,{enumerable:!0,set:function(e){Ze[t]=e,vt.forEach(n=>n(y))},get:function(){return Ze[t]}})});Object.defineProperty(y,"familyPrefix",{enumerable:!0,set:function(t){Ze.cssPrefix=t,vt.forEach(e=>e(y))},get:function(){return Ze.cssPrefix}});xe.FontAwesomeConfig=y;var vt=[];function Ma(t){return vt.push(t),()=>{vt.splice(vt.indexOf(t),1)}}var be=Yn,se={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Sa(t){if(!t||!_e)return;let e=I.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;let n=I.head.childNodes,i=null;for(let s=n.length-1;s>-1;s--){let l=n[s],u=(l.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(u)>-1&&(i=l)}return I.head.insertBefore(e,i),t}var Va="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function _t(){let t=12,e="";for(;t-- >0;)e+=Va[Math.random()*62|0];return e}function Je(t){let e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function ui(t){return t.classList?Je(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function ms(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Oa(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(ms(t[n]),'" '),"").trim()}function on(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function fi(t){return t.size!==se.size||t.x!==se.x||t.y!==se.y||t.rotate!==se.rotate||t.flipX||t.flipY}function Na(t){let{transform:e,containerWidth:n,iconWidth:i}=t,s={transform:"translate(".concat(n/2," 256)")},l="translate(".concat(e.x*32,", ").concat(e.y*32,") "),u="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),f="rotate(".concat(e.rotate," 0 0)"),m={transform:"".concat(l," ").concat(u," ").concat(f)},g={transform:"translate(".concat(i/2*-1," -256)")};return{outer:s,inner:m,path:g}}function ka(t){let{transform:e,width:n=Yn,height:i=Yn,startCentered:s=!1}=t,l="";return s&&is?l+="translate(".concat(e.x/be-n/2,"em, ").concat(e.y/be-i/2,"em) "):s?l+="translate(calc(-50% + ".concat(e.x/be,"em), calc(-50% + ").concat(e.y/be,"em)) "):l+="translate(".concat(e.x/be,"em, ").concat(e.y/be,"em) "),l+="scale(".concat(e.size/be*(e.flipX?-1:1),", ").concat(e.size/be*(e.flipY?-1:1),") "),l+="rotate(".concat(e.rotate,"deg) "),l}var Fa=`:root, :host {
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
}`;function ps(){let t=as,e=ls,n=y.cssPrefix,i=y.replacementClass,s=Fa;if(n!==t||i!==e){let l=new RegExp("\\.".concat(t,"\\-"),"g"),u=new RegExp("\\--".concat(t,"\\-"),"g"),f=new RegExp("\\.".concat(e),"g");s=s.replace(l,".".concat(n,"-")).replace(u,"--".concat(n,"-")).replace(f,".".concat(i))}return s}var Pr=!1;function zn(){y.autoAddCss&&!Pr&&(Sa(ps()),Pr=!0)}var Pa={mixout(){return{dom:{css:ps,insertCss:zn}}},hooks(){return{beforeDOMElementCreation(){zn()},beforeI2svg(){zn()}}}},ye=xe||{};ye[ve]||(ye[ve]={});ye[ve].styles||(ye[ve].styles={});ye[ve].hooks||(ye[ve].hooks={});ye[ve].shims||(ye[ve].shims=[]);var oe=ye[ve],gs=[],vs=function(){I.removeEventListener("DOMContentLoaded",vs),rn=1,gs.map(t=>t())},rn=!1;_e&&(rn=(I.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(I.readyState),rn||I.addEventListener("DOMContentLoaded",vs));function Ra(t){_e&&(rn?setTimeout(t,0):gs.push(t))}function bt(t){let{tag:e,attributes:n={},children:i=[]}=t;return typeof t=="string"?ms(t):"<".concat(e," ").concat(Oa(n),">").concat(i.map(bt).join(""),"</").concat(e,">")}function Rr(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var La=function(e,n){return function(i,s,l,u){return e.call(n,i,s,l,u)}},Gn=function(e,n,i,s){var l=Object.keys(e),u=l.length,f=s!==void 0?La(n,s):n,m,g,_;for(i===void 0?(m=1,_=e[l[0]]):(m=0,_=i);m<u;m++)g=l[m],_=f(_,e[g],g,e);return _};function Ua(t){let e=[],n=0,i=t.length;for(;n<i;){let s=t.charCodeAt(n++);if(s>=55296&&s<=56319&&n<i){let l=t.charCodeAt(n++);(l&64512)==56320?e.push(((s&1023)<<10)+(l&1023)+65536):(e.push(s),n--)}else e.push(s)}return e}function Zn(t){let e=Ua(t);return e.length===1?e[0].toString(16):null}function ja(t,e){let n=t.length,i=t.charCodeAt(e),s;return i>=55296&&i<=56319&&n>e+1&&(s=t.charCodeAt(e+1),s>=56320&&s<=57343)?(i-55296)*1024+s-56320+65536:i}function Lr(t){return Object.keys(t).reduce((e,n)=>{let i=t[n];return!!i.icon?e[i.iconName]=i.icon:e[n]=i,e},{})}function Jn(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:i=!1}=n,s=Lr(e);typeof oe.hooks.addPack=="function"&&!i?oe.hooks.addPack(t,Lr(e)):oe.styles[t]=h(h({},oe.styles[t]||{}),s),t==="fas"&&Jn("fa",e)}var{styles:Oe,shims:Ha}=oe,za={[T]:Object.values(ke[T]),[X]:Object.values(ke[X]),[q]:Object.values(ke[q])},di=null,ys={},_s={},Cs={},bs={},Es={},Ga={[T]:Object.keys(Ne[T]),[X]:Object.keys(Ne[X]),[q]:Object.keys(Ne[q])};function Ba(t){return~Da.indexOf(t)}function Wa(t,e){let n=e.split("-"),i=n[0],s=n.slice(1).join("-");return i===t&&s!==""&&!Ba(s)?s:null}var xs=()=>{let t=i=>Gn(Oe,(s,l,u)=>(s[u]=Gn(l,i,{}),s),{});ys=t((i,s,l)=>(s[3]&&(i[s[3]]=l),s[2]&&s[2].filter(f=>typeof f=="number").forEach(f=>{i[f.toString(16)]=l}),i)),_s=t((i,s,l)=>(i[l]=l,s[2]&&s[2].filter(f=>typeof f=="string").forEach(f=>{i[f]=l}),i)),Es=t((i,s,l)=>{let u=s[2];return i[l]=l,u.forEach(f=>{i[f]=l}),i});let e="far"in Oe||y.autoFetchSvg,n=Gn(Ha,(i,s)=>{let l=s[0],u=s[1],f=s[2];return u==="far"&&!e&&(u="fas"),typeof l=="string"&&(i.names[l]={prefix:u,iconName:f}),typeof l=="number"&&(i.unicodes[l.toString(16)]={prefix:u,iconName:f}),i},{names:{},unicodes:{}});Cs=n.names,bs=n.unicodes,di=an(y.styleDefault,{family:y.familyDefault})};Ma(t=>{di=an(t.styleDefault,{family:y.familyDefault})});xs();function hi(t,e){return(ys[t]||{})[e]}function Ya(t,e){return(_s[t]||{})[e]}function Ee(t,e){return(Es[t]||{})[e]}function As(t){return Cs[t]||{prefix:null,iconName:null}}function $a(t){let e=bs[t],n=hi("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function Ae(){return di}var mi=()=>({prefix:null,iconName:null,rest:[]});function an(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:n=T}=e,i=Ne[n][t],s=yt[n][t]||yt[n][i],l=t in oe.styles?t:null;return s||l||null}var Xa={[T]:Object.keys(ke[T]),[X]:Object.keys(ke[X]),[q]:Object.keys(ke[q])};function ln(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:n=!1}=e,i={[T]:"".concat(y.cssPrefix,"-").concat(T),[X]:"".concat(y.cssPrefix,"-").concat(X),[q]:"".concat(y.cssPrefix,"-").concat(q)},s=null,l=T,u=ta.filter(m=>m!==rs);u.forEach(m=>{(t.includes(i[m])||t.some(g=>Xa[m].includes(g)))&&(l=m)});let f=t.reduce((m,g)=>{let _=Wa(y.cssPrefix,g);if(Oe[g]?(g=za[l].includes(g)?ba[l][g]:g,s=g,m.prefix=g):Ga[l].indexOf(g)>-1?(s=g,m.prefix=an(g,{family:l})):_?m.iconName=_:g!==y.replacementClass&&!u.some(w=>g===i[w])&&m.rest.push(g),!n&&m.prefix&&m.iconName){let w=s==="fa"?As(m.iconName):{},b=Ee(m.prefix,m.iconName);w.prefix&&(s=null),m.iconName=w.iconName||b||m.iconName,m.prefix=w.prefix||m.prefix,m.prefix==="far"&&!Oe.far&&Oe.fas&&!y.autoFetchSvg&&(m.prefix="fas")}return m},mi());return(t.includes("fa-brands")||t.includes("fab"))&&(f.prefix="fab"),(t.includes("fa-duotone")||t.includes("fad"))&&(f.prefix="fad"),!f.prefix&&l===X&&(Oe.fass||y.autoFetchSvg)&&(f.prefix="fass",f.iconName=Ee(f.prefix,f.iconName)||f.iconName),!f.prefix&&l===q&&(Oe.fasds||y.autoFetchSvg)&&(f.prefix="fasds",f.iconName=Ee(f.prefix,f.iconName)||f.iconName),(f.prefix==="fa"||s==="fa")&&(f.prefix=Ae()||"fas"),f}var Qn=class{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];let s=n.reduce(this._pullDefinitions,{});Object.keys(s).forEach(l=>{this.definitions[l]=h(h({},this.definitions[l]||{}),s[l]),Jn(l,s[l]);let u=ke[T][l];u&&Jn(u,s[l]),xs()})}reset(){this.definitions={}}_pullDefinitions(e,n){let i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(s=>{let{prefix:l,iconName:u,icon:f}=i[s],m=f[2];e[l]||(e[l]={}),m.length>0&&m.forEach(g=>{typeof g=="string"&&(e[l][g]=f)}),e[l][u]=f}),e}},Ur=[],Xe={},qe={},qa=Object.keys(qe);function Ka(t,e){let{mixoutsTo:n}=e;return Ur=t,Xe={},Object.keys(qe).forEach(i=>{qa.indexOf(i)===-1&&delete qe[i]}),Ur.forEach(i=>{let s=i.mixout?i.mixout():{};if(Object.keys(s).forEach(l=>{typeof s[l]=="function"&&(n[l]=s[l]),typeof s[l]=="object"&&Object.keys(s[l]).forEach(u=>{n[l]||(n[l]={}),n[l][u]=s[l][u]})}),i.hooks){let l=i.hooks();Object.keys(l).forEach(u=>{Xe[u]||(Xe[u]=[]),Xe[u].push(l[u])})}i.provides&&i.provides(qe)}),n}function ei(t,e){for(var n=arguments.length,i=new Array(n>2?n-2:0),s=2;s<n;s++)i[s-2]=arguments[s];return(Xe[t]||[]).forEach(u=>{e=u.apply(null,[e,...i])}),e}function Pe(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];(Xe[t]||[]).forEach(l=>{l.apply(null,n)})}function we(){let t=arguments[0],e=Array.prototype.slice.call(arguments,1);return qe[t]?qe[t].apply(null,e):void 0}function ti(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t,n=t.prefix||Ae();if(e)return e=Ee(n,e)||e,Rr(ws.definitions,n,e)||Rr(oe.styles,n,e)}var ws=new Qn,Za=()=>{y.autoReplaceSvg=!1,y.observeMutations=!1,Pe("noAuto")},Ja={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return _e?(Pe("beforeI2svg",t),we("pseudoElements2svg",t),we("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e}=t;y.autoReplaceSvg===!1&&(y.autoReplaceSvg=!0),y.observeMutations=!0,Ra(()=>{el({autoReplaceSvgRoot:e}),Pe("watch",t)})}},Qa={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:Ee(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){let e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=an(t[0]);return{prefix:n,iconName:Ee(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(y.cssPrefix,"-"))>-1||t.match(Ea))){let e=ln(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||Ae(),iconName:Ee(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){let e=Ae();return{prefix:e,iconName:Ee(e,t)||t}}}},K={noAuto:Za,config:y,dom:Ja,parse:Qa,library:ws,findIconDefinition:ti,toHtml:bt},el=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:e=I}=t;(Object.keys(oe.styles).length>0||y.autoFetchSvg)&&_e&&y.autoReplaceSvg&&K.dom.i2svg({node:e})};function cn(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>bt(n))}}),Object.defineProperty(t,"node",{get:function(){if(!_e)return;let n=I.createElement("div");return n.innerHTML=t.html,n.children}}),t}function tl(t){let{children:e,main:n,mask:i,attributes:s,styles:l,transform:u}=t;if(fi(u)&&n.found&&!i.found){let{width:f,height:m}=n,g={x:f/m/2,y:.5};s.style=on(D(h({},l),{"transform-origin":"".concat(g.x+u.x/16,"em ").concat(g.y+u.y/16,"em")}))}return[{tag:"svg",attributes:s,children:e}]}function nl(t){let{prefix:e,iconName:n,children:i,attributes:s,symbol:l}=t,u=l===!0?"".concat(e,"-").concat(y.cssPrefix,"-").concat(n):l;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:D(h({},s),{id:u}),children:i}]}]}function pi(t){let{icons:{main:e,mask:n},prefix:i,iconName:s,transform:l,symbol:u,title:f,maskId:m,titleId:g,extra:_,watchable:w=!1}=t,{width:b,height:P}=n.found?n:e,O=i==="fak",te=[y.replacementClass,s?"".concat(y.cssPrefix,"-").concat(s):""].filter(Q=>_.classes.indexOf(Q)===-1).filter(Q=>Q!==""||!!Q).concat(_.classes).join(" "),$={children:[],attributes:D(h({},_.attributes),{"data-prefix":i,"data-icon":s,class:te,role:_.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(b," ").concat(P)})},M=O&&!~_.classes.indexOf("fa-fw")?{width:"".concat(b/P*16*.0625,"em")}:{};w&&($.attributes[Fe]=""),f&&($.children.push({tag:"title",attributes:{id:$.attributes["aria-labelledby"]||"title-".concat(g||_t())},children:[f]}),delete $.attributes.title);let R=D(h({},$),{prefix:i,iconName:s,main:e,mask:n,maskId:m,transform:l,symbol:u,styles:h(h({},M),_.styles)}),{children:G,attributes:le}=n.found&&e.found?we("generateAbstractMask",R)||{children:[],attributes:{}}:we("generateAbstractIcon",R)||{children:[],attributes:{}};return R.children=G,R.attributes=le,u?nl(R):tl(R)}function jr(t){let{content:e,width:n,height:i,transform:s,title:l,extra:u,watchable:f=!1}=t,m=D(h(h({},u.attributes),l?{title:l}:{}),{class:u.classes.join(" ")});f&&(m[Fe]="");let g=h({},u.styles);fi(s)&&(g.transform=ka({transform:s,startCentered:!0,width:n,height:i}),g["-webkit-transform"]=g.transform);let _=on(g);_.length>0&&(m.style=_);let w=[];return w.push({tag:"span",attributes:m,children:[e]}),l&&w.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),w}function il(t){let{content:e,title:n,extra:i}=t,s=D(h(h({},i.attributes),n?{title:n}:{}),{class:i.classes.join(" ")}),l=on(i.styles);l.length>0&&(s.style=l);let u=[];return u.push({tag:"span",attributes:s,children:[e]}),n&&u.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),u}var{styles:Bn}=oe;function ni(t){let e=t[0],n=t[1],[i]=t.slice(4),s=null;return Array.isArray(i)?s={tag:"g",attributes:{class:"".concat(y.cssPrefix,"-").concat(Hn.GROUP)},children:[{tag:"path",attributes:{class:"".concat(y.cssPrefix,"-").concat(Hn.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(y.cssPrefix,"-").concat(Hn.PRIMARY),fill:"currentColor",d:i[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:e,height:n,icon:s}}var rl={found:!1,width:512,height:512};function sl(t,e){!cs&&!y.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function ii(t,e){let n=e;return e==="fa"&&y.styleDefault!==null&&(e=Ae()),new Promise((i,s)=>{if(n==="fa"){let l=As(t)||{};t=l.iconName||t,e=l.prefix||e}if(t&&e&&Bn[e]&&Bn[e][t]){let l=Bn[e][t];return i(ni(l))}sl(t,e),i(D(h({},rl),{icon:y.showMissingIcons&&t?we("missingIconAbstract")||{}:{}}))})}var Hr=()=>{},ri=y.measurePerformance&&en&&en.mark&&en.measure?en:{mark:Hr,measure:Hr},pt='FA "6.6.0"',ol=t=>(ri.mark("".concat(pt," ").concat(t," begins")),()=>Ds(t)),Ds=t=>{ri.mark("".concat(pt," ").concat(t," ends")),ri.measure("".concat(pt," ").concat(t),"".concat(pt," ").concat(t," begins"),"".concat(pt," ").concat(t," ends"))},gi={begin:ol,end:Ds},tn=()=>{};function zr(t){return typeof(t.getAttribute?t.getAttribute(Fe):null)=="string"}function al(t){let e=t.getAttribute?t.getAttribute(li):null,n=t.getAttribute?t.getAttribute(ci):null;return e&&n}function ll(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(y.replacementClass)}function cl(){return y.autoReplaceSvg===!0?nn.replace:nn[y.autoReplaceSvg]||nn.replace}function ul(t){return I.createElementNS("http://www.w3.org/2000/svg",t)}function fl(t){return I.createElement(t)}function Is(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:n=t.tag==="svg"?ul:fl}=e;if(typeof t=="string")return I.createTextNode(t);let i=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(l){i.setAttribute(l,t.attributes[l])}),(t.children||[]).forEach(function(l){i.appendChild(Is(l,{ceFn:n}))}),i}function dl(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var nn={replace:function(t){let e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(Is(n),e)}),e.getAttribute(Fe)===null&&y.keepOriginalSource){let n=I.createComment(dl(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){let e=t[0],n=t[1];if(~ui(e).indexOf(y.replacementClass))return nn.replace(t);let i=new RegExp("".concat(y.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){let l=n[0].attributes.class.split(" ").reduce((u,f)=>(f===y.replacementClass||f.match(i)?u.toSvg.push(f):u.toNode.push(f),u),{toNode:[],toSvg:[]});n[0].attributes.class=l.toSvg.join(" "),l.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",l.toNode.join(" "))}let s=n.map(l=>bt(l)).join(`
`);e.setAttribute(Fe,""),e.innerHTML=s}};function Gr(t){t()}function Ts(t,e){let n=typeof e=="function"?e:tn;if(t.length===0)n();else{let i=Gr;y.mutateApproach===_a&&(i=xe.requestAnimationFrame||Gr),i(()=>{let s=cl(),l=gi.begin("mutate");t.map(s),l(),n()})}}var vi=!1;function Ms(){vi=!0}function si(){vi=!1}var sn=null;function Br(t){if(!Or||!y.observeMutations)return;let{treeCallback:e=tn,nodeCallback:n=tn,pseudoElementsCallback:i=tn,observeMutationsRoot:s=I}=t;sn=new Or(l=>{if(vi)return;let u=Ae();Je(l).forEach(f=>{if(f.type==="childList"&&f.addedNodes.length>0&&!zr(f.addedNodes[0])&&(y.searchPseudoElements&&i(f.target),e(f.target)),f.type==="attributes"&&f.target.parentNode&&y.searchPseudoElements&&i(f.target.parentNode),f.type==="attributes"&&zr(f.target)&&~wa.indexOf(f.attributeName))if(f.attributeName==="class"&&al(f.target)){let{prefix:m,iconName:g}=ln(ui(f.target));f.target.setAttribute(li,m||u),g&&f.target.setAttribute(ci,g)}else ll(f.target)&&n(f.target)})}),_e&&sn.observe(s,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function hl(){sn&&sn.disconnect()}function ml(t){let e=t.getAttribute("style"),n=[];return e&&(n=e.split(";").reduce((i,s)=>{let l=s.split(":"),u=l[0],f=l.slice(1);return u&&f.length>0&&(i[u]=f.join(":").trim()),i},{})),n}function pl(t){let e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),i=t.innerText!==void 0?t.innerText.trim():"",s=ln(ui(t));return s.prefix||(s.prefix=Ae()),e&&n&&(s.prefix=e,s.iconName=n),s.iconName&&s.prefix||(s.prefix&&i.length>0&&(s.iconName=Ya(s.prefix,t.innerText)||hi(s.prefix,Zn(t.innerText))),!s.iconName&&y.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=t.firstChild.data)),s}function gl(t){let e=Je(t.attributes).reduce((s,l)=>(s.name!=="class"&&s.name!=="style"&&(s[l.name]=l.value),s),{}),n=t.getAttribute("title"),i=t.getAttribute("data-fa-title-id");return y.autoA11y&&(n?e["aria-labelledby"]="".concat(y.replacementClass,"-title-").concat(i||_t()):(e["aria-hidden"]="true",e.focusable="false")),e}function vl(){return{iconName:null,title:null,titleId:null,prefix:null,transform:se,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Wr(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:n,prefix:i,rest:s}=pl(t),l=gl(t),u=ei("parseNodeAttributes",{},t),f=e.styleParser?ml(t):[];return h({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:i,transform:se,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:f,attributes:l}},u)}var{styles:yl}=oe;function Ss(t){let e=y.autoReplaceSvg==="nest"?Wr(t,{styleParser:!1}):Wr(t);return~e.extra.classes.indexOf(ds)?we("generateLayersText",t,e):we("generateSvgReplacementMutation",t,e)}var ae=new Set;us.map(t=>{ae.add("fa-".concat(t))});Object.keys(Ne[T]).map(ae.add.bind(ae));Object.keys(Ne[X]).map(ae.add.bind(ae));Object.keys(Ne[q]).map(ae.add.bind(ae));ae=[...ae];function Yr(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!_e)return Promise.resolve();let n=I.documentElement.classList,i=_=>n.add("".concat(Fr,"-").concat(_)),s=_=>n.remove("".concat(Fr,"-").concat(_)),l=y.autoFetchSvg?ae:us.map(_=>"fa-".concat(_)).concat(Object.keys(yl));l.includes("fa")||l.push("fa");let u=[".".concat(ds,":not([").concat(Fe,"])")].concat(l.map(_=>".".concat(_,":not([").concat(Fe,"])"))).join(", ");if(u.length===0)return Promise.resolve();let f=[];try{f=Je(t.querySelectorAll(u))}catch{}if(f.length>0)i("pending"),s("complete");else return Promise.resolve();let m=gi.begin("onTree"),g=f.reduce((_,w)=>{try{let b=Ss(w);b&&_.push(b)}catch(b){cs||b.name==="MissingIcon"&&console.error(b)}return _},[]);return new Promise((_,w)=>{Promise.all(g).then(b=>{Ts(b,()=>{i("active"),i("complete"),s("pending"),typeof e=="function"&&e(),m(),_()})}).catch(b=>{m(),w(b)})})}function _l(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Ss(t).then(n=>{n&&Ts([n],e)})}function Cl(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=(e||{}).icon?e:ti(e||{}),{mask:s}=n;return s&&(s=(s||{}).icon?s:ti(s||{})),t(i,D(h({},n),{mask:s}))}}var bl=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=se,symbol:i=!1,mask:s=null,maskId:l=null,title:u=null,titleId:f=null,classes:m=[],attributes:g={},styles:_={}}=e;if(!t)return;let{prefix:w,iconName:b,icon:P}=t;return cn(h({type:"icon"},t),()=>(Pe("beforeDOMElementCreation",{iconDefinition:t,params:e}),y.autoA11y&&(u?g["aria-labelledby"]="".concat(y.replacementClass,"-title-").concat(f||_t()):(g["aria-hidden"]="true",g.focusable="false")),pi({icons:{main:ni(P),mask:s?ni(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:w,iconName:b,transform:h(h({},se),n),symbol:i,title:u,maskId:l,titleId:f,extra:{attributes:g,styles:_,classes:m}})))},El={mixout(){return{icon:Cl(bl)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Yr,t.nodeCallback=_l,t}}},provides(t){t.i2svg=function(e){let{node:n=I,callback:i=()=>{}}=e;return Yr(n,i)},t.generateSvgReplacementMutation=function(e,n){let{iconName:i,title:s,titleId:l,prefix:u,transform:f,symbol:m,mask:g,maskId:_,extra:w}=n;return new Promise((b,P)=>{Promise.all([ii(i,u),g.iconName?ii(g.iconName,g.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(O=>{let[te,$]=O;b([e,pi({icons:{main:te,mask:$},prefix:u,iconName:i,transform:f,symbol:m,maskId:_,title:s,titleId:l,extra:w,watchable:!0})])}).catch(P)})},t.generateAbstractIcon=function(e){let{children:n,attributes:i,main:s,transform:l,styles:u}=e,f=on(u);f.length>0&&(i.style=f);let m;return fi(l)&&(m=we("generateAbstractTransformGrouping",{main:s,transform:l,containerWidth:s.width,iconWidth:s.width})),n.push(m||s.icon),{children:n,attributes:i}}}},xl={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:n=[]}=e;return cn({type:"layer"},()=>{Pe("beforeDOMElementCreation",{assembler:t,params:e});let i=[];return t(s=>{Array.isArray(s)?s.map(l=>{i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(y.cssPrefix,"-layers"),...n].join(" ")},children:i}]})}}}},Al={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:n=null,classes:i=[],attributes:s={},styles:l={}}=e;return cn({type:"counter",content:t},()=>(Pe("beforeDOMElementCreation",{content:t,params:e}),il({content:t.toString(),title:n,extra:{attributes:s,styles:l,classes:["".concat(y.cssPrefix,"-layers-counter"),...i]}})))}}}},wl={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:n=se,title:i=null,classes:s=[],attributes:l={},styles:u={}}=e;return cn({type:"text",content:t},()=>(Pe("beforeDOMElementCreation",{content:t,params:e}),jr({content:t,transform:h(h({},se),n),title:i,extra:{attributes:l,styles:u,classes:["".concat(y.cssPrefix,"-layers-text"),...s]}})))}}},provides(t){t.generateLayersText=function(e,n){let{title:i,transform:s,extra:l}=n,u=null,f=null;if(is){let m=parseInt(getComputedStyle(e).fontSize,10),g=e.getBoundingClientRect();u=g.width/m,f=g.height/m}return y.autoA11y&&!i&&(l.attributes["aria-hidden"]="true"),Promise.resolve([e,jr({content:e.innerHTML,width:u,height:f,transform:s,title:i,extra:l,watchable:!0})])}}},Dl=new RegExp('"',"ug"),$r=[1105920,1112319],Xr=h(h(h({FontAwesome:{normal:"fas",400:"fas"}},aa),oa),pa),oi=Object.keys(Xr).reduce((t,e)=>(t[e.toLowerCase()]=Xr[e],t),{}),Il=Object.keys(oi).reduce((t,e)=>{let n=oi[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Tl(t){let e=t.replace(Dl,""),n=ja(e,0),i=n>=$r[0]&&n<=$r[1],s=e.length===2?e[0]===e[1]:!1;return{value:Zn(s?e[0]:e),isSecondary:i||s}}function Ml(t,e){let n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),i=parseInt(e),s=isNaN(i)?"normal":i;return(oi[n]||{})[s]||Il[n]}function qr(t,e){let n="".concat(ya).concat(e.replace(":","-"));return new Promise((i,s)=>{if(t.getAttribute(n)!==null)return i();let u=Je(t.children).filter(b=>b.getAttribute($n)===e)[0],f=xe.getComputedStyle(t,e),m=f.getPropertyValue("font-family"),g=m.match(xa),_=f.getPropertyValue("font-weight"),w=f.getPropertyValue("content");if(u&&!g)return t.removeChild(u),i();if(g&&w!=="none"&&w!==""){let b=f.getPropertyValue("content"),P=Ml(m,_),{value:O,isSecondary:te}=Tl(b),$=g[0].startsWith("FontAwesome"),M=hi(P,O),R=M;if($){let G=$a(O);G.iconName&&G.prefix&&(M=G.iconName,P=G.prefix)}if(M&&!te&&(!u||u.getAttribute(li)!==P||u.getAttribute(ci)!==R)){t.setAttribute(n,R),u&&t.removeChild(u);let G=vl(),{extra:le}=G;le.attributes[$n]=e,ii(M,P).then(Q=>{let Re=pi(D(h({},G),{icons:{main:Q,mask:mi()},prefix:P,iconName:R,extra:le,watchable:!0})),Le=I.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(Le,t.firstChild):t.appendChild(Le),Le.outerHTML=Re.map(ce=>bt(ce)).join(`
`),t.removeAttribute(n),i()}).catch(s)}else i()}else i()})}function Sl(t){return Promise.all([qr(t,"::before"),qr(t,"::after")])}function Vl(t){return t.parentNode!==document.head&&!~Ca.indexOf(t.tagName.toUpperCase())&&!t.getAttribute($n)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Kr(t){if(_e)return new Promise((e,n)=>{let i=Je(t.querySelectorAll("*")).filter(Vl).map(Sl),s=gi.begin("searchPseudoElements");Ms(),Promise.all(i).then(()=>{s(),si(),e()}).catch(()=>{s(),si(),n()})})}var Ol={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Kr,t}}},provides(t){t.pseudoElements2svg=function(e){let{node:n=I}=e;y.searchPseudoElements&&Kr(n)}}},Zr=!1,Nl={mixout(){return{dom:{unwatch(){Ms(),Zr=!0}}}},hooks(){return{bootstrap(){Br(ei("mutationObserverCallbacks",{}))},noAuto(){hl()},watch(t){let{observeMutationsRoot:e}=t;Zr?si():Br(ei("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},Jr=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,i)=>{let s=i.toLowerCase().split("-"),l=s[0],u=s.slice(1).join("-");if(l&&u==="h")return n.flipX=!0,n;if(l&&u==="v")return n.flipY=!0,n;if(u=parseFloat(u),isNaN(u))return n;switch(l){case"grow":n.size=n.size+u;break;case"shrink":n.size=n.size-u;break;case"left":n.x=n.x-u;break;case"right":n.x=n.x+u;break;case"up":n.y=n.y-u;break;case"down":n.y=n.y+u;break;case"rotate":n.rotate=n.rotate+u;break}return n},e)},kl={mixout(){return{parse:{transform:t=>Jr(t)}}},hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-transform");return n&&(t.transform=Jr(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:i,containerWidth:s,iconWidth:l}=e,u={transform:"translate(".concat(s/2," 256)")},f="translate(".concat(i.x*32,", ").concat(i.y*32,") "),m="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),g="rotate(".concat(i.rotate," 0 0)"),_={transform:"".concat(f," ").concat(m," ").concat(g)},w={transform:"translate(".concat(l/2*-1," -256)")},b={outer:u,inner:_,path:w};return{tag:"g",attributes:h({},b.outer),children:[{tag:"g",attributes:h({},b.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:h(h({},n.icon.attributes),b.path)}]}]}}}},Wn={x:0,y:0,width:"100%",height:"100%"};function Qr(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Fl(t){return t.tag==="g"?t.children:[t]}var Pl={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-mask"),i=n?ln(n.split(" ").map(s=>s.trim())):mi();return i.prefix||(i.prefix=Ae()),t.mask=i,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:i,main:s,mask:l,maskId:u,transform:f}=e,{width:m,icon:g}=s,{width:_,icon:w}=l,b=Na({transform:f,containerWidth:_,iconWidth:m}),P={tag:"rect",attributes:D(h({},Wn),{fill:"white"})},O=g.children?{children:g.children.map(Qr)}:{},te={tag:"g",attributes:h({},b.inner),children:[Qr(h({tag:g.tag,attributes:h(h({},g.attributes),b.path)},O))]},$={tag:"g",attributes:h({},b.outer),children:[te]},M="mask-".concat(u||_t()),R="clip-".concat(u||_t()),G={tag:"mask",attributes:D(h({},Wn),{id:M,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[P,$]},le={tag:"defs",children:[{tag:"clipPath",attributes:{id:R},children:Fl(w)},G]};return n.push(le,{tag:"rect",attributes:h({fill:"currentColor","clip-path":"url(#".concat(R,")"),mask:"url(#".concat(M,")")},Wn)}),{children:n,attributes:i}}}},Rl={provides(t){let e=!1;xe.matchMedia&&(e=xe.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){let n=[],i={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:D(h({},i),{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let l=D(h({},s),{attributeName:"opacity"}),u={tag:"circle",attributes:D(h({},i),{cx:"256",cy:"364",r:"28"}),children:[]};return e||u.children.push({tag:"animate",attributes:D(h({},s),{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:D(h({},l),{values:"1;0;1;1;0;1;"})}),n.push(u),n.push({tag:"path",attributes:D(h({},i),{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:D(h({},l),{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:D(h({},i),{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:D(h({},l),{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Ll={hooks(){return{parseNodeAttributes(t,e){let n=e.getAttribute("data-fa-symbol"),i=n===null?!1:n===""?!0:n;return t.symbol=i,t}}}},Ul=[Pa,El,xl,Al,wl,Ol,Nl,kl,Pl,Rl,Ll];Ka(Ul,{mixoutsTo:K});var Uc=K.noAuto,jl=K.config,jc=K.library,Hl=K.dom,zl=K.parse,Hc=K.findIconDefinition,zc=K.toHtml,Gl=K.icon,Gc=K.layer,Bl=K.text,Wl=K.counter;var Vs=(()=>{let e=class e{};e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=me({type:e}),e.\u0275inj=he({});let t=e;return t})();var un=class t extends Mn{override={swipe:{direction:Hammer.DIRECTION_HORIZONTAL,threshold:10,velocity:.3}};static \u0275fac=(()=>{let e;return function(i){return(e||(e=lt(t)))(i||t)}})();static \u0275prov=Ft({token:t,factory:t.\u0275fac})};var fn=class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=me({type:t,bootstrap:[Qt]});static \u0275inj=he({providers:[{provide:rr,useClass:un}],imports:[ir,Jt,Vs,Tr,sr]})};nr().bootstrapModule(fn,{ngZoneEventCoalescing:!0}).catch(t=>console.error(t));
