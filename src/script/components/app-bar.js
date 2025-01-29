class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        color: white;
        font-family: 'Arial', sans-serif;
      }

      /* Styling untuk AppBar dengan latar belakang solid */
      div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 8px 16px;
        background-color: #34495e; /* Warna latar belakang solid */
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); /* Box-shadow yang lebih tegas */
      }

      /* Styling untuk Brand Name */
      .brand-name {
        font-size: 1.8em;
        margin-left: 12px;
        font-weight: bold;
        letter-spacing: 1px;
      }

      /* Styling untuk Logo */
      .logo {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        margin-left: 30px; /* Menambahkan padding ke kanan logo */
      }

      /* Responsif untuk layar kecil */
      @media (max-width: 600px) {
        .brand-name {
          font-size: 1.5em;
        }

        div {
          flex-direction: column;
          align-items: center;
        }

        .logo {
          width: 45px;  /* Ukuran logo lebih kecil di layar kecil */
          height: 45px;  /* Ukuran logo lebih kecil di layar kecil */
        }

        .brand-name {
          margin-left: 0;
          margin-top: 10px;
        }
      }

      /* Responsif untuk layar lebih besar (misalnya tablet) */
      @media (min-width: 601px) and (max-width: 900px) {
        .logo {
          width: 50px;  /* Menyesuaikan ukuran logo di tablet */
          height: 50px;  /* Menyesuaikan ukuran logo di tablet */
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div>
        <h1 class="brand-name">Notes App</h1>
      </div>
    `;
  }
}

{/* <img src="../src/public/icon-notes.png" alt="Logo" class="logo">  <!-- Pastikan path logo benar --> */}

customElements.define('app-bar', AppBar);
