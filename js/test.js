let person = { age: 12 };

console.log(Object.getOwnPropertyDescriptor(person, "age"));

Object.defineProperty(person, "age", {
  get() {
    return 12;
  },
  set(val) {
    throw new Error("age属性不能被修改！");
  },
});

person.age = 1212;
console.log(person.age); //12
