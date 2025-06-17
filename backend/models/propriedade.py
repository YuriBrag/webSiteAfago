class Propriedade:
    def __init__(self, nome, tamanho, clima, solo, endereco, areas=None):
        if not nome or not isinstance(nome, str):
            raise ValueError("Nome da propriedade deve ser uma string não vazia.")
        if not isinstance(tamanho, int) or tamanho <= 0:
            raise ValueError("Tamanho deve ser um inteiro positivo.")
        self.nome = nome
        self.tamanho = tamanho
        self.clima = clima
        self.solo = solo
        self.endereco = endereco
        self.areas = areas if areas is not None else []

    # Métodos GET
    def get_nome(self):
        return self.nome

    def get_tamanho(self):
        return self.tamanho

    def get_clima(self):
        return self.clima

    def get_solo(self):
        return self.solo

    def get_endereco(self):
        return self.endereco

    def get_areas(self):
        return self.areas

    # Métodos SET
    def set_nome(self, nome):
        self.nome = nome

    def set_tamanho(self, tamanho):
        self.tamanho = tamanho

    def set_clima(self, clima):
        self.clima = clima

    def set_solo(self, solo):
        self.solo = solo

    def set_endereco(self, endereco):
        self.endereco = endereco

    def set_areas(self, areas):
        self.areas = areas

    def add_area(self, area):
        self.areas.append(area)

    def __repr__(self):
        return (f"Propriedade(nome={self.nome!r}, tamanho={self.tamanho!r}, clima={self.clima!r}, "
                f"solo={self.solo!r}, endereco={self.endereco!r}, areas={self.areas!r})")