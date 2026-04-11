export type ClassToken = abstract new (...args: any[]) => any;
export type TokenType = string | symbol | ClassToken;
