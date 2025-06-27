from abc import ABC, abstractmethod

class RelatorioBase(ABC):
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

class RelatorioGrandeProdutor(RelatorioBase):
    def __init__(self, area_aplicacao=None, modo_aplicacao=None, frequencia_aplicacao=None, data_aplicacao=None, cultura=None):
        super().__init__()
        self.area_aplicacao = area_aplicacao
        self.modo_aplicacao = modo_aplicacao
        self.frequencia_aplicacao = frequencia_aplicacao
        self.data_aplicacao = data_aplicacao
        self.cultura = cultura

    def coletar_dados(self, **kwargs):
        self.area_aplicacao = kwargs.get('area_aplicacao', self.area_aplicacao)
        self.modo_aplicacao = kwargs.get('modo_aplicacao', self.modo_aplicacao)
        self.frequencia_aplicacao = kwargs.get('frequencia_aplicacao', self.frequencia_aplicacao)
        self.data_aplicacao = kwargs.get('data_aplicacao', self.data_aplicacao)
        self.cultura = kwargs.get('cultura', self.cultura)

    def validar(self):
        if not all([self.area_aplicacao, self.modo_aplicacao, self.frequencia_aplicacao, self.data_aplicacao, self.cultura]):
            raise ValueError("Todos os campos do relatório devem ser preenchidos.")

    def salvar(self):
        # Implemente a logica de persistencia se necessario
        pass

    def to_dict(self):
        return {
            "area_aplicacao": self.area_aplicacao,
            "modo_aplicacao": self.modo_aplicacao,
            "frequencia_aplicacao": self.frequencia_aplicacao,
            "data_aplicacao": self.data_aplicacao,
            "cultura": self.cultura
        }

    def __repr__(self):
        return (f"RelatorioGrandeProdutor(area_aplicacao={self.area_aplicacao!r}, modo_aplicacao={self.modo_aplicacao!r}, "
                f"frequencia_aplicacao={self.frequencia_aplicacao!r}, data_aplicacao={self.data_aplicacao!r}, cultura={self.cultura!r})")

class RelatorioFactory:
    @staticmethod
    def criar_relatorio(tipo, **kwargs):
        if tipo == 'grande_produtor':
            return RelatorioGrandeProdutor(**kwargs)
        # Adicione outros tipos de relatorio aqui se necessario
        raise ValueError(f"Tipo de relatorio desconhecido: {tipo}")
