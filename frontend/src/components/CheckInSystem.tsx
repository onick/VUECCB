}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={methods.find(m => m.id === method)?.placeholder}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={checkInStatus === 'searching' || checkInStatus === 'success'}
              />
              <button
                onClick={handleSearch}
                disabled={!searchValue.trim() || checkInStatus === 'searching' || checkInStatus === 'success'}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-ccb-blue text-white rounded-md hover:bg-ccb-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Estados de búsqueda */}
          {checkInStatus === 'searching' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ccb-blue"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Buscando reserva...</span>
            </motion.div>
          )}

          {checkInStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    No se encontró la reserva
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="mt-3 px-3 py-1 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
              >
                Intentar de nuevo
              </button>
            </motion.div>
          )}

          {checkInStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ¡Check-in Exitoso!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                El check-in se ha realizado correctamente
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Información de la reserva encontrada */}
      {foundReservation && checkInStatus === 'found' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reserva Encontrada
          </h3>

          <div className="space-y-4">
            {/* Información del usuario */}
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-12 h-12 bg-ccb-blue/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-ccb-blue" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {foundReservation.user?.nombre} {foundReservation.user?.apellido}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {foundReservation.user?.email}
                </p>
                {foundReservation.user?.telefono && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {foundReservation.user.telefono}
                  </p>
                )}
              </div>
            </div>

            {/* Información del evento */}
            {foundReservation.event && (
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(foundReservation.event.date)} a las {foundReservation.event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {foundReservation.event.location}
                </div>
              </div>
            )}

            {/* Detalles de la reserva */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Código:</span>
                <p className="font-mono text-lg text-gray-900 dark:text-white">
                  {foundReservation.codigo_reserva}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Asistentes:</span>
                <p className="text-lg text-gray-900 dark:text-white">
                  {foundReservation.numero_asistentes}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  foundReservation.estado === 'confirmada' 
                    ? 'bg-green-100 text-green-800' 
                    : foundReservation.estado === 'asistio'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {foundReservation.estado === 'confirmada' ? 'Confirmada' : 
                   foundReservation.estado === 'asistio' ? 'Ya asistió' : 
                   foundReservation.estado}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reservado:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(foundReservation.created_at)}
                </p>
              </div>
            </div>

            {/* Check-in previo */}
            {foundReservation.fecha_checkin && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Check-in ya realizado
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {formatDate(foundReservation.fecha_checkin)} a las {formatTime(foundReservation.fecha_checkin)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              
              {foundReservation.estado === 'confirmada' && (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Procesando...' : 'Realizar Check-in'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Métodos de Check-in Disponibles:
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Código QR:</strong> Escanea el código QR desde la reserva</li>
          <li>• <strong>Código:</strong> Ingresa el código alfanumérico de 8 caracteres</li>
          <li>• <strong>Email:</strong> Busca por dirección de correo electrónico</li>
          <li>• <strong>Teléfono:</strong> Busca por número de teléfono</li>
        </ul>
      </div>
    </div>
  );
}