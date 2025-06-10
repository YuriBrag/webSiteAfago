# backend/app.py - VERSÃO CORRIGIDA

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

LOGINS_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logins.txt")

def read_user_credentials():
    """Lê o arquivo logins.txt e retorna um dicionário de {email: senha}."""
    credentials = {}
    if not os.path.exists(LOGINS_FILE_PATH):
        return credentials
    
    with open(LOGINS_FILE_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if ":" in line:
                try:
                    # Formato esperado: email:senha
                    # Usamos .split(':', 1) para dividir apenas no primeiro ":"
                    # Isso permite que a senha contenha ":" se necessário.
                    email, password = line.split(':', 1) # <-- MUDANÇA NA LEITURA
                    credentials[email] = password
                except ValueError:
                    # Ignora linhas mal formatadas
                    continue
    return credentials

# Rota de Login (sem alterações, mas agora funcionará com a leitura correta)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    credentials = read_user_credentials()

    if email not in credentials:
        return jsonify({"message": "Usuário não encontrado."}), 404

    if credentials.get(email) == password:
        return jsonify({
            "message": "Login bem-sucedido!",
            "token": "dummy-test-token-12345",
            "userName": email.split('@')[0]
        }), 200
    else:
        return jsonify({"message": "Senha incorreta."}), 401

# Rota de Cadastro Atualizada
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    credentials = read_user_credentials()

    if email in credentials:
        return jsonify({"message": "Este email já está cadastrado."}), 409

    try:
        # Salva no formato simples: email:senha
        log_entry = f"{email}:{password}\n" # <-- MUDANÇA NA ESCRITA
        with open(LOGINS_FILE_PATH, "a") as f:
            f.write(log_entry)

        return jsonify({"message": "Usuário cadastrado com sucesso! Faça o login agora."}), 201
    except Exception as e:
        return jsonify({"message": f"Erro ao salvar dados: {str(e)}"}), 500


# Suas outras rotas (hello, serve) permanecem as mesmas.
@app.route('/api/hello')
def hello():
    return jsonify(message="Olá do Backend Flask!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)