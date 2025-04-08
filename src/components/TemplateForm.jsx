import React, { useState, useEffect } from 'react';
import '../app.css';

const TemplateForm = ({ plantilla, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    contenido: '',
    tipo: 'email',
    variables: []
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (plantilla) {
      setFormData(plantilla);
    }
  }, [plantilla]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.contenido.trim()) {
      setError('El contenido es requerido');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariablesChange = (e) => {
    const variables = e.target.value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({
      ...prev,
      variables
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="error-message form-space">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <div>
            <h3 className="font-medium">¡Ha ocurrido un error!</h3>
            <p>Por favor corrige los errores abajo.</p>
          </div>
        </div>
      )}

      <div className="form-space">
        <label htmlFor="nombre" className="label">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input-base"
          placeholder="Ingrese el nombre de la plantilla"
        />
      </div>

      <div className="form-space">
        <label htmlFor="tipo" className="label">
          Tipo
        </label>
        <select
          name="tipo"
          id="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="input-base"
        >
          <option value="email">Email</option>
          <option value="documento">Documento</option>
          <option value="mensaje">Mensaje</option>
        </select>
      </div>

      <div className="form-space">
        <label htmlFor="contenido" className="label">
          Contenido
        </label>
        <textarea
          name="contenido"
          id="contenido"
          rows={6}
          value={formData.contenido}
          onChange={handleChange}
          className="textarea"
          placeholder="Ingrese el contenido de la plantilla..."
        />
      </div>

      <div className="form-space">
        <label htmlFor="variables" className="label">
          Variables
        </label>
        <input
          type="text"
          name="variables"
          id="variables"
          value={formData.variables.join(', ')}
          onChange={handleVariablesChange}
          className="input-base"
          placeholder="nombre, fecha, empresa"
        />
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={onCancel}
          className="button button-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="button button-submit"
        >
          {plantilla ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default TemplateForm; 