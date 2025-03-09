// src/components/markdown/markdown-help.tsx
import { JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HelpCircle, ChevronDown } from "lucide-react";

export function MarkdownHelp(): JSX.Element {
  return (
    <Collapsible className="w-full mt-1 mb-3">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-xs text-muted-foreground flex items-center mt-2"
        >
          <HelpCircle className="h-3 w-3 mr-1" />
          Markdown formatting help
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="border rounded-md overflow-hidden bg-muted/20">
          {/* Header row */}
          <div className="grid grid-cols-2 text-xs font-medium bg-muted/30 border-b">
            <div className="p-2 border-r">Markdown Syntax</div>
            <div className="p-2">Result</div>
          </div>

          {/* Content rows */}
          <div className="text-xs divide-y">
            {/* Bold */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">**bold**</div>
              <div className="p-2">
                <strong>bold</strong>
              </div>
            </div>

            {/* Italic */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">*italic*</div>
              <div className="p-2">
                <em>italic</em>
              </div>
            </div>

            {/* Heading */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">## Heading</div>
              <div className="p-2 font-bold">Heading</div>
            </div>

            {/* Bullet List */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">
                - Item 1<br />- Item 2
              </div>
              <div className="p-2">
                • Item 1<br />• Item 2
              </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">
                - [ ] Todo
                <br />- [x] Done
              </div>
              <div className="p-2">
                <div className="flex items-center">
                  <Checkbox disabled className="h-3 w-3 mr-1.5" /> Todo
                </div>
                <div className="flex items-center">
                  <Checkbox checked disabled className="h-3 w-3 mr-1.5" /> Done
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">&gt; Quote text</div>
              <div className="p-2 border-l-2 border-muted-foreground pl-2 italic">
                Quote text
              </div>
            </div>

            {/* Link */}
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 font-mono bg-muted/10">
                [Link](https://example.com)
              </div>
              <div className="p-2">
                <a className="text-primary hover:underline" href="#">
                  Link
                </a>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
