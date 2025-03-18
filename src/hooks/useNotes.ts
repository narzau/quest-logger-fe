import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { NoteCreate, NoteUpdate, VoiceNoteCreate, NoteList } from "@/types/note";
import { useToast } from "@/components/ui/use-toast";

export function useNotes(options?: {
  skip?: number;
  limit?: number;
  folder?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  noteId?: number;
  sharedId?: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const skip = options?.skip || 0;
  const limit = options?.limit || 10;
  const folder = options?.folder;
  const tag = options?.tag;
  const search = options?.search;
  const sortBy = options?.sortBy || "updated_at";
  const sortOrder = options?.sortOrder || "desc";
  const noteId = options?.noteId;
  const sharedId = options?.sharedId;
  
  // Get notes list
  const notesQuery = useQuery<NoteList>({
    queryKey: ["notes", { skip, limit, folder, tag, search, sortBy, sortOrder }],
    queryFn: () => api.note.getNotes(skip, limit, folder, tag, search, sortBy, sortOrder),
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Get single note
  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => api.note.getNote(noteId!),
    enabled: !!noteId,
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Get shared note
  const sharedNoteQuery = useQuery({
    queryKey: ["note", "shared", sharedId],
    queryFn: () => api.note.getSharedNote(sharedId!),
    enabled: !!sharedId,
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Create note
  const createNoteMutation = useMutation({
    mutationFn: (data: NoteCreate) => api.note.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update note
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, data }: { noteId: number; data: NoteUpdate }) => 
      api.note.updateNote(noteId, data),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", updatedNote.id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["noteFolders"] });
      queryClient.invalidateQueries({ queryKey: ["noteTags"] });
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => api.note.deleteNote(noteId),
    onSuccess: (_, noteId) => {
      queryClient.removeQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Share note
  const shareNoteMutation = useMutation({
    mutationFn: (noteId: number) => api.note.shareNote(noteId),
    onSuccess: (response, noteId) => {
      queryClient.setQueryData(["note", noteId, "shareInfo"], response);
      toast({
        title: "Note shared",
        description: "Your note has been shared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Unshare note
  const unshareNoteMutation = useMutation({
    mutationFn: (noteId: number) => api.note.unshareNote(noteId),
    onSuccess: (_, noteId) => {
      queryClient.setQueryData(["note", noteId, "shareInfo"], null);
      toast({
        title: "Share removed",
        description: "Your note is no longer shared.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove sharing. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Create voice note
  const createVoiceNoteMutation = useMutation({
    mutationFn: ({ audioFile, data }: { audioFile: File; data: VoiceNoteCreate }) => 
      api.note.createVoiceNote(audioFile, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Voice note created",
        description: "Your voice note has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create voice note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Process note audio
  const processNoteAudioMutation = useMutation({
    mutationFn: (noteId: number) => api.note.processNoteAudio(noteId),
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      toast({
        title: "Processing started",
        description: "Your audio is being processed. This may take a few minutes.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Append audio to note
  const appendAudioToNoteMutation = useMutation({
    mutationFn: ({ noteId, audioFile }: { noteId: number; audioFile: File }) => 
      api.note.appendAudioToNote(noteId, audioFile),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", updatedNote.id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Audio appended",
        description: "Your audio has been appended to the note. It is being processed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to append audio to note. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Get folders
  const foldersQuery = useQuery({
    queryKey: ["noteFolders"],
    queryFn: api.note.getFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get tags
  const tagsQuery = useQuery({
    queryKey: ["noteTags"],
    queryFn: api.note.getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    // Data
    notes: notesQuery.data?.items || [],
    totalNotes: notesQuery.data?.total || 0,
    note: noteQuery.data,
    sharedNote: sharedNoteQuery.data,
    folders: foldersQuery.data || [],
    tags: tagsQuery.data || [],
    
    // Loading states
    isLoading: notesQuery.isLoading,
    isNoteLoading: noteQuery.isLoading,
    isSharedNoteLoading: sharedNoteQuery.isLoading,
    isFoldersLoading: foldersQuery.isLoading,
    isTagsLoading: tagsQuery.isLoading,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isSharing: shareNoteMutation.isPending,
    isUnsharing: unshareNoteMutation.isPending,
    isProcessingAudio: processNoteAudioMutation.isPending,
    
    // Error states
    error: notesQuery.error,
    noteError: noteQuery.error,
    sharedNoteError: sharedNoteQuery.error,
    foldersError: foldersQuery.error,
    tagsError: tagsQuery.error,
    
    // Actions
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    shareNote: shareNoteMutation.mutate,
    unshareNote: unshareNoteMutation.mutate,
    createVoiceNote: createVoiceNoteMutation.mutate,
    processNoteAudio: processNoteAudioMutation.mutate,
    appendAudioToNote: appendAudioToNoteMutation.mutate,
    
    // Refetch helpers
    refetchNotes: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    refetchNote: (id: number) => queryClient.invalidateQueries({ queryKey: ["note", id] }),
    refetchFolders: () => queryClient.invalidateQueries({ queryKey: ["noteFolders"] }),
    refetchTags: () => queryClient.invalidateQueries({ queryKey: ["noteTags"] }),
  };
} 