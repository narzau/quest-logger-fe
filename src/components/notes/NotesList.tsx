"use client";

import { memo, useCallback, useMemo } from "react";
import { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import { Folder, Tag, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/useNotes";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
import { motion, AnimatePresence } from "framer-motion";

// Individual note item component - memoized to prevent re-renders
const NoteItem = memo(({ note }: { note: Note }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedNoteId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;
  
  // Helper to get tag count from comma-separated string (excluding hidden tags)
  const getTagCount = useCallback((tagsString?: string) => {
    if (!tagsString) return 0;
    return tagsString.split(',')
      .map(t => t.trim())
      .filter(t => t && !t.startsWith('_')).length;
  }, []);

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    router.push(`/notes?id=${note.id}`);
  }, [router, note.id]);
  
  // Memoize the class names to prevent recalculating on every render
  const className = useMemo(() => {
    return cn(
      "border rounded-lg p-3 cursor-pointer hover:bg-accent/20 transition-colors",
      note.has_audio && "border-l-4 border-l-blue-500",
      selectedNoteId === note.id && "bg-accent/40"
    );
  }, [note.has_audio, selectedNoteId, note.id]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className} 
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg truncate">{note.title}</h3>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
        {note.content || (note.transcription || "No content")}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span>{formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</span>
        
        {/* Add metadata icons row for desktop/tablet */}
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          {note.folder && (
            <div className="flex items-center" title={`Folder: ${note.folder}`}>
              <Folder size={18} className="text-accent/80" />
            </div>
          )}
          
          {note.tags && (
            <div className="flex items-center" title={`Tags: ${note.tags}`}>
              <Tag size={18} className="text-accent/80" />
              <span className="ml-1 text-accent/80">{getTagCount(note.tags)}</span>
            </div>
          )}
          
          {note.has_audio && (
            <div title="Voice Note">
              <Mic size={12} className="text-blue-500" />
            </div>
          )}
        </div>
        
        {/* For mobile: show more condensed indicators */}
        <div className="flex sm:hidden items-center gap-2 ml-auto">
          {note.folder && <Folder size={12} />}
          {note.tags && (
            <div className="flex items-center">
              <Tag size={12} />
              <span className="ml-0.5">{getTagCount(note.tags)}</span>
            </div>
          )}
          {note.has_audio && <Mic size={12} className="text-blue-500" />}
        </div>
      </div>
    </motion.div>
  );
});
NoteItem.displayName = "NoteItem";

// Memoized list component to reduce re-renders
const NotesList = memo(function NotesList() {
  const { 
    searchQuery,
    selectedFolder,
    selectedTags,
    sortBy,
    sortOrder,
    page,
    limit,
    showArchived
  } = useFilterStore();
  
  // Calculate skip for pagination
  const skip = useMemo(() => (page - 1) * limit, [page, limit]);
  
  // Build query parameters from filter state
  const queryParams = useMemo(() => {
    // Handle archived notes through tags
    // When showArchived is false, we'll filter results client-side to exclude archived
    const tagsToFilter = [...selectedTags];
    
    return {
      skip,
      limit,
      folder: selectedFolder || undefined,
      tag: tagsToFilter.length > 0 ? tagsToFilter.join(',') : undefined,
      search: searchQuery || undefined,
      sortBy,
      sortOrder
    };
  }, [skip, limit, selectedFolder, selectedTags, searchQuery, sortBy, sortOrder]);
  
  // Use the query parameters when calling useNotes
  const { notes: allNotes } = useNotes(queryParams);
  
  // Filter out archived notes if not showing archived
  const notes = useMemo(() => {
    if (showArchived) {
      return allNotes;
    }
    // Filter out notes that have the _archived tag
    return allNotes.filter(note => !note.tags?.includes('_archived'));
  }, [allNotes, showArchived]);

  // Handle error case (convert error object to string)
  if (notes === undefined) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 border border-destructive rounded-lg text-center"
      >
        <p className="text-destructive">Failed to load notes</p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 border rounded-lg text-center"
      >
        <p className="text-muted-foreground">No notes found</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default NotesList; 