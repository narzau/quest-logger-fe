export interface Note {
  id: number;
  title: string;
  content?: string;
  transcription?: string;
  folder?: string;
  tags?: string;
  has_audio: boolean;
  audio_url?: string;
  created_at: string;
  updated_at: string;
  share_id?: string;
  processing_status?: "pending" | "processing" | "completed" | "error";
  processing_error?: string;
  archived?: boolean;
}

export interface NoteList {
  items: Note[];
  total: number;
  skip: number;
  limit: number;
}

export interface NoteCreate {
  title: string;
  content: string;
  folder?: string;
  tags?: string;
  note_style?: string;
  quest_id?: number;
  archived?: boolean;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  folder?: string;
  tags?: string;
  note_style?: string;
  quest_id?: number;
  archived?: boolean;
}

export interface VoiceNoteCreate {
  folder?: string;
  tags?: string[];
  note_style?: string;
}

export interface FoldersResponse {
  folders: string[];
}

export interface TagsResponse {
  tags: string[];
}

export interface ShareResponse {
  share_id: string;
  share_url: string;
} 