// src/components/markdown/smart-markdown-toolbar.tsx
import { JSX } from "react";
import {
  Bold,
  Italic,
  List,
  CheckSquare,
  Heading2,
  Link as LinkIcon,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartMarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onUpdate?: (value: string) => void;
  className?: string;
}

export function SmartMarkdownToolbar({
  textareaRef,
  onUpdate,
  className,
}: SmartMarkdownToolbarProps): JSX.Element {
  // Function to apply markdown formatting to selected text or insert at cursor
  const applyMarkdown = (formatType: string): void => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentValue = textarea.value;

    let newText: string;
    let newCursorPosition: number;

    // Handle different format types
    switch (formatType) {
      case "bold":
        if (selectedText) {
          newText =
            currentValue.substring(0, start) +
            "**" +
            selectedText +
            "**" +
            currentValue.substring(end);
          newCursorPosition = end + 4; // 4 chars added: ** at start and end
        } else {
          newText =
            currentValue.substring(0, start) +
            "**bold text**" +
            currentValue.substring(end);
          newCursorPosition = start + 10; // Position cursor inside the **
        }
        break;

      case "italic":
        if (selectedText) {
          newText =
            currentValue.substring(0, start) +
            "*" +
            selectedText +
            "*" +
            currentValue.substring(end);
          newCursorPosition = end + 2; // 2 chars added: * at start and end
        } else {
          newText =
            currentValue.substring(0, start) +
            "*italic text*" +
            currentValue.substring(end);
          newCursorPosition = start + 12; // Position cursor inside the *
        }
        break;

      case "heading":
        if (selectedText) {
          // If text already has ## at the start, don't add it again
          if (selectedText.trimStart().startsWith("## ")) {
            newText = currentValue;
            newCursorPosition = end;
          } else if (selectedText.trimStart().startsWith("#")) {
            // If it has # but not ##, convert to ##
            const trimmedText = selectedText.trimStart();
            const leadingSpaces = selectedText.length - trimmedText.length;
            const afterHash = trimmedText.substring(
              trimmedText.indexOf("#") + 1
            );
            const newHeading =
              selectedText.substring(0, leadingSpaces) +
              "## " +
              afterHash.trimStart();
            newText =
              currentValue.substring(0, start) +
              newHeading +
              currentValue.substring(end);
            newCursorPosition = start + newHeading.length;
          } else {
            // Normal case: add ## to start of line
            const lineStart = currentValue.lastIndexOf("\n", start - 1) + 1;
            const match = currentValue
              .substring(lineStart, start)
              .match(/^\s*/);
            const indentation = match ? match[0] : "";
            newText =
              currentValue.substring(0, lineStart) +
              indentation +
              "## " +
              selectedText.trimStart() +
              currentValue.substring(end);
            newCursorPosition =
              lineStart +
              indentation.length +
              3 +
              selectedText.trimStart().length;
          }
        } else {
          newText =
            currentValue.substring(0, start) +
            "## Heading" +
            currentValue.substring(end);
          newCursorPosition = start + 10; // Position after "## Heading"
        }
        break;

      case "bulletList":
        if (selectedText) {
          // Convert selected text into a list
          const lines = selectedText.split("\n");
          const newLines = lines.map((line) => `- ${line.trimStart()}`);
          newText =
            currentValue.substring(0, start) +
            newLines.join("\n") +
            currentValue.substring(end);
          newCursorPosition = start + newLines.join("\n").length;
        } else {
          newText =
            currentValue.substring(0, start) +
            "\n- List item\n- Another item" +
            currentValue.substring(end);
          newCursorPosition = start + 12; // Position after "- List item"
        }
        break;

      case "orderedList":
        if (selectedText) {
          // Convert selected text into a numbered list
          const lines = selectedText.split("\n");
          const newLines = lines.map(
            (line, i) => `${i + 1}. ${line.trimStart()}`
          );
          newText =
            currentValue.substring(0, start) +
            newLines.join("\n") +
            currentValue.substring(end);
          newCursorPosition = start + newLines.join("\n").length;
        } else {
          newText =
            currentValue.substring(0, start) +
            "\n1. First item\n2. Second item" +
            currentValue.substring(end);
          newCursorPosition = start + 14; // Position after "1. First item"
        }
        break;

      case "taskList":
        if (selectedText) {
          // Convert selected text into task items
          const lines = selectedText.split("\n");
          const newLines = lines.map((line) => `- [ ] ${line.trimStart()}`);
          newText =
            currentValue.substring(0, start) +
            newLines.join("\n") +
            currentValue.substring(end);
          newCursorPosition = start + newLines.join("\n").length;
        } else {
          newText =
            currentValue.substring(0, start) +
            "\n- [ ] Task to do\n- [x] Completed task" +
            currentValue.substring(end);
          newCursorPosition = start + 15; // Position after "- [ ] Task to do"
        }
        break;

      case "link":
        if (selectedText) {
          newText =
            currentValue.substring(0, start) +
            `[${selectedText}](https://example.com)` +
            currentValue.substring(end);
          newCursorPosition = start + selectedText.length + 21; // Position after the link URL
        } else {
          newText =
            currentValue.substring(0, start) +
            "[Link text](https://example.com)" +
            currentValue.substring(end);
          newCursorPosition = start + 10; // Position after "[Link text"
        }
        break;

      default:
        newText = currentValue;
        newCursorPosition = end;
    }

    // Update textarea
    textarea.value = newText;

    // Call onUpdate callback if provided
    if (onUpdate) {
      onUpdate(newText);
    }

    // Set focus and cursor position
    textarea.focus();
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);

    // Dispatch input event for React to detect change
    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);
  };

  return (
    <div
      className={`flex flex-wrap w-full items-center mb-2 p-1.5 bg-muted/20 rounded-md border gap-1 ${
        className || ""
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("bold");
        }}
        className="h-7 px-2"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("italic");
        }}
        className="h-7 px-2"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <div className="h-7 w-px bg-border"></div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("heading");
        }}
        className="h-7 px-2"
        title="Heading"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </Button>
      <div className="h-7 w-px bg-border"></div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("bulletList");
        }}
        className="h-7 px-2"
        title="Bullet List"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("orderedList");
        }}
        className="h-7 px-2"
        title="Numbered List"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("taskList");
        }}
        className="h-7 px-2"
        title="Task List"
      >
        <CheckSquare className="h-3.5 w-3.5" />
      </Button>
      <div className="h-7 w-px bg-border"></div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          applyMarkdown("link");
        }}
        className="h-7 px-2"
        title="Link"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
