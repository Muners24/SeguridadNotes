import React from 'react';
import NoteCard from './NoteCard';
import { updateUser } from '../api/user';
import useUserStore from '../store/userStore';

const NoteList = () => {
  const {token, user} = useUserStore();

  async function handelClick() {
    await updateUser("nuevo nobmre",token);
  }

  return (
    <>
      <button
        className="bg-amber-500 text-white px-4 py-2 rounded"
        onClick={handelClick}
      >
        Cambiar nombre
      </button>
      <NoteCard title='note1' owner='ow1' onEdit={ () =>console.log("edit") }></NoteCard>
    </>
    
  );
};

export default NoteList;
