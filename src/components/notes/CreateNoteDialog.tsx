"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Note, NoteCreate } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export default function CreateNoteDialog({
  isOpen,
  onClose,
  onSave,
}: CreateNoteDialogProps) {
  const { 
    createNote, 
    isCreating,
    folders,
    tags,
    isFoldersLoading
  } = useNotes();
  
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [folder, setFolder] = useState<string>("none");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      // When dialog opens, set today's date as a default tag
      const today = new Date();
      const dateTag = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).replace(/,/g, ''); // Format: "Dec 19 2024"
      setTagsList([dateTag]);
    }
  }, [isOpen]);

  // Handle "new_folder" selection
  useEffect(() => {
    if (folder === "new_folder") {
      setFolder("none");
      setShowNewFolder(true);
    }
  }, [folder]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFolder("none");
    setTagsList([]);
    setShowNewFolder(false);
    setNewFolder("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return; // Toast handled by mutation
    }

    // Use either existing folder or new folder
    const finalFolder = showNewFolder && newFolder.trim() 
      ? newFolder.trim() 
      : (folder === "none" ? "" : folder);

    // Convert tagsList array to a comma-separated string
    const formattedTags = tagsList.length > 0 ? tagsList.join(',') : undefined;
    
    const noteData: NoteCreate = {
      title,
      content,
      folder: finalFolder || undefined,
      tags: formattedTags,
    };
    
    createNote(noteData, {
      onSuccess: (createdNote) => {
        onSave(createdNote);
        resetForm();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={8}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 