import{$ as k,A as D,B as y,C as a,E as c,F as s,G as p,H as T,I as g,J as x,K as r,L as Y,M as m,S as E,T as w,a as C,aa as B,b as H,ba as P,ca as R,ja as N,k as h,ka as V,la as d,m as I,n as f,q as S,r as v,v as n,w as M}from"./chunk-C4AJC3S4.js";function X(i,e){if(i&1&&(c(0,"span"),r(1),E(2,"date"),s()),i&2){let t=x().$implicit;a("background","#f8d7da")("width","100%")("display","block"),n(),Y(w(2,7,t.date,"dd-MM-YYYY"))}}function L(i,e){if(i&1){let t=T();c(0,"span"),D(1,X,3,10,"span",3),p(2,"br"),r(3),p(4,"br"),r(5),p(6,"br"),r(7),E(8,"date"),p(9,"br")(10,"br"),c(11,"span",4),g("click",function(){let u=S(t).index,l=x();return v(l.onDelete(u))}),r(12,"Delete"),s(),c(13,"span",4),g("click",function(){let u=S(t).index,l=x();return v(l.onDeleteFromBalance(u))}),r(14," Delete from balance"),s(),p(15,"hr"),s()}if(i&2){let t=e.$implicit;n(),y("ngIf",t.showDateTitle),n(2),m(" Amount: ",t.amount,"\u20AC "),n(2),m(" Category: ",t.category," "),n(2),m(" Date: ",w(8,16,t.date,"dd-MM-YYYY HH:mm")," "),n(4),a("color","orange")("cursor","pointer"),n(2),a("color","green")("cursor","pointer"),n(2),a("background","#f8d7da")("height","2px")}}var b=class i{constructor(e){this.router=e}expenses=[];totalAmount=0;temporaryDate=0;ngOnInit(){this.expenses=JSON.parse(localStorage.getItem("expenses")||"[]").map(e=>H(C({},e),{showDateTitle:this.isDatePanelVisible(e.date)})),this.sumValues()}onDelete(e){confirm("Delete?")&&(this.updateBalance(e),this.expenses.splice(e,1),localStorage.setItem("expenses",JSON.stringify(this.expenses)),this.sumValues())}updateBalance(e){let t=Number(localStorage.getItem("balance"))||0;if(t){let o=Math.round((t+this.expenses[e].amount)*100)/100;localStorage.setItem("balance",o.toString())}}onDeleteFromBalance(e){confirm("Return to balance?")&&this.updateBalance(e)}onSwipeRight(){this.router.navigate(["/"])}isDatePanelVisible(e){return this.temporaryDate===0?(this.temporaryDate=e,!0):new Date(this.temporaryDate).toDateString()===new Date(e).toDateString()?!1:(this.temporaryDate=e,!0)}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(e){this.touchStartX=e.changedTouches[0].screenX,this.touchStartY=e.changedTouches[0].screenY}onTouchEnd(e){this.touchEndX=e.changedTouches[0].screenX,this.touchEndY=e.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let e=this.touchEndX-this.touchStartX,t=this.touchEndY-this.touchStartY;Math.abs(e)>Math.abs(t)&&(e>50?this.onSwipeRight():e<-50&&this.onSwipeLeft())}onSwipeLeft(){console.log("Swiped left")}sumValues(){this.totalAmount=this.expenses.reduce((e,t)=>{let o=e+t.amount;return Math.round(o*100)/100},0)}static \u0275fac=function(t){return new(t||i)(M(N))};static \u0275cmp=I({type:i,selectors:[["app-history"]],hostBindings:function(t,o){t&1&&g("touchstart",function(l){return o.onTouchStart(l)})("touchend",function(l){return o.onTouchEnd(l)})},decls:11,vars:15,consts:[[1,"history-container"],[3,"routerLink"],[4,"ngFor","ngForOf"],[3,"background","width","display",4,"ngIf"],[3,"click"]],template:function(t,o){t&1&&(c(0,"div",0)(1,"span",1),r(2,"< Back"),s(),p(3,"br"),c(4,"div")(5,"span"),r(6,"\u041E\u0431\u0449\u0438\u0439 \u0440\u0430\u0441\u0445\u043E\u0434: "),s(),c(7,"span"),r(8),s()(),p(9,"hr"),D(10,L,16,19,"span",2),s()),t&2&&(n(),a("color","blue")("cursor","pointer"),y("routerLink","/"),n(3),a("margin","10","px"),n(3),a("color","red"),n(),m("",o.totalAmount," $"),n(),a("background","#f8d7da")("height","2px"),n(),y("ngForOf",o.expenses))},dependencies:[V,k,B,P],styles:[".history-container[_ngcontent-%COMP%]{overflow-y:scroll}"]})};var j=[{path:"",component:b}],_=class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=f({type:i});static \u0275inj=h({imports:[d.forChild(j),d]})};var O=class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=f({type:i});static \u0275inj=h({imports:[d,_,R]})};export{O as HistoryModule};
