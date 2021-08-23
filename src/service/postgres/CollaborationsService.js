const {Pool}= require('pg')
const nanoid = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class collaborationsService{
    constructor() {
        this._pool = new Pool()
    }

    async addCollaboration(noteId,userId){
        const id=`CLB${nanoid(16)}`
        const query={
            text: 'insert into collaborations values ($1, $2, $3) returning id',
            value:[id,noteId,userId]
        }
        const result=await this._pool.query(query)
        if(!result.rowCount){
          throw new InvariantError('Kolaborasi gagal ditambahkan')
        }
        return result.rows[0].id
    }

    async deleteCollaboration(noteId, userId){
        const query={
            text: 'delete from collaborations where note_id=$1 and user_id=$2 returning id',
            values: [noteId,userId]
        }
        const result=await this._pool.query(query)

        if(!result.rowCount){
            throw new InvariantError('Kolaborasi gagal dihapus')
        }

     

    }

    async verifyCollborator(noteId, userId){
        const query={
            text: 'select *from collaborations where note_id=$1 and user_id=$2',
            values: [noteId, userId]
        }
        const result=await this._pool.query(query)
        if(!result.rowCount){
            throw new InvariantError('Kolaborasi gagal diverifikasi')
        }
    }
}

module.exports = collaborationsService