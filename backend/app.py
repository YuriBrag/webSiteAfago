from flask import Flask, jsonify, send_from_directory, request, g
from flask_cors import CORS
from functools import wraps
import os
import re 
import datetime

from models.usuario import Usuario
from models.propriedade import Propriedade
from models.area import Area
from models.relatorio import RelatorioFactory

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

USER_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "user_data")
LOGINS_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logins.txt")
PASTA_RESPOSTAS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "respostas_formularios")

def sanitize_email_for_filename(email):
    return re.sub(r'[^a-zA-Z0-9_.-]', '_', email)

def read_user_credentials():
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
    # Cria o usuário usando a classe Usuario
    usuario = Usuario(
        nome=data.get('nomeCompleto'),
        email=data.get('email'),
        senha=data.get('password'),
        lembrar_de_mim=data.get('lembrar_de_mim', False),
        nivel_de_acesso=data.get('nivel_de_acesso', 'user')
    )

    # Validação básica
    if not all([usuario.email, usuario.senha, usuario.nome]):
        return jsonify({"message": "Todos os campos são obrigatórios"}), 400
    
    credentials = read_user_credentials()
    if usuario.email in credentials:
        return jsonify({"message": "Este email já está cadastrado."}), 409
    
    try:
        # Salva login e senha com papel 'user' no logins.txt
        log_entry = f"{usuario.email}:{usuario.senha}:user\n"
        with open(LOGINS_FILE_PATH, "a") as f:
            f.write(log_entry)
        
        # Salva os dados adicionais em um arquivo de perfil separado
        sanitized_email = sanitize_email_for_filename(usuario.email)
        user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
        os.makedirs(user_dir, exist_ok=True)

        profile_file_path = os.path.join(user_dir, 'profile.txt')
        with open(profile_file_path, 'w', encoding='utf-8') as f:
            f.write(f"Nome: {usuario.nome}\n")
            f.write(f"Email: {usuario.email}\n")
            f.write(f"Lembrar_de_mim: {usuario.lembrar_de_mim}\n")
            f.write(f"Nivel_de_acesso: {usuario.nivel_de_acesso}\n")
            # Adicione outros campos se necessário

        return jsonify({"message": "Usuário cadastrado com sucesso! Faça o login agora."}), 201
        
    except Exception as e:
        app.logger.error(f"Erro ao registrar usuário: {str(e)}")
        return jsonify({"message": f"Erro interno ao salvar dados."}), 500

@app.route('/api/profile-data', methods=['GET'])
def get_profile_data():
    """Busca os dados de propriedades e áreas para um usuário e os formata como JSON."""
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({"message": "Email do usuário é necessário"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    
    properties = []
    areas = []

    # Lê e formata as propriedades
    try:
        prop_file_path = os.path.join(user_dir, 'properties.txt')
        if os.path.exists(prop_file_path):
            with open(prop_file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    parts = line.strip().split(';')
                    if len(parts) >= 5: # Garante que a linha tem todos os dados
                        properties.append({
                            'nome': parts[0],
                            'tamanho': parts[1],
                            'clima': parts[2],
                            'solo': parts[3],
                            'endereco': parts[4]
                        })
    except IOError as e:
        app.logger.error(f"Erro ao ler arquivo de propriedades para {user_email}: {e}")

    # Lê e formata as áreas
    try:
        areas_file_path = os.path.join(user_dir, 'areas.txt')
        if os.path.exists(areas_file_path):
            with open(areas_file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    parts = line.strip().split(';')
                    if len(parts) >= 5: # Garante que a linha tem todos os dados
                        areas.append({
                            'propertyName': parts[0],
                            'tamanho': parts[1],
                            'tipo_aplicacao': parts[2],
                            'cultura': parts[3],
                            'tempo_tratamento': parts[4]
                        })
    except IOError as e:
        app.logger.error(f"Erro ao ler arquivo de áreas para {user_email}: {e}")

    return jsonify({"properties": properties, "areas": areas})



@app.route('/api/properties', methods=['POST'])
def add_property():
    """Adiciona uma nova propriedade para um usuário."""
    data = request.get_json()
    user_email = data.get('email')
    nome = data.get('nome')
    tamanho = data.get('tamanho')
    clima = data.get('clima')
    solo = data.get('solo')
    endereco = data.get('endereco')

    # Validação básica
    if not user_email or not nome or not tamanho:
        return jsonify({"message": "Email, nome e tamanho da propriedade são necessários"}), 400

    try:
        tamanho_int = int(tamanho)
        propriedade = Propriedade(nome, tamanho_int, clima, solo, endereco)
    except Exception as e:
        return jsonify({"message": f"Erro ao criar propriedade: {e}"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    os.makedirs(user_dir, exist_ok=True)

    prop_file_path = os.path.join(user_dir, 'properties.txt')
    # Salva todos os campos em uma linha separada por ;
    with open(prop_file_path, 'a') as f:
        f.write(f"{propriedade.get_nome()};{propriedade.get_tamanho()};{propriedade.get_clima()};{propriedade.get_solo()};{propriedade.get_endereco()}\n")

    return jsonify({"message": "Propriedade adicionada com sucesso!"}), 201

@app.route('/api/areas', methods=['POST'])
def add_area():
    """Adiciona uma nova área a uma propriedade de um usuário."""
    data = request.get_json()
    user_email = data.get('email')
    property_name = data.get('propertyName')
    tamanho = data.get('tamanho')
    tipo_aplicacao = data.get('tipo_aplicacao')
    cultura = data.get('cultura')
    tempo_treinamento = data.get('tempo_tratamento')

    # Validação básica
    if not user_email or not property_name or not tamanho:
        return jsonify({"message": "Email, nome da propriedade e tamanho da área são necessários"}), 400

    try:
        tamanho_int = int(tamanho)
        area = Area(tamanho_int, tipo_aplicacao, cultura, tempo_treinamento)
    except Exception as e:
        return jsonify({"message": f"Erro ao criar área: {e}"}), 400

    sanitized_email = sanitize_email_for_filename(user_email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    os.makedirs(user_dir, exist_ok=True)

    areas_file_path = os.path.join(user_dir, 'areas.txt')
    # Salva todos os campos em uma linha separada por ;
    with open(areas_file_path, 'a') as f:
        f.write(f"{property_name};{area.getTamanho()};{area.getTipoAplicacao()};{area.getCultura()};{area.getTempoTreinamento()}\n")

    return jsonify({"message": "Área adicionada com sucesso!"}), 201

@app.route('/api/relatorios', methods=['POST'])
def salvar_relatorio():
    """Recebe e salva os dados do relatório do grande produtor."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Dados do formulário não recebidos."}), 400

    try:
        # --- CORREÇÃO PRINCIPAL AQUI ---
        # 1. Pega o valor de 'tipo' e o REMOVE do dicionário 'data'.
        tipo_relatorio = data.pop('tipo', None)
        if not tipo_relatorio:
            return jsonify({"message": "O campo 'tipo' do relatório é obrigatório."}), 400

        # 2. Agora chamamos a Factory. 'data' não tem mais a chave 'tipo'.
        novo_relatorio = RelatorioFactory.criar_relatorio(
            tipo=tipo_relatorio,
            **data
        )

        novo_relatorio.validar()

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = f"relatorio_grande_produtor_{timestamp}.txt"
        caminho_arquivo = os.path.join(PASTA_RESPOSTAS_DIR, filename)

        with open(caminho_arquivo, 'w', encoding='utf-8') as f:
            #f.write(f"Tipo de Relatório: {tipo_relatorio}\n")
            f.write("-" * 20 + "\n")
            # Usa os atributos do objeto 'novo_relatorio' que ele conhece
            f.write(f"Data da Aplicação: {novo_relatorio.data_aplicacao}\n")
            f.write(f"Área de Aplicação: {novo_relatorio.area_aplicacao}\n")
            f.write(f"Modo de Aplicação: {novo_relatorio.modo_aplicacao}\n")
            f.write(f"Frequência de Aplicação: {novo_relatorio.frequencia_aplicacao}\n")
            f.write(f"Cultura: {novo_relatorio.cultura}\n")
            f.write("-" * 20 + "\n")
            # --- CORREÇÃO SECUNDÁRIA AQUI ---
            # Para os campos que não estão no modelo, pegamos direto do dicionário 'data'
            f.write(f"Data da Coleta: {data.get('data_coleta', 'N/A')}\n")
            f.write(f"Amostra Coletada: {data.get('amostra_coletada', 'N/A')}\n")
            f.write(f"Características da Amostra: {data.get('caracteristicas_amostra', 'N/A')}\n")
            f.write(f"Sintomas da Coleta: {data.get('sintomas_coleta', 'N/A')}\n")

        return jsonify({"message": "Relatório salvo com sucesso!"}), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Erro ao salvar relatório: {str(e)}")
        return jsonify({"message": "Erro interno ao processar o relatório."}), 500
    
def parse_report_content(content):
    """Converte o conteúdo de texto de um relatório em um dicionário."""
    report_data = {}
    lines = content.strip().split('\n')
    for line in lines:
        if ':' in line:
            key, value = line.split(':', 1)
            # Converte a chave para um formato padronizado (ex: 'Data da Aplicação' -> 'data_da_aplicacao')
            key_formatted = key.strip().lower().replace(' ', '_').replace(':', '')
            report_data[key_formatted] = value.strip()
    return report_data

@app.route('/api/admin/relatorios', methods=['GET'])
@admin_required # Protege a rota para que apenas admins possam acessá-la
def get_all_relatorios():
    """Busca e retorna todos os relatórios de grande produtor."""
    relatorios = []
    
    if not os.path.exists(PASTA_RESPOSTAS_DIR):
        return jsonify([])

    # Ordena os arquivos para mostrar os mais recentes primeiro
    for nome_arquivo in sorted(os.listdir(PASTA_RESPOSTAS_DIR), reverse=True):
        # Filtra para pegar apenas os relatórios que nos interessam
        if nome_arquivo.startswith("relatorio_grande_produtor_"):
            try:
                caminho = os.path.join(PASTA_RESPOSTAS_DIR, nome_arquivo)
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo_texto = f.read()
                    dados_relatorio = parse_report_content(conteudo_texto)
                    
                    relatorios.append({
                        "id": nome_arquivo, # Usa o nome do arquivo como um ID único
                        "dados": dados_relatorio,
                        "raw_content": conteudo_texto # Envia o texto bruto também, se necessário
                    })
            except Exception as e:
                app.logger.error(f"Erro ao processar o arquivo de relatório {nome_arquivo}: {e}")
                continue # Pula para o próximo arquivo em caso de erro

    return jsonify(relatorios)

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

@app.route('/api/admin/users/<string:email>', methods=['PUT'])
@admin_required 
def update_user_role(email):
    """Atualiza o nível de acesso (role) de um usuário."""
    data = request.get_json()
    new_role = data.get('role')

    if not new_role or new_role not in ['user', 'admin']:
        return jsonify({'message': 'Nível de acesso inválido.'}), 400

    credentials = read_user_credentials()
    
    # Verifica se o usuário a ser editado existe
    if email not in credentials:
        return jsonify({'message': 'Usuário não encontrado.'}), 404

    # Atualiza o nível de acesso
    credentials[email]['role'] = new_role

    try:
        updated_lines = []
        for user_email, user_data in credentials.items():
            updated_lines.append(f"{user_email}:{user_data['password']}:{user_data['role']}\n")
        
        with open(LOGINS_FILE_PATH, "w") as f:
            f.writelines(updated_lines)

        return jsonify({'message': f'Nível de acesso de {email} atualizado para {new_role}.'}), 200
    except Exception as e:
        app.logger.error(f"Erro ao reescrever o arquivo de logins: {e}")
        return jsonify({'message': 'Erro interno ao salvar as alterações.'}), 500

@app.route('/api/user/<email>', methods=['GET'])
def get_user(email):
    """Busca os dados do usuário do arquivo de perfil e retorna como JSON."""
    sanitized_email = sanitize_email_for_filename(email)
    user_dir = os.path.join(USER_DATA_DIR, sanitized_email)
    profile_file_path = os.path.join(user_dir, 'profile.txt')
    if not os.path.exists(profile_file_path):
        return jsonify({"message": "Usuário não encontrado."}), 404

    # Lê os dados do arquivo e cria uma instância de Usuario
    dados = {}
    with open(profile_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if ':' in line:
                chave, valor = line.strip().split(':', 1)
                dados[chave.strip().lower()] = valor.strip()
    usuario = Usuario(
        nome=dados.get('nome', ''),
        email=dados.get('email', ''),
        lembrar_de_mim=dados.get('lembrar_de_mim', 'False') == 'True',
        nivel_de_acesso=dados.get('nivel_de_acesso', 'user')
    )
    return jsonify(usuario.to_dict())

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
