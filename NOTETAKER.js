const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the static files (HTML, CSS, etc.)
app.use(express.static("public"));

const dbFilePath = path.join(__dirname, 'db.json');

function readNotesFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // If the file doesn't exist, initialize it with an empty array
          return fs.writeFile(dbFilePath, '[]', 'utf8', (err) => {
            if (err) reject(err);
            resolve([]);
          });
        }
        return reject(err);
      }

      try {
        const notes = JSON.parse(data);
        resolve(notes);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function writeNotesToFile(notes) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await readNotesFromFile();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read notes data.' });
  }
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body;

  try {
    const notes = await readNotesFromFile();
    newNote.id = uuidv4();
    notes.push(newNote);
    await writeNotesToFile(notes);
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save the new note.' });
  }
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
