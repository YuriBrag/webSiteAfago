from flask import Flask, jsonify, send_from_directory, request, g
from flask_cors import CORS
from functools import wraps
import os
import re 
import datetime

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

USER_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "user_data")
LOGINS_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logins.txt")

PASTA_RESPOSTAS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "respostas_formularios")


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

def token_required(f):
    """Verifica o token e extrai os dados do usuário da requisição."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token or token != "dummy-test-token-12345":
            return jsonify({'message': 'Token inválido ou ausente!'}), 401
        
        # Extrai o email do corpo (POST) ou da URL (GET)
        user_email = None
        if request.method == 'GET':
            user_email = request.args.get('userEmail')
        elif request.is_json:
            user_email = request.get_json().get('userEmail')

        if not user_email:
            return jsonify({'message': 'Email do usuário não fornecido na requisição.'}), 400
        
        # Armazena os dados no objeto 'g' para uso na rota
        g.user_email = user_email
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    """Verifica se o usuário tem permissões de administrador."""
    @wraps(f)
    @token_required # Reutiliza a lógica do token_required
    def decorated(*args, **kwargs):
        credentials = read_user_credentials()
        user_data = credentials.get(g.user_email)
        
        if not user_data or user_data.get('role') != 'admin':
            return jsonify({'message': 'Acesso negado: Requer privilégios de administrador.'}), 403
        
        return f(*args, **kwargs)
    return decorated


def get_user_name_by_email(email):
    """Busca o nome completo de um usuário a partir do seu e-mail."""
    try:
        sanitized_email = sanitize_email_for_filename(email)
        profile_path = os.path.join(USER_DATA_DIR, sanitized_email, 'profile.txt')
        if os.path.exists(profile_path):
            with open(profile_path, 'r', encoding='utf-8') as f:
                for line in f:
                    # Procura pela linha que começa com "Nome:"
                    if line.strip().startswith("Nome:"):
                        # Retorna o valor após "Nome: ", removendo espaços extras
                        return line.strip()[6:].strip()
    except Exception as e:
        app.logger.error(f"Erro ao buscar nome para o email {email}: {e}")
        return "Usuário Desconhecido"
    # Retorna um valor padrão se o arquivo ou a linha não forem encontrados
    return "Nome não encontrado"

@app.route('/api/hello', methods=['GET'])
def hello():
    """Endpoint de teste para verificar a conexão com o frontend."""
    return jsonify({"message": "Olá! O frontend está conectado com o backend Flask!"})



@app.route('/api/admin/forms', methods=['GET'])
@admin_required # A proteção continua a mesma
def get_all_forms():
    """Retorna uma lista de todos os formulários submetidos, agora incluindo o nome do usuário."""
    formularios = []
    if not os.path.exists(PASTA_RESPOSTAS_DIR):
        return jsonify([])

    for nome_arquivo in sorted(os.listdir(PASTA_RESPOSTAS_DIR), reverse=True):
        caminho = os.path.join(PASTA_RESPOSTAS_DIR, nome_arquivo)
        if os.path.isfile(caminho) and nome_arquivo.endswith(".txt"):
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    conteudo = "".join(lines)
                    
                    user_email = "não identificado"
                    user_name = "Usuário Desconhecido"

                    # Extrai o email do conteúdo do arquivo
                    for line in lines:
                        if line.strip().startswith("Usuário:"):
                            user_email = line.strip()[8:].strip()
                            # Usa o email extraído para buscar o nome completo
                            user_name = get_user_name_by_email(user_email)
                            break
                    
                    formularios.append({
                        "nome": nome_arquivo,
                        "conteudo": conteudo,
                        "userName": user_name,  # Adiciona o nome do usuário
                        "userEmail": user_email # Adiciona o email para contexto
                    })
            except Exception as e:
                app.logger.error(f"Erro ao processar o arquivo de formulário {nome_arquivo}: {e}")
                continue
                
    return jsonify(formularios)

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    credentials = read_user_credentials()
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
    
    # 1. Obter todos os novos campos da requisição
    email = data.get('email')
    password = data.get('password')
    nome_completo = data.get('nomeCompleto')
    cpf_cnpj = data.get('cpfCnpj')
    telefone = data.get('telefone')

    # Validação básica
    if not all([email, password, nome_completo, cpf_cnpj, telefone]):
        return jsonify({"message": "Todos os campos são obrigatórios"}), 400
    
    credentials = read_user_credentials()
    if email in credentials:
        return jsonify({"message": "Este email já está cadastrado."}), 409
    
    try:
        # 2. Salvar login e senha com papel 'user' no logins.txt
        log_entry = f"{email}:{password}:user\n"
        with open(LOGINS_FILE_PATH, "a") as f:
            f.write(log_entry)
        
        # 3. Salvar os dados adicionais em um arquivo de perfil separado
        sanitized_email = sanitize_email_for_filename(email)
        user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
        os.makedirs(user_dir, exist_ok=True) # Cria o diretório do usuário se não existir

        profile_file_path = os.path.join(user_dir, 'profile.txt')
        with open(profile_file_path, 'w', encoding='utf-8') as f:
            f.write(f"Nome: {nome_completo}\n")
            f.write(f"CPF/CNPJ: {cpf_cnpj}\n")
            f.write(f"Telefone: {telefone}\n")

        return jsonify({"message": "Usuário cadastrado com sucesso! Faça o login agora."}), 201
        
    except Exception as e:
        # Em caso de erro, é uma boa prática logar o erro no servidor
        app.logger.error(f"Erro ao registrar usuário: {str(e)}")
        return jsonify({"message": f"Erro interno ao salvar dados."}), 500


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


@app.route('/api/resp-formulario', methods=['POST'])
@token_required # Agora este decorator já fornece g.user_email
def salvar_respostas():
    data = request.json
    user_email = g.user_email # Pega o email validado pelo decorator
    
    sanitized_email = sanitize_email_for_filename(user_email)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
    filename = f"resposta_{sanitized_email}_{timestamp}.txt"
    timestamp_display = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    caminho_arquivo = os.path.join(PASTA_RESPOSTAS_DIR, filename)

    with open(caminho_arquivo, 'w', encoding='utf-8') as f:
        f.write(f"Usuário: {user_email}\n")
        f.write(f"Horário: {timestamp_display}\n")
        f.write(f"Efetividade: {str(data.get('efetividade', ''))}\n")
        f.write(f"Estado da Planta: {data.get('saude', '')}\n")
        f.write(f"Houve Pragas: {data.get('houvePragas', '')}\n")
        f.write(f"Descrição das Pragas: {data.get('resposta', '')}\n")
        f.write(f"Satisfação: {str(data.get('satisfacao', ''))}\n")

    return jsonify({"message": "Respostas salvas com sucesso!"})

@app.route('/api/listar-formularios', methods=['GET'])
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
