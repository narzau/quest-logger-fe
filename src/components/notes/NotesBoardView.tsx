"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
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
  Plus,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface NoteBoardCardProps {
  note: Note;
  onSelect: (noteId: number) => void;
  isSelected: boolean;
  isDragging?: boolean;
}

const NoteBoardCard = ({ note, onSelect, isSelected, isDragging = false }: NoteBoardCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleClick = useCallback(() => {
    // Don't select if we're dragging
    if (!isSortableDragging) {
      onSelect(note.id);
    }
  }, [onSelect, note.id, isSortableDragging]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className={cn(
        "border rounded-lg p-3 cursor-pointer transition-all bg-card hover:shadow-md",
        note.has_audio && "border-l-4 border-l-blue-500",
        isSelected && "ring-2 ring-primary shadow-lg",
        isDragging && "opacity-50"
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
  onHideFolder?: (folder: string) => void;
  isUncategorized?: boolean;
  width?: number;
  onResize?: (newWidth: number) => void;
}

const BoardColumn = ({ 
  title, 
  notes, 
  onSelectNote, 
  selectedNoteId,
  onCreateNote,
  onHideFolder,
  isUncategorized,
  width = 300,
  onResize
}: BoardColumnProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const folderId = isUncategorized ? '__uncategorized__' : title;
  
  const { setNodeRef } = useDroppable({
    id: `folder-${folderId}`,
  });

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(250, Math.min(600, startWidth + e.clientX - startX));
      if (onResize) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width, onResize]);

  return (
    <div 
      ref={(node) => {
        columnRef.current = node;
        setNodeRef(node);
      }}
      className="flex flex-col h-full relative"
      style={{ width: `${width}px` }}
    >
      <div className="flex-1 overflow-hidden">
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
          <div className="flex items-center gap-1">
            {onHideFolder && !isUncategorized && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onHideFolder(title)}
                title="Hide this folder"
              >
                <EyeOff size={14} />
              </Button>
            )}
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
      
      {/* Resize handle */}
      {onResize && (
        <div
          className={cn(
            "absolute top-0 right-0 w-3 h-full cursor-col-resize transition-all",
            "hover:bg-primary/10",
            isResizing && "bg-primary/20"
          )}
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default function NotesBoardView() {
  const router = useRouter();
  const { 
    searchQuery,
    selectedFolders,
    selectedTags,
    sortBy,
    sortOrder,
    showArchived,
    setSelectedFolders,
    removeFolder
  } = useFilterStore();
  
  const { notes: allNotes, folders, isLoading, updateNote } = useNotes({
    search: searchQuery || undefined,
    folder: undefined, // We'll handle folder filtering in the component
    tag: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
    sortBy,
    sortOrder,
    limit: 100 // Load more notes for board view
  });

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store local note positions for optimistic updates
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    // Only update if the notes have actually changed
    if (JSON.stringify(localNotes) !== JSON.stringify(allNotes)) {
      setLocalNotes(allNotes);
    }
  }, [allNotes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter out archived notes if not showing archived
  const notes = useMemo(() => {
    let filteredNotes = localNotes;
    
    // Filter by archived status
    if (!showArchived) {
      filteredNotes = filteredNotes.filter(note => !note.tags?.includes('_archived'));
    }
    
    // Filter by folders (AND logic - note must be in ALL selected folders)
    // Since a note can only be in one folder, AND logic means we only show notes
    // if only one folder is selected
    if (selectedFolders.length > 0) {
      filteredNotes = filteredNotes.filter(note => {
        const noteFolder = note.folder || '__uncategorized__';
        return selectedFolders.includes(noteFolder === '__uncategorized__' ? 'Uncategorized' : noteFolder);
      });
    }
    
    return filteredNotes;
  }, [localNotes, showArchived, selectedFolders]);

  // Drag and drop state
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeNote = useMemo(() => 
    notes.find(note => note.id === activeId),
    [notes, activeId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Column widths state with localStorage persistence
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kanban-column-widths');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Save column widths to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanban-column-widths', JSON.stringify(columnWidths));
    }
  }, [columnWidths]);

  const handleColumnResize = useCallback((folder: string, newWidth: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [folder]: newWidth
    }));
  }, []);

  // Group notes by folder
  const notesByFolder = useMemo(() => {
    const grouped = new Map<string, Note[]>();
    
    // If folders are selected, only show those folders
    if (selectedFolders.length > 0) {
      selectedFolders.forEach(folder => {
        const key = folder === 'Uncategorized' ? '__uncategorized__' : folder;
        grouped.set(key, []);
      });
    } else {
      // Show all folders
      folders.forEach(folder => {
        grouped.set(folder, []);
      });
      
      // Add uncategorized
      grouped.set('__uncategorized__', []);
    }
    
    // Group notes
    notes.forEach(note => {
      const folder = note.folder || '__uncategorized__';
      
      if (grouped.has(folder)) {
        const existing = grouped.get(folder) || [];
        grouped.set(folder, [...existing, note]);
      }
    });
    
    // Remove empty uncategorized if no notes
    if (grouped.get('__uncategorized__')?.length === 0 && selectedFolders.length === 0) {
      grouped.delete('__uncategorized__');
    }
    
    return grouped;
  }, [notes, folders, selectedFolders]);

  // Get selected note ID from URL
  const selectedNoteId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      return id ? parseInt(id) : null;
    }
    return null;
  }, []);

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

  const handleHideFolder = useCallback((folder: string) => {
    // If no folders are selected, we want to show all except this one
    // This means selecting all other folders
    if (selectedFolders.length === 0) {
      const allFoldersExceptThis = folders.filter(f => f !== folder);
      
      // Check if we have uncategorized notes and we're not hiding uncategorized
      const hasUncategorized = Array.from(notesByFolder.keys()).includes('__uncategorized__');
      if (hasUncategorized && folder !== 'Uncategorized') {
        allFoldersExceptThis.push('Uncategorized');
      }
      
      // Set all folders except the one to hide
      setSelectedFolders(allFoldersExceptThis);
    } else {
      // If folders are selected, remove this one
      removeFolder(folder === '__uncategorized__' ? 'Uncategorized' : folder);
    }
  }, [selectedFolders, folders, setSelectedFolders, removeFolder, notesByFolder]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeNoteId = active.id as number;
    const overId = over.id;
    
    // Check if it's a folder drop zone
    if (typeof overId === 'string' && overId.startsWith('folder-')) {
      const targetFolder = overId.replace('folder-', '');
      const note = notes.find(n => n.id === activeNoteId);
      
      if (note && note.folder !== targetFolder) {
        const actualFolder = targetFolder === '__uncategorized__' ? '' : targetFolder;
        
        // Optimistic update
        setLocalNotes(prev => prev.map(n => 
          n.id === activeNoteId 
            ? { ...n, folder: actualFolder || undefined }
            : n
        ));
        
        // Server update
        updateNote({ 
          noteId: activeNoteId, 
          data: { folder: actualFolder || undefined } 
        });
      }
    } else if (typeof overId === 'number') {
      // Reordering within the same folder
      const overNote = notes.find(n => n.id === overId);
      const activeNote = notes.find(n => n.id === activeNoteId);
      
      if (overNote && activeNote && overNote.folder === activeNote.folder) {
        // Get all notes in this folder
        const folderNotes = notes.filter(n => n.folder === activeNote.folder);
        const oldIndex = folderNotes.findIndex(n => n.id === activeNoteId);
        const newIndex = folderNotes.findIndex(n => n.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          // Reorder the notes
          const reorderedNotes = arrayMove(folderNotes, oldIndex, newIndex);
          
          // Update local state for immediate feedback
          setLocalNotes(prev => {
            const otherNotes = prev.filter(n => n.folder !== activeNote.folder);
            return [...otherNotes, ...reorderedNotes];
          });
          
          // Here you would typically update the order on the server
          // Since the API doesn't support ordering, we'll just keep it local
        }
      }
    }
    
    setActiveId(null);
  };

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={cn(
          "h-full p-4",
          isMobile ? "overflow-y-auto" : "flex gap-4 overflow-x-auto"
        )}>
          <AnimatePresence>
            {/* On mobile, show folders vertically */}
            {isMobile ? (
              <div className="space-y-4">
                {/* Uncategorized notes */}
                {(notesByFolder.get('__uncategorized__')?.length ?? 0) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        <Folder size={16} className="text-muted-foreground opacity-50" />
                        Uncategorized
                        <Badge variant="secondary" className="text-xs">
                          {notesByFolder.get('__uncategorized__')?.length || 0}
                        </Badge>
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {notesByFolder.get('__uncategorized__')?.map((note) => (
                        <NoteBoardCard
                          key={note.id}
                          note={note}
                          onSelect={handleSelectNote}
                          isSelected={selectedNoteId === note.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Folder sections */}
                {Array.from(notesByFolder.entries())
                  .filter(([folder]) => folder !== '__uncategorized__')
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([folder, folderNotes]) => (
                    <motion.div
                      key={folder}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2">
                          <Folder size={16} className="text-muted-foreground" />
                          {folder}
                          <Badge variant="secondary" className="text-xs">
                            {folderNotes.length}
                          </Badge>
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {folderNotes.map((note) => (
                          <NoteBoardCard
                            key={note.id}
                            note={note}
                            onSelect={handleSelectNote}
                            isSelected={selectedNoteId === note.id}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              // Desktop view with columns
              <>
                {/* Uncategorized notes column */}
                {(notesByFolder.get('__uncategorized__')?.length ?? 0) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SortableContext
                      items={notesByFolder.get('__uncategorized__')?.map(n => n.id) || []}
                      strategy={verticalListSortingStrategy}
                      id="folder-__uncategorized__"
                    >
                      <BoardColumn
                        title="Uncategorized"
                        notes={notesByFolder.get('__uncategorized__') || []}
                        onSelectNote={handleSelectNote}
                        selectedNoteId={selectedNoteId}
                        onCreateNote={handleCreateNote}
                        onHideFolder={handleHideFolder}
                        isUncategorized
                        width={columnWidths['__uncategorized__'] || 300}
                        onResize={(width) => handleColumnResize('__uncategorized__', width)}
                      />
                    </SortableContext>
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
                      <SortableContext
                        items={folderNotes.map(n => n.id)}
                        strategy={verticalListSortingStrategy}
                        id={`folder-${folder}`}
                      >
                        <BoardColumn
                          title={folder}
                          notes={folderNotes}
                          onSelectNote={handleSelectNote}
                          selectedNoteId={selectedNoteId}
                          onCreateNote={handleCreateNote}
                          onHideFolder={handleHideFolder}
                          width={columnWidths[folder] || 300}
                          onResize={(width) => handleColumnResize(folder, width)}
                        />
                      </SortableContext>
                    </motion.div>
                  ))}
              </>
            )}
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
        
        <DragOverlay>
          {activeNote ? (
            <div className="border rounded-lg p-3 bg-card shadow-lg">
              <h4 className="font-medium text-sm">{activeNote.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
} 