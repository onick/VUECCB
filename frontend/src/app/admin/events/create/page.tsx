-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Capacidad y Detalles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-ccb-blue" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Capacidad y Detalles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacidad Máxima *
              </label>
              <input
                {...register('capacity', { valueAsNumber: true })}
                type="number"
                min="1"
                max="1000"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio (RD$) - Opcional
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Instructor */}
            {(watchedCategory === 'Talleres' || watchedCategory === 'Charlas/Conferencias') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructor/Facilitador
                </label>
                <input
                  {...register('instructor')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del instructor"
                />
                {errors.instructor && (
                  <p className="mt-1 text-sm text-red-600">{errors.instructor.message}</p>
                )}
              </div>
            )}

            {/* Requisitos */}
            <div className={watchedCategory === 'Talleres' || watchedCategory === 'Charlas/Conferencias' ? '' : 'md:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requisitos/Notas Adicionales
              </label>
              <textarea
                {...register('requirements')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                placeholder="Requisitos, materiales necesarios, edad mínima, etc."
              />
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Imagen */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <ImageIcon className="w-5 h-5 text-ccb-blue" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Imagen del Evento
            </h2>
          </div>

          <div className="space-y-4">
            {/* URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de la Imagen
              </label>
              <input
                {...register('image_url')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
              )}
            </div>

            {/* Upload de imagen */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                O sube una imagen desde tu dispositivo
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                </div>
              </label>
            </div>

            {/* Vista previa de la imagen */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vista Previa:
                </p>
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-6 py-3 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>
              {loading ? 'Creando...' : 'Crear Evento'}
            </span>
          </button>
        </motion.div>
      </form>
    </div>
  );
}