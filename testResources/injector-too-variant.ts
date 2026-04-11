// error: "Type 'Injector<[]>' is not assignable to type"

import { createInjector, Injector } from '../src/index.js';

const fooInjector: Injector<[['foo', string]]> = createInjector();
console.log(fooInjector);
