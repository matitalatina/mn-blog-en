type CSSModule = Record<string, string>;

// type shims for CSS modules

declare module '*.module.scss' {
  const cssModule: CSSModule;
  export = cssModule;
}

declare module '*.module.css' {
  const cssModule: CSSModule;
  export = cssModule;
}

declare module 'rehype-react' {
  interface RehypeOptions {
    createElement: typeof import('react').createElement;
    components: Record<string, unknown>;
  }
  class RehypeReact {
    Compiler: (ast: import('hast').Root) => import('react').ReactNode;
    constructor(options: RehypeOptions);
  }
  export default RehypeReact;
}
