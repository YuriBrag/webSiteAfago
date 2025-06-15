from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from functools import wraps
import os
import re 
import datetime

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

USER_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "user_data")
LOGINS_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logins.txt")

PASTA_RESPOSTAS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "respostas_formularios")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # O frontend deve enviar o token no cabeçalho "Authorization"
        if 'Authorization' in request.headers:
            # O formato esperado é "Bearer <token>"
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token de acesso ausente!'}), 401

        # --- Validação do Token ---
        # No seu protótipo, a validação é simples.
        # Em um app real, você usaria uma biblioteca de JWT para verificar a assinatura.
        if token != "dummy-test-token-12345":
             return jsonify({'message': 'Token inválido ou expirado!'}), 401

        # Você pode até extrair o email do token aqui se ele for um JWT
        # Por enquanto, vamos apenas validar

        return f(*args, **kwargs)
    return decorated

@app.route('/api/hello', methods=['GET'])
def hello():
    """Endpoint de teste para verificar a conexão com o frontend."""
    return jsonify({"message": "Olá! O frontend está conectado com o backend Flask!"})


def sanitize_email_for_filename(email):
    """Sanitizes an email address to be used as a filename or directory name."""
    return re.sub(r'[^a-zA-Z0-9_.-]', '_', email)

def read_user_credentials():
    credentials = {}
    if not os.path.exists(LOGINS_FILE_PATH):
        return credentials
    with open(LOGINS_FILE_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if ":" in line:
                try:
                    email, password = line.split(':', 1)
                    credentials[email] = password
                except ValueError:
                    continue
    return credentials

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
            "userName": email.split('@')[0],
            "userEmail": email 
        }), 200
    else:
        return jsonify({"message": "Senha incorreta."}), 401

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
        log_entry = f"{email}:{password}\n"
        with open(LOGINS_FILE_PATH, "a") as f:
            f.write(log_entry)
        return jsonify({"message": "Usuário cadastrado com sucesso! Faça o login agora."}), 201
    except Exception as e:
        return jsonify({"message": f"Erro ao salvar dados: {str(e)}"}), 500


@app.route('/api/profile-data', methods=['GET'])
def get_profile_data():
    """Busca os dados de propriedades e áreas para um usuário."""
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({"message": "Email do usuário é necessário"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    
    properties = []
    areas = []

    try:
        prop_file_path = os.path.join(user_dir, 'properties.txt')
        if os.path.exists(prop_file_path):
            with open(prop_file_path, 'r') as f:
                properties = [line.strip() for line in f.readlines()]
    except IOError:
        pass

    try:
        areas_file_path = os.path.join(user_dir, 'areas.txt')
        if os.path.exists(areas_file_path):
            with open(areas_file_path, 'r') as f:
                areas = [line.strip() for line in f.readlines()]
    except IOError:
        pass

    return jsonify({"properties": properties, "areas": areas})

@app.route('/api/properties', methods=['POST'])
def add_property():
    """Adiciona uma nova propriedade para um usuário."""
    data = request.get_json()
    user_email = data.get('email')
    property_name = data.get('propertyName')

    if not user_email or not property_name:
        return jsonify({"message": "Email e nome da propriedade são necessários"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    os.makedirs(user_dir, exist_ok=True)

    prop_file_path = os.path.join(user_dir, 'properties.txt')
    with open(prop_file_path, 'a') as f:
        f.write(f"{property_name}\n")

    return jsonify({"message": "Propriedade adicionada com sucesso!"}), 201

@app.route('/api/areas', methods=['POST'])
def add_area():
    """Adiciona uma nova área a uma propriedade de um usuário."""
    data = request.get_json()
    user_email = data.get('email')
    property_name = data.get('propertyName')
    area_name = data.get('areaName')

    if not user_email or not property_name or not area_name:
        return jsonify({"message": "Email, nome da propriedade e nome da área são necessários"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    os.makedirs(user_dir, exist_ok=True)

    areas_file_path = os.path.join(user_dir, 'areas.txt')
    with open(areas_file_path, 'a') as f:
        f.write(f"{property_name}:{area_name}\n")
    
    return jsonify({"message": "Área adicionada com sucesso!"}), 201


@app.route('/resp-formulario', methods=['POST'])
@token_required
def salvar_respostas():
    data = request.json
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H%M%S")
    filename = f"resposta_{timestamp}.txt"
    timestamp_display = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    os.makedirs(PASTA_RESPOSTAS_DIR, exist_ok=True)
    caminho_arquivo = os.path.join(PASTA_RESPOSTAS_DIR, filename)

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
    pasta_respostas = PASTA_RESPOSTAS_DIR
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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    os.makedirs(USER_DATA_DIR, exist_ok=True) 
    os.makedirs(PASTA_RESPOSTAS_DIR, exist_ok=True)
    app.run(debug=True, port=5001)