import React, { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';

const API_URL = 'http://localhost:5000/api/plantillas';

const Templates = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      const data = await response.json();
      setPlantillas(data);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
      setError('No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  const crearPlantilla = async (plantilla) => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantilla),
      });
      const nuevaPlantilla = await response.json();
      setPlantillas([...plantillas, nuevaPlantilla]);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      setError('No se pudo crear la plantilla. Verifica la conexión con el servidor.');
    }
  };

  const actualizarPlantilla = async (plantilla) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${plantilla._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantilla),
      });
      const plantillaActualizada = await response.json();
      setPlantillas(plantillas.map(p => 
        p._id === plantillaActualizada._id ? plantillaActualizada : p
      ));
      setPlantillaSeleccionada(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al actualizar plantilla:', error);
      setError('No se pudo actualizar la plantilla. Verifica la conexión con el servidor.');
    }
  };

  const eliminarPlantilla = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla?')) return;
    
    try {
      setError(null);
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setPlantillas(plantillas.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      setError('No se pudo eliminar la plantilla. Verifica la conexión con el servidor.');
    }
  };

  const handleRetry = () => {
    cargarPlantillas();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-light text-gray-900">Plantillas</h1>
            <button
              onClick={() => {
                setPlantillaSeleccionada(null);
                setMostrarFormulario(true);
              }}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              disabled={!!error}
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Plantilla
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Modal de formulario */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light">
                  {plantillaSeleccionada ? 'Editar' : 'Nueva'} plantilla
                </h2>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TemplateForm
                plantilla={plantillaSeleccionada}
                onSubmit={plantillaSeleccionada ? actualizarPlantilla : crearPlantilla}
                onCancel={() => setMostrarFormulario(false)}
              />
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de plantillas */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-gray-600"></div>
          </div>
        ) : !error ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {plantillas.length > 0 ? (
              plantillas.map(plantilla => (
                <div
                  key={plantilla._id}
                  className="bg-white border rounded-lg hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-normal text-gray-900">{plantilla.nombre}</h3>
                      <span className="text-xs text-gray-500">
                        {plantilla.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{plantilla.contenido}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {plantilla.variables?.map((variable, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-500"
                        >
                          #{variable}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t">
                      <button
                        onClick={() => {
                          setPlantillaSeleccionada(plantilla);
                          setMostrarFormulario(true);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarPlantilla(plantilla._id)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-sm text-gray-500">No hay plantillas</p>
                <button
                  onClick={() => {
                    setPlantillaSeleccionada(null);
                    setMostrarFormulario(true);
                  }}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  Crear nueva plantilla
                </button>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Templates; 