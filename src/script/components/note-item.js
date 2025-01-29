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
      // Re-render when the note is set
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
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          cursor: pointer; /* Menambahkan cursor pointer untuk menandakan bahwa elemen bisa diklik */
          min-height: 200px; /* Menetapkan tinggi minimum untuk card */
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
          flex-grow: 1; /* Agar paragraf bisa memanfaatkan ruang yang ada */
        }
  
        .note-item small {
          font-size: 0.9em;
          color: #666;
        }
  
        .note-item .status {
          font-weight: bold;
          margin-top: 4px; /* Mengurangi margin atas agar lebih rapat */
          color: ${this._note.archived ? 'red' : 'green'};
        }
  
        /* Efek hover untuk seluruh card */
        .note-item:hover {
          transform: scale(1.05); /* Membesarkan item sedikit */
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Menambah bayangan lebih gelap */
          background-color: #f4f6f9; /* Ganti warna latar belakang saat hover */
        }
  
        /* Responsif untuk layar kecil */
        @media (max-width: 600px) {
          .note-item {
            padding: 12px; /* Mengurangi padding pada perangkat kecil */
          }
  
          .note-item h3 {
            font-size: 1.2em; /* Mengurangi ukuran judul pada perangkat kecil */
          }
  
          .note-item p {
            font-size: 0.9em; /* Mengurangi ukuran teks body pada perangkat kecil */
          }
  
          .note-item small {
            font-size: 0.8em; /* Mengurangi ukuran teks kecil pada perangkat kecil */
          }
  
          .note-item .status {
            font-size: 0.9em; /* Mengurangi ukuran status pada perangkat kecil */
          }
        }
  
        /* Responsif untuk tablet (antara 600px hingga 900px) */
        @media (max-width: 900px) {
          .note-item h3 {
            font-size: 1.3em; /* Menyesuaikan ukuran judul di tablet */
          }
  
          .note-item p {
            font-size: 1em; /* Menyesuaikan ukuran teks body di tablet */
          }
        }
      `;
    }
  
    render() {
      this._emptyContent();
      this._updateStyle();
      
      this._shadowRoot.innerHTML = '';
      this.innerHTML = `<div class="note-list-container"></div>`;


      this._shadowRoot.appendChild(this._style);
      this._shadowRoot.innerHTML += `
        <div class="note-item">
          <h3>${this._note.title}</h3>
          <p>${this._note.body}</p>
          <small>Created at: ${new Date(this._note.createdAt).toLocaleString()}</small>
          <div class="status">${this._note.archived ? 'Archived' : 'Active'}</div>
        </div>
      `;
    }
  }
  
  // Defining the 'note-item' custom element
  customElements.define('note-item', NoteItem);
  