// src/components/chat/MarkdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import React from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded bg-gray-200 px-1.5 py-0.5 text-[0.85em] font-mono text-gray-800"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-2 overflow-hidden rounded-lg border border-gray-200">
                {match ? (
                  <div className="flex items-center justify-between bg-gray-800 px-3 py-1 text-xs text-gray-300">
                    <span>{match[1]}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(codeString)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ) : null}
                <SyntaxHighlighter
                  style={oneDark}
                  language={match ? match[1] : undefined}
                  PreTag="div"
                  customStyle={{ margin: 0, fontSize: "0.85em" }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },

          table(props) {
            return (
              <div className="my-2 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  {props.children}
                </table>
              </div>
            );
          },

          th(props) {
            return (
              <th className="border border-gray-300 bg-gray-100 px-3 py-1.5 font-medium">
                {props.children}
              </th>
            );
          },

          td(props) {
            return (
              <td className="border border-gray-300 px-3 py-1.5">
                {props.children}
              </td>
            );
          },

          ul(props) {
            return (
              <ul className="my-1.5 list-disc pl-5 space-y-0.5">
                {props.children}
              </ul>
            );
          },

          ol(props) {
            return (
              <ol className="my-1.5 list-decimal pl-5 space-y-0.5">
                {props.children}
              </ol>
            );
          },

          li(props) {
            return <li className="leading-relaxed">{props.children}</li>;
          },

          p(props) {
            return <p className="my-1.5 first:mt-0 last:mb-0">{props.children}</p>;
          },

          a: (props) => {
            const { href, children } = props;
            return React.createElement(
              "a",
              {
                href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-600 underline hover:text-blue-800",
              },
              children
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}