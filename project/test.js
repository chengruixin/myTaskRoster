var obj1 = {
    name : "hello"
}

var obj2 = new Object();

obj2.name = obj1.name;
obj1.name = "fasdf"
console.log(obj2);