"use client";

/**
 * Notes Page
 * 
 * URL Parameters:
 * - create-note: Opens the voice note creation dialog
 * - record=true: Automatically starts recording when create-note dialog opens
 * 
 * Examples:
 * - /notes?create-note=true - Opens voice note dialog
 * - /notes?create-note=true&record=true - Opens voice note dialog and auto-starts recording
 */

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import NotesSidebar from "@/components/notes/NotesSidebar";
import NotesBoardView from "@/components/notes/NotesBoardView";
import NotesCompactView from "@/components/notes/NotesCompactView";
import CreateNoteDialog from "@/components/notes/CreateNoteDialog";
import CreateVoiceNoteDialog from "@/components/notes/CreateVoiceNoteDialog";
import NotesContent from "@/components/notes/NotesContent";
import NotesFilter from "@/components/notes/NotesFilter";
import ViewModeToggle from "@/components/notes/ViewModeToggle";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Note } from "@/types/note";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

// Component that uses useSearchParams
function NotesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCreate = searchParams.get("showCreate");
  const createNote = searchParams.get("create-note");
  const autoRecord = searchParams.get("record") === "true";
  const { animationsEnabled, notesViewMode } = useSettingsStore();
  
  // Dialogs state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isVoiceNoteDialogOpen, setIsVoiceNoteDialogOpen] = useState<boolean>(false);
  const [shouldAutoRecord, setShouldAutoRecord] = useState<boolean>(false);

  // Initialize create dialog if URL param is present
  useEffect(() => {
    if (showCreate) {
      setIsCreateDialogOpen(true);
      router.replace("/notes"); // Remove the showCreate parameter
    }
  }, [showCreate, router]);

  // Initialize voice note dialog if create-note param is present
  useEffect(() => {
    if (createNote) {
      setShouldAutoRecord(autoRecord); // Preserve the autoRecord value
      setIsVoiceNoteDialogOpen(true);
      
      // Clean up URL immediately after preserving the state
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("create-note");
      newSearchParams.delete("record");
      const newUrl = newSearchParams.toString() 
        ? `/notes?${newSearchParams.toString()}` 
        : "/notes";
      router.replace(newUrl);
    }
  }, [createNote, router, searchParams, autoRecord]);

  const handleCreateNote = useCallback((note: Note) => {
    setIsCreateDialogOpen(false);
    // Update URL with the new note ID
    router.push(`/notes?id=${note.id}`);
  }, [router]);
  
  const handleCreateVoiceNote = useCallback((note: Note) => {
    setIsVoiceNoteDialogOpen(false);
    setShouldAutoRecord(false); // Reset the auto-record state
    // Update URL with the new note ID
    router.push(`/notes?id=${note.id}`);
  }, [router]);

  // Render the appropriate view based on the selected mode
  const renderNotesView = () => {
    switch (notesViewMode) {
      case "board":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
            <motion.div
              className="lg:col-span-2 overflow-hidden h-full"
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              <NotesBoardView />
            </motion.div>
            <motion.div
              className="lg:col-span-1 overflow-hidden h-full"
              initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <NotesContent />
            </motion.div>
          </div>
        );

      case "compact":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 h-full">
            <motion.div
              className="lg:col-span-3 overflow-hidden h-full"
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              <NotesCompactView />
            </motion.div>
            <motion.div
              className="lg:col-span-2 overflow-hidden h-full"
              initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <NotesContent />
            </motion.div>
          </div>
        );
      case "list":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 h-full">
            {/* Notes list with its own scrollbar */}
            <motion.div
              className="md:col-span-1 lg:col-span-1 overflow-hidden flex flex-col h-full"
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >              
              <NotesSidebar />
            </motion.div>
            
            {/* Note content with its own scrollbar */}
            <motion.div
              className="md:col-span-2 lg:col-span-2 overflow-hidden h-full"
              initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <NotesContent />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Use a fixed height container to prevent main page scrolling */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header section with fixed height */}
          <div className="px-2 sm:px-3 py-2 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-3xl font-bold">Notes</h1>
                <p className="text-muted-foreground mt-1">
                  <TotalNotesCount />
                </p>
              </div>
              
              <div className="flex gap-2 items-center">
                <ViewModeToggle />
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>New Note</span>
                </Button>
                <Button 
                  onClick={() => setIsVoiceNoteDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Voice Note</span>
                </Button>
              </div>
            </div>
            
            {/* Show filters for non-list views */}
            {notesViewMode !== "list" && (
              <div className="mb-2">
                <NotesFilter />
              </div>
            )}
          </div>
          
          {/* Content section with flex-grow to fill remaining space */}
          <div className="px-2 sm:px-3 flex-grow overflow-hidden">
            {renderNotesView()}
          </div>
          
          {/* Dialogs */}
          <CreateNoteDialog 
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSave={handleCreateNote}
          />
          
          <CreateVoiceNoteDialog
            isOpen={isVoiceNoteDialogOpen}
            onClose={() => {
              setIsVoiceNoteDialogOpen(false);
              setShouldAutoRecord(false); // Reset when manually closed
            }}
            onSave={handleCreateVoiceNote}
            autoRecord={shouldAutoRecord}
          />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

// Loading fallback
function LoadingNotes() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading notes...</p>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<LoadingNotes />}>
      <NotesPageContent />
    </Suspense>
  );
}

// Small component to display total notes count
function TotalNotesCount() {
  const { totalNotes } = useNotes();
  return <>{totalNotes || 0} notes total</>;
} 