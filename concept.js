function c() {
    console.log("C");
}

function b() {
    console.log("B");
    c();
}

function a() {
    console.log("A");
    b();
    console.log("A End");
}

a();

console.log("Finished");