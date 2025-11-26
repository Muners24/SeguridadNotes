import React from 'react';

interface NoteCardProps {
  title: string;
  owner: string;
  editors?: string[];          // opcional
  onEdit?: () => void;         // opcional
  onDelete?: () => void;       // opcional
}

const NoteCard: React.FC<NoteCardProps> = ({ title, owner, editors = [], onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      <p className="text-sm text-gray-600 mb-1">
        <span className="font-semibold">Owner:</span> {owner}
      </p>

      <p className="text-sm text-gray-600 mb-4">
        <span className="font-semibold">Editors:</span> {editors.length > 0 ? editors.join(', ') : 'Ninguno'}
      </p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Borrar
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
