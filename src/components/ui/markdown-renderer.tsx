// src/components/ui/markdown-renderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MarkdownRendererProps {
  content: string;
  onTaskToggle?: (lineIndex: number, checked: boolean) => void;
  readOnly?: boolean;
  className?: string;
}

export function MarkdownRenderer({
  content,
  onTaskToggle,
  readOnly = false,
  className,
}: MarkdownRendererProps) {
  if (!content) return null;

  // Split the content by lines for task handling
  const contentLines = content.split("\n");

  // Function to handle checkbox changes
  const handleCheckboxChange = (lineIndex: number, checked: boolean) => {
    if (readOnly || !onTaskToggle) return;
    onTaskToggle(lineIndex, checked);
  };

  return (
    <div
      className={cn(
        "prose dark:prose-invert prose-sm max-w-none",
        // Override prose styles to use theme colors
        "prose-p:text-foreground dark:prose-p:text-foreground",
        "prose-headings:text-foreground dark:prose-headings:text-foreground",
        "prose-strong:text-foreground dark:prose-strong:text-foreground",
        "prose-em:text-foreground dark:prose-em:text-foreground",
        "prose-li:text-foreground dark:prose-li:text-foreground",
        "prose-ol:text-foreground dark:prose-ol:text-foreground",
        "prose-ul:text-foreground dark:prose-ul:text-foreground",
        "prose-blockquote:text-foreground/80 dark:prose-blockquote:text-foreground/80",
        "prose-blockquote:border-border dark:prose-blockquote:border-border",
        "prose-code:text-foreground dark:prose-code:text-foreground",
        "prose-a:text-primary dark:prose-a:text-primary",
        className
      )}
    >
      {contentLines.map((line, lineIndex) => {
        // Check if this line is a task item
        const taskMatch = line.match(/^(\s*-\s+\[)([x ])(\]\s+.*)$/);

        if (taskMatch) {
          // It's a task item, render it with checkbox
          const isChecked = taskMatch[2] === "x";
          const taskText = taskMatch[3].replace(/^\]\s+/, "");

          return (
            <div
              key={`task-${lineIndex}`}
              className="flex items-center gap-2 py-1 relative"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-5 h-5">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: isChecked ? 1.1 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(lineIndex, !!checked)
                    }
                    disabled={readOnly}
                    id={`task-${lineIndex}`}
                    className={cn("h-4 w-4 rounded border-2")}
                  />
                </motion.div>
              </div>

              <div className="relative inline-block">
                <motion.label
                  initial={false}
                  animate={{
                    opacity: isChecked ? 0.6 : 1,
                    x: isChecked ? 4 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  htmlFor={`task-${lineIndex}`}
                  className="cursor-pointer text-foreground"
                >
                  {taskText}

                  {/* This is the strike-through line that animates in */}
                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        className="absolute left-0 top-1/2 h-0.5 bg-primary/50 -translate-y-1/2 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ width: "90%" }}
                      />
                    )}
                  </AnimatePresence>
                </motion.label>
              </div>
            </div>
          );
        }

        // It's not a task, render it as markdown
        return (
          <div key={`line-${lineIndex}`} className="text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Component overrides remain unchanged
                p: ({ ...props }) => (
                  <p className="text-foreground" {...props} />
                ),
                h1: ({ ...props }) => (
                  <h1
                    className="text-foreground text-2xl font-bold mt-6 mb-4"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-foreground text-xl font-bold mt-5 mb-3"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-foreground text-lg font-bold mt-4 mb-2"
                    {...props}
                  />
                ),
                a: ({ ...props }) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-bold text-foreground" {...props} />
                ),
                em: ({ ...props }) => (
                  <em className="italic text-foreground" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-border pl-4 italic text-foreground/80"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 text-foreground" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol
                    className="list-decimal pl-5 text-foreground"
                    {...props}
                  />
                ),
                li: ({ ...props }) => (
                  <li className="text-foreground" {...props} />
                ),
              }}
            >
              {line}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
