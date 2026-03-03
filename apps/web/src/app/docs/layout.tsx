import { DocsLayout } from "@fumadocs/base-ui/layouts/notebook";
import type { BaseLayoutProps } from "@fumadocs/base-ui/layouts/shared";
import { RootProvider } from "@fumadocs/base-ui/provider/next";

import { source } from "@/lib/source";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "fuma-nama",
  repo: "fumadocs",
  branch: "main",
};

function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "My App",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider>
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
