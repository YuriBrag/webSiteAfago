from abc import ABC, abstractmethod

class TelefoneBase(ABC):
    """
    Classe base abstrata para Telefone, usando o Template Method Pattern.
    Define o esqueleto do algoritmo de validacao.
    """
    def __init__(self, codigo: str, numero: str):
        self.codigo = codigo
        self.numero = numero

    def getFone(self) -> str:
        return f"{self.codigo}-{self.numero}"

    def setFone(self, codigo: str, numero: str) -> None:
        self.codigo = codigo
        self.numero = numero

    @abstractmethod
    def ehCelular(self) -> bool:
        """Metodo abstrato para ser implementado pelas subclasses."""
        pass

    @abstractmethod
    def _get_comprimento_esperado(self) -> int:
        """Metodo abstrato que define o comprimento esperado do numero."""
        pass

    def _validar_regras_especificas(self) -> bool:
        """
        Hook method: um gancho para validacoes extras nas subclasses.
        Por padrao, nao faz nada. Pode ser sobrescrito se necessario.
        """
        return True

    # Este e o Template Method
    def validar(self) -> bool:
        """
        Define o esqueleto do algoritmo de validacao.
        Os passos especificos sao delegados as subclasses.
        """
        if not self.numero.isdigit():
            return False
        
        if len(self.numero) != self._get_comprimento_esperado():
            return False
        
        if not self._validar_regras_especificas():
            return False
            
        return True

class TelefoneFixo(TelefoneBase):
    """Implementacao concreta para um telefone fixo."""
    def ehCelular(self) -> bool:
        return False

    def _get_comprimento_esperado(self) -> int:
        return 8

class TelefoneCelular(TelefoneBase):
    """Implementacao concreta para um telefone celular."""
    def ehCelular(self) -> bool:
        return True

    def _get_comprimento_esperado(self) -> int:
        return 9

    def _validar_regras_especificas(self) -> bool:
        # Hook exemplo: celulares no Brasil devem comecar com o digito 9.
        return self.numero.startswith('9')

