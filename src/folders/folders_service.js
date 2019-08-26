const foldersService = {
  getAllFolders(db) {
    return db.select('*').from('folders');
  },
  getById(db, id) {
    return db.select('*').from('folders').where({id}).first();
  },
  insertFolder(db, newFolder) {
    return db.insert(newFolder)
      .into('folders')
      .returning('*')
      .then(rows => {return rows[0]});
  }
};

module.exports = foldersService;