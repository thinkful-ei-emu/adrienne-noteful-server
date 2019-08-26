const notesService = require('./notes_service');
const path = require('path');
const express = require('express');
const jsonBodyParser = express.json();
const logger = require('../logger');
const xss = require('xss');
const notesRouter = express.Router();

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  date_modified: note.date_modified,
  folder_id: note.folder_id,
  content: xss(note.content)
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    notesService.getAllNotes(req.app.get('db'))
      .then(note => {
        res.json(note.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    for (const field of ['note_name']) {
      if(!req.body[field]) {
        logger.error(`'${field}' is required`);
        return res.status(400).send({ error: { message: `'${field}' is required`}});
      }
    }
    const { note_name, date_modified, folder_id, content} = req.body;
    const newNote = { note_name, date_modified, folder_id, content };
    notesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        logger.info(`Note with id ${note.id} created`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

notesRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    function validateId(id) {
      return !isNaN(id);
    }
    if(validateId(id)) {
      notesService.getById(req.app.get('db'), id)
        .then(note => {
          if(!note) {
            logger.error(`Note with id ${id} not found`);
            return res.status(400).json({
              error: { message: 'Note Not Found'}
            });
          }
          res.note = note;
          next();
        })
        .catch(next);
    }
  })
  .get((req, res, next) => {
    res.status(200);
    res.json(res.note);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    notesService.deleteNote(
      req.app.get('db'),
      id
    )
      .then(numRowsAffected => {
        logger.info(`Card with id '${id}' deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { note_name, content } = req.body;
    const noteToUpdate = { note_name, content };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({ error: { Message: 'Request body must contain either "note_name" or "content"'}});
    }

    notesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;