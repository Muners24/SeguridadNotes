import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from './NoteCard';
import { updateUser } from '../api/user';
import { listNotes, deleteNote, insertNote, updateNote } from '../api/note';
import type { Note } from '../api/note';
import useUserStore from '../store/userStore';

const NoteList = () => {
  const navigate = useNavigate();
  const { token } = useUserStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Cargar notas al montar el componente
  useEffect(() => {
    loadNotes();
  }, [token]);

  const loadNotes = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const fetchedNotes = await listNotes(token);
      setNotes(fetchedNotes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las notas');
      console.error('Error cargando notas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    navigate(`/notes/${note.id}/edit`, { state: note });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar la nota "${title}"?`)) return;
    
    try {
      await deleteNote(id, token);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      alert('Error al eliminar la nota: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      console.error('Error eliminando nota:', err);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      const result = await insertNote({ title: newNoteTitle }, token);
      
      // Si hay contenido inicial, actualizar la nota
      if (newNoteContent.trim()) {
        await updateNote({
          id: result.inserted_id,
          title: newNoteTitle,
          texts: [newNoteContent]
        }, token);
      }
      
      // Recargar la lista completa de notas para obtener la nota actualizada
      await loadNotes();
      
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowCreateModal(false);
    } catch (err) {
      alert('Error al crear la nota: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      console.error('Error creando nota:', err);
    }
  };

  async function handelClick() {
    await updateUser("nuevo nobmre", token);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header con acciones */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Notas</h1>
            <p className="text-gray-600">Gestiona tus notas de forma segura</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
              onClick={handelClick}
            >
              Cambiar nombre
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Nota
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Grid de notas */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes notas aún</h3>
            <p className="text-gray-500 mb-4">Crea tu primera nota para comenzar</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              Crear Nota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                owner={note.owner.name}
                editors={note.editors?.map(e => e.name)}
                texts={note.texts}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note.id, note.title)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear nota */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear Nueva Nota</h2>
            <div className="mb-6">
              <label htmlFor="noteTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Título de la nota
              </label>
              <input
                id="noteTitle"
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ingresa el título..."
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label htmlFor="noteContent" className="block text-sm font-semibold text-gray-700 mb-2">
                Contenido inicial (opcional)
              </label>
              <textarea
                id="noteContent"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Escribe el contenido inicial de tu nota..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNote}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;

