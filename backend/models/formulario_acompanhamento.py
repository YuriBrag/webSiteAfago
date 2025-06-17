class FormularioAcompanhamento:
    def __init__(self, efetividade, condicao_planta, ocorrencia_pragas, satisfacao_geral):
        self.efetividade = efetividade
        self.condicao_planta = condicao_planta
        self.ocorrencia_pragas = ocorrencia_pragas
        self.satisfacao_geral = satisfacao_geral

    # Métodos GET
    def get_efetividade(self):
        return self.efetividade

    def get_condicao_planta(self):
        return self.condicao_planta

    def get_ocorrencia_pragas(self):
        return self.ocorrencia_pragas

    def get_satisfacao_geral(self):
        return self.satisfacao_geral

    # Métodos SET
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


def test_criacao_formulario_diferentes_valores():
    form = FormularioAcompanhamento(0, 1, 2, 3)
    assert form.get_efetividade() == 0
    assert form.get_condicao_planta() == 1
    assert form.get_ocorrencia_pragas() == 2
    assert form.get_satisfacao_geral() == 3