import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from './NoteCard';

const NoteList = () => {
  const navigate = useNavigate();

  const handleEdit = (noteData: { title: string; owner: string; editors?: string[] }) => {
    navigate(`/notes/1/edit`, { state: noteData });
  };

  const handleDelete = (title: string) => {
    console.log('Eliminar nota:', title);
    // Aquí iría la lógica para eliminar
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      <NoteCard 
        title='note1' 
        owner='ow1' 
        onEdit={() => handleEdit({ title: 'note1', owner: 'ow1' })}
        onDelete={() => handleDelete('note1')}
      />
      <NoteCard 
        title='note2' 
        owner='ow2' 
        editors={['editor1', 'editor2']} 
        onEdit={() => handleEdit({ title: 'note2', owner: 'ow2', editors: ['editor1', 'editor2'] })}
        onDelete={() => handleDelete('note2')}
      />
      <NoteCard 
        title='note3' 
        owner='ow3' 
        onEdit={() => handleEdit({ title: 'note3', owner: 'ow3' })}
        onDelete={() => handleDelete('note3')}
      />
    </div>
  );
};

export default NoteList;
