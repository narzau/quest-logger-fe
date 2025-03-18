"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useFilterStore } from "@/store/filterStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  SortAsc,
  SortDesc,
  X,
  FolderOpen, 
  Tag,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function NotesFilter() {
  const { folders, tags } = useNotes();
  const { 
    searchQuery, 
    selectedFolder, 
    selectedTags, 
    sortBy, 
    sortOrder,
    setSearchQuery, 
    setSelectedFolder, 
    toggleTag, 
    removeTag,
    setSelectedTags,
    setSortBy, 
    setSortOrder,
    resetFilters
  } = useFilterStore();

  const [folderSearchTerm, setFolderSearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [folderPopoverOpen, setFolderPopoverOpen] = useState(false);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  // Filter folders and tags based on search term
  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(folderSearchTerm.toLowerCase())
  );
  
  // Since tags come as a comma-separated string from the backend,
  // we need to split and normalize them for the filter UI
  const tagsArray = tags.flatMap(tag => tag.split(',').map(t => t.trim())).filter(Boolean);
  const uniqueTags = [...new Set(tagsArray)];
  
  const filteredTags = uniqueTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Folder Selector */}
        <Popover open={folderPopoverOpen} onOpenChange={setFolderPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedFolder ? "default" : "outline"} 
              className="gap-1"
              aria-expanded={folderPopoverOpen}
            >
              <FolderOpen size={16} />
              <span className="hidden sm:inline">
                {selectedFolder ? `Folder: ${selectedFolder}` : "Folders"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 w-64" align="end">
            <div className="space-y-2">
              <Input 
                placeholder="Search folders..." 
                value={folderSearchTerm}
                onChange={(e) => setFolderSearchTerm(e.target.value)}
                className="mb-2"
              />
              
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                {filteredFolders.length === 0 && folderSearchTerm ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No folders found
                  </div>
                ) : (
                  <div className="py-1">
                    <button
                      className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setSelectedFolder(null);
                        setFolderPopoverOpen(false);
                      }}
                    >
                      <span>All Folders</span>
                      {!selectedFolder && <Check size={16} />}
                    </button>
                    
                    {filteredFolders.map((folder) => (
                      <button
                        key={folder}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setSelectedFolder(folder);
                          setFolderPopoverOpen(false);
                        }}
                      >
                        <span>{folder}</span>
                        {selectedFolder === folder && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tag Selector */}
        <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedTags.length > 0 ? "default" : "outline"} 
              className="gap-1"
              aria-expanded={tagPopoverOpen}
            >
              <Tag size={16} />
              <span className="hidden sm:inline">
                {selectedTags.length > 0 
                  ? selectedTags.length === 1 
                    ? `Tag: ${selectedTags[0]}` 
                    : `Tags: ${selectedTags.length}` 
                  : "Tags"}
              </span>
              {selectedTags.length > 0 && (
                <span className="flex sm:hidden items-center justify-center bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px]">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 w-64" align="end">
            <div className="space-y-2">
              <Input 
                placeholder="Search tags..." 
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                className="mb-2"
              />
              
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                {filteredTags.length === 0 && tagSearchTerm ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No tags found
                  </div>
                ) : (
                  <div className="py-1">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Select multiple tags (AND filter)
                    </div>
                    <button
                      className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setSelectedTags([]);
                        setTagPopoverOpen(false);
                      }}
                    >
                      <span>All Tags</span>
                      {selectedTags.length === 0 && <Check size={16} />}
                    </button>
                    
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleTag(tag);
                          // Don't close the popover to allow multiple selections
                        }}
                      >
                        <span>{tag}</span>
                        {selectedTags.includes(tag) && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => setTagPopoverOpen(false)}
                  >
                    Apply {selectedTags.length > 0 && `(${selectedTags.length})`}
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="updated_at">
                Last Updated {sortBy === "updated_at" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at">
                Created Date {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title">
                Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value: string) => setSortOrder(value as "asc" | "desc")}>
              <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters Button - only show if any filter is active */}
        {(selectedFolder || selectedTags.length > 0 || searchQuery) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetFilters}
            title="Clear all filters"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Active Filters Display with fixed height - always present */}
      <div className="h-10 mt-2 overflow-y-auto">
        {(selectedFolder || selectedTags.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedFolder && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <FolderOpen size={12} />
                <span>{selectedFolder}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0 hover:bg-muted/50"
                  onClick={() => setSelectedFolder(null)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <Tag size={12} />
                <span>{tag}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0 hover:bg-muted/50"
                  onClick={() => removeTag(tag)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 