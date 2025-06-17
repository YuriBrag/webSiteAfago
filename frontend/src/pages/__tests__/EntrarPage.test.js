import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EntrarPage from './EntrarPage';

// Mock para useNavigate e localStorage
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa e mantém as funcionalidades originais
  useNavigate: () => mockNavigate, // Sobrescreve useNavigate com o mock
}));

// Mock para window.location.reload
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: jest.fn() },
});

// Mock para localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock para fetch
global.fetch = jest.fn();

describe('EntrarPage', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    fetch.mockClear();
    mockNavigate.mockClear();
    window.location.reload.mockClear();
    localStorage.clear();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <EntrarPage />
      </BrowserRouter>
    );
  };

  test('renderiza o formulário de login corretamente', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /Entrar na Plataforma/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Não tem uma conta?/i)).toBeInTheDocument();
  });

  test('permite que o usuário digite no campo de email e senha', () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Senha/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('mostra mensagem de erro para campos obrigatórios se o backend retornar erro (exemplo genérico)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400, // Exemplo de bad request
      json: async () => ({ message: 'Email e senha são obrigatórios.' }),
    });

    renderComponent();
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Email e senha são obrigatórios./i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('mostra mensagem de erro para usuário não encontrado (status 404)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Usuário não encontrado.' }), // A mensagem exata pode variar
    });

    renderComponent();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Usuário não encontrado./i)).toBeInTheDocument();
    expect(screen.getByText(/Crie uma conta./i)).toBeInTheDocument(); // Verifica o link para registrar
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('realiza login com sucesso, armazena token e redireciona', async () => {
    const mockUserData = {
      token: 'fake-jwt-token',
      userEmail: 'test@example.com',
      userName: 'Test User',
      userRole: 'user',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    renderComponent();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Espera o botão de "Entrando..." aparecer e desaparecer
    expect(screen.getByRole('button', { name: /Entrando.../i})).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('button', { name: /Entrando.../i})).not.toBeInTheDocument());


    // Verifica se o localStorage foi atualizado
    expect(localStorage.getItem('authToken')).toBe(mockUserData.token);
    expect(localStorage.getItem('userEmail')).toBe(mockUserData.userEmail);
    expect(localStorage.getItem('userName')).toBe(mockUserData.userName);
    expect(localStorage.getItem('userRole')).toBe(mockUserData.userRole);

    // Verifica se a navegação ocorreu
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    // Verifica se window.location.reload foi chamado
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('mostra mensagem de erro genérica para falha no login não tratada especificamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500, // Erro de servidor
      json: async () => ({ message: 'Erro interno do servidor.' }),
    });

    renderComponent();
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Erro interno do servidor./i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

   test('mostra mensagem de erro se a resposta do servidor não contiver token ou userEmail', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Resposta incompleta' }), // Resposta sem token/userEmail
    });

    renderComponent();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Resposta de login inválida do servidor./i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});