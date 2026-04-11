// error: "\"not-exists\""

import { createInjector, tokens } from '../src/index.js';

function foo(bar: string) {}
foo.inject = tokens('not-exists');

createInjector().injectFunction(foo);
