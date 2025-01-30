import Utils from '../utils.js';
import NotesApi from '../api/notes-api.js'; // Mengimpor NotesApi yang sudah didefinisikan sebelumnya

const home = () => {
  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteListElement = noteListContainerElement.querySelector('note-list');
  const addFormElement = document.querySelector('add-form');

  // Membuat instance dari NotesApi
  const api = new NotesApi();

  // Fungsi untuk menampilkan catatan dari API
  const showNotes = async () => {
    try {
      // Mengambil catatan dari API
      const apiNotes = await api.getNotes();
      console.log('Notes from API:', apiNotes); // Debugging: log data dari API

      displayResult(apiNotes); // Menampilkan hasil setelah mengambil data dari API
      showNoteList(); // Menampilkan list catatan di UI
    } catch (error) {
      console.log('Error fetching notes from API:', error); // Log error jika terjadi masalah saat fetching dari API
      Utils.showElement(noteListElement); // Menampilkan list meskipun gagal mengambil dari API
    }
  };

  // Fungsi untuk menampilkan hasil catatan ke UI
  const displayResult = (notes) => {
    // Urutkan notes berdasarkan createdAt agar data terbaru tampil di atas
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Map setiap catatan menjadi elemen <note-item>
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note; // Set setiap note item
      noteItemElement.addEventListener('click', () => showSingleNote(note.id)); // Menambahkan listener untuk klik catatan
  
      // Menambahkan tombol Archive
      const archiveButton = document.createElement('button');
      archiveButton.textContent = 'Archive';
      archiveButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Menghindari event click pada item note
        archiveNote(note.id); // Mengarsipkan catatan
      });
      noteItemElement.appendChild(archiveButton); // Menambahkan tombol Archive ke dalam note item
  
      // Menambahkan event listener untuk penghapusan catatan
      noteItemElement.addEventListener('delete-note', () => handleDeleteNote(note));
  
      return noteItemElement;
    });
    noteListElement.innerHTML = ''; // Bersihkan catatan yang ada di dalam list
    noteListElement.append(...noteItemElements); // Tambahkan catatan baru ke dalam list
  };
  

  // Fungsi untuk menampilkan list catatan
  const showNoteList = () => {
    // Tampilkan catatan setelah proses fetching selesai
    Utils.showElement(noteListElement);
  };

  // Fungsi untuk menangani event saat catatan baru ditambahkan
  const handleNewNote = async (event) => {
    const newNote = event.detail; // Mengambil detail catatan baru dari event
    console.log('New note to be added:', newNote); // Debugging: log catatan baru yang akan ditambahkan

    // Menambahkan catatan baru ke API
    await api.createNote(newNote); // Memanggil metode createNote dari NotesApi untuk menyimpan ke API
    console.log('New note added to API:', newNote); // Debugging: log catatan yang ditambahkan ke API

    // Setelah catatan baru ditambahkan ke API, tampilkan catatan terbaru
    showNotes(); // Menampilkan kembali daftar catatan yang telah diperbarui
  };

  // Menambahkan event listener untuk menangani event 'note-added' dari AddForm
  addFormElement.addEventListener('note-added', handleNewNote);

  // Fungsi untuk menampilkan catatan yang diarsipkan
  const showArchivedNotes = async () => {
    try {
      // Mengambil catatan yang diarsipkan dari API
      const archivedNotes = await api.getArchivedNotes();
      console.log('Archived Notes:', archivedNotes); // Debugging: log catatan yang diarsipkan

      displayResult(archivedNotes); // Menampilkan catatan yang diarsipkan ke UI
      showNoteList(); // Menampilkan list catatan di UI
    } catch (error) {
      console.log('Error fetching archived notes from API:', error); // Log error jika terjadi masalah saat fetching
      Utils.showElement(noteListElement); // Menampilkan list meskipun gagal mengambil dari API
    }
  };

  // Fungsi untuk menampilkan catatan tunggal berdasarkan ID
  const showSingleNote = async (noteId) => {
    try {
      // Mengambil catatan tunggal dari API
      const singleNote = await api.getSingleNote(noteId);
      console.log('Single Note:', singleNote); // Debugging: log catatan tunggal

      // Menampilkan catatan tunggal pada UI
      noteDetailElement.innerHTML = `
          <h2>${singleNote.title}</h2>
          <p>${singleNote.body}</p>
          <p><strong>Created At:</strong> ${singleNote.createdAt}</p>
          <p><strong>Archived:</strong> ${singleNote.archived ? 'Yes' : 'No'}</p>
        `;

      Utils.showElement(noteDetailElement); // Menampilkan detail catatan
    } catch (error) {
      console.log('Error fetching single note from API:', error); // Log error jika terjadi masalah saat fetching
    }
  };

  // Fungsi untuk mengarsipkan catatan
  const archiveNote = async (noteId) => {
    try {
      // Mengarsipkan catatan melalui API
      await api.archiveNote(noteId);
      console.log('Note archived successfully'); // Debugging: log setelah catatan berhasil diarsipkan

      // Setelah mengarsipkan, tampilkan daftar catatan yang telah diperbarui
      showNotes();
    } catch (error) {
      console.log('Error archiving note:', error); // Log error jika gagal mengarsipkan
    }
  };

    // Fungsi untuk menangani penghapusan catatan
    const handleDeleteNote = async (note) => {
      try {
        // Menghapus catatan dari API
        await api.deleteNote(note.id);
        console.log('Note deleted from API:', note.id); // Debugging: log catatan yang dihapus
    
        // Menampilkan daftar catatan yang telah diperbarui setelah penghapusan
        showNotes();
      } catch (error) {
        console.log('Error deleting note from API:', error);
      }
    };
    


  // Menambahkan event listener untuk tombol "Show Archived Notes"
  const showArchivedButton = document.querySelector('#showArchivedButton');
  if (showArchivedButton) {
    showArchivedButton.addEventListener('click', showArchivedNotes); // Menampilkan catatan yang diarsipkan saat tombol diklik
  }

  // Menampilkan daftar catatan saat halaman dimuat
  showNotes();
};

export default home;
