export interface Note {
  id: string
  userId: string
  title: string
  content: string
  dateCreated: string
  dateUpdated: string
}

export interface NoteList {
  count: number
  data: Omit<Note, 'content' | 'dateCreated' | 'dateUpdated'>[]
}

export interface NoteItem {
  data: Note
}

export interface NotePayload {
  title: string
  content: string
}
