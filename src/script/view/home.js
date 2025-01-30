import Utils from "../utils.js";
import NotesApi from "../api/notes-api.js";

const home = () => {
  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteLoadingElement = noteListContainerElement.querySelector(".loading"); // Loading hanya untuk daftar catatan
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const addFormElement = document.querySelector("add-form");

  // Declaring the noteDetailElement for displaying a single note
  const noteDetailElement = document.querySelector("#noteDetailElement");

  // Create instance of NotesApi
  const api = new NotesApi();

  // Function to fetch both active and archived notes from the API
  const showNotes = async () => {
    try {
      showLoading(); // Menampilkan indikator loading

      // Fetch active notes
      const apiNotes = await api.getNotes();
      console.log("Active Notes from API:", apiNotes);

      // Fetch archived notes
      const archivedNotes = await api.getArchivedNotes();
      console.log("Archived Notes from API:", archivedNotes);

      // Combine both active and archived notes
      const combinedNotes = [...apiNotes, ...archivedNotes];

      // Display the combined notes
      displayResult(combinedNotes);

      // Pastikan daftar catatan muncul setelah data diambil
      showNoteList();
    } catch (error) {
      console.log("Error fetching notes from API:", error);
      Utils.showElement(noteListElement); // Menampilkan daftar catatan meski terjadi error
    } finally {
      hideLoading(); // Menyembunyikan indikator loading setelah permintaan selesai
    }
  };

  // Menampilkan indikator loading
  const showLoading = () => {
    Utils.hideElement(noteListElement); // Sembunyikan daftar catatan selama loading
    Utils.showElement(noteLoadingElement); // Tampilkan loading di bawah daftar catatan
  };

  // Menyembunyikan indikator loading
  const hideLoading = () => {
    Utils.hideElement(noteLoadingElement); // Sembunyikan indikator loading
    Utils.showElement(noteListElement); // Tampilkan daftar catatan
  };

  // Fungsi untuk menampilkan daftar catatan di UI
  const displayResult = (notes) => {
    // Mengurutkan catatan berdasarkan tanggal pembuatan
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Membuat elemen <note-item> untuk setiap catatan
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note; // Menetapkan setiap catatan
      noteItemElement.addEventListener("click", () => showSingleNote(note.id)); // Tampilkan catatan tunggal saat diklik

      // Menambahkan tombol Archive
      const archiveButton = document.createElement("button");
      archiveButton.textContent = note.archived ? "Unarchive" : "Archive";
      archiveButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Mencegah event bubbling
        toggleArchive(note.id, note.archived); // Toggle status arsip
      });
      noteItemElement.appendChild(archiveButton); // Menambahkan tombol Archive

      // Menambahkan tombol Delete
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        handleDeleteNote(note); // Menangani penghapusan catatan
      });
      noteItemElement.appendChild(deleteButton); // Menambahkan tombol Delete

      return noteItemElement;
    });

    // Mengosongkan daftar yang ada dan menambahkan catatan baru
    noteListElement.innerHTML = "";
    noteListElement.append(...noteItemElements);
  };

  // Menampilkan daftar catatan
  const showNoteList = () => {
    Utils.showElement(noteListElement);
  };

  // Menangani penambahan catatan baru
  const handleNewNote = async (event) => {
    const newNote = event.detail; // Mendapatkan detail catatan baru dari event
    console.log("New note to be added:", newNote);

    // Membuat catatan baru melalui API
    await api.createNote(newNote);
    console.log("New note added to API:", newNote);

    // Memperbarui daftar catatan setelah penambahan
    showNotes(); // Tidak perlu menampilkan loading di sini
  };

  // Event listener untuk menambahkan catatan baru
  addFormElement.addEventListener("note-added", handleNewNote);

  // Menampilkan detail dari catatan tunggal
  const showSingleNote = async (noteId) => {
    try {
      const singleNote = await api.getSingleNote(noteId);
      console.log("Single Note:", singleNote);

      // Menampilkan detail catatan di UI
      noteDetailElement.innerHTML = `
        <h2>${singleNote.title}</h2>
        <p>${singleNote.body}</p>
        <p><strong>Created At:</strong> ${new Date(singleNote.createdAt).toLocaleString()}</p>
        <p><strong>Archived:</strong> ${singleNote.archived ? "Yes" : "No"}</p>
      `;
      Utils.showElement(noteDetailElement); // Menampilkan elemen detail catatan
    } catch (error) {
      console.log("Error fetching single note from API:", error);
    }
  };

  // Mengubah status arsip dari catatan
  const toggleArchive = async (noteId, isArchived) => {
    try {
      if (isArchived) {
        await api.unarchiveNote(noteId); // Unarchive catatan
        console.log("Note unarchived successfully");
      } else {
        await api.archiveNote(noteId); // Archive catatan
        console.log("Note archived successfully");
      }
      // Memperbarui daftar catatan setelah mengubah status arsip
      showNotes();
    } catch (error) {
      console.log("Error toggling archive state:", error);
    }
  };

  // Menangani penghapusan catatan
  const handleDeleteNote = async (note) => {
    try {
      await api.deleteNote(note.id); // Menghapus catatan dari API
      console.log("Note deleted from API:", note.id);

      // Memperbarui daftar catatan setelah penghapusan
      showNotes();
    } catch (error) {
      console.log("Error deleting note from API:", error);
    }
  };

  showNotes();
};

export default home;
