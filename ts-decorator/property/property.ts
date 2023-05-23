import { propertyDecorator, getFormat, observableDecorator } from './property.decorator';

class Greeter {
  @propertyDecorator("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}

const instance = new Greeter('msg')

console.log(instance.greeting);
console.log(instance.greet());

interface IC {
  foo: number;
  bar: string;
  onFooChange?: (Function) => {};
  onBarChange?: (Function) => {};
}


class C implements IC {
  @observableDecorator
  foo = -1;

  @observableDecorator
  bar = "bar";
}

const c = new C() as IC;

c.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))
c.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))

c.foo = 100; // -> prev: -1, next: 100
c.foo = -3.14; // -> prev: 100, next: -3.14
c.bar = "baz"; // -> prev: bar, next: baz
c.bar = "sing"; // -> prev: baz, next: sing
