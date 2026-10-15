import express from 'express';
// Apagamos a importação do PrismaClient e trazemos o nosso db.js
import { prisma } from "../../../../packages/database/lib/prisma.js";
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    // 1. Captura os dados enviados no corpo da requisição
    const { title, description, time, studentId } = req.body;

    // 2. Validação básica de campos obrigatórios
    // Usamos time === undefined porque o valor pode ser 0, o que falsificaria um !time
    if (!title || time === undefined || !studentId ) {
      return res.status(400).json({
        error: 'Os campos title, time e studentId são obrigatórios.'
      });
    }

    // 3. Cria a tarefa no banco
   const task = await prisma.task.create({
      data: {
        title,
        description,
        time,
        student: {
          connect: { id: studentId }
        }
      }
    });

    // 4. Retorna a tarefa criada com Status 201
    return res.status(201).json(task);

  } catch (error) {
    // P2003 é o erro do Prisma para falha de chave estrangeira (ID não encontrado)
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: 'O studentId informado não existe no banco de dados.'
      });
    }

    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor ao criar tarefa.' });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.query;
    const isTeacher = req.user.role === 'TEACHER';
    const requestedStudentId = isTeacher ? studentId : req.user.id;

    if (!isTeacher && studentId && studentId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado às tarefas de outro aluno.' });
    }

    const tasks = await prisma.task.findMany({
      where: requestedStudentId ? { studentId: requestedStudentId } : undefined,
      orderBy: {
        createdAt: 'desc' // Mostra as tarefas mais novas primeiro
      },
      include: {
        student: {
          select: { id: true, name: true }
        }
      }
    });

    return res.status(200).json(tasks);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor ao buscar tarefas.' });
  }
});


router.put('/:task_id', verifyToken, async (req, res) => {
  try {
    const { task_id } = req.params;
    const { title, description, time, isCompleted } = req.body;

    // 1. Monta o objeto com os campos que vieram na requisição
    const dataToUpdate = {};
    
    if (title) dataToUpdate.title = title;
    
    // Usamos !== undefined para permitir que o usuário envie um texto vazio ("") na descrição ou mude para false/0
    if (description !== undefined) dataToUpdate.description = description;
    if (time !== undefined) dataToUpdate.time = time;
    if (isCompleted !== undefined) dataToUpdate.isCompleted = isCompleted;

    // 2. Valida se veio pelo menos um campo para atualizar
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
    }

    // 3. Executa a atualização no banco de dados
    const updatedTask = await prisma.task.update({
      where: { id: task_id },
      data: dataToUpdate
    });

    return res.status(200).json(updatedTask);

  } catch (error) {
    // Tratamento de erro caso o ID da tarefa não exista no banco
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor ao atualizar a tarefa.' });
  }
});


router.delete('/:task_id', verifyToken, async (req, res) => {
  try {
    const { task_id } = req.params;

    // O Prisma deleta a tarefa inteira baseada no ID informado
    await prisma.task.delete({
      where: { id: task_id }
    });

    return res.status(200).json({ message: 'Tarefa deletada com sucesso.' });

  } catch (error) {
    // Código de erro P2025 significa que o ID não existe no banco de dados
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tarefa não encontrada ou já deletada.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor ao deletar a tarefa.' });
  }
});


export default router;