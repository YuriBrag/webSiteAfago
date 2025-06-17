import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_add_property_success(client):
    data = {
        "email": "test@example.com",
        "nome": "Fazenda Teste",
        "tamanho": 100,
        "clima": "Tropical",
        "solo": "Argiloso",
        "endereco": "Rua 1, 123"
    }
    response = client.post('/api/properties', json=data)
    assert response.status_code == 201
    assert "Propriedade adicionada com sucesso" in response.get_json()["message"]

def test_add_property_missing_fields(client):
    data = {
        "email": "test@example.com",
        "nome": "",
        "tamanho": 100
    }
    response = client.post('/api/properties', json=data)
    assert response.status_code == 400
    assert "necessários" in response.get_json()["message"]

def test_add_property_invalid_tamanho(client):
    data = {
        "email": "test@example.com",
        "nome": "Fazenda Teste",
        "tamanho": -5,
        "clima": "Tropical",
        "solo": "Argiloso",
        "endereco": "Rua 1, 123"
    }
    response = client.post('/api/properties', json=data)
    assert response.status_code == 400
    assert "Erro ao criar propriedade" in response.get_json()["message"]

def test_add_area_success(client):
    # Primeiro, adiciona uma propriedade para garantir que ela existe
    prop_data = {
        "email": "test2@example.com",
        "nome": "Fazenda Area",
        "tamanho": 50,
        "clima": "Seco",
        "solo": "Arenoso",
        "endereco": "Rua 2, 456"
    }
    client.post('/api/properties', json=prop_data)
    area_data = {
        "email": "test2@example.com",
        "propertyName": "Fazenda Area",
        "tamanho": 10,
        "tipo_aplicacao": "Manual",
        "cultura": "Soja",
        "tempo_tratamento": "30 dias"
    }
    response = client.post('/api/areas', json=area_data)
    assert response.status_code == 201
    assert "Área adicionada com sucesso" in response.get_json()["message"]

def test_add_area_missing_fields(client):
    data = {
        "email": "test2@example.com",
        "propertyName": "",
        "tamanho": 10
    }
    response = client.post('/api/areas', json=data)
    assert response.status_code == 400
    assert "necessários" in response.get_json()["message"]
