import Swal from 'sweetalert2';

class AddForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  _render() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        margin: 20px auto;
        box-sizing: border-box;
        font-family: sans-serif;
      }
  
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 100%;
        width: 100%;
        margin: auto;
        box-sizing: border-box;
        font-family: sans-serif;
      }
  
      label {
        font-size: 1.2em;
        color: #333;
        font-weight: bold;
      }
  
      input, textarea {
        padding: 12px;
        font-size: 1em;
        border-radius: 6px;
        border: 1px solid #ccc;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        font-family: sans-serif;
      }
  
      textarea {
        height: 100px;
        resize: vertical;
      }
  
      input:focus, textarea:focus {
        border-color: #3498db;
        box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
        outline: none;
      }
  
      button {
        padding: 12px 20px;
        background-color: #2980b9;
        color: white;
        font-size: 1.1em;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-family: sans-serif;
      }
  
      button:hover {
        background-color: #3498db;
      }
  
      button:active {
        background-color: #21618c;
      }
  
      .error-message {
        color: red;
        font-size: 0.9em;
        margin-top: 5px;
      }
  
      .valid {
        border-color: green;
      }
  
      .invalid {
        border-color: red;
      }
  
      .submit-disabled {
        background-color: #bbb;
        cursor: not-allowed;
      }
  
      @media (max-width: 600px) {
        :host {
          margin: 15px;
        }
  
        form {
          width: 90%;
          padding: 15px;
        }
  
        button {
          font-size: 1em;
          padding: 10px 15px;
        }
      }
  
      @media (min-width: 601px) and (max-width: 900px) {
        form {
          width: 80%;
        }
      }
  
      @media (min-width: 901px) {
        form {
          width: 60%;
        }
      }
    `;
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <form id="addNoteForm">
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" required placeholder="Enter note title">
        <div id="titleError" class="error-message"></div>
  
        <label for="body">Body:</label>
        <textarea id="body" name="body" required placeholder="Enter note body"></textarea>
        <div id="bodyError" class="error-message"></div>
  
        <button type="submit" id="submitBtn" disabled>Add Note</button>
      </form>
    `;
  }

  _setupEventListeners() {
    const form = this._shadowRoot.querySelector('#addNoteForm');
    form.addEventListener('submit', (event) => this._handleSubmit(event));

    // Add real-time validation for title and body
    const titleInput = this._shadowRoot.querySelector('#title');
    const bodyInput = this._shadowRoot.querySelector('#body');

    titleInput.addEventListener('input', () => this._validateTitle(titleInput));
    bodyInput.addEventListener('input', () => this._validateBody(bodyInput));
  }

  _handleSubmit(event) {
    event.preventDefault();

    const title = this._shadowRoot.querySelector('#title').value;
    const body = this._shadowRoot.querySelector('#body').value;

    // Validasi akhir sebelum menambah note
    if (this._isValid(title, body)) {
      const newNote = {
        title: title,
        body: body,
      };

      // Cek apakah semua data catatan baru valid
      if (!newNote.title || !newNote.body) {
        console.error('Invalid note data:', newNote);
        return;
      }

      // Kirim event note-added ke home.js untuk menambahkan catatan baru
      this.dispatchEvent(new CustomEvent('note-added', {
        detail: newNote,
        bubbles: true,
        composed: true,
      }));

      // Mengosongkan input setelah submit
      this._shadowRoot.querySelector('#title').value = '';
      this._shadowRoot.querySelector('#body').value = '';

      // Menampilkan SweetAlert2 saat data berhasil disimpan tanpa tombol OK
      Swal.fire({
        icon: 'success',
        title: 'Note Added!',
        text: 'Your note has been successfully added.',
        showConfirmButton: false,  // Menyembunyikan tombol OK
        timer: 2000,  // Alert akan hilang setelah 2 detik
      });
    } else {
      console.log('Form is invalid.');
    }
  }

  _validateTitle(input) {
    const titleError = this._shadowRoot.querySelector('#titleError');
    const value = input.value;

    if (value.length < 3) {
      titleError.textContent = 'Title must be at least 3 characters';
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else if (/\d/.test(value)) {
      titleError.textContent = 'Title cannot contain numbers';
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else {
      titleError.textContent = '';
      input.classList.add('valid');
      input.classList.remove('invalid');
    }

    this._toggleSubmitButton();
  }

  _validateBody(input) {
    const bodyError = this._shadowRoot.querySelector('#bodyError');
    const value = input.value;

    if (value.length < 3) {
      bodyError.textContent = 'Body must be at least 3 characters';
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else {
      bodyError.textContent = '';
      input.classList.add('valid');
      input.classList.remove('invalid');
    }

    this._toggleSubmitButton();
  }

  _toggleSubmitButton() {
    const titleValid = this._shadowRoot.querySelector('#title').classList.contains('valid');
    const bodyValid = this._shadowRoot.querySelector('#body').classList.contains('valid');
    const submitBtn = this._shadowRoot.querySelector('#submitBtn');

    if (titleValid && bodyValid) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('submit-disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('submit-disabled');
    }
  }

  _isValid(title, body) {
    return title.length >= 3 && body.length >= 3 && !/\d/.test(title);
  }
}

customElements.define('add-form', AddForm);