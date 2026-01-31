import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Contact } from '@/entities/contact';

interface ContactsState {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    immer((set, get) => ({
      contacts: [],

      addContact: (contact) =>
        set((state) => {
          state.contacts.unshift(contact);
        }),

      removeContact: (id) =>
        set((state) => {
          state.contacts = state.contacts.filter((c) => c.id !== id);
        }),

      getContact: (id) => get().contacts.find((c) => c.id === id),
    })),
    {
      name: 'enigma-contacts',
    }
  )
);
