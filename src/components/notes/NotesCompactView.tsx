"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { useFilterStore } from "@/store/filterStore";
import { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Folder, 
  Tag, 
  Mic, 
  FileText,
  ChevronRight,
  GripVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCompactNoteItemProps {
  note: Note;
  isSelected: boolean;
  index: number;
}

const SortableCompactNoteItem = ({ note, isSelected, index }: SortableCompactNoteItemProps) => {
  const router = useRouter();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleClick = useCallback(() => {
    router.push(`/notes?id=${note.id}`);
  }, [router, note.id]);

  // Get tag array (excluding hidden tags like _archived)
  const tags = useMemo(() => {
    return note.tags 
      ? note.tags.split(',')
          .map(t => t.trim())
          .filter(t => t && !t.startsWith('_')) // Filter out hidden tags
      : [];
  }, [note.tags]);

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ 
          duration: 0.2,
          delay: index * 0.01
        }}
      >
        <div
          className={cn(
            "group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all relative",
            "hover:bg-accent/20 border-b last:border-b-0",
            note.has_audio && "border-l-4 border-l-blue-500",
            isSelected && "bg-accent/40"
          )}
        >
          {/* Drag handle - minimal width */}
          <div 
            className="w-6 flex items-center justify-center cursor-grab text-muted-foreground hover:text-foreground -ml-2"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={12} />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 w-10 justify-center flex-shrink-0">
            {note.has_audio && <Mic size={14} className="text-blue-500" />}
            {note.content && <FileText size={14} className="text-muted-foreground" />}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0" onClick={handleClick}>
            <h4 className="font-medium text-sm truncate">{note.title}</h4>
          </div>

          {/* Folder */}
          <div className="w-32 text-sm text-muted-foreground flex-shrink-0" onClick={handleClick}>
            {note.folder ? (
              <div className="flex items-center gap-1.5 truncate">
                <Folder size={14} className="flex-shrink-0" />
                <span className="truncate">{note.folder}</span>
              </div>
            ) : (
              <span className="text-muted-foreground/50">—</span>
            )}
          </div>
          
          {/* Tags */}
          <div className="w-28 text-sm flex-shrink-0" onClick={handleClick}>
            {tags.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <Tag size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground truncate">
                  {tags.length === 1 ? tags[0] : `${tags.length} tags`}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground/50">—</span>
            )}
          </div>
          
          {/* Time */}
          <div className="w-20 text-sm text-muted-foreground text-right flex-shrink-0" onClick={handleClick}>
            {formatDistanceToNow(new Date(note.updated_at), { 
              addSuffix: false,
              includeSeconds: false
            })}
          </div>

          {/* Hover indicator */}
          <ChevronRight 
            size={16} 
            className="absolute right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default function NotesCompactView() {
  const searchParams = useSearchParams();
  const selectedNoteId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;
  
  const { 
    searchQuery,
    selectedFolder,
    selectedTags,
    sortBy,
    sortOrder,
    page,
    setPage,
    showArchived
  } = useFilterStore();
  
  const { notes: allFetchedNotes, totalNotes, isLoading } = useNotes({
    search: searchQuery || undefined,
    folder: selectedFolder || undefined,
    tag: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
    sortBy,
    sortOrder,
    skip: (page - 1) * 50, // 50 items per page for compact view
    limit: 50
  });

  // Filter out archived notes if not showing archived
  const fetchedNotes = useMemo(() => {
    if (showArchived) {
      return allFetchedNotes;
    }
    return allFetchedNotes.filter(note => !note.tags?.includes('_archived'));
  }, [allFetchedNotes, showArchived]);

  // Local state for managing drag and drop order
  const [notes, setNotes] = useState<Note[]>([]);
  const noteOrderRef = useRef<number[]>([]);
  const initialLoadRef = useRef(true);

  // Update notes when fetched data changes
  useMemo(() => {
    if (initialLoadRef.current && fetchedNotes.length > 0) {
      // First load: use fetched order
      setNotes(fetchedNotes);
      noteOrderRef.current = fetchedNotes.map(note => note.id);
      initialLoadRef.current = false;
    } else if (fetchedNotes.length > 0) {
      // Subsequent loads: maintain custom order
      const currentIds = noteOrderRef.current;
      const noteMap = new Map(fetchedNotes.map(note => [note.id, note]));
      
      // Preserve existing order
      const orderedNotes = currentIds
        .filter(id => noteMap.has(id))
        .map(id => noteMap.get(id)!);
      
      // Add new notes at the beginning
      const newNotes = fetchedNotes.filter(note => !currentIds.includes(note.id));
      if (newNotes.length > 0) {
        orderedNotes.unshift(...newNotes);
        noteOrderRef.current = orderedNotes.map(note => note.id);
      }
      
      setNotes(orderedNotes);
    }
  }, [fetchedNotes]);

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setNotes((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update the order reference
      noteOrderRef.current = newItems.map(note => note.id);
      
      // TODO: Persist order to backend if needed
      // You could add an API call here to save the custom order
      
      return newItems;
    });
  };

  const totalPages = Math.ceil(totalNotes / 50);

  if (isLoading) {
    return (
      <Card className="h-full border-muted">
        <div className="space-y-0">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="px-4 py-2 border-b">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card className="h-full border-muted flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">No notes found</p>
          <Button onClick={() => window.location.href = '/notes?showCreate=true'}>
            Create your first note
          </Button>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-muted flex flex-col">
      {/* Header with column labels */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-muted/30 text-xs text-muted-foreground font-medium sticky top-0 z-10">
        <div className="w-6 -ml-2"></div>
        <div className="w-10 text-center">Type</div>
        <div className="flex-1">Title</div>
        <div className="w-32">Folder</div>
        <div className="w-28">Tags</div>
        <div className="w-20 text-right">Updated</div>
      </div>

      {/* Notes list with drag and drop */}
      <ScrollArea className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notes.map(note => note.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="divide-y">
              <AnimatePresence mode="popLayout">
                {notes.map((note, index) => (
                  <SortableCompactNoteItem
                    key={note.id}
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * 50) + 1}-{Math.min(page * 50, totalNotes)} of {totalNotes} notes
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm px-3">
              Page {page} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 