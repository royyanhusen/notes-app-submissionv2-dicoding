import Swal from 'sweetalert2';
import NotesApi from '../api/notes-api.js';

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

      .detail-button {
        background-color: #007BFF;
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
          <button class="detail-button">Details</button>
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

    const detailButton = this._shadowRoot.querySelector('.detail-button');
    detailButton.addEventListener('click', () => this.showDetails());
  }

  async toggleArchive() {
    try {
      const api = new NotesApi();
      if (this._note.archived) {
        await api.unarchiveNote(this._note.id); // Unarchive note via API
        this._note.archived = false;
      } else {
        await api.archiveNote(this._note.id); // Archive note via API
        this._note.archived = true;
      }

      // Re-render dengan status yang diperbarui
      this.render();

      // Menampilkan SweetAlert dalam mode Toast (notifikasi singkat)
      Swal.fire({
        icon: 'success',
        title: this._note.archived ? 'Archived' : 'Unarchived',
        text: this._note.archived ? 'Note has been archived.' : 'Note has been unarchived.',
        toast: true,
        position: 'top-end',  // Menempatkan toast di bagian kanan atas
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error toggling archive status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error toggling archive status.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async deleteNote() {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const api = new NotesApi();
        await api.deleteNote(this._note.id); // Call the API to delete the note
        this.remove();

        Swal.fire({
          title: 'Deleted!',
          text: 'Your note has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your note is safe :)',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error deleting your note.',
        showConfirmButton: true,
      });
    }
  }

  async showDetails() {
    try {
      const api = new NotesApi();
      const noteDetail = await api.getSingleNote(this._note.id); // Mengambil detail catatan berdasarkan ID

      // Menampilkan detail catatan menggunakan Swal dengan styling
      Swal.fire({
        title: `<strong style="font-size: 1.2em;">${noteDetail.title}</strong>`,
        html: `
          <div style="font-size: 1em; line-height: 1.6; text-align: left; margin-bottom: 15px;">
            <p><strong>Body:</strong></p>
            <p style="white-space: pre-wrap; word-wrap: break-word; font-size: 1em;">${noteDetail.body}</p>
            <p><strong>Created At:</strong> ${new Date(noteDetail.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${noteDetail.archived ? 'Archived' : 'Active'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-popup-details',
        },
      });
    } catch (error) {
      console.error('Error fetching single note details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching note details.',
        showConfirmButton: true,
      });
    }
  }

}

customElements.define('note-item', NoteItem);
