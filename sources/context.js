"use strict";


let ns = new WeakMap();

let internal = function (object) {
if (!ns.has(object)) ns.set(object, {});
return ns.get(object);
} // internal


class Base {
constructor () {
} // constructor

context (c) {
return (c)? internal(Base).context = c : internal(Base).context;
} // context

m0 () {
console.log (`Base.m0 using ${this.context()}`);
} // M0
} // class Base

class C extends Base {
constructor () {
super ();
console.log (`C instantiated using context ${this.context()}`);
} // constructor

m1 () {
console.log (`C.m1 using context ${this.context()}`);
} // m1
} // class C

// adding methods via prototype

C.prototype.m2 = function () {
console.log (`C.m2 using context ${this.context()}`);
} // C.prototype.m2

C.prototype.C1 = class  extends C {
constructor () {
super ();
console.log (`C1 instantiated using context ${this.context()}`);
} // constructor
} // class C1

let base = new Base ();
base.context(77);

let c = new C();
c.m0();
c.m1();
c.m2();

let c1 = new c.C1 ();


