require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
  next();
});

// Middleware para verificar token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id e type
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

// Rota de registro
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, type } = req.body;

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) return res.status(400).json({ message: 'Email já cadastrado.' });

  const { error } = await supabase.from('users').insert({
    name,
    email,
    password,
    type: type || 'CLIENTE'
  });

  if (error) return res.status(500).json({ message: 'Erro ao registrar.', error });

  res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !user) return res.status(400).json({ message: 'Credenciais inválidas.' });

  const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, type: user.type } });
});

// Exemplo de rota protegida
app.get('/api/me', authMiddleware, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, type')
    .eq('id', req.user.id)
    .single();

  res.json(user);
});

// Verifica se usuário é ADMIN
function adminMiddleware(req, res, next) {
  if (req.user?.type !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado. Apenas ADMIN pode fazer isso.' });
  }
  next();
}

// Criar produto (ADMIN)
app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, image } = req.body;

  const { error } = await supabase.from('products').insert({ name, price, image });

  if (error) return res.status(500).json({ message: 'Erro ao criar produto.', error });

  res.status(201).json({ message: 'Produto criado com sucesso!' });
});

// Listar todos os produtos
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) return res.status(500).json({ message: 'Erro ao buscar produtos.' });

  res.json(data);
});

// Editar produto (ADMIN)
app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  const { error } = await supabase
    .from('products')
    .update({ name, price, image })
    .eq('id', id);

  if (error) return res.status(500).json({ message: 'Erro ao atualizar produto.' });

  res.json({ message: 'Produto atualizado com sucesso.' });
});

// Deletar produto (ADMIN)
app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ message: 'Erro ao excluir produto.' });

  res.json({ message: 'Produto excluído com sucesso.' });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
