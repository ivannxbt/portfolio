"use client";

import ReactMarkdown from "react-markdown";

type RichTextProps = {
  text?: string;
  className?: string;
  linkClassName?: string;
};

export const RichText = ({
  text,
  className = "",
  linkClassName = "",
}: RichTextProps) => {
  if (!text?.trim()) {
    return null;
  }

  return (
    <div className={`${className} whitespace-pre-line`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          a: ({ href, children, ...props }) => {
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
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-teal-500/50 pl-4 text-sm italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
