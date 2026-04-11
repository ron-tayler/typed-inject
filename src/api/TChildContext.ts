import { TokenType } from './Token.js';

export type ContextEntry = readonly [token: TokenType, type: unknown];
export type TContextList = readonly ContextEntry[];

/**
 * Look up the type for a given token in a tuple context.
 * Returns the type of the first matching entry (most recently added wins).
 */
export type ContextLookup<TContext extends TContextList, Token> =
  TContext extends readonly [readonly [infer K, infer V], ...infer Rest extends TContextList]
    ? K extends Token
      ? V
      : ContextLookup<Rest, Token>
    : never;

/**
 * Extract all token types from a tuple context as a union.
 */
export type ContextTokens<TContext extends TContextList> =
  TContext extends readonly [readonly [infer K, ...any[]], ...infer Rest extends TContextList]
    ? K | ContextTokens<Rest>
    : never;

/**
 * Add a new token→type entry to the front of the context (child has priority over parent).
 */
export type TChildContext<
  TParentContext extends TContextList,
  TProvided,
  CurrentToken extends TokenType,
> = readonly [[CurrentToken, TProvided], ...TParentContext];

/**
 * Remove entries from TContext whose token is in ExcludeTokens.
 */
type ExcludeContextTokens<TContext extends TContextList, ExcludeTokens> =
  TContext extends readonly [readonly [infer K, infer V], ...infer Rest extends TContextList]
    ? [K] extends [ExcludeTokens]
      ? ExcludeContextTokens<Rest, ExcludeTokens>
      : readonly [[K, V], ...ExcludeContextTokens<Rest, ExcludeTokens>]
    : readonly [];

/**
 * Merge two contexts. TContext has priority: tokens already in TContext are excluded from TImportedContext.
 */
export type TImportContext<TContext extends TContextList, TImportedContext extends TContextList> =
  readonly [...TContext, ...ExcludeContextTokens<TImportedContext, ContextTokens<TContext>>];

/**
 * Filter a context to only entries whose token is in Allowed.
 */
type FilterContextTokens<TContext extends TContextList, Allowed> =
  TContext extends readonly [readonly [infer K, infer V], ...infer Rest extends TContextList]
    ? [K] extends [Allowed]
      ? readonly [[K, V], ...FilterContextTokens<Rest, Allowed>]
      : FilterContextTokens<Rest, Allowed>
    : readonly [];

/**
 * Pick a subset of entries from a context by token (used for export).
 */
export type TPickContext<TContext extends TContextList, Allowed> =
  FilterContextTokens<TContext, Allowed>;

// Kept for backward compatibility
export type Simplify<T> = {} & { [K in keyof T]: T[K] };
