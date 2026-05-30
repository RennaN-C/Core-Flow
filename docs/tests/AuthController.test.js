const AuthController = require("../../backend/controllers/AuthController");
const { User, Tenant } = require("../../backend/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// MOCK (Falsificação) das Dependências
jest.mock("../models", () => ({
  User: { findOne: jest.fn(), create: jest.fn() },
  Tenant: { create: jest.fn(), findByPk: jest.fn() },
  sequelize: { transaction: jest.fn((callback) => callback("transaction")) },
}));

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("AuthController - Testes Unitários (CT01 a CT04)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. Registro de Conta (Gestão de Multi-tenancy)", () => {
    test("CT01 (Positivo): Deve registrar empresa e usuário com sucesso", async () => {
      // ARRANGE (Preparar)
      const req = {
        body: {
          name: "Admin Teste",
          email: "admin@teste.com",
          password: "123",
          companyName: "Empresa Teste",
          business_type: "varejo",
        },
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue(null);
      Tenant.create.mockResolvedValue({
        id: "tenant-123",
        name: "Empresa Teste",
        update: jest.fn(),
      });
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed_password");
      User.create.mockResolvedValue({
        id: "user-123",
        name: "Admin Teste",
        email: "admin@teste.com",
      });

      // ACT (Executar)
      await AuthController.register(req, res);

      // ASSERT (Verificar)
      expect(Tenant.create).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Empresa e usuário criados com sucesso!",
        }),
      );
    });

    test("CT02 (Negativo): Deve retornar erro se faltar dado obrigatório no Sequelize", async () => {
      // ARRANGE
      const req = {
        body: {
          name: "Admin",
          email: "admin@teste.com",
          password: "123",
        },
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue(null);
      Tenant.create.mockRejectedValue(
        new Error("notNull Violation: Tenant.name cannot be null"),
      );

      // ACT
      await AuthController.register(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Erro ao registrar" }),
      );
    });
  });

  describe("2. Autenticação de Usuários (Login)", () => {
    test("CT03 (Positivo): Deve fazer login com credenciais corretas e retornar JWT", async () => {
      // ARRANGE
      const req = {
        body: { email: "admin@teste.com", password: "senha_correta" },
      };
      const res = mockResponse();

      const mockUser = {
        id: "user-1",
        name: "Admin",
        email: "admin@teste.com",
        tenant_id: "tenant-1",
        password_hash: "hash",
      };
      const mockTenant = { active: true };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      Tenant.findByPk.mockResolvedValue(mockTenant);
      jwt.sign.mockReturnValue("token-jwt-falso-123");

      // ACT
      await AuthController.login(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "token-jwt-falso-123",
          user: expect.any(Object),
        }),
      );
    });

    test("CT04 (Negativo): Deve bloquear login com senha incorreta", async () => {
      // ARRANGE
      const req = {
        body: { email: "admin@teste.com", password: "senha_errada" },
      };
      const res = mockResponse();

      const mockUser = { id: "user-1", password_hash: "hash" };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // ACT
      await AuthController.login(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Credenciais inválidas.",
      });
    });
  });
});
