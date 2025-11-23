declare module '*.mdx' {
  import { ComponentType } from 'react';
  
  export const meta?: {
    title?: string;
    description?: string;
    duration?: string;
  };
  
  const MDXComponent: ComponentType;
  export default MDXComponent;
}

