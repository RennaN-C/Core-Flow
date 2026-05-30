const PersonController = require("../../backend/controllers/PersonController");
const { Person } = require("../../backend/models");

// 1. MOCK das Dependências
jest.mock("../models", () => ({
  Person: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("PersonController - Testes Unitários", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Integração de Pessoas e Proteção de Tenant", () => {
    test("CT05 (Positivo): Cadastrar pessoa associada ao tenant_id do usuário logado", async () => {
      // ARRANGE
      const req = {
        user: { tenant_id: "tenant-secreto-123" },
        body: {
          name: "João da Silva",
          document: "12345678900",
          phone: "999999999",
          email: "joao@email.com",
          metadata: { cep: "01001000" },
        },
      };
      const res = mockResponse();

      Person.create.mockResolvedValue({
        id: "person-1",
        ...req.body,
        tenant_id: req.user.tenant_id,
      });

      // ACT
      await PersonController.store(req, res);

      // ASSERT
      expect(Person.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "João da Silva",
          tenant_id: "tenant-secreto-123",
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201); // 201 Created
    });

    test("CT06 (Negativo): Retornar erro 500 se o banco de dados falhar ao salvar", async () => {
      // ARRANGE
      const req = {
        user: { tenant_id: "tenant-secreto-123" },
        body: { name: "Maria" },
      };
      const res = mockResponse();

      Person.create.mockRejectedValue(
        new Error("Falha de conexão com o banco"),
      );

      // ACT
      await PersonController.store(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao criar pessoa",
        }),
      );
    });

    test("CT07 (Negativo): Bloquear criação se não houver usuário autenticado na requisição", async () => {
      // ARRANGE
      const req = {
        body: { name: "Invasor" },
      };
      const res = mockResponse();

      // ACT
      await PersonController.store(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(500);
      expect(Person.create).not.toHaveBeenCalled();
    });
  });
});
