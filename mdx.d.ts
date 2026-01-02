declare module '*.mdx' {
  import { ComponentType } from 'react';
  
  export var meta: {
    title?: string;
    description?: string;
    duration?: string;
  } | undefined;
  
  const MDXComponent: ComponentType;
  export default MDXComponent;
}

