import Utils from "../utils.js";
import NotesApi from "../api/notes-api.js";

const home = () => {
  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const addFormElement = document.querySelector("add-form");

  const noteDetailElement = document.querySelector("#noteDetailElement");
  const api = new NotesApi();

  // Function to show the loading spinner
  const showLoading = () => {
    Utils.hideElement(noteListElement); // Hide note list while loading
    const loadingSpinner =
      noteListContainerElement.querySelector("loading-spinner");
    loadingSpinner.style.display = "block"; // Show spinner
  };

  // Function to hide the loading spinner
  const hideLoading = () => {
    const loadingSpinner =
      noteListContainerElement.querySelector("loading-spinner");
    loadingSpinner.style.display = "none"; // Hide spinner
    Utils.showElement(noteListElement); // Show note list again
  };

  // Fetch and display notes (both active and archived)
  const showNotes = async () => {
    try {
      showLoading(); // Show loading spinner before starting the HTTP request

      const apiNotes = await api.getNotes(); // Fetch active notes
      const archivedNotes = await api.getArchivedNotes(); // Fetch archived notes
      const combinedNotes = [...apiNotes, ...archivedNotes]; // Combine both sets of notes

      displayResult(combinedNotes); // Display the notes in the UI
      showNoteList(); // Ensure the note list is visible
    } catch (error) {
      console.log("Error fetching notes from API:", error);
      Utils.showElement(noteListElement); // Show notes even in case of error
    } finally {
      hideLoading(); // Hide loading spinner after the request is complete
    }
  };

  // Display the list of notes in the UI
  const displayResult = (notes) => {
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort notes by creation date

    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note;
      noteItemElement.addEventListener("click", () => showSingleNote(note.id));

      // Archive button
      const archiveButton = document.createElement("button");
      archiveButton.textContent = note.archived ? "Unarchive" : "Archive";
      archiveButton.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleArchive(note.id, note.archived); // Toggle archive state
      });
      noteItemElement.appendChild(archiveButton);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        handleDeleteNote(note); // Handle note deletion
      });
      noteItemElement.appendChild(deleteButton);

      return noteItemElement;
    });

    // Clear the note list and append new items
    noteListElement.innerHTML = "";
    noteListElement.append(...noteItemElements);
  };

  // Show the note list in the UI
  const showNoteList = () => {
    Utils.showElement(noteListElement);
  };

  // Handle adding a new note
  const handleNewNote = async (event) => {
    try {
      showLoading(); // Show loading spinner before creating the note

      const newNote = event.detail; // Get the new note from the event
      await api.createNote(newNote); // Create the new note via API
      showNotes(); // Refresh the notes list
    } catch (error) {
      console.log("Error creating note:", error);
    } finally {
      hideLoading(); // Hide loading spinner after request completion
    }
  };

  // Handle viewing a single note
  const showSingleNote = async (noteId) => {
    try {
      const singleNote = await api.getSingleNote(noteId); // Fetch a single note
      noteDetailElement.innerHTML = `
        <h2>${singleNote.title}</h2>
        <p>${singleNote.body}</p>
        <p><strong>Created At:</strong> ${new Date(singleNote.createdAt).toLocaleString()}</p>
        <p><strong>Archived:</strong> ${singleNote.archived ? "Yes" : "No"}</p>
      `;
      Utils.showElement(noteDetailElement); // Show note detail view
    } catch (error) {
      console.log("Error fetching single note from API:", error);
    }
  };

  // Toggle the archive status of a note (archive/unarchive)
  const toggleArchive = async (noteId, isArchived) => {
    try {
      if (isArchived) {
        await api.unarchiveNote(noteId); // Unarchive the note
      } else {
        await api.archiveNote(noteId); // Archive the note
      }

      showNotes(); // Refresh the notes list
    } catch (error) {
      console.log("Error toggling archive state:", error);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (note) => {
    try {
      await api.deleteNote(note.id); // Delete the note via API
      showNotes(); // Refresh the notes list
    } catch (error) {
      console.log("Error deleting note from API:", error);
    } finally {
      hideLoading(); // Hide loading spinner after request completion
    }
  };

  addFormElement.addEventListener("note-added", handleNewNote);
  showNotes();
};

export default home;
