import sys
import os

# Adiciona o diretório pai (a pasta 'backend') ao path do Python.
# Isso é necessário para que os testes dentro da pasta 'tests'
# possam encontrar e importar o módulo 'app' que está na raiz de 'backend'.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))