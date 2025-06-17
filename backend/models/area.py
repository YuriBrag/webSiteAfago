class Area:
    def __init__(self, tamanho, tipo_aplicacao, cultura, tempo_treinamento):
        if not isinstance(tamanho, int) or tamanho <= 0:
            raise ValueError("Tamanho deve ser um inteiro positivo.")
        self.tamanho = tamanho
        self.tipo_aplicacao = tipo_aplicacao
        self.cultura = cultura
        self.tempo_treinamento = tempo_treinamento

    # Métodos GET
    def getTamanho(self):
        return self.tamanho

    def getTipoAplicacao(self):
        return self.tipo_aplicacao

    def getCultura(self):
        return self.cultura

    def getTempoTreinamento(self):
        return self.tempo_treinamento

    # Métodos SET
    def setTamanho(self, tamanho):
        if not isinstance(tamanho, int) or tamanho <= 0:
            raise ValueError("Tamanho deve ser um inteiro positivo.")
        self.tamanho = tamanho

    def setTipoAplicacao(self, tipo_aplicacao):
        self.tipo_aplicacao = tipo_aplicacao

    def setCultura(self, cultura):
        self.cultura = cultura

    def setTempoTreinamento(self, tempo_treinamento):
        self.tempo_treinamento = tempo_treinamento

    def __repr__(self):
        return (f"Area(tamanho={self.tamanho!r}, tipo_aplicacao={self.tipo_aplicacao!r}, "
                f"cultura={self.cultura!r}, tempo_treinamento={self.tempo_treinamento!r})")