import pytest
from models.propriedade import Propriedade

def test_criacao_propriedade():
    prop = Propriedade("Fazenda Boa Vista", 100, "Tropical", "Argiloso", "Rua 1, 123")
    assert prop.get_nome() == "Fazenda Boa Vista"
    assert prop.get_tamanho() == 100
    assert prop.get_clima() == "Tropical"
    assert prop.get_solo() == "Argiloso"
    assert prop.get_endereco() == "Rua 1, 123"
    assert prop.get_areas() == []

def test_setters_propriedade():
    prop = Propriedade("A", 1, "B", "C", "D")
    prop.set_nome("Nova Fazenda")
    prop.set_tamanho(200)
    prop.set_clima("Semiárido")
    prop.set_solo("Arenoso")
    prop.set_endereco("Av. Central, 456")
    prop.set_areas(["Area 1", "Area 2"])
    assert prop.get_nome() == "Nova Fazenda"
    assert prop.get_tamanho() == 200
    assert prop.get_clima() == "Semiárido"
    assert prop.get_solo() == "Arenoso"
    assert prop.get_endereco() == "Av. Central, 456"
    assert prop.get_areas() == ["Area 1", "Area 2"]

def test_add_area():
    prop = Propriedade("Fazenda", 50, "Tropical", "Argiloso", "Rua 2")
    prop.add_area("Area Nova")
    assert prop.get_areas() == ["Area Nova"]
    prop.add_area("Area Extra")
    assert prop.get_areas() == ["Area Nova", "Area Extra"]

def test_repr_propriedade():
    prop = Propriedade("Fazenda", 10, "Tropical", "Argiloso", "Rua 3", ["A1"])
    rep = repr(prop)
    assert "Propriedade" in rep
    assert "Fazenda" in rep
    assert "A1" in rep

def test_propriedade_nome_vazio():
    with pytest.raises(ValueError):
        Propriedade("", 100, "Tropical", "Argiloso", "Rua 1")

def test_propriedade_tamanho_negativo():
    with pytest.raises(ValueError):
        Propriedade("Fazenda", -10, "Tropical", "Argiloso", "Rua 2")

def test_propriedade_tamanho_zero():
    with pytest.raises(ValueError):
        Propriedade("Fazenda", 0, "Tropical", "Argiloso", "Rua 3")