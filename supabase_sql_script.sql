-- Script para criar as tabelas migradas do V1 para o V2 no Supabase
-- Atenção: Estas tabelas assumem que você já tem as tabelas 'pessoas' e 'produtos' criadas (caso não existam, este script precisará de ajustes ou pode falhar em chaves estrangeiras).

-- ===============================================================
-- 1. FINANCEIRO: Contas Bancárias
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    banco TEXT NOT NULL,
    agencia TEXT,
    conta TEXT,
    tipo TEXT NOT NULL DEFAULT 'corrente',
    descricao TEXT NOT NULL,
    saldo_inicial NUMERIC(15,2) DEFAULT 0,
    saldo_atual NUMERIC(15,2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 2. FINANCEIRO: Plano de Contas
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.plano_contas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    codigo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo TEXT NOT NULL,
    natureza TEXT NOT NULL,
    conta_pai_id UUID REFERENCES public.plano_contas(id) ON DELETE SET NULL,
    sintetica BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 3. FINANCEIRO: Contas a Pagar
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.contas_pagar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    descricao TEXT NOT NULL,
    valor_original NUMERIC(15,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    forma_pagamento TEXT,
    observacoes TEXT,
    pessoa_id UUID, -- Referência à tabela pessoas (fornecedor)
    plano_conta_id UUID REFERENCES public.plano_contas(id) ON DELETE SET NULL,
    conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
    condicao_pagamento TEXT DEFAULT 'a_vista',
    parcela_numero INTEGER DEFAULT 1,
    parcela_total INTEGER DEFAULT 1,
    status TEXT DEFAULT 'aberto',
    valor_pago NUMERIC(15,2),
    valor_juros NUMERIC(15,2) DEFAULT 0,
    valor_multa NUMERIC(15,2) DEFAULT 0,
    valor_desconto NUMERIC(15,2) DEFAULT 0,
    data_pagamento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 4. FINANCEIRO: Contas a Receber
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.contas_receber (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    descricao TEXT NOT NULL,
    valor_original NUMERIC(15,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    forma_pagamento TEXT,
    observacoes TEXT,
    pessoa_id UUID, -- Referência à tabela pessoas (cliente)
    plano_conta_id UUID REFERENCES public.plano_contas(id) ON DELETE SET NULL,
    conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
    condicao_pagamento TEXT DEFAULT 'a_vista',
    parcela_numero INTEGER DEFAULT 1,
    parcela_total INTEGER DEFAULT 1,
    status TEXT DEFAULT 'aberto',
    valor_recebido NUMERIC(15,2),
    valor_juros NUMERIC(15,2) DEFAULT 0,
    valor_multa NUMERIC(15,2) DEFAULT 0,
    valor_desconto NUMERIC(15,2) DEFAULT 0,
    data_recebimento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 5. FINANCEIRO: Lançamentos Contábeis
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.lancamentos_contabeis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    data_lancamento DATE NOT NULL DEFAULT CURRENT_DATE,
    valor NUMERIC(15,2) NOT NULL,
    historico TEXT NOT NULL,
    origem_tipo TEXT,
    origem_id UUID,
    conta_debito_id UUID REFERENCES public.plano_contas(id) ON DELETE RESTRICT,
    conta_credito_id UUID REFERENCES public.plano_contas(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 6. COMERCIAL: Vendedores
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.vendedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    percentual_comissao NUMERIC(5,2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 7. COMERCIAL: Pedidos de Venda
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.pedidos_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    numero_pedido SERIAL,
    cliente_id UUID, -- Referência à tabela pessoas
    vendedor_id UUID REFERENCES public.vendedores(id) ON DELETE SET NULL,
    data_pedido DATE DEFAULT CURRENT_DATE,
    data_entrega_prevista DATE,
    condicao_pagamento TEXT DEFAULT 'a_vista',
    valor_produtos NUMERIC(15,2) DEFAULT 0,
    valor_desconto NUMERIC(15,2) DEFAULT 0,
    valor_frete NUMERIC(15,2) DEFAULT 0,
    valor_total NUMERIC(15,2) DEFAULT 0,
    observacoes TEXT,
    status TEXT DEFAULT 'rascunho',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 8. COMERCIAL: Itens do Pedido
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.itens_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    pedido_id UUID REFERENCES public.pedidos_venda(id) ON DELETE CASCADE,
    produto_id UUID, -- Referência à tabela produtos
    quantidade NUMERIC(15,3) NOT NULL,
    preco_unitario NUMERIC(15,2) NOT NULL,
    valor_total NUMERIC(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- 9. COMERCIAL: Romaneios de Venda
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.romaneios_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    empresa_id UUID,
    pedido_id UUID REFERENCES public.pedidos_venda(id) ON DELETE CASCADE,
    veiculo_placa TEXT,
    motorista_nome TEXT,
    motorista_cpf TEXT,
    valor_frete NUMERIC(15,2) DEFAULT 0,
    peso_total NUMERIC(15,3) DEFAULT 0,
    observacoes TEXT,
    status TEXT DEFAULT 'carregado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================================
-- Dica: Opcionalmente você precisará criar as Functions (RPC) 
-- gerar_parcelas_cp e gerar_parcelas_cr no Supabase depois, 
-- ou o Lovable pode tentar criar o comportamento pelo código.
-- ===============================================================
