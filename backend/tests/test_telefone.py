import pytest
from models.telefone import Telefone

# Testes de validação para a classe Telefone

def test_validar_celular_correto():
    """Testa a validação de um número de celular correto (9 dígitos)."""
    telefone = Telefone(codigo="31", numero="999998888", celular=True)
    assert telefone.validar() is True

def test_validar_celular_incompleto():
    """Testa a validação de um número de celular incompleto (menos de 9 dígitos)."""
    telefone = Telefone(codigo="31", numero="99998888", celular=True)
    assert telefone.validar() is False

def test_validar_celular_com_letras():
    """Testa a validação de um número de celular com caracteres não numéricos."""
    telefone = Telefone(codigo="31", numero="9999a8888", celular=True)
    assert telefone.validar() is False

def test_validar_fixo_correto():
    """Testa a validação de um número de telefone fixo correto (8 dígitos)."""
    telefone = Telefone(codigo="11", numero="33334444", celular=False)
    assert telefone.validar() is True

def test_validar_fixo_incompleto():
    """Testa a validação de um número de telefone fixo incompleto (menos de 8 dígitos)."""
    telefone = Telefone(codigo="11", numero="3334444", celular=False)
    assert telefone.validar() is False

def test_validar_fixo_com_letras():
    """Testa a validação de um número de telefone fixo com caracteres não numéricos."""
    telefone = Telefone(codigo="11", numero="3333b444", celular=False)
    assert telefone.validar() is False

# Teste para o método ehCelular()
def test_eh_celular():
    """Testa se o método ehCelular retorna o valor booleano correto."""
    celular = Telefone(codigo="81", numero="987654321", celular=True)
    fixo = Telefone(codigo="71", numero="32323232", celular=False)
    assert celular.ehCelular() is True
    assert fixo.ehCelular() is False
