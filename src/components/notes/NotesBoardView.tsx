"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { useFilterStore } from "@/store/filterStore";
import { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  Mic, 
  FileText,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteBoardCardProps {
  note: Note;
  onSelect: (noteId: number) => void;
  isSelected: boolean;
}

const NoteBoardCard = ({ note, onSelect, isSelected }: NoteBoardCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(note.id);
  }, [onSelect, note.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className={cn(
        "border rounded-lg p-3 cursor-pointer transition-all bg-card hover:shadow-md",
        note.has_audio && "border-l-4 border-l-blue-500",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm line-clamp-2 flex-1">{note.title}</h4>
        <div className="flex items-center gap-1 flex-shrink-0">
          {note.has_audio && <Mic size={14} className="text-blue-500" />}
          {note.content && <FileText size={14} className="text-muted-foreground" />}
        </div>
      </div>
      
      {(note.content || note.transcription) && (
        <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
          {note.content || note.transcription}
        </p>
      )}

      {note.tags && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.split(',').slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
              {tag.trim()}
            </Badge>
          ))}
          {note.tags.split(',').length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{note.tags.split(',').length - 3}
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
      </div>
    </motion.div>
  );
};

interface BoardColumnProps {
  title: string;
  notes: Note[];
  onSelectNote: (noteId: number) => void;
  selectedNoteId: number | null;
  onCreateNote?: (folder?: string) => void;
  isUncategorized?: boolean;
}

const BoardColumn = ({ 
  title, 
  notes, 
  onSelectNote, 
  selectedNoteId,
  onCreateNote,
  isUncategorized 
}: BoardColumnProps) => {
  return (
    <div className="flex flex-col h-full min-w-[300px] max-w-[400px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Folder size={16} className={cn(
            "text-muted-foreground",
            isUncategorized && "opacity-50"
          )} />
          <h3 className="font-medium text-sm">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {notes.length}
          </Badge>
        </div>
        {onCreateNote && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onCreateNote(isUncategorized ? undefined : title)}
          >
            <Plus size={14} />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <NoteBoardCard
                key={note.id}
                note={note}
                onSelect={onSelectNote}
                isSelected={selectedNoteId === note.id}
              />
            ))}
          </AnimatePresence>
          
          {notes.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              No notes in this folder
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default function NotesBoardView() {
  const router = useRouter();
  const { 
    searchQuery,
    selectedFolder,
    selectedTags,
    sortBy,
    sortOrder,
    showArchived
  } = useFilterStore();
  
  const { notes: allNotes, folders, isLoading } = useNotes({
    search: searchQuery || undefined,
    folder: selectedFolder || undefined,
    tag: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
    sortBy,
    sortOrder,
    limit: 100 // Load more notes for board view
  });

  // Filter out archived notes if not showing archived
  const notes = useMemo(() => {
    if (showArchived) {
      return allNotes;
    }
    return allNotes.filter(note => !note.tags?.includes('_archived'));
  }, [allNotes, showArchived]);

  // Get selected note ID from URL
  const selectedNoteId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      return id ? parseInt(id) : null;
    }
    return null;
  }, []);

  // Group notes by folder
  const notesByFolder = useMemo(() => {
    const grouped = new Map<string, Note[]>();
    
    // Initialize with all folders
    folders.forEach(folder => {
      grouped.set(folder, []);
    });
    
    // Add uncategorized
    grouped.set('__uncategorized__', []);
    
    // Group notes
    notes.forEach(note => {
      const folder = note.folder || '__uncategorized__';
      const existing = grouped.get(folder) || [];
      grouped.set(folder, [...existing, note]);
    });
    
    return grouped;
  }, [notes, folders]);

  const handleSelectNote = useCallback((noteId: number) => {
    router.push(`/notes?id=${noteId}`);
  }, [router]);

  const handleCreateNote = useCallback((folder?: string) => {
    // This would open the create note dialog with the folder pre-selected
    const params = new URLSearchParams();
    params.set('showCreate', 'true');
    if (folder) params.set('folder', folder);
    router.push(`/notes?${params.toString()}`);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex gap-4 h-full p-4 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[300px] space-y-2">
            <Skeleton className="h-8 w-32 mb-3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="h-full border-muted">
      <div className="flex gap-4 h-full p-4 overflow-x-auto">
        <AnimatePresence>
          {/* Uncategorized notes column */}
          {(notesByFolder.get('__uncategorized__')?.length ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BoardColumn
                title="Uncategorized"
                notes={notesByFolder.get('__uncategorized__') || []}
                onSelectNote={handleSelectNote}
                selectedNoteId={selectedNoteId}
                onCreateNote={handleCreateNote}
                isUncategorized
              />
            </motion.div>
          )}
          
          {/* Folder columns */}
          {Array.from(notesByFolder.entries())
            .filter(([folder]) => folder !== '__uncategorized__')
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([folder, folderNotes], index) => (
              <motion.div
                key={folder}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BoardColumn
                  title={folder}
                  notes={folderNotes}
                  onSelectNote={handleSelectNote}
                  selectedNoteId={selectedNoteId}
                  onCreateNote={handleCreateNote}
                />
              </motion.div>
            ))}
        </AnimatePresence>
        
        {/* Empty state */}
        {notes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No notes found</p>
              <Button onClick={() => handleCreateNote()}>
                Create your first note
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
} 