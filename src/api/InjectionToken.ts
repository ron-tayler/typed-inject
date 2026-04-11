import { ContextTokens, TContextList } from './TChildContext.js';

export type InjectorToken = '$injector';
export type TargetToken = '$target';
export const INJECTOR_TOKEN: InjectorToken = '$injector';
export const TARGET_TOKEN: TargetToken = '$target';

export type InjectionToken<TContext extends TContextList> =
  | InjectorToken
  | TargetToken
  | ContextTokens<TContext>;
