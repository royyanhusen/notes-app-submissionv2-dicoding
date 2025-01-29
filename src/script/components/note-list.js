import Utils from '../utils.js';

class NoteList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _column = 3; // Default 3 kolom
  _gutter = 16; // Default gutter antara item

  static get observedAttributes() {
    return ['column', 'gutter'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(${this.column}, 1fr);
        gap: ${this.gutter}px;
        padding: ${this.gutter}px; /* Menambahkan padding di sekitar grid */
      }

      /* Styling untuk item dalam list */
      ::slotted(.note-item) {
        padding: 16px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease; /* Animasi untuk smooth hover effect */
        cursor: pointer; /* Menambahkan cursor pointer saat hover */
      }

      /* Efek hover saat mouse diarahkan ke item */
      ::slotted(.note-item:hover) {
        transform: scale(1.05); /* Membesarkan item sedikit */
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Menambah bayangan lebih gelap */
        background-color: #f4f6f9; /* Ganti warna latar belakang saat hover */
      }

      /* Responsif untuk layar kecil (1 kolom pada layar kecil) */
      @media (max-width: 600px) {
        .list {
          grid-template-columns: 1fr; /* 1 kolom untuk layar kecil */
        }
      }

      /* Responsif untuk layar menengah (2 kolom pada tablet) */
      @media (min-width: 601px) and (max-width: 900px) {
        .list {
          grid-template-columns: repeat(2, 1fr); /* 2 kolom untuk layar menengah */
        }
      }

      /* Responsif untuk layar besar (default 3 kolom) */
      @media (min-width: 901px) {
        .list {
          grid-template-columns: repeat(${this._column}, 1fr); /* Default 3 kolom pada layar besar */
        }
      }
    `;
  }

  set column(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue) || newValue < 1) return;

    this._column = newValue;
    this.render();
  }

  get column() {
    return this._column;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue) || newValue < 0) return;

    this._gutter = value;
    this.render();
  }

  get gutter() {
    return this._gutter;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="list">
        <slot></slot> <!-- Elemen dengan kelas .note-item akan diberi gaya -->
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'column':
        this.column = newValue;
        break;
      case 'gutter':
        this.gutter = newValue;
        break;
    }
  }
}

customElements.define('note-list', NoteList);
