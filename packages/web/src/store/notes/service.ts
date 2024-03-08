import { KyInstance, KyResponse } from 'ky';
import type { Note, NoteItem, NoteList, NotePayload } from './types';

export class NoteService {
  kyInstance: KyInstance;

  constructor(kyInstance: KyInstance) {
    this.kyInstance = kyInstance;
  }

  async create(payload: NotePayload): Promise<KyResponse> {
    const response = await this.kyInstance.post('/note', {
      json: payload
    });
    return response;
  }

  async list(): Promise<NoteList> {
    const response = await this.kyInstance.get('/note');
    const data = await response.json<NoteList>();
    return data;
  }

  async getOne(id: string): Promise<Note> {
    const response = await this.kyInstance.get(`/note/${id}`);
    const { data } = await response.json<NoteItem>();
    return data;
  }

  async update(id: string, payload: NotePayload): Promise<KyResponse> {
    const response = await this.kyInstance.put(`/note/${id}`, {
      json: payload
    });
    return response;
  }

  async delete(id: string): Promise<KyResponse> {
    const response = await this.kyInstance.delete(`/note/${id}`);
    return response;
  }
}
