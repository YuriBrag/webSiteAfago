import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FormsPage from "./FormsPage";

// Testes para a FormsPage
describe("FormsPage", () => {
	test("renderiza o título principal corretamente", () => {
		render(<FormsPage />, { wrapper: BrowserRouter }); // O wrapper é necessário por causa do <Link>

		// Procura por um elemento de cabeçalho (h1, h2, etc.) com o texto "Formulários"
		const headingElement = screen.getByRole("heading", {
			name: /formulários/i,
		});
		expect(headingElement).toBeInTheDocument();
	});

	test("renderiza o link para responder formulário", () => {
		render(<FormsPage />, { wrapper: BrowserRouter });

		const responderLink = screen.getByRole("link", {
			name: /responder formulário/i,
		});
		expect(responderLink).toBeInTheDocument();
		expect(responderLink).toHaveAttribute("href", "/responder-formulario");
	});
});
