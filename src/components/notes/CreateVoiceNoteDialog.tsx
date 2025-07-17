"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { VoiceNoteCreate, Note } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioRecorder } from "@/components/quests/audio-recorder";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateVoiceNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  autoRecord?: boolean;
}

export default function CreateVoiceNoteDialog({
  isOpen,
  onClose,
  onSave,
  autoRecord = false,
}: CreateVoiceNoteDialogProps) {
  console.log('📝 CreateVoiceNoteDialog rendered with autoRecord:', autoRecord, 'isOpen:', isOpen);
  
  const { 
    createVoiceNote, 
    folders,
    tags,
    isFoldersLoading
  } = useNotes();
  
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [folder, setFolder] = useState<string>("none");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  // Handle "new_folder" selection
  useEffect(() => {
    if (folder === "new_folder") {
      setFolder("none");
      setShowNewFolder(true);
    }
  }, [folder]);

  const handleAudioReady = (blob: Blob) => {
    setAudioBlob(blob);
  };
  
  // This will be called when the user clicks the submit button in the audio recorder
  const handleAudioSubmit = async (blob: Blob) => {
    // User clicked record but no actual recording happened
    if (!blob || blob.size === 0) {
      toast.error("No audio recorded");
      return;
    }
    
    // We don't actually submit here - we just keep the audio blob
    // The user still needs to fill out the form
    toast.success("Audio recording captured!", {
      description: "Please fill out the details below to create your note."
    });
  };

  const resetForm = () => {
    setFolder("none");
    setTagsList([]);
    setAudioBlob(null);
    setShowNewFolder(false);
    setNewFolder("");
    setIsProcessing(false);
    setIsSuccess(false);
    setIsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioBlob) {
      toast.error("Please record audio");
      return;
    }
    
    // Use either existing folder or new folder
    const finalFolder = showNewFolder && newFolder.trim() 
      ? newFolder.trim() 
      : (folder === "none" ? "" : folder);
    
    // Convert tagsList array to a comma-separated string
    const formattedTags = tagsList.length > 0 ? tagsList.join(',') : undefined;
    
    const noteData: VoiceNoteCreate = {
      folder: finalFolder || undefined,
      tags: formattedTags ? [formattedTags] : undefined,
    };
    
    // Convert blob to file with a name
    const audioFile = new File([audioBlob], "voice-recording.webm", {
      type: "audio/webm",
    });
    
    setIsProcessing(true);
    
    createVoiceNote({ 
      audioFile, 
      data: noteData 
    }, {
      onSuccess: (createdNote) => {
        setIsSuccess(true);
        setTimeout(() => {
          onSave(createdNote);
          resetForm();
        }, 1500); // Show success animation for 1.5 seconds
      },
      onError: (error) => {
        setIsError(true);
        toast.error("Failed to create voice note", {
          description: error?.message || "Please try again later."
        });
      },
      onSettled: () => {
        setIsProcessing(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Voice Note</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 border rounded-lg mb-4">
              <AudioRecorder 
                onAudioReady={handleAudioReady}
                onSubmit={handleAudioSubmit}
                isProcessing={isProcessing}
                isSuccess={isSuccess}
                isError={isError}
                submitButtonLabel="Create Voice Note"
                onCancel={() => setAudioBlob(null)}
                autoRecord={autoRecord}
              />
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              {!showNewFolder ? (
                <div className="flex items-center gap-2">
                  <Select value={folder} onValueChange={setFolder}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a folder or create a new one" />
                    </SelectTrigger>
                    <SelectContent 
                      className="max-h-[212px] overflow-y-auto"
                      position="popper"
                    >
                      {folders.length === 0 ? (
                        <SelectItem value="no_folders" disabled>
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
           
            <Button 
              type="submit"
              disabled={isProcessing || !audioBlob}
            >
              Create Voice Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 