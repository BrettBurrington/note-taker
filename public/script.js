// Function to fetch notes from the server and display them in the notes.html page
async function getAndDisplayNotes() {
    try {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      const notesList = document.getElementById('note-list');
      notesList.innerHTML = ''; // Clear the existing list before populating it again
  
      // Populate the notesList with each note's title and content
      notes.forEach((note) => {
        const noteItem = document.createElement('li');
        const noteTitle = document.createElement('h3');
        const noteContent = document.createElement('p');
  
        noteTitle.textContent = note.title;
        noteContent.textContent = note.content;
  
        noteItem.appendChild(noteTitle);
        noteItem.appendChild(noteContent);
        notesList.appendChild(noteItem);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  // Function to handle form submission and save a new note
  async function saveNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
  
    if (!noteTitle || !noteContent) {
      alert('Please enter both title and content for the note.');
      return;
    }
  
    const newNote = { title: noteTitle, content: noteContent };
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
  
      if (response.ok) {
        // Clear form fields after successful save
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        getAndDisplayNotes(); // Refresh the list of notes after saving
      } else {
        console.error(response);
        alert('Failed to save the note. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save the note. Please try again.');
    }
  }
  
  document.getElementById('note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveNote();
  });
  
  // Fetch and display the notes when the page loads
  getAndDisplayNotes();
  