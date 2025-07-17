"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Trash, 
  Share, 
  Download, 
  PlayCircle, 
  Edit,
  MoreHorizontal,
  Tag,
  Mic,
  Folder
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { AudioRecorder } from "@/components/quests/audio-recorder";
import CreateVoiceNoteDialog from "./CreateVoiceNoteDialog";
import { Note } from "@/types/note";
import { toast } from "sonner";

export default function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id") ? parseInt(searchParams.get("id")!) : null;
  
  const { 
    updateNote,
    deleteNote,
    shareNote,
    unshareNote,
    processNoteAudio,
    appendAudioToNote,
    folders,
    tags,
    isFoldersLoading,
    note
  } = useNotes({ noteId: noteId || undefined });

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [folder, setFolder] = useState<string>("none");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState<boolean>(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const [isAudioSuccess, setIsAudioSuccess] = useState<boolean>(false);
  const [isAudioError, setIsAudioError] = useState<boolean>(false);
  const [isVoiceNoteDialogOpen, setIsVoiceNoteDialogOpen] = useState<boolean>(false);

  // Enhanced animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.25 } },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.35,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.25,
        ease: "easeIn" 
      } 
    }
  };
  
  // Animation variants for smaller elements
  const elementVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: custom * 0.1,
        duration: 0.3 
      } 
    })
  };

  // Handle "new_folder" selection 
  useEffect(() => {
    if (folder === "new_folder") {
      setFolder("none");
      setShowNewFolder(true);
    }
  }, [folder]);

  // Initialize form data when note is loaded
  useEffect(() => {
    if (note && !isEditing) {
      setTitle(note.title);
      setContent(note.content || "");
      setFolder(!note.folder || note.folder.trim() === "" ? "none" : note.folder);
      setTagsList(note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
      setIsShared(!!note.share_id);
    }
  }, [note, isEditing]);

  const handleSave = () => {
    if (!title.trim() || !note) {
      return; // Toast handled by mutation
    }

    // Use either existing folder or new folder
    const finalFolder = showNewFolder && newFolder.trim() 
      ? newFolder.trim() 
      : (folder === "none" ? "" : folder);

    // Convert tagsList array back to comma-separated string for submission
    const formattedTags = tagsList.length > 0 ? tagsList.join(',') : undefined;

    const updateData = {
      title,
      content,
      folder: finalFolder || undefined,
      tags: formattedTags,
    };

    updateNote({ 
      noteId: note.id, 
      data: updateData 
    }, {
      onSuccess: () => {
        setIsEditing(false);
        setShowNewFolder(false);
        setNewFolder("");
      }
    });
  };

  const handleDelete = () => {
    if (!note) return;
    
    deleteNote(note.id, {
      onSuccess: () => {
        router.push("/notes");
      }
    });
  };

  const handleShare = () => {
    if (!note) return;
    
    shareNote(note.id, {
      onSuccess: (result) => {
        setIsShared(true);
        
        // Copy to clipboard
        navigator.clipboard.writeText(result.share_url).then(
          () => {},
          (err) => {
            console.error("Could not copy text: ", err);
          }
        );
      }
    });
  };

  const handleUnshare = () => {
    if (!note) return;
    
    unshareNote(note.id, {
      onSuccess: () => {
        setIsShared(false);
      }
    });
  };

  const handleExport = async (format: string = "text") => {
    if (!note) return;
    
    try {
      const { api } = await import("@/lib/api");
      const blob = await api.note.exportNote(note.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `note_${note.id}.${format === "pdf" ? "pdf" : format === "markdown" ? "md" : "txt"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting note:", err);
    }
  };

  const handleProcessAudio = () => {
    if (!note?.has_audio) return;
    processNoteAudio(note.id);
  };

  const handleCreateVoiceNote = useCallback((note: Note) => {
    setIsVoiceNoteDialogOpen(false);
    // Update URL with the new note ID
    console.log("note", note);
    router.push(`/notes?id=${note.id}`);
  }, [router]);

  // Handle submitting audio recording
  const handleAudioSubmit = async (blob: Blob) => {
    if (!blob || !note) return;
    
    setIsProcessingAudio(true);
    setIsAudioError(false);
    
    try {
      // Convert Blob to File
      const audio_file = new File([blob], `audio-append-${Date.now()}.webm`, { 
        type: "audio/webm" 
      });
      
      appendAudioToNote({
        noteId: note.id,
        audioFile: audio_file,
      }, {
        onSuccess: () => {
          setIsAudioSuccess(true);
          setTimeout(() => {
            setIsRecordingDialogOpen(false);
            setIsAudioSuccess(false);
          }, 1500);
        },
        onError: (error) => {
          setIsAudioError(true);
          console.error("Error appending audio:", error);
          toast.error("Failed to append audio", {
            description: error?.message || "Please try again later"
          });
        },
        onSettled: () => {
          setIsProcessingAudio(false);
        }
      });
    } catch (error) {
      setIsAudioError(true);
      setIsProcessingAudio(false);
      console.error("Error creating file:", error);
      toast.error("Failed to process audio recording", {
        description: "An unexpected error occurred"
      });
    }
  };

  if (!note) {
    return (
      <Card className="h-full bg-card flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0] 
          }}
          className="max-w-md flex flex-col items-center justify-center"
        >
          <h3 className="text-2xl font-semibold mb-3">No Note Selected</h3>
          <p className="text-card-foreground mb-4">
            Select a note from the list to view its contents, or create a new note to get started.
          </p>
          <Button 
                  onClick={() => setIsVoiceNoteDialogOpen(true)}
                  className="flex items-center gap-2"
          >
            <Edit size={16} />
            Create New Note
          </Button>
          <CreateVoiceNoteDialog
            isOpen={isVoiceNoteDialogOpen}
            onClose={() => setIsVoiceNoteDialogOpen(false)}
            onSave={handleCreateVoiceNote}
          />
        </motion.div>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="edit-mode"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 pt-3 flex-shrink-0">
              <motion.div 
                className="space-y-1"
                variants={elementVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="text-lg font-medium"
                />
              </motion.div>
              <motion.div 
                className="flex gap-2"
                variants={elementVariants}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setTitle(note.title);
                    setContent(note.content || "");
                    setFolder(!note.folder || note.folder.trim() === "" ? "none" : note.folder);
                    setTagsList(note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </Button>
              </motion.div>
            </CardHeader>
            
            {/* Fixed folder and tags selection */}
            <motion.div 
              className="px-3 pb-3 border-b flex-shrink-0"
              variants={elementVariants}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="folder">Folder</Label>
                  {!showNewFolder ? (
                    <div className="flex items-center gap-2">
                      <Select value={folder} onValueChange={setFolder}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a folder or create a new one" />
                        </SelectTrigger>
                        <SelectContent 
                          className="max-h-[212px] overflow-y-auto bg-muted p-2"
                          position="popper"
                        >
                          {folders.length === 0 ? (
                            <SelectItem value="__loading__" disabled>
                              {isFoldersLoading ? "Loading folders..." : "No folders found"}
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="none">No folder</SelectItem>
                              {folders.filter(folderName => folderName && folderName.trim() !== "").map((folderName) => (
                                <SelectItem key={folderName} value={folderName}>
                                  {folderName}
                                </SelectItem>
                              ))}
                            </>
                          )}
                          <SelectItem value="new_folder">+ Create New Folder</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowNewFolder(true)}
                        title="Create new folder"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newFolder}
                        onChange={(e) => setNewFolder(e.target.value)}
                        placeholder="Enter new folder name"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setShowNewFolder(false);
                          setNewFolder("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput
                    value={tagsList}
                    onChange={setTagsList}
                    suggestions={tags}
                    placeholder="Type a tag and press enter or comma..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Enter or comma to add a tag. Press Backspace to remove the last tag.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Scrollable content area */}
            <CardContent className="flex-1 overflow-hidden px-0 py-0">
              <motion.div 
                className="h-full overflow-auto px-3 py-3"
                variants={elementVariants}
                custom={3}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={15}
                    className="min-h-[300px] resize-none h-[calc(100vh-25rem)]"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`note-${note.id}`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
        className="h-full relative"
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 pt-3 flex-shrink-0">
            <motion.h2 
              className=" flex gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl font-bold">{note.title}</div>
              {note.folder && (
                  <motion.div 
                    className="flex items-center gap-1 text-muted bg-accent/20 rounded-full px-3 py-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Folder size={14} className="text-accent/80 mt-0.5" />
                    <div className="text-accent/80 text-xs flex items-center gap-2">
                      {note.folder}
                    </div>
                  </motion.div>
                )}
            </motion.h2>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                  {isShared ? (
                    <DropdownMenuItem onClick={handleUnshare}>
                      <Share size={16} className="mr-2" />
                      Unshare
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleShare}>
                      <Share size={16} className="mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleExport("text")}>
                    <Download size={16} className="mr-2" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("markdown")}>
                    <Download size={16} className="mr-2" />
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <Download size={16} className="mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  {note.has_audio && (
                    <DropdownMenuItem onClick={handleProcessAudio}>
                      <PlayCircle size={16} className="mr-2" />
                      Process Audio
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            
          </CardHeader>
          
          {/* Fixed folder and tags display */}
          {(note.folder || (note.tags && note.tags.length > 0)) && (
            <motion.div 
              className="px-3 pb-2 flex-shrink-0 border-b"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-2">
                {note.folder && (
                  <motion.div 
                    className="flex items-center gap-1 text-sm text-muted-foreground bg-accent/20 rounded-full px-3 py-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Folder size={14} className="text-accent/80 mt-0.5" />
                    <div className="text-accent/80 text-xs flex items-center gap-2">
                      {note.folder}
                    </div>
                  </motion.div>
                )}
                
                {note.tags && note.tags.length > 0 && (
                  note.tags.split(',').map((tag, index) => (
                    <motion.div 
                      key={tag} 
                      className="flex items-center gap-1 text-sm text-muted bg-accent/20 rounded-full px-3 py-1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.25 + (0.05 * index) }}
                    >
                      <div className="text-accent/80 flex items-center gap-2">
                      <Tag size={14} className="mt-0.5" />{tag.trim()}</div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
          
          {/* Scrollable content area */}
          <CardContent className="flex-1 overflow-hidden px-0 py-0">
            <motion.div 
              className="h-full overflow-auto px-3 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {note.has_audio && (
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">Audio</h3>
                  <audio controls className="w-full" src={note.audio_url}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              {/* Show processing status for voice notes */}
              {note.processing_status && note.processing_status !== "completed" && (
                <div className={`p-4 rounded-lg mb-4 `}>
                  {note.processing_status === "processing" && (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin dark:border-blue-400 dark:border-t-transparent"></div>
                      <p>Your audio is being processed. This may take a few minutes.</p>
                    </div>
                  )}
                  {note.processing_status === "pending" && (
                    <p>Your audio is queued for processing.</p>
                  )}
                  {note.processing_status === "error" && (
                    <div>
                      <p className="font-medium">Error processing your audio.</p>
                      {note.processing_error && <p className="text-sm mt-1">{note.processing_error}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                {note.content ? (
                  <MarkdownRenderer content={note.content} readOnly={true} />
                ) : note.transcription ? (
                  <div>
                    <h3 className="font-medium text-lg mb-2">Transcription</h3>
                    <div className="whitespace-pre-wrap">{note.transcription}</div>
                  </div>
                ) : (
                  <p className="text-muted">No content</p>
                )}
              </div>
            </motion.div>
          </CardContent>
          
          {/* Always visible fixed recording button at the bottom */}
          {note && (
            <div className="border-t py-4 px-6 flex justify-center flex-shrink-0">
              <Button 
                size="lg"
                onClick={() => setIsRecordingDialogOpen(true)}
                className="shadow-md flex items-center gap-2"
              >
                <Mic size={18} />
                Continue recording
              </Button>
            </div>
          )}
          
          {/* Recording Dialog */}
          <Dialog open={isRecordingDialogOpen} onOpenChange={(open) => {
            // Only allow closing if not processing
            if (!isProcessingAudio || !open) {
              setIsRecordingDialogOpen(open);
              // Reset states when closing
              if (!open) {
                setIsAudioSuccess(false);
                setIsAudioError(false);
                setIsProcessingAudio(false);
              }
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Continue Recording</DialogTitle>
                <DialogDescription>
                  Record additional audio to append to your note.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <AudioRecorder 
                  isProcessing={isProcessingAudio}
                  isSuccess={isAudioSuccess}
                  isError={isAudioError}
                  onSubmit={handleAudioSubmit}
                  submitButtonLabel="Append to Note"
                  onCancel={() => {
                    if (!isProcessingAudio) {
                      setIsRecordingDialogOpen(false);
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
        
      </motion.div>
      
    </AnimatePresence>
  );
} 