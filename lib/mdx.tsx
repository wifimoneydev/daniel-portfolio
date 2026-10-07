import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { isExternal } from "./utils";

/** Elements available inside project MDX files. */
const components = {
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    ) : (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  // Demote headings inside sections: "##" is reserved for case-study sections.
  h2: (props: ComponentProps<"h3">) => <h3 {...props} />,
  h3: (props: ComponentProps<"h3">) => <h3 {...props} />,
};

export function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
