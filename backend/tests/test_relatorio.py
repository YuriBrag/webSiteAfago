import pytest
from models.relatorio import RelatorioGrandeProdutor, RelatorioFactory

def test_relatorio_grande_produtor_preenchimento_sucesso():
    rel = RelatorioGrandeProdutor()
    rel.coletar_dados(
        area_aplicacao="Área 1",
        modo_aplicacao="Pulverização",
        frequencia_aplicacao="Semanal",
        data_aplicacao="2025-06-17",
        cultura="Soja"
    )
    rel.validar()  # Não deve lançar exceção
    d = rel.to_dict()
    assert d["area_aplicacao"] == "Área 1"
    assert d["modo_aplicacao"] == "Pulverização"
    assert d["frequencia_aplicacao"] == "Semanal"
    assert d["data_aplicacao"] == "2025-06-17"
    assert d["cultura"] == "Soja"

def test_relatorio_grande_produtor_factory():
    rel = RelatorioFactory.criar_relatorio(
        'grande_produtor',
        area_aplicacao="Área 2",
        modo_aplicacao="Manual",
        frequencia_aplicacao="Mensal",
        data_aplicacao="2025-06-18",
        cultura="Milho"
    )
    assert isinstance(rel, RelatorioGrandeProdutor)
    assert rel.area_aplicacao == "Área 2"
    assert rel.modo_aplicacao == "Manual"
    assert rel.frequencia_aplicacao == "Mensal"
    assert rel.data_aplicacao == "2025-06-18"
    assert rel.cultura == "Milho"

def test_relatorio_grande_produtor_validacao_falha():
    rel = RelatorioGrandeProdutor()
    rel.coletar_dados(
        area_aplicacao="Área 1",
        modo_aplicacao="Pulverização",
        frequencia_aplicacao="Semanal",
        data_aplicacao=None,  # Campo faltando
        cultura="Soja"
    )
    with pytest.raises(ValueError):
        rel.validar()

def test_relatorio_factory_tipo_desconhecido():
    with pytest.raises(ValueError):
        RelatorioFactory.criar_relatorio('tipo_inexistente', area_aplicacao="A")
