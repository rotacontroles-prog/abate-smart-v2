export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      animais_compra: {
        Row: {
          categoria_peso: string | null
          comissao_comprador_percentual: number | null
          comissao_comprador_valor: number | null
          comprador_nome: string | null
          created_at: string
          data_compra: string
          deleted_at: string | null
          empresa_id: string
          especie: string
          funrural_percentual: number | null
          funrural_valor: number | null
          gta_valor: number | null
          id: string
          numero_gta: string | null
          observacoes: string | null
          peso_arroba: number | null
          peso_total: number
          pessoa_id: string | null
          preco_arroba: number | null
          quantidade: number
          raca: string | null
          senar_percentual: number | null
          senar_valor: number | null
          sexo: string | null
          status: string
          tenant_id: string
          total_impostos: number | null
          valor_liquido: number | null
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          categoria_peso?: string | null
          comissao_comprador_percentual?: number | null
          comissao_comprador_valor?: number | null
          comprador_nome?: string | null
          created_at?: string
          data_compra?: string
          deleted_at?: string | null
          empresa_id: string
          especie?: string
          funrural_percentual?: number | null
          funrural_valor?: number | null
          gta_valor?: number | null
          id?: string
          numero_gta?: string | null
          observacoes?: string | null
          peso_arroba?: number | null
          peso_total?: number
          pessoa_id?: string | null
          preco_arroba?: number | null
          quantidade?: number
          raca?: string | null
          senar_percentual?: number | null
          senar_valor?: number | null
          sexo?: string | null
          status?: string
          tenant_id: string
          total_impostos?: number | null
          valor_liquido?: number | null
          valor_total?: number
          valor_unitario?: number
        }
        Update: {
          categoria_peso?: string | null
          comissao_comprador_percentual?: number | null
          comissao_comprador_valor?: number | null
          comprador_nome?: string | null
          created_at?: string
          data_compra?: string
          deleted_at?: string | null
          empresa_id?: string
          especie?: string
          funrural_percentual?: number | null
          funrural_valor?: number | null
          gta_valor?: number | null
          id?: string
          numero_gta?: string | null
          observacoes?: string | null
          peso_arroba?: number | null
          peso_total?: number
          pessoa_id?: string | null
          preco_arroba?: number | null
          quantidade?: number
          raca?: string | null
          senar_percentual?: number | null
          senar_valor?: number | null
          sexo?: string | null
          status?: string
          tenant_id?: string
          total_impostos?: number | null
          valor_liquido?: number | null
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "animais_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_compra_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_compra_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          created_at: string
          dados_antes: Json | null
          dados_depois: Json | null
          hash_anterior: string | null
          hash_integridade: string
          id: string
          registro_id: string
          tabela_origem: string
          tenant_id: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          hash_anterior?: string | null
          hash_integridade: string
          id?: string
          registro_id: string
          tabela_origem: string
          tenant_id: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          hash_anterior?: string | null
          hash_integridade?: string
          id?: string
          registro_id?: string
          tabela_origem?: string
          tenant_id?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      camaras_frias: {
        Row: {
          capacidade_kg: number | null
          codigo: string
          created_at: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          observacoes: string | null
          status: string
          temperatura_atual: number | null
          temperatura_max: number | null
          temperatura_min: number | null
          tenant_id: string
          ultima_leitura: string | null
        }
        Insert: {
          capacidade_kg?: number | null
          codigo: string
          created_at?: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          observacoes?: string | null
          status?: string
          temperatura_atual?: number | null
          temperatura_max?: number | null
          temperatura_min?: number | null
          tenant_id: string
          ultima_leitura?: string | null
        }
        Update: {
          capacidade_kg?: number | null
          codigo?: string
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          observacoes?: string | null
          status?: string
          temperatura_atual?: number | null
          temperatura_max?: number | null
          temperatura_min?: number | null
          tenant_id?: string
          ultima_leitura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "camaras_frias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "camaras_frias_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      centros_custo: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          tenant_id: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          tenant_id: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "centros_custo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "centros_custo_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          ativo: boolean
          banco: string
          conta: string | null
          created_at: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          saldo_atual: number
          saldo_inicial: number
          tenant_id: string
          tipo: string
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean
          banco: string
          conta?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          saldo_atual?: number
          saldo_inicial?: number
          tenant_id: string
          tipo?: string
        }
        Update: {
          agencia?: string | null
          ativo?: boolean
          banco?: string
          conta?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          saldo_atual?: number
          saldo_inicial?: number
          tenant_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_bancarias_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_pagar: {
        Row: {
          centro_custo_id: string | null
          condicao_pagamento: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_emissao: string
          data_pagamento: string | null
          data_vencimento: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          forma_pagamento: string | null
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          pessoa_id: string | null
          plano_conta_id: string | null
          status: string
          tenant_id: string
          updated_at: string
          valor_desconto: number | null
          valor_juros: number | null
          valor_multa: number | null
          valor_original: number
          valor_pago: number | null
        }
        Insert: {
          centro_custo_id?: string | null
          condicao_pagamento?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          forma_pagamento?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          pessoa_id?: string | null
          plano_conta_id?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_original: number
          valor_pago?: number | null
        }
        Update: {
          centro_custo_id?: string | null
          condicao_pagamento?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          forma_pagamento?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          pessoa_id?: string | null
          plano_conta_id?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_original?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagar_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_receber: {
        Row: {
          centro_custo_id: string | null
          condicao_pagamento: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_emissao: string
          data_recebimento: string | null
          data_vencimento: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          forma_pagamento: string | null
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          pessoa_id: string | null
          plano_conta_id: string | null
          status: string
          tenant_id: string
          updated_at: string
          valor_desconto: number | null
          valor_juros: number | null
          valor_multa: number | null
          valor_original: number
          valor_recebido: number | null
        }
        Insert: {
          centro_custo_id?: string | null
          condicao_pagamento?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_emissao?: string
          data_recebimento?: string | null
          data_vencimento: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          forma_pagamento?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          pessoa_id?: string | null
          plano_conta_id?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_original: number
          valor_recebido?: number | null
        }
        Update: {
          centro_custo_id?: string | null
          condicao_pagamento?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_emissao?: string
          data_recebimento?: string | null
          data_vencimento?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          forma_pagamento?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          pessoa_id?: string | null
          plano_conta_id?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_original?: number
          valor_recebido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cortes_desossa: {
        Row: {
          created_at: string
          deleted_at: string | null
          destino: string | null
          empresa_id: string
          id: string
          nome_corte: string
          observacoes: string | null
          ordem_desossa_id: string
          peso: number
          quantidade: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          destino?: string | null
          empresa_id: string
          id?: string
          nome_corte: string
          observacoes?: string | null
          ordem_desossa_id: string
          peso?: number
          quantidade?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          destino?: string | null
          empresa_id?: string
          id?: string
          nome_corte?: string
          observacoes?: string | null
          ordem_desossa_id?: string
          peso?: number
          quantidade?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cortes_desossa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cortes_desossa_ordem_desossa_id_fkey"
            columns: ["ordem_desossa_id"]
            isOneToOne: false
            referencedRelation: "ordens_desossa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cortes_desossa_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean
          cidade: string | null
          cnpj: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          endereco: string | null
          id: string
          inscricao_estadual: string | null
          nome_fantasia: string | null
          razao_social: string
          sif: string | null
          telefone: string | null
          tenant_id: string
          uf: string | null
        }
        Insert: {
          ativo?: boolean
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          razao_social: string
          sif?: string | null
          telefone?: string | null
          tenant_id: string
          uf?: string | null
        }
        Update: {
          ativo?: boolean
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          sif?: string | null
          telefone?: string | null
          tenant_id?: string
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_movimentos: {
        Row: {
          created_at: string
          custo_unitario: number
          empresa_id: string
          id: string
          origem_id: string | null
          origem_tipo: string | null
          produto_id: string
          quantidade: number
          tenant_id: string
          tipo: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          custo_unitario: number
          empresa_id: string
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          produto_id: string
          quantidade: number
          tenant_id: string
          tipo: string
          valor_total: number
        }
        Update: {
          created_at?: string
          custo_unitario?: number
          empresa_id?: string
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          produto_id?: string
          quantidade?: number
          tenant_id?: string
          tipo?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_movimentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_movimentos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_movimentos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_abate: {
        Row: {
          compra_id: string | null
          created_at: string
          data_abate: string
          deleted_at: string | null
          empresa_id: string
          id: string
          numero_ficha: string | null
          observacoes: string | null
          peso_carcaca: number | null
          peso_vivo: number | null
          quantidade_animais: number
          rendimento_carcaca: number | null
          sif_responsavel: string | null
          status: string
          tenant_id: string
          veterinario: string | null
        }
        Insert: {
          compra_id?: string | null
          created_at?: string
          data_abate?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          numero_ficha?: string | null
          observacoes?: string | null
          peso_carcaca?: number | null
          peso_vivo?: number | null
          quantidade_animais?: number
          rendimento_carcaca?: number | null
          sif_responsavel?: string | null
          status?: string
          tenant_id: string
          veterinario?: string | null
        }
        Update: {
          compra_id?: string | null
          created_at?: string
          data_abate?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          numero_ficha?: string | null
          observacoes?: string | null
          peso_carcaca?: number | null
          peso_vivo?: number | null
          quantidade_animais?: number
          rendimento_carcaca?: number | null
          sif_responsavel?: string | null
          status?: string
          tenant_id?: string
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_abate_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "animais_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_abate_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_abate_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          created_at: string
          id: string
          observacoes: string | null
          pedido_id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          tenant_id: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_id: string
          preco_unitario?: number
          produto_id: string
          quantidade?: number
          tenant_id: string
          valor_total?: number
        }
        Update: {
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          tenant_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_venda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_contabeis: {
        Row: {
          centro_custo_id: string | null
          conta_credito_id: string
          conta_debito_id: string
          created_at: string
          data_lancamento: string
          empresa_id: string
          historico: string
          id: string
          origem_id: string | null
          origem_tipo: string | null
          tenant_id: string
          usuario_id: string | null
          valor: number
        }
        Insert: {
          centro_custo_id?: string | null
          conta_credito_id: string
          conta_debito_id: string
          created_at?: string
          data_lancamento?: string
          empresa_id: string
          historico: string
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          tenant_id: string
          usuario_id?: string | null
          valor: number
        }
        Update: {
          centro_custo_id?: string | null
          conta_credito_id?: string
          conta_debito_id?: string
          created_at?: string
          data_lancamento?: string
          empresa_id?: string
          historico?: string
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          tenant_id?: string
          usuario_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_contabeis_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_conta_credito_id_fkey"
            columns: ["conta_credito_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_conta_debito_id_fkey"
            columns: ["conta_debito_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lote_cortes: {
        Row: {
          created_at: string
          custo_total: number | null
          custo_unitario_calculado: number | null
          id: string
          lote_id: string
          produto_id: string
          quantidade_kg: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          custo_total?: number | null
          custo_unitario_calculado?: number | null
          id?: string
          lote_id: string
          produto_id: string
          quantidade_kg?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          custo_total?: number | null
          custo_unitario_calculado?: number | null
          id?: string
          lote_id?: string
          produto_id?: string
          quantidade_kg?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lote_cortes_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_abate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lote_cortes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lote_cortes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lote_rendimento: {
        Row: {
          created_at: string
          id: string
          lote_id: string
          perda_tecnica_percentual: number
          peso_carcaca_total: number
          rendimento_percentual: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lote_id: string
          perda_tecnica_percentual?: number
          peso_carcaca_total?: number
          rendimento_percentual?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lote_id?: string
          perda_tecnica_percentual?: number
          peso_carcaca_total?: number
          rendimento_percentual?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lote_rendimento_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_abate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lote_rendimento_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes_abate: {
        Row: {
          created_at: string
          custo_indireto_rateado: number
          custo_total_animais: number
          data_abate: string
          deleted_at: string | null
          empresa_id: string
          finalizado_em: string | null
          id: string
          peso_total_vivo: number
          quantidade_animais: number
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          custo_indireto_rateado?: number
          custo_total_animais?: number
          data_abate?: string
          deleted_at?: string | null
          empresa_id: string
          finalizado_em?: string | null
          id?: string
          peso_total_vivo?: number
          quantidade_animais?: number
          status?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          custo_indireto_rateado?: number
          custo_total_animais?: number
          data_abate?: string
          deleted_at?: string | null
          empresa_id?: string
          finalizado_em?: string | null
          id?: string
          peso_total_vivo?: number
          quantidade_animais?: number
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotes_abate_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lotes_abate_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentos_caixa: {
        Row: {
          conta_bancaria: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_movimento: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          forma: string | null
          id: string
          origem_id: string | null
          origem_tipo: string | null
          tenant_id: string
          tipo: string
          valor: number
        }
        Insert: {
          conta_bancaria?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_movimento?: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          forma?: string | null
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          tenant_id: string
          tipo: string
          valor: number
        }
        Update: {
          conta_bancaria?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_movimento?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          forma?: string | null
          id?: string
          origem_id?: string | null
          origem_tipo?: string | null
          tenant_id?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentos_caixa_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentos_caixa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentos_caixa_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_desossa: {
        Row: {
          created_at: string
          data_desossa: string
          deleted_at: string | null
          empresa_id: string
          ficha_abate_id: string | null
          id: string
          numero_ordem: string | null
          observacoes: string | null
          peso_entrada: number | null
          peso_saida_total: number | null
          quantidade_meias_carcacas: number
          responsavel: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          data_desossa?: string
          deleted_at?: string | null
          empresa_id: string
          ficha_abate_id?: string | null
          id?: string
          numero_ordem?: string | null
          observacoes?: string | null
          peso_entrada?: number | null
          peso_saida_total?: number | null
          quantidade_meias_carcacas?: number
          responsavel?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          data_desossa?: string
          deleted_at?: string | null
          empresa_id?: string
          ficha_abate_id?: string | null
          id?: string
          numero_ordem?: string | null
          observacoes?: string | null
          peso_entrada?: number | null
          peso_saida_total?: number | null
          quantidade_meias_carcacas?: number
          responsavel?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_desossa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_desossa_ficha_abate_id_fkey"
            columns: ["ficha_abate_id"]
            isOneToOne: false
            referencedRelation: "fichas_abate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_desossa_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_venda: {
        Row: {
          cliente_id: string | null
          condicao_pagamento: string | null
          created_at: string
          data_entrega_prevista: string | null
          data_pedido: string
          deleted_at: string | null
          empresa_id: string
          id: string
          numero_pedido: string | null
          observacoes: string | null
          status: string
          tenant_id: string
          updated_at: string
          valor_desconto: number
          valor_frete: number
          valor_produtos: number
          valor_total: number
          vendedor_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          condicao_pagamento?: string | null
          created_at?: string
          data_entrega_prevista?: string | null
          data_pedido?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          numero_pedido?: string | null
          observacoes?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          valor_desconto?: number
          valor_frete?: number
          valor_produtos?: number
          valor_total?: number
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          condicao_pagamento?: string | null
          created_at?: string
          data_entrega_prevista?: string | null
          data_pedido?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          numero_pedido?: string | null
          observacoes?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          valor_desconto?: number
          valor_frete?: number
          valor_produtos?: number
          valor_total?: number
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_venda_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_venda_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_venda_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_venda_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      periodos_contabeis: {
        Row: {
          ano: number
          created_at: string
          data_fechamento: string | null
          empresa_id: string
          fechado_por: string | null
          id: string
          mes: number
          status: string
          tenant_id: string
        }
        Insert: {
          ano: number
          created_at?: string
          data_fechamento?: string | null
          empresa_id: string
          fechado_por?: string | null
          id?: string
          mes: number
          status?: string
          tenant_id: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_fechamento?: string | null
          empresa_id?: string
          fechado_por?: string | null
          id?: string
          mes?: number
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "periodos_contabeis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "periodos_contabeis_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          id: string
          inscricao_estadual: string | null
          nome_fantasia: string | null
          observacoes: string | null
          razao_social: string
          telefone: string | null
          tenant_id: string
          tipo: string[]
          uf: string | null
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social: string
          telefone?: string | null
          tenant_id: string
          tipo?: string[]
          uf?: string | null
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social?: string
          telefone?: string | null
          tenant_id?: string
          tipo?: string[]
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plano_contas: {
        Row: {
          ativo: boolean
          codigo: string
          conta_pai_id: string | null
          created_at: string
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          natureza: string
          sintetica: boolean
          tenant_id: string
          tipo: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          conta_pai_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          natureza: string
          sintetica?: boolean
          tenant_id: string
          tipo: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          conta_pai_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          natureza?: string
          sintetica?: boolean
          tenant_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "plano_contas_conta_pai_id_fkey"
            columns: ["conta_pai_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_contas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_contas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_saas: {
        Row: {
          acesso_cnab: boolean
          acesso_contabilidade: boolean
          ativo: boolean
          created_at: string
          id: string
          limite_nfe_mes: number
          limite_storage_gb: number
          limite_usuarios: number
          nome: string
          valor_mensal: number
        }
        Insert: {
          acesso_cnab?: boolean
          acesso_contabilidade?: boolean
          ativo?: boolean
          created_at?: string
          id?: string
          limite_nfe_mes?: number
          limite_storage_gb?: number
          limite_usuarios?: number
          nome: string
          valor_mensal?: number
        }
        Update: {
          acesso_cnab?: boolean
          acesso_contabilidade?: boolean
          ativo?: boolean
          created_at?: string
          id?: string
          limite_nfe_mes?: number
          limite_storage_gb?: number
          limite_usuarios?: number
          nome?: string
          valor_mensal?: number
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          custo_medio: number
          deleted_at: string | null
          descricao: string
          empresa_id: string
          estoque_atual: number
          id: string
          preco_venda: number
          tenant_id: string
          unidade: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          custo_medio?: number
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          estoque_atual?: number
          id?: string
          preco_venda?: number
          tenant_id: string
          unidade?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          custo_medio?: number
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          estoque_atual?: number
          id?: string
          preco_venda?: number
          tenant_id?: string
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          empresa_id: string | null
          id: string
          nome: string
          tenant_id: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          id: string
          nome?: string
          tenant_id?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      romaneios_embarque: {
        Row: {
          compra_id: string
          created_at: string
          data_embarque: string
          deleted_at: string | null
          destino_unidade: string | null
          empresa_id: string
          id: string
          km_final: number | null
          km_inicial: number | null
          km_total: number | null
          motorista_cpf: string | null
          motorista_nome: string | null
          observacoes: string | null
          origem_cidade: string | null
          origem_fazenda: string | null
          origem_uf: string | null
          peso_embarque: number | null
          quantidade_animais: number | null
          status: string
          tenant_id: string
          valor_frete_km: number | null
          valor_frete_total: number | null
          veiculo_placa: string | null
          veiculo_tipo: string | null
        }
        Insert: {
          compra_id: string
          created_at?: string
          data_embarque?: string
          deleted_at?: string | null
          destino_unidade?: string | null
          empresa_id: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          km_total?: number | null
          motorista_cpf?: string | null
          motorista_nome?: string | null
          observacoes?: string | null
          origem_cidade?: string | null
          origem_fazenda?: string | null
          origem_uf?: string | null
          peso_embarque?: number | null
          quantidade_animais?: number | null
          status?: string
          tenant_id: string
          valor_frete_km?: number | null
          valor_frete_total?: number | null
          veiculo_placa?: string | null
          veiculo_tipo?: string | null
        }
        Update: {
          compra_id?: string
          created_at?: string
          data_embarque?: string
          deleted_at?: string | null
          destino_unidade?: string | null
          empresa_id?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          km_total?: number | null
          motorista_cpf?: string | null
          motorista_nome?: string | null
          observacoes?: string | null
          origem_cidade?: string | null
          origem_fazenda?: string | null
          origem_uf?: string | null
          peso_embarque?: number | null
          quantidade_animais?: number | null
          status?: string
          tenant_id?: string
          valor_frete_km?: number | null
          valor_frete_total?: number | null
          veiculo_placa?: string | null
          veiculo_tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "romaneios_embarque_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "animais_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "romaneios_embarque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "romaneios_embarque_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      romaneios_venda: {
        Row: {
          created_at: string
          data_expedicao: string
          deleted_at: string | null
          empresa_id: string
          id: string
          motorista_cpf: string | null
          motorista_nome: string | null
          numero_romaneio: string | null
          observacoes: string | null
          pedido_id: string
          peso_total: number | null
          status: string
          tenant_id: string
          valor_frete: number | null
          veiculo_placa: string | null
        }
        Insert: {
          created_at?: string
          data_expedicao?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          motorista_cpf?: string | null
          motorista_nome?: string | null
          numero_romaneio?: string | null
          observacoes?: string | null
          pedido_id: string
          peso_total?: number | null
          status?: string
          tenant_id: string
          valor_frete?: number | null
          veiculo_placa?: string | null
        }
        Update: {
          created_at?: string
          data_expedicao?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          motorista_cpf?: string | null
          motorista_nome?: string | null
          numero_romaneio?: string | null
          observacoes?: string | null
          pedido_id?: string
          peso_total?: number | null
          status?: string
          tenant_id?: string
          valor_frete?: number | null
          veiculo_placa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "romaneios_venda_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "romaneios_venda_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_venda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "romaneios_venda_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          nome: string
          plano_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          plano_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          plano_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_saas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores: {
        Row: {
          ativo: boolean
          created_at: string
          deleted_at: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          percentual_comissao: number
          pessoa_id: string | null
          telefone: string | null
          tenant_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          percentual_comissao?: number
          pessoa_id?: string | null
          telefone?: string | null
          tenant_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          percentual_comissao?: number
          pessoa_id?: string | null
          telefone?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedores_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_cmv: {
        Args: {
          p_empresa_id: string
          p_origem_id?: string
          p_origem_tipo?: string
          p_produto_id: string
          p_quantidade: number
          p_tenant_id: string
        }
        Returns: number
      }
      fechar_periodo: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: undefined
      }
      finalizar_lote_abate: { Args: { p_lote_id: string }; Returns: undefined }
      gerar_balancete: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          codigo: string
          conta_id: string
          descricao: string
          natureza: string
          saldo: number
          tipo: string
          total_credito: number
          total_debito: number
        }[]
      }
      gerar_dre: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          descricao: string
          grupo: string
          ordem: number
          valor: number
        }[]
      }
      gerar_dre_por_centro_custo: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          centro_custo_codigo: string
          centro_custo_descricao: string
          centro_custo_id: string
          deducoes: number
          despesas: number
          receita_bruta: number
          receita_liquida: number
          resultado: number
        }[]
      }
      gerar_lancamento_contabil: {
        Args: {
          p_conta_credito_id: string
          p_conta_debito_id: string
          p_empresa_id: string
          p_historico: string
          p_origem_id: string
          p_origem_tipo: string
          p_tenant_id: string
          p_valor: number
        }
        Returns: string
      }
      gerar_livro_diario: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          conta_credito_codigo: string
          conta_credito_descricao: string
          conta_debito_codigo: string
          conta_debito_descricao: string
          data_lancamento: string
          historico: string
          origem_id: string
          origem_tipo: string
          valor: number
        }[]
      }
      gerar_livro_razao: {
        Args: {
          p_ano: number
          p_conta_id: string
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          credito: number
          data_lancamento: string
          debito: number
          historico: string
          saldo_acumulado: number
        }[]
      }
      gerar_margem_produto: {
        Args: {
          p_ano: number
          p_empresa_id: string
          p_mes: number
          p_tenant_id: string
        }
        Returns: {
          cmv: number
          margem_bruta: number
          percentual_margem: number
          produto_codigo: string
          produto_descricao: string
          produto_id: string
          receita: number
        }[]
      }
      gerar_parcelas_cp: {
        Args: {
          p_conta_bancaria_id?: string
          p_data_primeira_parcela: string
          p_descricao: string
          p_empresa_id: string
          p_forma_pagamento?: string
          p_intervalo_dias?: number
          p_num_parcelas: number
          p_observacoes?: string
          p_pessoa_id?: string
          p_plano_conta_id?: string
          p_tenant_id: string
          p_valor_total: number
        }
        Returns: string[]
      }
      gerar_parcelas_cr: {
        Args: {
          p_conta_bancaria_id?: string
          p_data_primeira_parcela: string
          p_descricao: string
          p_empresa_id: string
          p_forma_pagamento?: string
          p_intervalo_dias?: number
          p_num_parcelas: number
          p_observacoes?: string
          p_pessoa_id?: string
          p_plano_conta_id?: string
          p_tenant_id: string
          p_valor_total: number
        }
        Returns: string[]
      }
      get_tenant_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      movimentar_estoque: {
        Args: {
          p_custo_unitario: number
          p_empresa_id: string
          p_origem_id?: string
          p_origem_tipo?: string
          p_produto_id: string
          p_quantidade: number
          p_tenant_id: string
          p_tipo: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "gerente" | "financeiro" | "operador" | "vendedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gerente", "financeiro", "operador", "vendedor"],
    },
  },
} as const
