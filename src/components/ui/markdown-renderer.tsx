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
        // Force removal of top margins on first elements
        "[&>div:first-child>*:first-child]:!mt-0",
        // Aggressive overrides for list spacing
        "[&_ul]:!my-1 [&_ol]:!my-1",
        "[&_li]:!my-0 [&_li]:!py-0",
        "[&_li>p]:!my-0 [&_li>p]:!py-0",
        "[&_li>*]:!my-0 [&_li>*]:!leading-tight",
        // Apply more specific spacing overrides
        "[&_ul>li]:!mt-0.5 [&_ol>li]:!mt-0.5",
        " px-4 py-2",
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
              className="flex items-start gap-2 py-0.5 relative"
            >
              <motion.label
                htmlFor={`task-${lineIndex}`}
                className="flex items-start gap-2 flex-1 cursor-pointer"
                initial={false}
                animate={{
                  opacity: isChecked ? 0.6 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mt-0.5">
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

                <div className="relative inline-block flex-1">
                  <span className="text-foreground">
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
                  </span>
                </div>
              </motion.label>
            </div>
          );
        }

        // It's not a task, render it as markdown
        return (
          <div key={`line-${lineIndex}`} className="text-foreground py-0.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Component overrides with aggressive margin/padding removal
                p: ({ ...props }) => (
                  <p
                    className="text-foreground !my-0 !py-0 !leading-normal"
                    {...props}
                  />
                ),
                h1: ({ ...props }) => (
                  <h1
                    className="text-foreground text-2xl font-bold !mt-4 !mb-2"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-foreground text-xl font-bold !mt-3 !mb-2"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-foreground text-lg font-bold !mt-3 !mb-1"
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
                    className="border-l-4 border-border pl-4 italic text-foreground/80 !my-2"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul
                    className="list-disc pl-5 text-foreground !my-1 !py-0 !leading-tight"
                    {...props}
                  />
                ),
                ol: ({ ...props }) => (
                  <ol
                    className="list-decimal pl-5 text-foreground !my-1 !py-0 !leading-tight"
                    {...props}
                  />
                ),
                li: ({ ...props }) => (
                  <li
                    className="text-foreground !my-0 !py-0 !leading-tight"
                    {...props}
                  />
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
