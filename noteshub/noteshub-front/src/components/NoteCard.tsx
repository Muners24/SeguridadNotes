import React from 'react';

interface NoteCardProps {
  title: string;
  owner: string;
  editors?: string[];
  texts?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, owner, editors = [], texts = [], onEdit, onDelete }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 w-full max-w-sm border border-gray-100 hover:border-blue-200 flex flex-col">
      {/* Header con título */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      </div>

      {/* Información del propietario y editores */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Propietario</p>
            <p className="text-sm text-gray-800 font-semibold">{owner}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Editores</p>
            <div className="mt-1">
              {editors.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {editors.map((editor, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                      {editor}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Sin editores asignados</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la nota */}
      <div className="mb-4 flex-1">
        <p className="text-xs text-gray-500 font-medium mb-2">Contenido</p>
        {texts.length > 0 ? (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {texts.map((text, index) => (
              <p key={index} className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded">
                {text}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Sin contenido</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Borrar
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
