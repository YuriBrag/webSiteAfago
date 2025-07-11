# filepath: /home/gustavo/tp_inf221/webSiteAfago/backend/manage_users.py
import sys
import database

def make_admin(email):
    """Promove um usuário existente para o nível de acesso 'admin'."""
    if not email:
        print("Erro: O email do usuário deve ser fornecido.")
        return

    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    # Primeiro, verifica se o usuário existe
    user = cursor.execute("SELECT email, role FROM usuarios WHERE email = ?", (email,)).fetchone()
    
    if not user:
        print(f"Erro: Usuário com email '{email}' não encontrado.")
        conn.close()
        return
        
    if user['role'] == 'admin':
        print(f"O usuário '{email}' já é um administrador.")
        conn.close()
        return

    # Atualiza o nível de acesso do usuário
    cursor.execute("UPDATE usuarios SET role = 'admin' WHERE email = ?", (email,))
    conn.commit()
    
    if cursor.rowcount > 0:
        print(f"Sucesso! O usuário '{email}' foi promovido a administrador.")
    else:
        # Esta mensagem é uma segurança extra, mas improvável de acontecer com a verificação acima
        print(f"Erro: Não foi possível atualizar o usuário '{email}'.")
        
    conn.close()

if __name__ == '__main__':
    # Pega o email do argumento da linha de comando
    if len(sys.argv) < 2:
        print("Uso: python backend/manage_users.py <email_do_usuario>")
    else:
        user_email = sys.argv[1]
        make_admin(user_email)