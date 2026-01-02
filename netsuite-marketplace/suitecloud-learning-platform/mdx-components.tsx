import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';
import ConceptExplainer from '@/components/learning/ConceptExplainer';
import DeploymentFlow from '@/components/animations/DeploymentFlow';
import SPAArchitecture from '@/components/interactive/SPAArchitecture';
import CodePlayground from '@/components/interactive/CodePlayground';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ConceptExplainer,
    DeploymentFlow,
    SPAArchitecture,
    CodePlayground,
  };
}

