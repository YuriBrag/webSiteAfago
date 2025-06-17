import { render, screen } from "@testing-library/react";
import ListarFormulariosPage from "./ListarFormulariosPage";

// Mock global da função fetch antes de todos os testes
beforeEach(() => {
	global.fetch = jest.fn();
});

describe("ListarFormulariosPage", () => {
	test('exibe mensagem de "nenhum formulário" quando a API retorna uma lista vazia', async () => {
		// Configura o mock para retornar uma lista vazia
		fetch.mockResolvedValueOnce({
			json: async () => [],
		});

		render(<ListarFormulariosPage />);

		// Espera até que o texto apareça na tela (após a chamada da API)
		const noFormsMessage = await screen.findByText(
			/nenhum formulário encontrado/i
		);
		expect(noFormsMessage).toBeInTheDocument();
	});

	test("renderiza a lista de formulários quando a API retorna dados", async () => {
		const mockForms = [
			{ nome: "resposta_2025-06-15.txt", conteudo: "Efetividade: 5" },
			{ nome: "resposta_2025-06-14.txt", conteudo: "Efetividade: 4" },
		];

		// Configura o mock para retornar os dados simulados
		fetch.mockResolvedValueOnce({
			json: async () => mockForms,
		});

		render(<ListarFormulariosPage />);

		// Espera e verifica se o nome do primeiro formulário aparece
		const firstFormTitle = await screen.findByRole("heading", {
			name: /resposta_2025-06-15.txt/i,
		});
		expect(firstFormTitle).toBeInTheDocument();

		// Verifica se o conteúdo do segundo formulário aparece
		const secondFormContent = await screen.findByText(/efetividade: 4/i);
		expect(secondFormContent).toBeInTheDocument();
	});
});
