import{$ as R,Ca as ue,D as n,Da as pe,E as O,Ea as B,F as y,Fa as V,G as u,Ga as Z,H as m,Ha as E,J as l,Ja as me,K as s,Ka as de,L as g,La as ge,M as K,Ma as fe,N as Q,Na as he,O as C,P as d,Q as p,S as c,T as v,U as x,V as ie,W as k,X as I,Y as T,Z as Y,_ as ne,a as $,ba as W,fa as re,ga as L,ha as X,i as J,j as ee,k as F,ka as oe,l as te,la as M,n as A,q as b,r as H,u as j,ua as ae,v as f,w as h,wa as le,xa as se,y as N,ya as S,za as ce}from"./chunk-2J53E7KK.js";import{a as P,b as D}from"./chunk-MZBEQE75.js";function ve(r,t){if(r&1){let e=C();K(0),l(1,"div",9)(2,"input",10),d("change",function(){f(e);let a=p();return h(a.emitChanges())}),T("ngModelChange",function(a){let o=f(e).$implicit,_=p();return I(_.filterCategories[o.id],a)||(_.filterCategories[o.id]=a),h(a)}),s(),l(3,"label",11),c(4),s()(),Q()}if(r&2){let e=t.$implicit,i=p();n(2),u("value",e.id)("id",e.id)("checked",i.filterCategories[e.id]),k("ngModel",i.filterCategories[e.id]),n(),u("for",e.id),n(),v(e.name)}}function xe(r,t){if(r&1){let e=C();K(0),l(1,"div",9)(2,"input",10),d("change",function(){f(e);let a=p();return h(a.emitChanges())}),T("ngModelChange",function(a){let o=f(e).$implicit,_=p();return I(_.filterCategories[o.id],a)||(_.filterCategories[o.id]=a),h(a)}),s(),l(3,"label",11),c(4),s()(),Q()}if(r&2){let e=t.$implicit,i=p();n(2),u("value",e.id)("id",e.id)("checked",i.filterCategories[e.id]),k("ngModel",i.filterCategories[e.id]),n(),u("for",e.id),n(),v(e.name)}}var G=class r{value;selectedCategories=new N;regularValue="regular";irregularValue="irregular";filterCategories=E.reduce((t,e)=>(t[e.id]=!1,t),{});categories={regular:E.filter(t=>!t.includeInBalance),irregular:E.filter(t=>t.includeInBalance)};ngOnChanges(t){t.value&&Array.isArray(this.value)&&(this.initiateFilterCategory(),this.filterCategories=E.reduce((e,i)=>(e[i.id]=this.value.length>0?this.value.includes(i.id):!1,e),{}),this.checkMainCategory())}clearCategoryFilters(){this.initiateFilterCategory(),this.emitChanges()}filterCategory(t){let e=t===this.regularValue?this.categories.regular:this.categories.irregular;e=e.map(i=>i.id),this.filterCategories[t]&&e.forEach(i=>{this.filterCategories[i]=!1});for(let i in this.filterCategories)e.includes(i)&&(this.filterCategories[i]=!this.filterCategories[i]);this.emitChanges()}emitChanges(){this.checkMainCategory();let t=this.getSelectedCategories();t=t?.length===E.length?[]:t,this.selectedCategories.emit(t)}checkMainCategory(){let t=this.categories.regular.map(o=>o.id),e=this.categories.irregular.map(o=>o.id),i=t.every(o=>this.filterCategories[o]),a=e.every(o=>this.filterCategories[o]);return this.filterCategories.regular=i,this.filterCategories.irregular=a,{regularChecked:i,irregularChecked:a}}getSelectedCategories(){return Object.keys(this.filterCategories).reduce((t,e)=>(this.filterCategories[e]&&e!==this.regularValue&&e!==this.irregularValue&&t.push(e),t),[])}initiateFilterCategory(){for(let t in this.filterCategories)this.filterCategories[t]=!1;this.filterCategories.irregular=!1,this.filterCategories.regular=!1}static \u0275fac=function(e){return new(e||r)};static \u0275cmp=b({type:r,selectors:[["app-category-filter"]],inputs:{value:"value"},outputs:{selectedCategories:"selectedCategories"},standalone:!0,features:[j,Y],decls:19,vars:6,consts:[[1,"category-filter"],[1,"category-filter-clear",3,"click"],[1,"category-filter-checkbox","category-filter-checkbox-main"],["type","checkbox","value","regular","id","category-regular",3,"change","ngModelChange","checked","ngModel"],["for","category-regular"],[1,"category-filter-sub-items"],[4,"ngFor","ngForOf"],["type","checkbox","value","irregular","id","category-irregular",3,"change","ngModelChange","checked","ngModel"],["for","category-irregular"],[1,"category-filter-checkbox","category-filter-checkbox-sub"],["type","checkbox",3,"change","ngModelChange","value","id","checked","ngModel"],[3,"for"]],template:function(e,i){e&1&&(l(0,"div",0)(1,"span"),c(2,"\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F:"),s(),g(3,"br"),l(4,"button",1),d("click",function(){return i.clearCategoryFilters()}),c(5," \u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B "),s(),g(6,"br"),l(7,"div",2)(8,"input",3),d("change",function(){return i.filterCategory(i.regularValue)}),T("ngModelChange",function(o){return I(i.filterCategories.regular,o)||(i.filterCategories.regular=o),o}),s(),l(9,"label",4),c(10,"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435"),s()(),l(11,"div",5),y(12,ve,5,6,"ng-container",6),s(),l(13,"div",2)(14,"input",7),d("change",function(){return i.filterCategory(i.irregularValue)}),T("ngModelChange",function(o){return I(i.filterCategories.irregular,o)||(i.filterCategories.irregular=o),o}),s(),l(15,"label",8),c(16,"\u041D\u0435\u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435"),s()(),l(17,"div"),y(18,xe,5,6,"ng-container",6),s()()),e&2&&(n(8),u("checked",i.filterCategories.regular),k("ngModel",i.filterCategories.regular),n(4),u("ngForOf",i.categories.regular),n(2),u("checked",i.filterCategories.irregular),k("ngModel",i.filterCategories.irregular),n(4),u("ngForOf",i.categories.irregular))},dependencies:[M,L,S,ae,le,se],styles:[".category-filter[_ngcontent-%COMP%]   .category-filter-clear[_ngcontent-%COMP%]{font-family:Montserrat,sans-serif;color:gray;border:none;background-color:transparent;cursor:pointer;margin:.5rem 0 0;padding:0;text-decoration:underline}.category-filter[_ngcontent-%COMP%]   .category-filter-checkbox[_ngcontent-%COMP%]{display:flex;align-items:center;flex-direction:row;gap:.5rem;margin-top:.5rem}.category-filter[_ngcontent-%COMP%]   .category-filter-checkbox[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{width:100%}.category-filter[_ngcontent-%COMP%]   .category-filter-checkbox-main[_ngcontent-%COMP%]{display:flex;font-family:Montserrat,sans-serif;color:#000;flex-direction:row;gap:.5rem}.category-filter[_ngcontent-%COMP%]   .category-filter-checkbox-sub[_ngcontent-%COMP%]{margin-left:2rem}"]})};var Fe=r=>({"app-multi-filter-button-active":r});function be(r,t){if(r&1){let e=C();l(0,"span")(1,"span"),c(2,"\u0424\u0438\u043B\u044C\u0442\u0440\u044B:"),s(),l(3,"i",7),d("click",function(){f(e);let a=p();return h(a.clearFilters())}),s(),g(4,"br"),c(5," \u041F\u0435\u0440\u0438\u043E\u0434: "),l(6,"span"),c(7),s(),g(8,"br"),c(9," \u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438: "),l(10,"span"),c(11),s()()}if(r&2){let e=p();n(),m("font-weight","bold"),n(2),m("padding-left","10px"),n(3),m("color","#ff6f61"),n(),v((e.dateFilter==null?null:e.dateFilter.display)||"\u0412\u0435\u0441\u044C"),n(3),m("color","#ff6f61"),n(),v(e.getCategoryFilters()||"\u0412\u0441\u0435")}}function Me(r,t){if(r&1&&(l(0,"span")(1,"div")(2,"span"),c(3,"\u041E\u0431\u0449\u0438\u0439 \u0440\u0430\u0441\u0445\u043E\u0434: "),s(),l(4,"span"),c(5),s()()()),r&2){let e=p();n(),m("margin","10","px"),n(3),m("color","#ff6f61"),n(),x("",e.totalAmount,"\u20AC")}}function Se(r,t){if(r&1&&(l(0,"div")(1,"span"),c(2,"\u041E\u0431\u0449\u0438\u0439 \u0440\u0430\u0441\u0445\u043E\u0434: "),s(),l(3,"span"),c(4),s()()),r&2){let e=p();m("margin","10","px"),n(3),m("color","#ff6f61"),n(),x("",e.totalAmount,"\u20AC")}}function Ee(r,t){if(r&1){let e=C();l(0,"div",8)(1,"div",9)(2,"div",10)(3,"app-date-filter",11),d("changeFilter",function(a){f(e);let o=p();return h(o.emitDateFilter(a))}),s()(),l(4,"app-category-filter",12),d("selectedCategories",function(a){f(e);let o=p();return h(o.emitCategoryFilters(a))}),s()()()}if(r&2){let e=p();n(3),u("value",e.dateFilter),n(),u("value",e.predefineCategories)}}var w=class r{value;totalAmount;selectedFilters=new N;dateFilter;selectedCategories=[];predefineCategories=[];expandFilters=!1;ngOnChanges(t){t.value&&this.value&&(this.dateFilter=this.value.date,this.selectedCategories=this.value.categories,this.predefineCategories=this.value.categories)}getCategoryFilters(){return this.selectedCategories.map(V).join(", ")}clearFilters(){this.dateFilter=void 0,this.predefineCategories=[],this.selectedCategories=[],this.selectedFilters.emit({categories:[],date:void 0})}emitDateFilter(t){this.dateFilter=t,this.selectedFilters.emit({categories:this.selectedCategories,date:t})}emitCategoryFilters(t){this.selectedCategories=t,this.selectedFilters.emit({categories:t,date:this.dateFilter})}toggleExpandFilters(){this.expandFilters=!this.expandFilters,this.predefineCategories=[...this.selectedCategories]}static \u0275fac=function(e){return new(e||r)};static \u0275cmp=b({type:r,selectors:[["app-multi-filter"]],inputs:{value:"value",totalAmount:"totalAmount"},outputs:{selectedFilters:"selectedFilters"},standalone:!0,features:[j,Y],decls:8,vars:7,consts:[[1,"app-multi-filter"],[1,"app-multi-filter-container"],[4,"ngIf"],[1,"app-multi-filter-button",3,"click","ngClass"],[1,"fas","fa-filter"],[3,"margin",4,"ngIf"],["class","app-multi-filter-expand",4,"ngIf"],[1,"fas","fa-redo-alt",3,"click"],[1,"app-multi-filter-expand"],[1,"app-multi-filter-expand-items"],[1,"app-multi-filter-expand-date"],[3,"changeFilter","value"],[3,"selectedCategories","value"]],template:function(e,i){if(e&1&&(l(0,"div",0)(1,"div",1),y(2,be,12,10,"span",2)(3,Me,6,5,"span",2),l(4,"button",3),d("click",function(){return i.toggleExpandFilters()}),g(5,"i",4),s()(),y(6,Se,5,5,"div",5)(7,Ee,5,2,"div",6),s()),e&2){let a,o,_;n(2),u("ngIf",((i.dateFilter==null?null:i.dateFilter.display)||((a=i.getCategoryFilters())==null?null:a.length))&&!i.expandFilters),n(),u("ngIf",!(i.dateFilter!=null&&i.dateFilter.display)&&!((o=i.getCategoryFilters())!=null&&o.length)||i.expandFilters),n(),u("ngClass",ne(5,Fe,i.expandFilters)),n(2),u("ngIf",((i.dateFilter==null?null:i.dateFilter.display)||((_=i.getCategoryFilters())==null?null:_.length))&&!i.expandFilters),n(),u("ngIf",i.expandFilters)}},dependencies:[M,re,X,S,ge,G],styles:[".app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-container[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:0 1rem 0 0}.app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-container[_ngcontent-%COMP%]   .app-multi-filter-button[_ngcontent-%COMP%]{font-family:Montserrat,sans-serif;color:#000;border:2px solid #f8d7da;background-color:transparent;border-radius:5px;padding:.5rem 1rem;margin:.5rem;cursor:pointer}.app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-container[_ngcontent-%COMP%]   .app-multi-filter-button-active[_ngcontent-%COMP%]{background-color:#f8d7da}.app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-expand[_ngcontent-%COMP%]{display:flex;align-items:flex-start;flex-direction:column;margin:.5rem}.app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-expand[_ngcontent-%COMP%]   .app-multi-filter-expand-items[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem;width:100%}.app-multi-filter[_ngcontent-%COMP%]   .app-multi-filter-expand[_ngcontent-%COMP%]   .app-multi-filter-expand-items[_ngcontent-%COMP%]   .app-multi-filter-expand-date[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:100%;font-family:Montserrat,sans-serif;padding:.5rem;border:2px solid #f8d7da;border-radius:5px;cursor:pointer}"]})};function Pe(r,t){r&1&&(l(0,"div",5)(1,"span"),c(2,"\u0414\u043B\u044F \u044D\u0442\u0438\u0445 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439 \u0438 \u043F\u0435\u0440\u0438\u043E\u0434\u0430 \u0442\u0440\u0430\u0442 \u043D\u0435\u0442"),s()())}function De(r,t){if(r&1&&(l(0,"span")(1,"span"),c(2),R(3,"date"),s(),l(4,"span"),c(5),s()()),r&2){let e=p().$implicit,i=p();m("background","#f8d7da")("width","100%")("display","block"),n(2),x("",W(3,10,e.date,"dd-MM-YYYY")," - "),n(2),m("font-weight","600"),n(),x("",i.getTotalAmountPerDay(e.date),"\u20AC")}}function Oe(r,t){if(r&1){let e=C();l(0,"span",9),d("click",function(){f(e);let a=p().index,o=p();return h(o.onDeleteFromBalance(a))}),c(1," | Delete from balance"),s()}r&2&&m("color","grey")("cursor","pointer")}function ke(r,t){if(r&1){let e=C();l(0,"span"),y(1,De,6,13,"span",6),l(2,"div",7),g(3,"br"),c(4,"\u0426\u0435\u043D\u0430: "),l(5,"span"),c(6),s(),g(7,"br")(8,"br"),l(9,"div"),c(10," Category: "),l(11,"span",8),d("click",function(){let a=f(e).$implicit,o=p();return h(o.filterByCategory(a.category))}),c(12),s()(),c(13),R(14,"date"),R(15,"date"),g(16,"br")(17,"br"),l(18,"span",9),d("click",function(){let a=f(e).index,o=p();return h(o.onDelete(a))}),c(19,"Delete"),s(),y(20,Oe,2,4,"span",10),s(),g(21,"hr"),s()}if(r&2){let e=t.$implicit,i=p();n(),u("ngIf",e.showDateTitle),n(4),m("color","#ff6f61"),n(),x("",e.amount,"\u20AC"),n(6),v(i.getCategoryNameByIdFunc(e.category)),n(),ie(" Date: ",W(14,16,e.date,"HH:mm")," (",W(15,19,e.date,"dd-MM-YYYY"),")"),n(5),m("color","grey")("cursor","pointer"),n(2),u("ngIf",!e.isDeletedFromBalance&&i.getCategoryByIdFunc(e.category).includeInBalance),n(),m("background","#f8d7da")("height","2px")}}var U=class r{constructor(t,e,i,a){this.router=t;this.expenseService=e;this.balanceService=i;this.dateFilterService=a}expenses=[];totalAmount=0;temporaryDate=0;totalAmountPerDays=new Map;getCategoryByIdFunc=Z;filter={categories:[],date:void 0};getCategoryNameByIdFunc=V;destroySubject=new $;ngOnInit(){this.dateFilterService.dateFilter&&(this.filter=D(P({},this.filter),{date:this.dateFilterService.dateFilter}),this.dateFilterService.dateFilter=void 0);let t=this.dateFilterService.categories;Array.isArray(t)&&t.length>0&&(this.filter=D(P({},this.filter),{categories:t}),this.dateFilterService.categories=void 0),this.filter?.date||this.filter?.categories?.length>0?this.applyFilters(this.filter):this.initiateExpenses().pipe(J(),F(this.destroySubject)).subscribe(()=>{this.sumValues()})}initiateExpenses(){return this.expenseService.getExpenses().pipe(te(t=>{this.expenses=t.map(e=>{let i=this.isDatePanelVisible(e.date);if(i)this.totalAmountPerDays.set(e.date,e.amount);else{let a=this.totalAmountPerDays.get(this.temporaryDate)||0,o=Math.round((a+e.amount)*100)/100;this.totalAmountPerDays.set(this.temporaryDate,o)}return D(P({},e),{showDateTitle:i})})}))}getCategoryFilters(){return this.filter?.categories.map(V).join(", ")}applyFilters(t){this.initiateExpenses().pipe(J(),F(this.destroySubject)).subscribe(()=>{t?.categories.length>0&&(this.expenses=this.expenses.filter(e=>t?.categories.includes(e.category))),t?.date&&(this.expenses=fe(this.expenses,t?.date?.start,t?.date?.finish)),this.sumValues()})}filterByCategory(t){this.filter=D(P({},this.filter),{categories:[t]}),this.applyFilters(this.filter)}getTotalAmountPerDay(t){return this.totalAmountPerDays.get(t)||0}onDelete(t){if(confirm("Delete?")){this.updateBalance(t);let e=this.expenses[t].id;this.expenseService.deleteExpense(e).pipe(ee(()=>this.initiateExpenses()),F(this.destroySubject)).subscribe(()=>this.sumValues())}}updateBalance(t,e){let i=Number(localStorage.getItem("balance"))||0,a=Z(this.expenses[t].category);if(i&&!this.expenses[t]?.isDeletedFromBalance&&a?.includeInBalance){let o=Math.round((i+this.expenses[t].amount)*100)/100;this.balanceService.addBalance(o).pipe(F(this.destroySubject)).subscribe()}e&&(this.expenses[t].isDeletedFromBalance=e,this.expenseService.updateExpense(this.expenses[t]).pipe(F(this.destroySubject)).subscribe())}onDeleteFromBalance(t){confirm("Return to balance?")&&this.updateBalance(t,!0)}onSwipeRight(){this.router.navigate(["/"])}showCategoryDetails(t){this.router.navigate(["/details"],{queryParams:{"category-id":t,"back-url":"/history"}})}isDatePanelVisible(t){return this.temporaryDate===0?(this.temporaryDate=t,!0):new Date(this.temporaryDate).toDateString()===new Date(t).toDateString()?!1:(this.temporaryDate=t,!0)}touchStartX=0;touchStartY=0;touchEndX=0;touchEndY=0;onTouchStart(t){this.touchStartX=t.changedTouches[0].screenX,this.touchStartY=t.changedTouches[0].screenY}onTouchEnd(t){this.touchEndX=t.changedTouches[0].screenX,this.touchEndY=t.changedTouches[0].screenY,this.handleSwipeGesture()}handleSwipeGesture(){let t=this.touchEndX-this.touchStartX,e=this.touchEndY-this.touchStartY;Math.abs(t)>Math.abs(e)&&(t>100?this.onSwipeRight():t<-100&&this.onSwipeLeft())}onSwipeLeft(){this.router.navigate(["/statistics"])}ngOnDestroy(){this.destroySubject.next(),this.destroySubject.complete()}sumValues(){this.totalAmount=this.expenses.reduce((t,e)=>{let i=t+e.amount;return Math.round(i*100)/100},0)}static \u0275fac=function(e){return new(e||r)(O(ue),O(me),O(de),O(he))};static \u0275cmp=b({type:r,selectors:[["app-history"]],hostBindings:function(e,i){e&1&&d("touchstart",function(o){return i.onTouchStart(o)})("touchend",function(o){return i.onTouchEnd(o)})},decls:8,vars:13,consts:[[1,"history-container"],[3,"routerLink"],[3,"selectedFilters","value","totalAmount"],["class","history-empty",4,"ngIf"],[4,"ngFor","ngForOf"],[1,"history-empty"],[3,"background","width","display",4,"ngIf"],[1,"history-item"],[1,"app-link",3,"click"],[3,"click"],[3,"color","cursor","click",4,"ngIf"]],template:function(e,i){e&1&&(l(0,"div",0)(1,"span",1),c(2,"< Back"),s(),g(3,"br"),l(4,"app-multi-filter",2),d("selectedFilters",function(o){return i.applyFilters(o)}),s(),g(5,"hr"),y(6,Pe,3,0,"div",3)(7,ke,22,22,"span",4),s()),e&2&&(n(),m("color","blue")("cursor","pointer"),u("routerLink","/"),n(3),u("value",i.filter)("totalAmount",i.totalAmount),n(),m("background","#f8d7da")("height","2px"),n(),u("ngIf",!i.expenses.length),n(),u("ngForOf",i.expenses))},dependencies:[pe,L,X,w,oe],styles:[".history-container[_ngcontent-%COMP%]{height:100dvh;overflow-y:scroll}.history-container[_ngcontent-%COMP%]   .history-item[_ngcontent-%COMP%]{padding-left:10px}.history-container[_ngcontent-%COMP%]   .history-container-top[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:0 1rem 0 0}.history-container[_ngcontent-%COMP%]   .history-empty[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;font-family:Montserrat,sans-serif;color:#000}"]})};var Ie=[{path:"",component:U}],z=class r{static \u0275fac=function(e){return new(e||r)};static \u0275mod=H({type:r});static \u0275inj=A({imports:[B.forChild(Ie),B]})};var _e=class r{static \u0275fac=function(e){return new(e||r)};static \u0275mod=H({type:r});static \u0275inj=A({imports:[B,z,M,S,ce,w]})};export{_e as HistoryModule};
