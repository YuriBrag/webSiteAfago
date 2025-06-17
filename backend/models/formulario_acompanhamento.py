from abc import ABC, abstractmethod

class FormularioBase(ABC):
    def __init__(self):
        pass

    def preencher(self, **kwargs):
        self.coletar_dados(**kwargs)
        self.validar()
        self.salvar()

    @abstractmethod
    def coletar_dados(self, **kwargs):
        pass

    @abstractmethod
    def validar(self):
        pass

    @abstractmethod
    def salvar(self):
        pass

class FormularioAcompanhamento(FormularioBase):
    def __init__(self, efetividade=None, condicao_planta=None, ocorrencia_pragas=None, satisfacao_geral=None):
        super().__init__()
        self.efetividade = efetividade
        self.condicao_planta = condicao_planta
        self.ocorrencia_pragas = ocorrencia_pragas
        self.satisfacao_geral = satisfacao_geral

    def coletar_dados(self, **kwargs):
        self.efetividade = kwargs.get('efetividade', self.efetividade)
        self.condicao_planta = kwargs.get('condicao_planta', self.condicao_planta)
        self.ocorrencia_pragas = kwargs.get('ocorrencia_pragas', self.ocorrencia_pragas)
        self.satisfacao_geral = kwargs.get('satisfacao_geral', self.satisfacao_geral)

    def validar(self):
        if self.efetividade is None or self.condicao_planta is None or self.ocorrencia_pragas is None or self.satisfacao_geral is None:
            raise ValueError("Todos os campos devem ser preenchidos.")

    def salvar(self):
        # Aqui você pode implementar a lógica de persistência (arquivo, banco, etc)
        pass

    # Métodos GET/SET e utilitários
    def get_efetividade(self):
        return self.efetividade
    def get_condicao_planta(self):
        return self.condicao_planta
    def get_ocorrencia_pragas(self):
        return self.ocorrencia_pragas
    def get_satisfacao_geral(self):
        return self.satisfacao_geral
    def set_efetividade(self, efetividade):
        self.efetividade = efetividade
    def set_condicao_planta(self, condicao_planta):
        self.condicao_planta = condicao_planta
    def set_ocorrencia_pragas(self, ocorrencia_pragas):
        self.ocorrencia_pragas = ocorrencia_pragas
    def set_satisfacao_geral(self, satisfacao_geral):
        self.satisfacao_geral = satisfacao_geral
    def __repr__(self):
        return (f"FormularioAcompanhamento(efetividade={self.efetividade!r}, condicao_planta={self.condicao_planta!r}, "
                f"ocorrencia_pragas={self.ocorrencia_pragas!r}, satisfacao_geral={self.satisfacao_geral!r})")
    def to_dict(self):
        return {
            "efetividade": self.efetividade,
            "condicao_planta": self.condicao_planta,
            "ocorrencia_pragas": self.ocorrencia_pragas,
            "satisfacao_geral": self.satisfacao_geral
        }

class FormularioFactory:
    @staticmethod
    def criar_formulario(tipo, **kwargs):
        if tipo == 'acompanhamento':
            return FormularioAcompanhamento(**kwargs)
        # Adicione outros tipos de formulário aqui se necessário
        raise ValueError(f"Tipo de formulário desconhecido: {tipo}")


def test_criacao_formulario_diferentes_valores():
    form = FormularioAcompanhamento(0, 1, 2, 3)
    assert form.get_efetividade() == 0
    assert form.get_condicao_planta() == 1
    assert form.get_ocorrencia_pragas() == 2
    assert form.get_satisfacao_geral() == 3