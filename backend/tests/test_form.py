from models.usuario import Usuario
from models.formulario_acompanhamento import FormularioAcompanhamento, FormularioFactory
import pytest

def test_formulario_acompanhamento_get_set():
    form = FormularioAcompanhamento(10, 8, 2, 9)
    assert form.get_efetividade() == 10
    form.set_efetividade(7)
    assert form.get_efetividade() == 7
    form.set_satisfacao_geral(5)
    assert form.get_satisfacao_geral() == 5

def test_criacao_formulario_diferentes_valores():
    form = FormularioAcompanhamento(0, 1, 2, 3)
    assert form.get_efetividade() == 0
    assert form.get_condicao_planta() == 1
    assert form.get_ocorrencia_pragas() == 2
    assert form.get_satisfacao_geral() == 3

def test_setters_formulario():
    form = FormularioAcompanhamento(1, 2, 3, 4)
    form.set_efetividade(10)
    form.set_condicao_planta(20)
    form.set_ocorrencia_pragas(30)
    form.set_satisfacao_geral(40)
    assert form.get_efetividade() == 10
    assert form.get_condicao_planta() == 20
    assert form.get_ocorrencia_pragas() == 30
    assert form.get_satisfacao_geral() == 40

def test_to_dict_formulario():
    form = FormularioAcompanhamento(5, 6, 7, 8)
    d = form.to_dict()
    assert d == {
        "efetividade": 5,
        "condicao_planta": 6,
        "ocorrencia_pragas": 7,
        "satisfacao_geral": 8
    }

def test_repr_formulario():
    form = FormularioAcompanhamento(1, 2, 3, 4)
    rep = repr(form)
    assert "FormularioAcompanhamento" in rep
    assert "efetividade=1" in rep
    assert "condicao_planta=2" in rep
    assert "ocorrencia_pragas=3" in rep
    assert "satisfacao_geral=4" in rep

def test_validar_campos_obrigatorios():
    form = FormularioAcompanhamento()
    with pytest.raises(ValueError):
        form.validar()
    form.set_efetividade(1)
    form.set_condicao_planta(2)
    form.set_ocorrencia_pragas(3)
    form.set_satisfacao_geral(4)
    form.validar()

def test_coletar_dados_parcial_e_total():
    form = FormularioAcompanhamento()
    form.coletar_dados(efetividade=5)
    assert form.get_efetividade() == 5
    form.coletar_dados(condicao_planta=6, ocorrencia_pragas=7, satisfacao_geral=8)
    assert form.get_condicao_planta() == 6
    assert form.get_ocorrencia_pragas() == 7
    assert form.get_satisfacao_geral() == 8

def test_factory_criar_formulario_acompanhamento():
    form = FormularioFactory.criar_formulario('acompanhamento', efetividade=1, condicao_planta=2, ocorrencia_pragas=3, satisfacao_geral=4)
    assert isinstance(form, FormularioAcompanhamento)
    assert form.get_efetividade() == 1
    assert form.get_condicao_planta() == 2
    assert form.get_ocorrencia_pragas() == 3
    assert form.get_satisfacao_geral() == 4
