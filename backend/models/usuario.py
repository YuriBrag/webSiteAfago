class Usuario:
    def __init__(self, nome, sobrenome, email, senha, lembrar_de_mim=False, nivel_de_acesso="user"):
        self.nome = nome
        self.sobrenome = sobrenome
        self.email = email
        self.senha = senha
        self.lembrar_de_mim = lembrar_de_mim
        self.nivel_de_acesso = nivel_de_acesso

    # Métodos GET
    def get_nome(self):
        return self.nome

    def get_sobrenome(self):
        return self.sobrenome

    def get_email(self):
        return self.email

    def get_senha(self):
        return self.senha

    def get_lembrar_de_mim(self):
        return self.lembrar_de_mim

    def get_nivel_de_acesso(self):
        return self.nivel_de_acesso

    # Métodos SET
    def set_nome(self, nome):
        self.nome = nome

    def set_sobrenome(self, sobrenome):
        self.sobrenome = sobrenome

    def set_email(self, email):
        self.email = email

    def set_senha(self, senha):
        self.senha = senha

    def set_lembrar_de_mim(self, lembrar_de_mim):
        self.lembrar_de_mim = lembrar_de_mim

    def set_nivel_de_acesso(self, nivel_de_acesso):
        self.nivel_de_acesso = nivel_de_acesso

    def __repr__(self):
        return (f"Usuario(nome={self.nome!r}, sobrenome={self.sobrenome!r}, email={self.email!r}, "
                f"lembrar_de_mim={self.lembrar_de_mim!r}, nivel_de_acesso={self.nivel_de_acesso!r})")
        
    def to_dict(self):
        return {
            "nome": self.nome,
            "sobrenome": self.sobrenome,
            "email": self.email,
            "lembrar_de_mim": self.lembrar_de_mim,
            "nivel_de_acesso": self.nivel_de_acesso
        }