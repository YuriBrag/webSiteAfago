from flask import Flask, jsonify, send_from_directory, request, g
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
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token or token != "dummy-test-token-12345":
            return jsonify({'message': 'Token inválido ou ausente!'}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator que verifica se o usuário é um administrador."""
    @wraps(f)
    @token_required # Primeiro, verifica o token
    def decorated(*args, **kwargs):
        user_email = None
        # Para requisições GET, os parâmetros vêm na URL (request.args)
        if request.method == 'GET':
            user_email = request.args.get('userEmail')
        # Para outras requisições (POST, etc.), vêm no corpo JSON
        else:
            if request.is_json:
                user_email = request.get_json().get('userEmail')

        if not user_email:
            return jsonify({'message': 'Email do usuário administrador não fornecido.'}), 400
            
        credentials = read_user_credentials()
        user_data = credentials.get(user_email)
        
        if not user_data or user_data.get('role') != 'admin':
            return jsonify({'message': 'Acesso negado: Requer privilégios de administrador.'}), 403
        
        # Opcional: Armazena o email para uso futuro na rota, se necessário
        g.user_email = user_email
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
    """Lê as credenciais do arquivo, agora incluindo o papel do usuário."""
    credentials = {}
    if not os.path.exists(LOGINS_FILE_PATH):
        return credentials
    with open(LOGINS_FILE_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line:
                parts = line.split(':', 2)
                if len(parts) == 3:
                    email, password, role = parts
                    credentials[email] = {'password': password, 'role': role}
    return credentials

@app.route('/api/admin/forms', methods=['GET'])
@admin_required # Protegendo a rota
def get_all_forms():
    """Retorna uma lista de todos os formulários submetidos."""
    formularios = []
    if not os.path.exists(PASTA_RESPOSTAS_DIR):
        return jsonify([])
    for nome_arquivo in sorted(os.listdir(PASTA_RESPOSTAS_DIR), reverse=True):
        caminho = os.path.join(PASTA_RESPOSTAS_DIR, nome_arquivo)
        if os.path.isfile(caminho) and nome_arquivo.endswith(".txt"):
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    formularios.append({
                        "nome": nome_arquivo,
                        "conteudo": conteudo
                    })
            except Exception:
                continue # Ignora arquivos que não puderem ser lidos
    return jsonify(formularios)


@app.route('/api/admin/users', methods=['GET'])
@admin_required # Protegendo a rota
def get_all_users():
    """Retorna uma lista de todos os usuários cadastrados."""
    credentials = read_user_credentials()
    # Remove as senhas antes de enviar para o frontend
    users_list = [{'email': email, 'role': data['role']} for email, data in credentials.items()]
    return jsonify(users_list)

@app.route('/api/login', methods=['POST'])
def login():
    """Função de login atualizada para retornar o papel (role) do usuário."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400
    
    credentials = read_user_credentials()
    user_data = credentials.get(email)

    if user_data and user_data['password'] == password:
        return jsonify({
            "message": "Login bem-sucedido!",
            "token": "dummy-test-token-12345", # Em produção, seria um JWT
            "userName": email.split('@')[0],
            "userEmail": email,
            "userRole": user_data['role'] 
        }), 200
    else:
        return jsonify({"message": "Credenciais incorretas."}), 401

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