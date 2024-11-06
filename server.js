import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.use(cors());

dotenv.config();

// Rota para criar um novo usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { email, nome, idade } = req.body;

    const novoUsuario = await prisma.user.create({
      data: { email, nome, idade },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Rota para obter usuários
app.get("/usuarios", async (req, res) => {
  try {
    const { nome, email, idade } = req.query;
    const filtros = {};

    if (nome) filtros.nome = nome;
    if (email) filtros.email = email;
    if (idade) filtros.idade = idade;

    const users = await prisma.user.findMany({
      where: filtros,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

// Rota para atualizar um usuário
app.put("/usuarios/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, nome, idade } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { email, nome, idade },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Rota para deletar um usuário
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
