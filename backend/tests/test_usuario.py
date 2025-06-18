import pytest
from models.usuario import Usuario
from models.telefone import TelefoneFixo, TelefoneCelular

def test_usuario_getters_setters():
    telefone = TelefoneCelular(codigo="31", numero="999998888")
    usuario = Usuario("João", "Silva", "joao@email.com", "senha123", telefone)
    # Testa getters
    assert usuario.get_nome() == "João"
    assert usuario.get_sobrenome() == "Silva"
    assert usuario.get_email() == "joao@email.com"
    assert usuario.get_senha() == "senha123"
    assert usuario.get_telefone() == telefone
    assert usuario.get_lembrar_de_mim() is False
    assert usuario.get_nivel_de_acesso() == "user"
    # Testa setters
    usuario.set_nome("Maria")
    usuario.set_sobrenome("Souza")
    usuario.set_email("maria@email.com")
    usuario.set_senha("novaSenha")
    novo_telefone = TelefoneFixo(codigo="11", numero="33334444")
    usuario.set_telefone(novo_telefone)
    usuario.set_lembrar_de_mim(True)
    usuario.set_nivel_de_acesso("admin")
    assert usuario.get_nome() == "Maria"
    assert usuario.get_sobrenome() == "Souza"
    assert usuario.get_email() == "maria@email.com"
    assert usuario.get_senha() == "novaSenha"
    assert usuario.get_telefone() == novo_telefone
    assert usuario.get_lembrar_de_mim() is True
    assert usuario.get_nivel_de_acesso() == "admin"

def test_usuario_repr_to_dict():
    telefone = TelefoneCelular(codigo="31", numero="999998888")
    usuario = Usuario("Ana", "Pereira", "ana@email.com", "senha", telefone, True, "admin")
    rep = repr(usuario)
    assert "Usuario" in rep
    assert "Ana" in rep
    assert "Pereira" in rep
    assert "ana@email.com" in rep
    assert "telefone" in rep
    d = usuario.to_dict()
    assert d["nome"] == "Ana"
    assert d["sobrenome"] == "Pereira"
    assert d["email"] == "ana@email.com"
    assert d["telefone"] == telefone.getFone()
    assert d["lembrar_de_mim"] is True
    assert d["nivel_de_acesso"] == "admin"

def test_usuario_telefone_none():
    usuario = Usuario("Sem", "Telefone", "sem@email.com", "senha")
    assert usuario.get_telefone() is None
    d = usuario.to_dict()
    assert d["telefone"] is None

def test_usuario_nivel_de_acesso_default():
    usuario = Usuario("Padrao", "User", "padrao@email.com", "senha")
    assert usuario.get_nivel_de_acesso() == "user"
    usuario.set_nivel_de_acesso("admin")
    assert usuario.get_nivel_de_acesso() == "admin"
