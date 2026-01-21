import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";

type RichTextProps = {
  text?: string;
  className?: string;
  linkClassName?: string;
};

export const RichText = React.memo<RichTextProps>(
  ({ text, className = "", linkClassName = "" }) => {
    const components = useMemo(
      () => ({
        p: ({ children }: { children?: React.ReactNode }) => (
          <p className="leading-relaxed">{children}</p>
        ),
        strong: ({ children }: { children?: React.ReactNode }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        a: ({
          href,
          children,
          ...props
        }: {
          href?: string;
          children?: React.ReactNode;
        }) => {
          const external = !!href && /^https?:/i.test(href);
          return (
            <a
              href={href}
              className={linkClassName}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        ul: ({ children }: { children?: React.ReactNode }) => (
          <ul className="list-disc space-y-2 pl-6">{children}</ul>
        ),
        ol: ({ children }: { children?: React.ReactNode }) => (
          <ol className="list-decimal space-y-2 pl-6">{children}</ol>
        ),
        li: ({ children }: { children?: React.ReactNode }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        code: ({ children }: { children?: React.ReactNode }) => (
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">{children}</code>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
          <blockquote className="border-l-2 border-teal-500/50 pl-4 text-sm italic">
            {children}
          </blockquote>
        ),
      }),
      [linkClassName]
    );

    if (!text?.trim()) {
      return null;
    }

    return (
      <div className={`${className} whitespace-pre-line`}>
        <ReactMarkdown components={components}>{text}</ReactMarkdown>
      </div>
    );
  }
);

RichText.displayName = "RichText";
