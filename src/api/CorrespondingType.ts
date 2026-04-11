import { ContextLookup, TContextList } from './TChildContext.js';
import {
  InjectionToken,
  InjectorToken,
  TargetToken,
} from './InjectionToken.js';
import { Injector } from './Injector.js';

export type CorrespondingType<
  TContext extends TContextList,
  T extends InjectionToken<TContext>,
> = T extends InjectorToken
  ? Injector<TContext>
  : T extends TargetToken
    ? Function | undefined
    : ContextLookup<TContext, T>;

export type CorrespondingTypes<
  TContext extends TContextList,
  TS extends readonly InjectionToken<TContext>[],
> = {
  [K in keyof TS]: TS[K] extends InjectionToken<TContext>
    ? CorrespondingType<TContext, TS[K]>
    : never;
};
