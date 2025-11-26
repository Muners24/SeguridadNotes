import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { updateNote, findNote } from '../api/note';
import type { Note } from '../api/note';
import useUserStore from '../store/userStore';

const EditNote = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const { token } = useUserStore();
    
    const [note, setNote] = useState<Note | null>(location.state);
    const [title, setTitle] = useState('');
    const [texts, setTexts] = useState<string[]>([]);
    const [newText, setNewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setTexts(note.texts || []);
        } else if (id) {
            loadNote();
        }
    }, []);

    const loadNote = async () => {
        if (!id || !token) return;
        
        try {
            setLoading(true);
            const fetchedNote = await findNote(id, token);
            setNote(fetchedNote);
            setTitle(fetchedNote.title);
            setTexts(fetchedNote.texts || []);
        } catch (err) {
            alert('Error al cargar la nota: ' + (err instanceof Error ? err.message : 'Error desconocido'));
            navigate('/notes');
        } finally {
            setLoading(false);
        }
    };

    const handleAddText = () => {
        if (newText.trim()) {
            setTexts([...texts, newText.trim()]);
            setNewText('');
        }
    };

    const handleRemoveText = (index: number) => {
        setTexts(texts.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('El título no puede estar vacío');
            return;
        }

        if (!id || !token) return;

        try {
            setSaving(true);
            await updateNote({ id, title, texts }, token);
            navigate('/notes');
        } catch (err) {
            alert('Error al guardar la nota: ' + (err instanceof Error ? err.message : 'Error desconocido'));
            console.error('Error guardando nota:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/notes');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando nota...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a las notas
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Nota</h1>
                    <p className="text-gray-600">Modifica tu nota y gestiona el contenido</p>
                </div>

                {/* Contenedor principal */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Título de la nota */}
                        <div>
                            <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Título
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Título de tu nota"
                            />
                        </div>

                        {/* Información del propietario */}
                        {note && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium">Propietario</p>
                                        <p className="text-sm text-blue-900 font-semibold">{note.owner.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gestión de textos */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Contenidos
                            </label>

                            {/* Lista de textos */}
                            <div className="space-y-2 mb-3">
                                {texts.length > 0 ? (
                                    texts.map((text, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100"
                                        >
                                            <p className="flex-1 text-sm text-gray-700">{text}</p>
                                            <button
                                                onClick={() => handleRemoveText(index)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors flex-shrink-0"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic py-2">No hay contenidos agregados</p>
                                )}
                            </div>

                            {/* Agregar nuevo texto */}
                            <div className="flex gap-2">
                                <textarea
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddText())}
                                    rows={3}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Agregar contenido a la nota..."
                                />
                                <button
                                    onClick={handleAddText}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 self-start"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Agregar
                                </button>
                            </div>
                        </div>

                        {/* Información de editores (solo lectura) */}
                        {note && note.editors && note.editors.length > 0 && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Editores
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {note.editors.map((editor, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200"
                                        >
                                            {editor.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="bg-gray-50 px-8 py-6 flex items-center justify-end gap-3 border-t border-gray-200">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNote;
