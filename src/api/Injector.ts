import { InjectableClass, InjectableFunction } from './Injectable.js';
import { InjectionToken } from './InjectionToken.js';
import { Scope } from './Scope.js';
import {
  ContextLookup,
  ContextTokens,
  TChildContext,
  TContextList,
  TImportContext,
  TPickContext,
} from './TChildContext.js';
import { TokenType } from './Token.js';

export interface Injector<TContext extends TContextList = []> {
  /**
   * This method creates a new instance of class `injectable` by populating its constructor arguments from the injector and returns it.
   * @param Class The class to instantiate.
   */
  injectClass<R, Tokens extends readonly InjectionToken<TContext>[]>(
    Class: InjectableClass<TContext, R, Tokens>,
  ): R;
  /**
   * This method injects the function with requested tokens from the injector, invokes it and returns the result.
   * @param fn The function to inject.
   */
  injectFunction<R, Tokens extends readonly InjectionToken<TContext>[]>(
    fn: InjectableFunction<TContext, R, Tokens>,
  ): R;
  /**
   * Resolve a token by hand.
   * @param token The token to resolve.
   */
  resolve<Token extends ContextTokens<TContext>>(
    token: Token,
  ): ContextLookup<TContext, Token>;
  /**
   * Create a child injector that provides a value for token `token`.
   * @param token The token to associate with the value.
   * @param value The value to provide.
   */
  provideValue<Token extends TokenType, R>(
    token: Token,
    value: R,
  ): Injector<TChildContext<TContext, R, Token>>;
  /**
   * Create a child injector that provides instances of `Class` for token `token`.
   * @param token The token to associate with the class.
   * @param Class The class to instantiate.
   * @param scope Lifecycle scope (default: Singleton).
   */
  provideClass<
    Token extends TokenType,
    R,
    Tokens extends readonly InjectionToken<TContext>[],
  >(
    token: Token,
    Class: InjectableClass<TContext, R, Tokens>,
    scope?: Scope,
  ): Injector<TChildContext<TContext, R, Token>>;
  /**
   * Create a child injector that provides a value using `factory` for token `token`.
   * @param token The token to associate with the factory.
   * @param factory A factory function.
   * @param scope Lifecycle scope (default: Singleton).
   */
  provideFactory<
    Token extends TokenType,
    R,
    Tokens extends readonly InjectionToken<TContext>[],
  >(
    token: Token,
    factory: InjectableFunction<TContext, R, Tokens>,
    scope?: Scope,
  ): Injector<TChildContext<TContext, R, Token>>;

  /**
   * Shorthand: provide a concrete class as its own token (class = token = type).
   * @example
   * ```ts
   * injector.provide(MyService) // token: MyService, type: MyService instance
   * ```
   */
  provide<T extends new (...args: any[]) => any>(
    Class: T & InjectableClass<TContext, InstanceType<T>, any>,
    scope?: Scope,
  ): Injector<TChildContext<TContext, InstanceType<T>, T>>;

  /**
   * Provide an abstract token backed by a concrete implementation.
   * @example
   * ```ts
   * injector.provide(Logger, ConsoleLogger) // token: Logger (abstract), type: Logger instance
   * ```
   */
  provide<
    Token extends abstract new (...args: any[]) => any,
    Impl extends new (...args: any[]) => InstanceType<Token>,
  >(
    token: Token,
    Class: Impl & InjectableClass<TContext, InstanceType<Token>, any>,
    scope?: Scope,
  ): Injector<TChildContext<TContext, InstanceType<Token>, Token>>;

  /**
   * Import all tokens from another injector into this one.
   * The current injector's tokens take priority in case of conflict.
   * @param injector The injector to import from.
   */
  import<TImportedContext extends TContextList>(
    injector: Injector<TImportedContext>,
  ): Injector<TImportContext<TContext, TImportedContext>>;

  /**
   * Import a subset of tokens from another injector into this one.
   * @param injector The injector to import from.
   * @param tokens The list of tokens to import (whitelist).
   */
  import<
    TImportedContext extends TContextList,
    Tokens extends readonly (ContextTokens<TImportedContext> & TokenType)[],
  >(
    injector: Injector<TImportedContext>,
    tokens: Tokens,
  ): Injector<TImportContext<TContext, TPickContext<TImportedContext, Tokens[number]>>>;

  /**
   * Create a restricted view of this injector that only exposes the specified tokens.
   * @param tokens The list of tokens to expose publicly.
   */
  export<Tokens extends readonly (ContextTokens<TContext> & TokenType)[]>(
    tokens: Tokens,
  ): Injector<TPickContext<TContext, Tokens[number]>>;

  /**
   * Create a child injector with the same context but a new disposable scope.
   * @example
   * ```ts
   * const parentInjector = createInjector().provideValue('foo', 'bar');
   * for(const task of tasks) {
   *   try {
   *     const scope = parentInjector.createChildInjector();
   *     const foo = scope.provideClass('baz', DisposableBaz).injectClass(Foo);
   *     foo.handle(task);
   *   } finally {
   *     await scope.dispose();
   *   }
   * }
   * ```
   **/
  createChildInjector(): Injector<TContext>;

  /**
   * Explicitly dispose the injector.
   * @see {@link https://github.com/nicojs/typed-inject?tab=readme-ov-file#disposing-provided-stuff}
   */
  dispose(): Promise<void>;
}
