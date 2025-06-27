import pytest
from models.area import Area

def test_criacao_area():
    area = Area(50, "Pulverização", "Soja", "30 dias")
    assert area.getTamanho() == 50
    assert area.getTipoAplicacao() == "Pulverização"
    assert area.getCultura() == "Soja"
    assert area.getTempoTreinamento() == "30 dias"

def test_setters_area():
    area = Area(10, "Manual", "Milho", "15 dias")
    area.setTamanho(100)
    area.setTipoAplicacao("Tratorizada")
    area.setCultura("Algodão")
    area.setTempoTreinamento("45 dias")
    assert area.getTamanho() == 100
    assert area.getTipoAplicacao() == "Tratorizada"
    assert area.getCultura() == "Algodão"
    assert area.getTempoTreinamento() == "45 dias"

def test_repr_area():
    area = Area(20, "Manual", "Cana", "60 dias")
    rep = repr(area)
    assert "Area" in rep
    assert "20" in rep
    assert "Manual" in rep
    assert "Cana" in rep
    assert "60 dias" in rep

def test_criacao_area_tamanho_invalido():
    with pytest.raises(ValueError):
        Area(0, "Manual", "Soja", "10 dias")
    with pytest.raises(ValueError):
        Area(-5, "Manual", "Soja", "10 dias")
    with pytest.raises(ValueError):
        Area("grande", "Manual", "Soja", "10 dias")

def test_set_tamanho_invalido():
    area = Area(10, "Manual", "Soja", "10 dias")
    with pytest.raises(ValueError):
        area.setTamanho(0)
    with pytest.raises(ValueError):
        area.setTamanho(-1)
    with pytest.raises(ValueError):
        area.setTamanho("pequeno")