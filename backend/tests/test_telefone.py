import pytest
from models.telefone import TelefoneFixo, TelefoneCelular

# Testes de validacao para a classe TelefoneBase

def test_validar_celular_correto():
    """Testa a validacao de um numero de celular correto (9 digitos, comeca com 9)."""
    telefone = TelefoneCelular(codigo="31", numero="999998888")
    assert telefone.validar() is True

def test_validar_celular_incompleto():
    """Testa a validacao de um numero de celular incompleto (menos de 9 digitos)."""
    telefone = TelefoneCelular(codigo="31", numero="99998888")
    assert telefone.validar() is False

def test_validar_celular_com_letras():
    """Testa a validacao de um numero de celular com caracteres nao numericos."""
    telefone = TelefoneCelular(codigo="31", numero="9999a8888")
    assert telefone.validar() is False

def test_validar_celular_nao_comeca_com_9():
    """Testa a validacao de um numero de celular que nao comeca com 9."""
    telefone = TelefoneCelular(codigo="31", numero="899998888")
    assert telefone.validar() is False

def test_validar_fixo_correto():
    """Testa a validacao de um numero de telefone fixo correto (8 digitos)."""
    telefone = TelefoneFixo(codigo="11", numero="33334444")
    assert telefone.validar() is True

def test_validar_fixo_incompleto():
    """Testa a validacao de um numero de telefone fixo incompleto (menos de 8 digitos)."""
    telefone = TelefoneFixo(codigo="11", numero="3334444")
    assert telefone.validar() is False

def test_validar_fixo_com_letras():
    """Testa a validacao de um numero de telefone fixo com caracteres nao numericos."""
    telefone = TelefoneFixo(codigo="11", numero="3333b444")
    assert telefone.validar() is False

# Teste para o metodo ehCelular()
def test_eh_celular():
    """Testa se o metodo ehCelular retorna o valor booleano correto."""
    celular = TelefoneCelular(codigo="81", numero="987654321")
    fixo = TelefoneFixo(codigo="71", numero="32323232")
    assert celular.ehCelular() is True
    assert fixo.ehCelular() is False
