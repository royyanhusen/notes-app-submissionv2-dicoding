import Swal from 'sweetalert2';  // Impor SweetAlert2
import NotesApi from '../api/notes-api.js';  // Pastikan ini sudah diimpor dengan benar

class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        margin-bottom: 16px;
      }

      .note-item {
        background-color: #fff;
        padding: 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.3s ease;
        cursor: pointer;
        min-height: 200px;
      }

      .note-item h3 {
        margin: 0;
        font-size: 1.4em;
        font-weight: bold;
      }

      .note-item p {
        margin: 8px 0;
        font-size: 1em;
        line-height: 1.6;
        flex-grow: 1;
      }

      .note-item small {
        font-size: 0.9em;
        color: #666;
      }

      .note-item .status {
        font-weight: bold;
        margin-top: 4px;
        color: ${this._note.archived ? 'red' : 'green'};
      }

      .note-item .button-container {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        width: 100%;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }

      .note-item .button-container button {
        padding: 12px;
        font-size: 1em;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        flex-grow: 1;
      }

      button:hover {
        background-color: #ddd;
      }

      .archive-button {
        background-color: ${this._note.archived ? 'gray' : '#4CAF50'};
        color: white;
      }

      .delete-button {
        background-color: red;
        color: white;
      }

      @media (max-width: 600px) {
        .note-item {
          padding: 12px;
        }

        .button-container button {
          font-size: 0.9em;
        }
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="note-item">
        <h3>${this._note.title}</h3>
        <p>${this._note.body}</p>
        <small>Created at: ${new Date(this._note.createdAt).toLocaleString()}</small>
        
        <div class="status">${this._note.archived ? 'Archived' : 'Active'}</div>

        <div class="button-container">
          <button class="archive-button">${this._note.archived ? 'Unarchive' : 'Archive'}</button>
          <button class="delete-button">Delete</button>
        </div>
      </div>
    `;

    const archiveButton = this._shadowRoot.querySelector('.archive-button');
    archiveButton.addEventListener('click', () => this.toggleArchive());

    const deleteButton = this._shadowRoot.querySelector('.delete-button');
    deleteButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.deleteNote();
    });
  }

  async toggleArchive() {
    try {
      const api = new NotesApi();
      if (this._note.archived) {
        await api.unarchiveNote(this._note.id);
        this._note.archived = false;
      } else {
        await api.archiveNote(this._note.id);
        this._note.archived = true;
      }
      this.render();
    } catch (error) {
      console.error('Error toggling archive status:', error);
      // Gunakan SweetAlert2 untuk menampilkan pesan error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error toggling archive status.',
        showConfirmButton: true
      });
    }
  }

  async deleteNote() {
    try {
      const api = new NotesApi(); // Pastikan NotesApi sudah diimpor dengan benar
      await api.deleteNote(this._note.id);  // Menghapus catatan melalui API
      this.remove();  // Menghapus elemen dari DOM setelah sukses

      // Gunakan SweetAlert2 untuk menampilkan pesan sukses
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your note has been deleted successfully.',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      // Gunakan SweetAlert2 untuk menampilkan pesan error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error deleting your note.',
        showConfirmButton: true
      });
    }
  }
}

customElements.define('note-item', NoteItem);
