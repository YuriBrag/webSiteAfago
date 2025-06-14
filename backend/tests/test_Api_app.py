# tests/test_app.py
import pytest
import json
from app import app # Importe seu app

# Fixture para criar um cliente de teste para todas as funções de teste
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Teste para o endpoint /api/hello
def test_hello_endpoint(client):
    """Testa se o endpoint /api/hello retorna a mensagem correta."""
    response = client.get('/api/hello')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert "message" in data
    assert data["message"] == "Olá! O frontend está conectado com o backend Flask!"

# Teste para o endpoint de registro (caso de sucesso)
def test_register_success(client, mocker): # mocker é para simular (mockar)
    """Testa o registro de um novo usuário com sucesso."""
    # Simula a escrita em arquivo para não criar arquivos reais durante o teste
    mocker.patch("builtins.open", mocker.mock_open())
    # Simula que o usuário ainda não existe
    mocker.patch("app.read_user_credentials", return_value={})

    response = client.post('/api/register', json={
        "email": "newuser@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 201 # 201 Created
    assert b"Usu\u00e1rio cadastrado com sucesso" in response.data # b"" para bytes

# Teste para o endpoint de registro (usuário já existe)
def test_register_user_exists(client, mocker):
    """Testa a tentativa de registro de um email que já existe."""
    # Simula que o usuário já existe no "banco de dados"
    mocker.patch("app.read_user_credentials", return_value={"existing@example.com": "pass"})

    response = client.post('/api/register', json={
        "email": "existing@example.com",
        "password": "password123"
    })

    assert response.status_code == 409 # 409 Conflict
    assert b"Este email j\u00e1 est\u00e1 cadastrado" in response.data