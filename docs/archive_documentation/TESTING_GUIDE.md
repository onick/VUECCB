# 🧪 Guía de Testing - Centro Cultural

## 📋 Descripción General

Este proyecto utiliza pytest como framework de testing. Los tests están organizados en diferentes categorías:
- **Unit Tests**: Prueban componentes individuales
- **Integration Tests**: Prueban la interacción entre componentes
- **E2E Tests**: Prueban flujos completos (por implementar)

## 🚀 Configuración Inicial

### 1. Instalar Dependencias de Testing

```bash
cd backend
pip install -r requirements-test.txt
```

### 2. Configurar Variables de Entorno

Crear archivo `backend/.env.test`:
```env
ENVIRONMENT=testing
MONGO_URL=mongodb://localhost:27017/cultural_center_test
SECRET_KEY=test-secret-key
SENDGRID_API_KEY=test-api-key
```

## 🏃 Ejecutar Tests

### Ejecutar Todos los Tests
```bash
cd backend
pytest
```

### Ejecutar con Coverage
```bash
pytest --cov=backend --cov-report=html
```

### Ejecutar Tests Específicos
```bash
# Solo unit tests
pytest -m unit

# Solo integration tests
pytest -m integration

# Tests de un archivo específico
pytest tests/test_auth.py

# Test específico
pytest tests/test_auth.py::TestAuthentication::test_login_success
```

### Ejecutar con Más Detalle
```bash
# Ver print statements
pytest -s

# Ver más detalles
pytest -vv

# Parar en el primer fallo
pytest -x
```

## 📊 Coverage Report

Después de ejecutar los tests con coverage:
```bash
# Ver reporte en terminal
pytest --cov=backend --cov-report=term-missing

# Generar reporte HTML
pytest --cov=backend --cov-report=html

# Abrir reporte HTML
open htmlcov/index.html  # Mac
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

## 🏗️ Estructura de Tests

```
tests/
├── conftest.py          # Configuración y fixtures compartidas
├── test_auth.py         # Tests de autenticación
├── test_events.py       # Tests de eventos
├── test_reservations.py # Tests de reservas
├── test_analytics.py    # Tests de analytics
└── test_admin.py        # Tests de funciones admin
```

## 📝 Escribir Nuevos Tests

### Ejemplo de Test Unitario
```python
import pytest
from backend.core.security import hash_password, verify_password

class TestSecurity:
    @pytest.mark.unit
    def test_password_hashing(self):
        password = "testpassword123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("wrongpassword", hashed)
```

### Ejemplo de Test de Integración
```python
@pytest.mark.integration
def test_full_reservation_flow(test_client, auth_headers, test_event_data):
    # Crear evento
    response = test_client.post("/api/events", json=test_event_data)
    event_id = response.json()["id"]
    
    # Hacer reserva
    reservation_data = {"event_id": event_id}
    response = test_client.post(
        "/api/reservations", 
        json=reservation_data,
        headers=auth_headers
    )
    assert response.status_code == 201
    
    # Verificar reserva
    response = test_client.get("/api/reservations", headers=auth_headers)
    reservations = response.json()
    assert len(reservations) == 1
```

## 🔧 Fixtures Disponibles

### Fixtures de Datos
- `test_user_data`: Datos de usuario de prueba
- `test_admin_data`: Datos de admin de prueba
- `test_event_data`: Datos de evento de prueba

### Fixtures de Autenticación
- `auth_headers`: Headers con token de usuario regular
- `admin_auth_headers`: Headers con token de admin

### Fixtures de Utilidad
- `test_db`: Conexión a base de datos de prueba
- `test_client`: Cliente HTTP de prueba
- `mock_email_service`: Mock del servicio de email

## 🐛 Debugging Tests

### Usar pdb (Python Debugger)
```python
def test_something():
    # Agregar breakpoint
    import pdb; pdb.set_trace()
    
    # Tu código de test
```

### Ejecutar con pdb
```bash
pytest --pdb  # Entra a pdb cuando falla un test
```

## ⚡ Best Practices

1. **Aislamiento**: Cada test debe ser independiente
2. **Nombres Descriptivos**: Los nombres deben describir qué se está probando
3. **Arrange-Act-Assert**: Estructura clara en cada test
4. **Mocks**: Usar mocks para servicios externos (email, APIs)
5. **Fixtures**: Reutilizar datos de prueba con fixtures
6. **Markers**: Usar markers para categorizar tests

## 🔍 Troubleshooting

### MongoDB Connection Error
```bash
# Asegurarse que MongoDB está corriendo
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Import Errors
```bash
# Ejecutar desde el directorio backend
cd backend
python -m pytest
```

### Coverage No Alcanza el Mínimo
```bash
# Ver qué líneas faltan por cubrir
pytest --cov=backend --cov-report=term-missing
```

## 📚 Recursos Adicionales

- [Pytest Documentation](https://docs.pytest.org/)
- [Pytest-cov Documentation](https://pytest-cov.readthedocs.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices)

---

¡Happy Testing! 🎉