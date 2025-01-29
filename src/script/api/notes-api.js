class NotesApi {
  constructor() {
    this.baseUrl = 'https://notes-api.dicoding.dev/v2'; // Base URL di dalam kelas
  }

  // Method untuk mengambil catatan dari API
  async getNotes() {
    try {
      const response = await fetch(`${this.baseUrl}/notes`);
      const responseJson = await response.json();
      console.log('Response from API:', responseJson); // Log untuk debugging
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson.data; // Kembalikan data catatan dari API
    } catch (error) {
      console.error('Error fetching notes:', error); // Log error jika terjadi masalah saat fetching dari API
      throw error; // Meneruskan error
    }
  }

  // Method untuk membuat catatan baru
  async createNote(note) {
    try {
      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Ambil detail kesalahan dari respons
        console.error('Error response from server:', errorDetails);
        throw new Error(`API Error: ${errorDetails.message || 'Unknown error'}`);
      }

      const responseJson = await response.json();
      return responseJson; // Kembalikan hasil dari API
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }


  // Method untuk mengupdate catatan
  async updateNote(note) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      const responseJson = await response.json();
      return responseJson; // Kembalikan hasil dari API
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  // Method untuk menghapus catatan
  async deleteNote(noteId) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
        method: 'DELETE',
      });
      const responseJson = await response.json();
      return responseJson; // Kembalikan hasil dari API
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

export default NotesApi;