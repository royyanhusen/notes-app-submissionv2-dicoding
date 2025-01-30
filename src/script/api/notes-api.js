class NotesApi {
  constructor() {
    this.baseUrl = "https://notes-api.dicoding.dev/v2"; // Base URL di dalam kelas
  }

  // Method POST membuat catatan baru
  async createNote(note) {
    try {
      const response = await fetch(`${this.baseUrl}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Ambil detail kesalahan dari respons
        console.error("Error response from server:", errorDetails);
        throw new Error(
          `API Error: ${errorDetails.message || "Unknown error"}`,
        );
      }

      const responseJson = await response.json();
      return responseJson; // Kembalikan hasil dari API
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  }

  // Method GET notes non-archived
  async getNotes() {
    try {
      const response = await fetch(`${this.baseUrl}/notes`);
      const responseJson = await response.json();
      console.log("Response from API:", responseJson); // Log untuk debugging
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson.data; // Kembalikan data catatan dari API
    } catch (error) {
      console.error("Error fetching notes:", error); // Log error jika terjadi masalah saat fetching dari API
      throw error; // Meneruskan error
    }
  }

  // Method GET archived notes
  async getArchivedNotes() {
    try {
      const response = await fetch(`${this.baseUrl}/notes/archived`);
      const responseJson = await response.json();
      console.log("Archived Notes from API:", responseJson); // Log untuk debugging
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson.data; // Kembalikan data catatan yang diarsipkan
    } catch (error) {
      console.error("Error fetching archived notes:", error); // Log error jika terjadi masalah saat fetching dari API
      throw error; // Meneruskan error
    }
  }

  //  Method GET single note
  async getSingleNote(note_id) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${note_id}`);
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson.data; // Mengembalikan data catatan tunggal
    } catch (error) {
      console.error("Error fetching single note:", error);
      throw error;
    }
  }

  // Method POST untuk archived note
  async archiveNote(note_id) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${note_id}/archive`, {
        method: "POST",
      });
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson; // Kembalikan hasil setelah berhasil mengarsipkan
    } catch (error) {
      console.error("Error archiving note:", error);
      throw error;
    }
  }

  // Method POST untuk unarchived note
  async unarchiveNote(note_id) {
    try {
      const response = await fetch(
        `${this.baseUrl}/notes/${note_id}/unarchive`,
        {
          method: "POST",
        },
      );
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson; // Kembalikan hasil setelah berhasil mengarsipkan
    } catch (error) {
      console.error("Error archiving note:", error);
      throw error;
    }
  }

  // Method untuk menghapus catatan
  async deleteNote(note_id) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${note_id}`, {
        method: "DELETE",
      });
      const responseJson = await response.json();
      return responseJson; // Kembalikan hasil dari API
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  }
}

export default NotesApi;
