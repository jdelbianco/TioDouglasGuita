import express from 'express';
import { prisma }  from "../../../../packages/database/lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/STUDENT', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Busca o utilizador no banco
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 2. Verifica se o utilizador tem a permissão de ALUNO (Trava de segurança)
    if (user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Acesso negado: Este painel é exclusivo para alunos.' });
    }

    // 2. Verifica se o utilizador tem a permissão de ALUNO (Trava de segurança)
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Ops! O tio Douglas ainda não te autorizou a acessar sua conta.' });
    }

    // 3. Compara a senha digitada com o Hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 4. Gera o Token JWT válido por 1 dia
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || '918612', 
      { expiresIn: '1d' }
    );

    // 5. Remove a senha do objeto antes de devolver para o frontend
    const { password: _, ...userWithoutPassword } = user;

    // 6. Retorna o formato EXATO que o nosso frontend React está a esperar
    return res.status(200).json({
      message: "Login realizado com sucesso",
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

router.post('/TEACHER', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Busca o utilizador no banco
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 2. Verifica se o utilizador tem a permissão de ADMIN (Trava de segurança)
    if (user.role !== 'TEACHER') {
      return res.status(403).json({ error: 'Acesso negado: Este painel é exclusivo para professores.' });
    }

    // 3. Compara a senha digitada com o Hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 4. Gera o Token JWT válido por 1 dia
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || '918612', 
      { expiresIn: '1d' }
    );

    // 5. Remove a senha do objeto antes de devolver para o frontend
    const { password: _, ...userWithoutPassword } = user;

    // 6. Retorna o formato EXATO que o nosso frontend React está a esperar
    return res.status(200).json({
      message: "Login realizado com sucesso",
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

export default router;