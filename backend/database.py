import sqlite3
import os

# Define o caminho do banco de dados na pasta 'backend'
DATABASE_URL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "afago.db")

def get_db_connection():
    """Cria e retorna uma conexão com o banco de dados."""
    conn = sqlite3.connect(DATABASE_URL)
    # Retorna as linhas como dicionários, facilitando o acesso por nome de coluna
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa o banco de dados e cria as tabelas se elas não existirem."""
    if os.path.exists(DATABASE_URL):
        return # Evita recriar o banco de dados a cada reinicialização

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabela de usuários
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            cpf_cnpj TEXT,
            telefone TEXT,
            role TEXT NOT NULL DEFAULT 'user'
        );
    """)
    
    # Você pode adicionar outras tabelas aqui no futuro
    # Exemplo:
    # cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS propriedades (
    #         id INTEGER PRIMARY KEY AUTOINCREMENT,
    #         usuario_id INTEGER NOT NULL,
    #         nome TEXT NOT NULL,
    #         tamanho REAL NOT NULL,
    #         clima TEXT,
    #         solo TEXT,
    #         endereco TEXT,
    #         FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    #     );
    # """)

    conn.commit()
    conn.close()
    print("Banco de dados inicializado e tabelas criadas com sucesso.")

