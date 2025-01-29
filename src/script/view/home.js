import Utils from '../utils.js';
import NotesApi from '../api/notes-api.js'; // Mengimpor NotesApi yang sudah didefinisikan sebelumnya

const home = () => {
  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteListElement = noteListContainerElement.querySelector('note-list');
  const addFormElement = document.querySelector('add-form'); // Elemen untuk form penambahan catatan

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

  // Menampilkan daftar catatan saat halaman dimuat
  showNotes();
};

export default home;
