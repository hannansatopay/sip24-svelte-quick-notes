import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://bharath:ZsrB1ybIuCON2y1l@cluster0.plhjgkj.mongodb.net/notesApp', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Note Schema
const noteSchema = new mongoose.Schema({
  title: String,
  note: String,
});

const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const { title, note } = req.body;
  const newNote = new Note({ title, note });
  await newNote.save();
  res.json(newNote);
});

app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(id, { title, note }, { new: true });
  res.json(updatedNote);
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.json({ message: 'Note deleted' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
