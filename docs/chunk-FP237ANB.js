var S=Object.create;var d=Object.defineProperty,P=Object.defineProperties,E=Object.getOwnPropertyDescriptor,T=Object.getOwnPropertyDescriptors,D=Object.getOwnPropertyNames,b=Object.getOwnPropertySymbols,v=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable,A=Reflect.get;var m=(e,t,r)=>t in e?d(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,F=(e,t)=>{for(var r in t||={})g.call(t,r)&&m(e,r,t[r]);if(b)for(var r of b(t))R.call(t,r)&&m(e,r,t[r]);return e},M=(e,t)=>P(e,T(t));var G=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),I=(e,t)=>{for(var r in t)d(e,r,{get:t[r],enumerable:!0})},C=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of D(t))!g.call(e,o)&&o!==r&&d(e,o,{get:()=>t[o],enumerable:!(n=E(t,o))||n.enumerable});return e};var V=(e,t,r)=>(r=e!=null?S(v(e)):{},C(t||!e||!e.__esModule?d(r,"default",{value:e,enumerable:!0}):r,e));var q=(e,t,r)=>A(v(e),r,t);var B=(e,t,r)=>new Promise((n,o)=>{var i=f=>{try{c(r.next(f))}catch(l){o(l)}},u=f=>{try{c(r.throw(f))}catch(l){o(l)}},c=f=>f.done?n(f.value):Promise.resolve(f.value).then(i,u);c((r=r.apply(e,t)).next())});function N(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r}function z(e,t,r,n){function o(i){return i instanceof r?i:new r(function(u){u(i)})}return new(r||(r=Promise))(function(i,u){function c(s){try{l(n.next(s))}catch(y){u(y)}}function f(s){try{l(n.throw(s))}catch(y){u(y)}}function l(s){s.done?i(s.value):o(s.value).then(c,f)}l((n=n.apply(e,t||[])).next())})}function O(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function _(e){return this instanceof _?(this.v=e,this):new _(e)}function H(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(e,t||[]),o,i=[];return o={},c("next"),c("throw"),c("return",u),o[Symbol.asyncIterator]=function(){return this},o;function u(a){return function(p){return Promise.resolve(p).then(a,y)}}function c(a,p){n[a]&&(o[a]=function(h){return new Promise(function(x,j){i.push([a,h,x,j])>1||f(a,h)})},p&&(o[a]=p(o[a])))}function f(a,p){try{l(n[a](p))}catch(h){w(i[0][3],h)}}function l(a){a.value instanceof _?Promise.resolve(a.value.v).then(s,y):w(i[0][2],a)}function s(a){f("next",a)}function y(a){f("throw",a)}function w(a,p){a(p),i.shift(),i.length&&f(i[0][0],i[0][1])}}function J(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],r;return t?t.call(e):(e=typeof O=="function"?O(e):e[Symbol.iterator](),r={},n("next"),n("throw"),n("return"),r[Symbol.asyncIterator]=function(){return this},r);function n(i){r[i]=e[i]&&function(u){return new Promise(function(c,f){u=e[i](u),o(c,f,u.done,u.value)})}}function o(i,u,c,f){Promise.resolve(f).then(function(l){i({value:l,done:c})},u)}}export{F as a,M as b,G as c,I as d,V as e,q as f,B as g,N as h,z as i,_ as j,H as k,J as l};
