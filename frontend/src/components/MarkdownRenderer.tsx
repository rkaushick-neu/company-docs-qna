import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // You can change this to other themes

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for markdown elements - white text for frosted glass theme
          h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mb-2 text-white">{children}</h3>,
          p: ({ children }) => <p className="mb-2 text-white/90 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc text-white/90">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal text-white/90">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-white/20 text-white px-1 py-0.5 rounded text-sm font-mono backdrop-blur-sm">{children}</code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-white/15 backdrop-blur-sm p-3 rounded-lg overflow-x-auto mb-2 border border-white/20">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-white/80 mb-2">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-300 hover:text-yellow-200 underline"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-white/90">{children}</em>,
          hr: () => <hr className="border-white/30 my-4" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-white/30">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/30 px-3 py-2 bg-white/10 backdrop-blur-sm font-semibold text-left text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/30 px-3 py-2 text-white/90">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
