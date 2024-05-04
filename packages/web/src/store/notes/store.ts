import { create } from 'zustand';
import type { Note, NoteList, NotePayload } from './types';
import { fetchClient } from '../client';
import { NoteService } from './service';
import { extractHTTPErrorMessage } from '../../utils/http-utils';

interface State {
  noteList: NoteList
  currentNote?: Note
  error: string
}

interface Actions {
  clear: () => void
  create: (payload: NotePayload) => Promise<void>
  list: () => Promise<void>
  getOne: (id: string) => Promise<void>
  update: (id: string, payload: NotePayload) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

interface NoteState extends State, Actions {}

const noteService = new NoteService(fetchClient);

const DEFAULT_STATE: State = {
  noteList: {
    count: 0,
    data: [],
  },
  currentNote: undefined,
  error: '',
};

export const useNotes = create<NoteState>((set) => ({
  ...DEFAULT_STATE,
  clear: () => {
    set(DEFAULT_STATE);
  },
  create: async (payload) => {
    try {
      await noteService.create(payload);
    } catch (error) {
      if (error) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      error: ''
    });
  },
  list: async () => {
    let noteList: NoteList;
    try {
      noteList = await noteService.list();
    } catch (error) {
      if (error) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      noteList,
      error: '',
    });
  },
  getOne: async (id) => {
    let note: Note;
    try {
      note = await noteService.getOne(id);
    } catch (error) {
      if (error) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      currentNote: note,
      error: '',
    });
  },
  update: async (id, payload) => {
    try {
      await noteService.update(id, payload);
    } catch (error) {
      if (error) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      error: ''
    });
  },
  deleteNote: async (id) => {
    try {
      await noteService.delete(id);
    } catch (error) {
      if (error) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      error: ''
    });
  },
}));
