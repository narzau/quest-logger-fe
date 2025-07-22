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
import { Plus, Loader2, PanelRightOpen } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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
  const [isContentCollapsed, setIsContentCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Use a ref to track if we're manually collapsing
  const isManuallyCollapsing = useRef(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get selected note ID from URL
  const selectedNoteId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;

  // Auto-expand content when a note is selected, but not on mobile or when manually collapsing
  useEffect(() => {
    if (selectedNoteId && isContentCollapsed && !isMobile && !isManuallyCollapsing.current) {
      setIsContentCollapsed(false);
    }
    // Reset the manual collapsing flag after URL changes
    if (!selectedNoteId) {
      isManuallyCollapsing.current = false;
    }
  }, [selectedNoteId, isContentCollapsed, isMobile]);

  const handleToggleCollapse = useCallback(() => {
    if (!isContentCollapsed) {
      // Mark that we're manually collapsing
      isManuallyCollapsing.current = true;
      // Set collapsed state
      setIsContentCollapsed(true);
      // Clear the note ID from URL
      router.push('/notes');
    } else {
      // When expanding, just update the state
      setIsContentCollapsed(false);
    }
  }, [isContentCollapsed, router]);

  const handleMobileBack = useCallback(() => {
    router.push('/notes');
  }, [router]);

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
    // On mobile, show either the list or the content, not both
    if (isMobile && selectedNoteId) {
      return (
        <motion.div
          className="h-full"
          initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
          animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.3 }}
        >
          <NotesContent onToggleCollapse={handleMobileBack} />
        </motion.div>
      );
    }

    switch (notesViewMode) {
      case "board":
        return (
          <div className={cn(
            "h-full",
            isMobile ? "" : "grid grid-cols-1 lg:grid-cols-3 gap-2"
          )}>
            <motion.div
              className={cn(
                "overflow-hidden h-full transition-all duration-300",
                !isMobile && (isContentCollapsed ? "lg:col-span-3" : "lg:col-span-2")
              )}
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              <NotesBoardView />
            </motion.div>
            {!isMobile && !isContentCollapsed && (
              <motion.div
                className="overflow-hidden h-full transition-all duration-300 lg:col-span-1"
                initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
                animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <NotesContent onToggleCollapse={handleToggleCollapse} />
              </motion.div>
            )}
          </div>
        );

      case "compact":
        return (
          <div className={cn(
            "h-full",
            isMobile ? "" : "grid grid-cols-1 lg:grid-cols-5 gap-2"
          )}>
            <motion.div
              className={cn(
                "overflow-hidden h-full transition-all duration-300",
                !isMobile && (isContentCollapsed ? "lg:col-span-5" : "lg:col-span-3")
              )}
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              <NotesCompactView />
            </motion.div>
            {!isMobile && !isContentCollapsed && (
              <motion.div
                className="overflow-hidden h-full transition-all duration-300 lg:col-span-2"
                initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
                animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <NotesContent onToggleCollapse={handleToggleCollapse} />
              </motion.div>
            )}
          </div>
        );
      case "list":
      default:
        return (
          <div className={cn(
            "h-full",
            isMobile ? "" : "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2"
          )}>
            {/* Notes list with its own scrollbar */}
            <motion.div
              className={cn(
                "overflow-hidden flex flex-col h-full transition-all duration-300",
                !isMobile && (isContentCollapsed ? "md:col-span-3 lg:col-span-3" : "md:col-span-1 lg:col-span-1")
              )}
              initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
              animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >              
              <NotesSidebar />
            </motion.div>
            
            {/* Note content with its own scrollbar */}
            {!isMobile && !isContentCollapsed && (
              <motion.div
                className="overflow-hidden h-full transition-all duration-300 md:col-span-2 lg:col-span-2"
                initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
                animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <NotesContent onToggleCollapse={handleToggleCollapse} />
              </motion.div>
            )}
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
          <div className="px-2 sm:px-3 py-1 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div>
                <h1 className="text-2xl font-bold">Notes</h1>
                <p className="text-muted-foreground text-sm">
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
              <div className="mb-1">
                <NotesFilter />
              </div>
            )}
          </div>
          
          {/* Content section with flex-grow to fill remaining space */}
          <div className="px-2 sm:px-3 pb-2 flex-grow overflow-hidden relative">
            {renderNotesView()}
            
            {/* Floating expand button when content is collapsed */}
            <AnimatePresence>
              {isContentCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 right-4"
                >
                  <Button
                    onClick={() => setIsContentCollapsed(false)}
                    size="lg"
                    className="shadow-lg flex items-center gap-2"
                  >
                    <PanelRightOpen size={20} />
                    <span>Show Note</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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