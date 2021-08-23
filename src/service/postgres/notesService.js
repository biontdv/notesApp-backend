/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class notesService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addNote({ title, tags, body, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into notes values($1,$2,$3,$4,$5,$6,$7) returning id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getNotes(owner) {
    const query= {
      text: 'select a.*from notes a left join collaborations b on a.id=b.note_id where a.owner=$1 or b.user_id=$1 group by a.id',
      values: [owner]
    }
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  //   async getNoteById(id) {
  //     const result = await this._pool.query(`SELECT * FROM notes WHERE id = ${id}`);
  //     if (!result.rows.length) {
  //       throw new NotFoundError('Catatan tidak ditemukan');
  //     }
  //     return result.rows.map(mapDBToModel)[0];
  //   }

  async verifyNoteOwner(id,owner) {
    const query= {
      text: 'select * from notes where id=$1',
      values: [id]
    }

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const note= result.rows[0]

    if(note.owner!== owner){
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyNoteAccess(noteId,userId) {
    try {
      await this.verifyNoteOwner(noteId,userId)
    } catch (error) {
      if(error instanceof NotFoundError){
      throw error
      }
      try {
        await this._collaborationsService.verifyCollborator(noteId,userId)
      } catch (error) {
        throw error
      }
    }
    

  }

  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModel);
  }

  async editNoteById(id, { title, tags, body }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'update notes set title=$1,tags=$2,body=$3,updatedAt=$4 where id=$5 returning id',
      values: [title, tags, body, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const query = `delete from notes where id=${id} returning id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = notesService;
