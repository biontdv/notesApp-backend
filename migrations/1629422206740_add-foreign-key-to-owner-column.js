/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("update notes set owner='old_note' where owner=NULL")
    pgm.addConstraint('notes','fk_notes.owner_user.id','foreign key(owner) references users(id) on delete cascade on update cascade')
};

exports.down = pgm => {};
