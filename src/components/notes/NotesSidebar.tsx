"use client";

import { useState, memo, useRef, useEffect, useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useFilterStore } from "@/store/filterStore";
import { 
  Tag, 
  Search, 
  SortAsc, 
  SortDesc, 
  X, 
  Check,
  FolderOpen
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import NotesList from "@/components/notes/NotesList";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants for elements
const fadeInVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 5, transition: { duration: 0.1 } }
};

const popInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { 
      duration: 0.15, 
      ease: "easeIn" 
    } 
  }
};

// Custom AnimatePresence wrapper for Popover and DropdownMenu
interface AnimatedPopoverContentProps extends React.ComponentProps<typeof PopoverContent> {
  children: React.ReactNode;
  open: boolean;
}

const AnimatedPopoverContent = ({ children, open, ...props }: AnimatedPopoverContentProps) => (
  <AnimatePresence>
    {open && (
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={popInVariants}
      >
        <PopoverContent {...props}>
          {children}
        </PopoverContent>
      </motion.div>
    )}
  </AnimatePresence>
);

interface AnimatedDropdownContentProps extends React.ComponentProps<typeof DropdownMenuContent> {
  children: React.ReactNode;
  open: boolean;
}

const AnimatedDropdownContent = ({ children, open, ...props }: AnimatedDropdownContentProps) => (
  <AnimatePresence>
    {open && (
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={popInVariants}
      >
        <DropdownMenuContent {...props}>
          {children}
        </DropdownMenuContent>
      </motion.div>
    )}
  </AnimatePresence>
);

// Memoized search input component to prevent re-renders with debounce
const SearchInput = memo(({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for debounce
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300); // 300ms debounce
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search notes..."
        className="pl-8"
        value={inputValue}
        onChange={handleChange}
      />
    </motion.div>
  );
});
SearchInput.displayName = "SearchInput";

// Memoized active filters display
const ActiveFilters = memo(() => {
  const { selectedFolder, selectedTags, setSelectedFolder, removeTag } = useFilterStore();
  
  if (!selectedFolder && selectedTags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5">
      <AnimatePresence>
        {selectedFolder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Badge variant="secondary" className="flex items-center gap-1 py-0.5">
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
          </motion.div>
        )}
        
        {selectedTags.map((tag) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Badge variant="secondary" className="flex items-center gap-1 py-0.5">
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
ActiveFilters.displayName = "ActiveFilters";

// Memoized filter controls component
const FilterControls = memo(() => {
  const { folders } = useNotes();
  const { 
    selectedFolder, 
    selectedTags, 
    sortBy, 
    sortOrder,
    setSelectedFolder,
    toggleTag,
    setSelectedTags,
    setSortBy,
    setSortOrder,
    resetFilters
  } = useFilterStore();

  const [folderSearchTerm, setFolderSearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [folderPopoverOpen, setFolderPopoverOpen] = useState(false);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get unique tags
  const { tags } = useNotes();
  const uniqueTags = useMemo(() => {
    return [...new Set(
      tags.flatMap(tag => tag.split(',').map(t => t.trim())).filter(Boolean)
    )];
  }, [tags]);

  // Filter folders and tags based on search term
  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(folderSearchTerm.toLowerCase())
  );
  
  const filteredTags = uniqueTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  // Format sort by label
  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "created_at": return "Created";
      case "updated_at": return "Updated";
      case "title": return "Title";
      default: return "Updated";
    }
  };

  const hasActiveFilters = !!selectedFolder || selectedTags.length > 0;

  return (
    <motion.div 
      className="flex flex-col gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-2">
        {/* Folder Selector */}
        <Popover open={folderPopoverOpen} onOpenChange={setFolderPopoverOpen}>
          <PopoverTrigger asChild>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button 
                variant={selectedFolder ? "default" : "outline"} 
                size="sm"
                className="gap-1 flex-1"
                aria-expanded={folderPopoverOpen}
              >
                <FolderOpen size={16} />
                <span className="truncate">
                  {selectedFolder ? `${selectedFolder}` : "Folders"}
                </span>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <AnimatedPopoverContent className="p-2 w-64" align="start" open={folderPopoverOpen}>
            <div className="space-y-2">
              <Input 
                placeholder="Search folders..." 
                value={folderSearchTerm}
                onChange={(e) => setFolderSearchTerm(e.target.value)}
                className="mb-2"
              />
              
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                <AnimatePresence>
                  {filteredFolders.length === 0 && folderSearchTerm ? (
                    <motion.div 
                      initial={fadeInVariants.hidden}
                      animate={fadeInVariants.visible}
                      exit={fadeInVariants.exit}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No folders found
                    </motion.div>
                  ) : (
                    <div className="py-1">
                      <motion.button
                        initial={fadeInVariants.hidden}
                        animate={fadeInVariants.visible}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setSelectedFolder(null);
                          setFolderPopoverOpen(false);
                        }}
                      >
                        <span>All Folders</span>
                        {!selectedFolder && <Check size={16} />}
                      </motion.button>
                      
                      {filteredFolders.map((folder, index) => (
                        <motion.button
                          key={folder}
                          initial={fadeInVariants.hidden}
                          animate={fadeInVariants.visible}
                          transition={{ delay: index * 0.02 }}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => {
                            setSelectedFolder(folder);
                            setFolderPopoverOpen(false);
                          }}
                        >
                          <span>{folder}</span>
                          {selectedFolder === folder && <Check size={16} />}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimatedPopoverContent>
        </Popover>

        {/* Tag Selector */}
        <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button 
                variant={selectedTags.length > 0 ? "default" : "outline"}
                size="sm" 
                className="gap-1 flex-1"
                aria-expanded={tagPopoverOpen}
              >
                <Tag size={16} />
                <span className="truncate">
                  {selectedTags.length > 0 
                    ? selectedTags.length === 1 
                      ? `${selectedTags[0]}` 
                      : `Tags: ${selectedTags.length}` 
                    : "Tags"}
                </span>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <AnimatedPopoverContent className="p-2 w-64" align="start" open={tagPopoverOpen}>
            <div className="space-y-2">
              <Input 
                placeholder="Search tags..." 
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                className="mb-2"
              />
              
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                <AnimatePresence>
                  {filteredTags.length === 0 && tagSearchTerm ? (
                    <motion.div 
                      initial={fadeInVariants.hidden}
                      animate={fadeInVariants.visible}
                      exit={fadeInVariants.exit}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No tags found
                    </motion.div>
                  ) : (
                    <div className="py-1">
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        Select multiple tags (AND filter)
                      </div>
                      <motion.button
                        initial={fadeInVariants.hidden}
                        animate={fadeInVariants.visible}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setSelectedTags([]);
                          setTagPopoverOpen(false);
                        }}
                      >
                        <span>All Tags</span>
                        {selectedTags.length === 0 && <Check size={16} />}
                      </motion.button>
                      
                      {filteredTags.map((tag, index) => (
                        <motion.button
                          key={tag}
                          initial={fadeInVariants.hidden}
                          animate={fadeInVariants.visible}
                          transition={{ delay: index * 0.02 }}
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
                        </motion.button>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              {selectedTags.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end mt-2"
                >
                  <Button 
                    size="sm" 
                    onClick={() => setTagPopoverOpen(false)}
                  >
                    Apply {selectedTags.length > 0 && `(${selectedTags.length})`}
                  </Button>
                </motion.div>
              )}
            </div>
          </AnimatedPopoverContent>
        </Popover>

        {/* Sort Options */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-1.5" /> : <SortDesc className="h-4 w-4 mr-1.5" />}
                {getSortLabel(sortBy)}
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <AnimatedDropdownContent align="end" open={dropdownOpen}>
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="updated_at">
                Last Updated
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at">
                Created Date
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title">
                Title
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value: string) => setSortOrder(value as "asc" | "desc")}>
              <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </AnimatedDropdownContent>
        </DropdownMenu>

        {/* Reset Filters Button - only show if any filter is active */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={resetFilters}
                title="Clear all filters"
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
FilterControls.displayName = "FilterControls";

// Memoized pagination component
const Pagination = memo(() => {
  const { page, limit, setPage } = useFilterStore();
  const { totalNotes, notes } = useNotes();
  
  return (
    <motion.div 
      className="flex justify-between items-center py-2 px-3 border-t flex-shrink-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="text-sm text-muted-foreground">
        {notes.length} of {totalNotes}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button 
          variant="outline"
          size="sm" 
          disabled={page * limit >= totalNotes} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
});
Pagination.displayName = "Pagination";

// The main component that uses the memoized components
const NotesSidebar = memo(function NotesSidebar() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { isLoading } = useNotes();

  return (
    <Card className="h-full border-muted flex flex-col will-change-transform transform-gpu">
      <CardHeader className="px-3 py-3 pb-2 space-y-3 flex-shrink-0">
        {/* Search Input - Memoized */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        {/* Filter controls - Updated with new component */}
        <FilterControls />
        
        {/* Active Filters Display - Memoized */}
        <ActiveFilters />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 relative isolation-auto">
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-grow px-3 pt-2">
            {/* Notes List */}
            <div className="space-y-3 pr-2">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Skeleton className="h-20 w-full rounded-md" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <NotesList />
              )}
            </div>
          </ScrollArea>
          
          {/* Pagination controls - Memoized */}
          <Pagination />
        </div>
      </CardContent>
    </Card>
  );
});
NotesSidebar.displayName = "NotesSidebar";

export default NotesSidebar; 