// src/components/markdown/markdown-editor.tsx
import { useRef, JSX, useState, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SmartMarkdownToolbar } from "./smart-markdown-toolbar";
import { MarkdownHelp } from "./markdown-help";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  compactOnMobile?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Write with markdown...",
  className = "",

  compactOnMobile = false,
}: MarkdownEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className={`markdown-editor ${className}`}>
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        {/* Reduced margin on mobile */}
        <div className="text-sm font-medium">Description</div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm" // Smaller on mobile
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      {!previewMode && (
        <SmartMarkdownToolbar
          textareaRef={textareaRef as RefObject<HTMLTextAreaElement>}
          onUpdate={onChange}
          className={"mb-1 p-1 sm:mb-2 sm:p-1.5"}
        />
      )}

      {previewMode ? (
        <div className="overflow-y-auto border rounded-md p-2 sm:p-3 bg-muted/10">
          <MarkdownRenderer content={value} />
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="resize-none font-mono text-sm sm:h-36 h-24"
        />
      )}

      {/* Hide MarkdownHelp on very small screens unless expanded */}
      <div className={compactOnMobile ? "hidden sm:block" : ""}>
        <MarkdownHelp />
      </div>
    </div>
  );
}
