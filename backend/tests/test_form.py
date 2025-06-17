from models.usuario import Usuario
from models.formulario_acompanhamento import FormularioAcompanhamento

def test_formulario_acompanhamento_get_set():
    form = FormularioAcompanhamento(10, 8, 2, 9)
    assert form.get_efetividade() == 10
    form.set_efetividade(7)
    assert form.get_efetividade() == 7
    form.set_satisfacao_geral(5)
    assert form.get_satisfacao_geral() == 5

#Testa se o construtor da classe armazena corretamente diferentes valores passados na criação do objeto.
#Verifica todos os campos (efetividade, condicao_planta, ocorrencia_pragas, satisfacao_geral) usando os getters.

def test_criacao_formulario_diferentes_valores():
    form = FormularioAcompanhamento(0, 1, 2, 3)
    assert form.get_efetividade() == 0
    assert form.get_condicao_planta() == 1
    assert form.get_ocorrencia_pragas() == 2
    assert form.get_satisfacao_geral() == 3

#Testa se todos os métodos setters funcionam corretamente para cada atributo.
#Altera todos os campos do formulário e verifica se os getters retornam os novos valores.

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

#Testa se o método to_dict retorna um dicionário correto com todos os campos e valores do objeto.

def test_to_dict_formulario():
    form = FormularioAcompanhamento(5, 6, 7, 8)
    d = form.to_dict()
    assert d == {
        "efetividade": 5,
        "condicao_planta": 6,
        "ocorrencia_pragas": 7,
        "satisfacao_geral": 8
    }

#Testa se o método __repr__ retorna uma string que 
# contém o nome da classe e todos os campos com seus valores, útil para debug e logs.

def test_repr_formulario():
    form = FormularioAcompanhamento(1, 2, 3, 4)
    rep = repr(form)
    assert "FormularioAcompanhamento" in rep
    assert "efetividade=1" in rep
    assert "condicao_planta=2" in rep
    assert "ocorrencia_pragas=3" in rep
    assert "satisfacao_geral=4" in rep