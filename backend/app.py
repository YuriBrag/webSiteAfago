from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
import datetime # Usaremos para adicionar um timestamp ao log

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

# ARQUIVO DE LOG PARA TESTE
LOG_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logins.txt")

@app.route('/api/hello')
def hello():
    return jsonify(message="Olá do Backend Flask!")

@app.route('/api/login', methods=['POST'])
def login_test_save_to_file(): # Nome da função alterado para clareza
    data = request.get_json()

    if not data:
        return jsonify({"message": "Nenhum dado fornecido (payload JSON esperado)"}), 400

    email = data.get('email')
    password = data.get('password') # Lembre-se: em produção, nunca logue senhas em texto plano

    if not email or not password:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    # Salvar os dados em um arquivo de texto
    try:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(LOG_FILE_PATH, "a") as f: # "a" para append (adicionar ao final do arquivo)
            f.write(f"Timestamp: {timestamp}, Email: {email}, Password: {password}\n")
        
        # Retornar uma resposta de sucesso com um "token" de teste para o frontend
        # O frontend espera um campo "token" e "userName" (com base no código anterior)
        return jsonify({
            "message": "Dados recebidos e salvos em logins.txt para teste.",
            "token": "dummy-test-token-12345", # Token de teste
            "userName": email.split('@')[0] or "Usuário Teste" # Nome de usuário de teste
        }), 200

    except Exception as e:
        print(f"Erro ao salvar dados no arquivo: {e}") # Log do erro no console do servidor
        return jsonify({"message": f"Erro interno ao tentar salvar dados: {str(e)}"}), 500

@app.route('/resp-formulario', methods=['POST'])
def salvar_respostas():
    data = request.json
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H%M%S")
    filename = f"resposta_{timestamp}.txt"
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    pasta_respostas = "respostas_formularios"
    os.makedirs(pasta_respostas, exist_ok=True)

    caminho_arquivo = os.path.join(pasta_respostas, filename)

    with open(caminho_arquivo, 'w', encoding='utf-8') as f:
        f.write("Horário: " + timestamp + "\n")
        f.write("Efetividade: " + str(data.get('efetividade', '')) + "\n")
        f.write("Estado da Planta: " + data.get('saude', '') + "\n")
        f.write("Houve Pragas: " + data.get('houvePragas', '') + "\n")
        f.write("Descrição das Pragas: " + data.get('resposta', '') + "\n")
        f.write("Satisfação: " + str(data.get('satisfacao', '')) + "\n")

    return jsonify({"message": "Respostas salvas com sucesso!"})

@app.route('/listar-formularios', methods=['GET'])
def listar_formularios():
    pasta_respostas = "respostas_formularios"
    formularios = []

    if not os.path.exists(pasta_respostas):
        return jsonify([])

    for nome_arquivo in sorted(os.listdir(pasta_respostas), reverse=True):
        caminho = os.path.join(pasta_respostas, nome_arquivo)
        if os.path.isfile(caminho) and nome_arquivo.endswith(".txt"):
            with open(caminho, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                formularios.append({
                    "nome": nome_arquivo,
                    "conteudo": conteudo
                })

    return jsonify(formularios)

# Rotas para servir o frontend React (mantidas como estão)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({"error": "Conteúdo estático não encontrado."}), 404

if __name__ == '__main__':
    # Garanta que o diretório do backend existe para salvar o logins.txt
    # (os.path.dirname(os.path.abspath(__file__)) pega o diretório do app.py)
    print(f"Tentando salvar logins em: {LOG_FILE_PATH}")
    app.run(debug=True, port=5001)