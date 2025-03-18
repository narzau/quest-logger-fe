"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  className,
  disabled = false,
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);

  // Filter suggestions to remove existing tags
  const filteredSuggestions = suggestions.filter(
    (suggestion) => 
      !value.includes(suggestion) && 
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't hide suggestions if clicking on a suggestion
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).classList.contains('tag-suggestion')) {
      return;
    }
    
    if (inputValue) {
      addTag(inputValue);
    }
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 rounded-md border bg-background min-h-10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Badge 
            key={`${tag}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-0.5"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              disabled={disabled}
              className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted/50"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value) {
              setShowSuggestions(true);
            }
          }}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-grow bg-transparent outline-none border-none focus:ring-0 p-1 text-sm"
        />
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-popover text-popover-foreground rounded-md border shadow-md">
          <div className="max-h-60 overflow-auto p-1">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="tag-suggestion w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur event
                  addTag(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 