import { FetchClient } from '../../utils/http-utils';
import type { Note, NoteItem, NoteList, NotePayload } from './types';

export class NoteService {
  client: FetchClient;

  constructor(client: FetchClient) {
    this.client = client;
  }

  async create(payload: NotePayload): Promise<Response> {
    const response = await this.client.request('note', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return response;
  }

  async list(): Promise<NoteList> {
    const response = await this.client.request('note', {
      method: 'GET',
    });
    const data: NoteList = await response.json();
    return data;
  }

  async getOne(id: string): Promise<Note> {
    const response = await this.client.request(`note/${id}`, {
      method: 'GET',
    });
    const { data }: NoteItem = await response.json();
    return data;
  }

  async update(id: string, payload: NotePayload): Promise<Response> {
    const response = await this.client.request(`note/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response;
  }

  async delete(id: string): Promise<Response> {
    const response = await this.client.request(`note/${id}`, {
      method: 'DELETE',
    });
    return response;
  }
}
