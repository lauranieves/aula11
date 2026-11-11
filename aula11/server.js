require('dotenv').config();
const express = require('express');
const supabase = require('./src/config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Buscar todos os pacotes turísticos ordenados pelo menor preço (valor_total crescente)
app.get('/pacotes', async (req, res) => {
  const { data, error } = await supabase
    .from('pacotes_turismo')
    .select('*')
    .order('valor_total', { ascending: true });

  if (error) {
    return res.status(500).json({ erro: 'Erro ao consultar a lista de pacotes' });
  }

  res.json(data);
});

// Buscar pacote específico por ID
app.get('/pacotes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pacotes_turismo')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error?.code === 'PGRST116' || !data) {
      return res.status(404).json({ erro: 'Pacote não encontrado' });
    }

    if (error) {
      return res.status(500).json({ erro: 'Erro ao consultar os detalhes do pacote' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/pacotes`);
});