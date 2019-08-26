const notesService = {
  getAllNotes(db) {
    return db.select('*').from('notes');
  },
  getById(db, id) {
    return db.select('*').from('notes').where({id}).first();
  },
  insertNote(db, newNote) {
    return db.insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => {return rows[0]});
  },
  deleteNote(db, id) {
    return db('notes')
      .where({id})
      .delete();
  },
  updateNote(db, id, newNoteFields) {
    return db('notes')
      .where({id})
      .update(newNoteFields);
  }
};

module.exports = notesService;