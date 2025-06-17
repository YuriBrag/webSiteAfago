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
    mocker.patch("builtins.open", mocker.mock_open())
    mocker.patch("app.read_user_credentials", return_value={})

    response = client.post('/api/register', json={
        "email": "existing@example.com",
        "senha": "password123",  # Corrigido para 'senha'
        "nome": "Usuário",
        "sobrenome": "Teste",
        "lembrar_de_mim": False,
        "nivel_de_acesso": "user"
    })

    assert response.status_code == 201 # 201 Created
    data = response.get_json()
    assert data["message"] == "Usuário cadastrado com sucesso! Faça o login agora."

# Teste para o endpoint de registro (usuário já existe)
def test_register_user_exists(client, mocker):
    """Testa a tentativa de registro de um email que já existe."""
    mocker.patch("app.read_user_credentials", return_value={"existing@example.com": {"password": "pass", "role": "user"}})

    response = client.post('/api/register', json={
        "email": "existing@example.com",
        "senha": "password123",  # Corrigido para 'senha'
        "nome": "Usuário",
        "sobrenome": "Teste",
        "lembrar_de_mim": False,
        "nivel_de_acesso": "user"
    })

    assert response.status_code == 409
    data = response.get_json()
    assert data["message"] == "Este email já está cadastrado."

def test_login_success(client, mocker):
    """Testa login bem-sucedido."""
    # Simula as credenciais no arquivo
    mocker.patch("app.read_user_credentials", return_value={
        "user@example.com": {"password": "senha123", "role": "user"}
    })

    response = client.post('/api/login', json={
        "email": "user@example.com",
        "password": "senha123"
    })

    data = response.get_json()
    assert response.status_code == 200
    assert data["message"] == "Login bem-sucedido!"
    assert data["token"] == "dummy-test-token-12345"
    assert data["userEmail"] == "user@example.com"
    assert data["userRole"] == "user"

def test_login_wrong_password(client, mocker):
    """Testa login com senha incorreta."""
    mocker.patch("app.read_user_credentials", return_value={
        "user@example.com": {"password": "senha123", "role": "user"}
    })

    response = client.post('/api/login', json={
        "email": "user@example.com",
        "password": "errada"
    })

    data = response.get_json()
    assert response.status_code == 401
    assert data["message"] == "Credenciais incorretas."

def test_login_missing_fields(client):
    """Testa login com campos faltando."""
    response = client.post('/api/login', json={
        "email": "user@example.com"
    })
    data = response.get_json()
    assert response.status_code == 400
    assert data["message"] == "Email e senha são obrigatórios"

def test_get_profile_data_success(client, mocker):
    """Testa buscar dados de perfil com sucesso."""
    mock_email = "test@example.com"
    sanitized_email = "test_example_com"
    user_dir = f"/algum/caminho/user_data/{sanitized_email}"

    # Mock da função de sanitização
    mocker.patch("app.sanitize_email_for_filename", return_value=sanitized_email)
    # Mock dos caminhos dos arquivos
    mocker.patch("os.path.join", side_effect=lambda *args: "/".join(args))
    # Mock para os.path.exists
    def exists_side_effect(path):
        if path.endswith("properties.txt") or path.endswith("areas.txt"):
            return True
        return False
    mocker.patch("os.path.exists", side_effect=exists_side_effect)
    # Mock para open dos arquivos
    def open_side_effect(path, *args, **kwargs):
        if path.endswith("properties.txt"):
            return mocker.mock_open(read_data="Propriedade1\nPropriedade2\n")()
        if path.endswith("areas.txt"):
            return mocker.mock_open(read_data="Area1\nArea2\n")()
        raise FileNotFoundError
    mocker.patch("builtins.open", side_effect=open_side_effect)

    response = client.get(f'/api/profile-data?email={mock_email}')
    data = response.get_json()

    assert response.status_code == 200
    assert data["properties"] == ["Propriedade1", "Propriedade2"]
    assert data["areas"] == ["Area1", "Area2"]

def test_get_profile_data_missing_email(client):
    """Testa buscar dados de perfil sem informar email."""
    response = client.get('/api/profile-data')
    data = response.get_json()
    assert response.status_code == 400
    assert data["message"] == "Email do usuário é necessário"

