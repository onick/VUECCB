import React, { useState } from 'react';

const BulkUserImport = ({ onImportComplete, onClose }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [defaultPassword, setDefaultPassword] = useState('changeme123');
  const [dragActive, setDragActive] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setImportResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV o Excel (.csv, .xls, .xlsx)');
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Upload and process file
  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setIsUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('default_password', defaultPassword);

      const response = await fetch(`${BACKEND_URL}/api/admin/users/bulk-import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        setImportResult(result);
        if (onImportComplete) {
          onImportComplete(result);
        }
      } else {
        throw new Error(result.detail || 'Error en la importación');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Get file size in readable format
  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Download template CSV
  const downloadTemplate = () => {
    const csvContent = `name,email,phone,age,location
Juan Pérez,juan.perez@example.com,809-555-0001,25,Santo Domingo
María García,maria.garcia@example.com,809-555-0002,30,Santiago
Carlos López,carlos.lopez@example.com,809-555-0003,28,La Vega`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_usuarios.csv';
    link.click();
  };

  if (importResult) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <i className="bx bx-bar-chart mr-2"></i>
              Resultado de Importación
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{importResult.total_processed}</p>
                <p className="text-sm text-gray-600">Total Procesados</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{importResult.successful_imports}</p>
                <p className="text-sm text-gray-600">Importados</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{importResult.failed_imports}</p>
                <p className="text-sm text-gray-600">Fallos</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{importResult.duplicate_emails}</p>
                <p className="text-sm text-gray-600">Duplicados</p>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tasa de Éxito</span>
                <span className="text-sm text-gray-500">
                  {importResult.total_processed > 0 
                    ? Math.round((importResult.successful_imports / importResult.total_processed) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${importResult.total_processed > 0 
                      ? (importResult.successful_imports / importResult.total_processed) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Imported Users */}
            {importResult.imported_users.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <i className="bx bx-check mr-2"></i>
                  Usuarios Importados Exitosamente
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {importResult.imported_users.map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{user.email}</span>
                      </div>
                      <span className="text-xs text-gray-400">{user.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                  <i className="bx bx-x mr-2"></i>
                  Errores Encontrados
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {importResult.errors.map((error, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-red-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-red-700">Fila {error.row}:</span>
                          <span className="text-sm text-red-600 ml-2">{error.error}</span>
                        </div>
                      </div>
                      {error.data && (
                        <div className="text-xs text-gray-500 mt-1">
                          Datos: {JSON.stringify(error.data)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setImportResult(null);
                  setFile(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Importar Más
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="bx bx-upload mr-2"></i>
            Importar Usuarios en Lote
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <i className="bx bx-list-ul mr-2"></i>
              Instrucciones
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sube un archivo CSV o Excel (.csv, .xls, .xlsx)</li>
              <li>• Columnas requeridas: <strong>name, email, phone, age, location</strong></li>
              <li>• También acepta variaciones como: nombre, correo, telefono, edad, ciudad</li>
              <li>• Los emails duplicados serán omitidos</li>
              <li>• Todos los usuarios tendrán la contraseña temporal que especifiques</li>
            </ul>
            <button
              onClick={downloadTemplate}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <i className="bx bx-download mr-1"></i>
              Descargar plantilla CSV
            </button>
          </div>

          {/* Password Configuration */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Temporal para Usuarios Nuevos
            </label>
            <input
              type="text"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña temporal..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta contraseña será asignada a todos los usuarios importados
            </p>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{getFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover archivo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Arrastra tu archivo aquí, o{' '}
                    <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      selecciona un archivo
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500">CSV, XLS o XLSX hasta 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !file || isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center">
                  <i className="bx bx-upload mr-2"></i>
                  Importar Usuarios
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUserImport; 