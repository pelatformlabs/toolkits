import type { CSSProperties } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";

import { Logo } from "pelatform-ui/components";
import { source } from "@/lib/source";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "pelatformlabs",
  repo: "toolkits",
  branch: "main",
};

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider>
      <DocsLayout
        tree={source.getPageTree()}
        tabMode="navbar"
        nav={{
          mode: "top",
          title: (
            <>
              <Logo className="size-6.5" />
              <span className="font-semibold">Pelatform Toolkits</span>
            </>
          ),
        }}
        sidebar={{
          collapsible: false,
          tabs: {
            transform(option, node) {
              const meta = source.getNodeMeta(node);
              if (!(meta && node.icon)) {
                return option;
              }

              const segments = meta.path.split("/");
              const segment = serializeSegment(segments[0]);

              const color = `var(--${segment}-color, var(--color-fd-foreground))`;
              return {
                ...option,
                icon: (
                  <div
                    className="size-full rounded-lg text-(--tab-color) max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5 [&_svg]:size-full"
                    style={
                      {
                        "--tab-color": color,
                      } as CSSProperties
                    }
                  >
                    {node.icon}
                  </div>
                ),
              };
            },
          },
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

const LEADING_DASHES = /^-+/;
const TRAILING_DASHES = /-+$/;

function serializeSegment(segment: string | undefined): string {
  const raw = (segment ?? "").trim();

  const kebab = raw
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(LEADING_DASHES, "")
    .replace(TRAILING_DASHES, "");
  return kebab || "fd";
}
