class Footer extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        color: white;
        font-family: 'Arial', sans-serif;
      }

      /* Styling untuk Footer */
      footer {
        background-color: #34495e;  /* Warna abu-abu gelap */
        padding: 20px 24px;
        text-align: center;
        color: white;
        font-size: 1em;  /* Ukuran font standar di footer */
        border-top: 3px solid #2980b9;  /* Border biru untuk pemisah */
      }

      footer a {
        color: #ecf0f1;
        text-decoration: none;
        margin: 0 10px;
        font-size: 1em;  /* Ukuran font link agar sama dengan teks di footer */
      }

      footer a:hover {
        text-decoration: underline;
      }

      footer p {
        margin: 10px 0;
        font-size: 1em;  /* Ukuran font standar di p, sama dengan ukuran font link */
        line-height: 1.5;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }

      /* Responsif untuk layar kecil (smartphone) */
      @media (max-width: 600px) {
        footer {
          padding: 15px 20px;
        }

        footer p {
          font-size: 1em;  /* Tetap ukuran font yang sama pada perangkat kecil */
          flex-direction: column;  /* Menata link secara vertikal pada perangkat kecil */
          align-items: center;
        }

        footer a {
          font-size: 1em;  /* Ukuran font link tetap konsisten */
        }
      }

      /* Responsif untuk layar tablet */
      @media (min-width: 601px) and (max-width: 900px) {
        footer {
          padding: 18px 22px;
        }

        footer p {
          font-size: 1em;  /* Tetap ukuran font yang sama pada tablet */
        }

        footer a {
          font-size: 1em;  /* Ukuran font link tetap konsisten */
        }
      }

      /* Responsif untuk layar besar (desktop) */
      @media (min-width: 901px) {
        footer {
          padding: 20px 24px;  /* Padding standar untuk layar besar */
        }

        footer p {
          font-size: 1em;  /* Ukuran font standar di desktop */
        }

        footer a {
          font-size: 1em;  /* Ukuran font link tetap konsisten */
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <footer>
        <p>&copy; 2025 Notes App. All rights reserved.</p>
        <p>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </p>
      </footer>
    `;
  }
}

customElements.define("footer-bar", Footer);
