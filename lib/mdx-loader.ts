// Static mapping of MDX modules
// This is necessary because Next.js doesn't support dynamic imports with template literals

import type { ComponentType } from 'react';

// Import MDX files - these should be compiled by Next.js
// The MDX files are imported as modules with default export and meta
import functionalUsers01 from '@/content/paths/functional-users/01-getting-started.mdx';
import developers01 from '@/content/paths/developers/01-setup.mdx';

// Add more imports as MDX files are created
// import functionalUsers02 from '@/content/paths/functional-users/02-basic-concepts.mdx';
// import functionalUsers03 from '@/content/paths/functional-users/03-first-customization.mdx';
// import functionalUsers04 from '@/content/paths/functional-users/04-deploying-changes.mdx';
// import functionalUsers05 from '@/content/paths/functional-users/05-common-patterns.mdx';

type MDXModule = {
  default: ComponentType;
  meta?: {
    title?: string;
    description?: string;
    duration?: string;
  };
};

// Handle the case where MDX might be imported as a function or component
// Next.js MDX compilation should provide a default export
const mdxModules: Record<string, any> = {
  'functional-users/01-getting-started': functionalUsers01,
  'developers/01-setup': developers01,
  // Add more mappings as MDX files are created
  // 'functional-users/02-basic-concepts': functionalUsers02,
  // 'functional-users/03-first-customization': functionalUsers03,
  // 'functional-users/04-deploying-changes': functionalUsers04,
  // 'functional-users/05-common-patterns': functionalUsers05,
};

export function loadMDXModule(
  pathId: string,
  moduleId: string
): MDXModule | null {
  const key = `${pathId}/${moduleId}`;
  const module = mdxModules[key];
  
  if (!module) {
    return null;
  }
  
  // Debug logging
  console.log(`Loading MDX module: ${key}`, {
    hasDefault: !!module?.default,
    hasMeta: !!module?.meta,
    moduleType: typeof module,
    moduleKeys: Object.keys(module || {}),
    moduleConstructor: module?.constructor?.name,
    isFunction: typeof module === 'function',
    isComponent: typeof module === 'function' && module.prototype?.isReactComponent !== undefined,
  });
  
  // If the module itself is a function/component (not wrapped in an object),
  // wrap it to match our expected structure
  if (typeof module === 'function' && !module.default) {
    return {
      default: module as ComponentType,
      meta: (module as any).meta,
    };
  }
  
  // If it's already in the expected format
  if (module.default) {
    return module as MDXModule;
  }
  
  // Last resort: try to use the module directly as a component
  if (typeof module === 'function') {
    return {
      default: module as ComponentType,
      meta: undefined,
    };
  }
  
  return null;
}

export function hasMDXModule(pathId: string, moduleId: string): boolean {
  const key = `${pathId}/${moduleId}`;
  return key in mdxModules;
}

