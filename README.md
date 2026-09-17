# ClinicxFlow

Plataforma de gestão para clínicas de saúde.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · CSS Modules / CSS tradicional · Supabase (Banco de dados, Auth, RLS)

---

## 1. Pré-requisitos

- Node.js 18.18 ou superior
- Uma conta gratuita no [Supabase](https://supabase.com)

## 2. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie um novo projeto.
2. No painel, abra **SQL Editor**.
3. Execute, em ordem, os arquivos de `supabase/migrations/`.
   Eles criam tabelas, agenda médica, atribuição automática, funções, políticas de RLS,
   o gatilho de cadastro e os dados iniciais.
4. Em **Project Settings → API**, copie a `Project URL` e a chave `Publishable`.

## 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (use `.env.example` como base):

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
```

## 4. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse **http://localhost:3000**.

Para produção:

```bash
npm run build
npm run start
```

## 5. Criar o primeiro administrador

Todo cadastro feito pela tela pública nasce com o cargo **paciente** (regra de segurança).
Para promover um usuário a administrador, cadastre-se normalmente em `/cadastro` e depois
execute no **SQL Editor** do Supabase:

```sql
update public.user_roles
set role = 'admin'
where user_id = (select id from auth.users where email = 'seu@email.com');
```

Faça logout e login novamente para entrar na área `/admin`.

## 6. Vincular usuários a profissionais

Para que um médico ou enfermeiro veja a própria agenda, o registro em `public.profissionais`
precisa ter o campo `user_id` preenchido com o id do usuário em `auth.users`:

```sql
update public.profissionais
set user_id = (select id from auth.users where email = 'medico@email.com')
where nome = 'Nome do Profissional';
```

## 7. Estrutura

```
src/
  app/
    page.tsx                landing page pública (dados reais do banco)
    login/ cadastro/ recuperar-senha/ nova-senha/
    admin/                  dashboard, pacientes, profissionais, especialidades, unidades, agenda
    gestor/                 indicadores e agenda geral
    medico/                 agenda própria, pacientes e prontuário
    enfermagem/             atendimentos do dia
    recepcao/               painel do dia, pacientes e agendamentos
    paciente/               painel, agendamento e histórico
  components/               AppShell, painéis, tabelas e formulários
  lib/
    supabase/               clientes browser, server e middleware de sessão
    actions.ts              server actions (escrita no banco)
    queries.ts              indicadores e listagens
    roles.ts nav.ts auth.ts controle de acesso por cargo
  middleware.ts             proteção de rotas por cargo
supabase/migrations/        schema + RLS + seed
```

## 8. Cargos

`admin`, `gestor`, `medico`, `enfermeiro`, `recepcionista`, `paciente`.

Cada cargo é redirecionado automaticamente para sua área após o login, e o middleware
bloqueia o acesso a áreas de outros cargos. Todas as regras também são aplicadas no
banco por Row Level Security.

## 9. Fluxo de agendamento

1. O administrador cadastra o profissional com especialidade e unidade.
2. Em `/admin/agenda`, libera os horários daquele profissional.
3. O paciente escolhe apenas especialidade, unidade e horário.
4. O banco reserva uma vaga e atribui automaticamente um profissional livre.
5. O nome do profissional aparece somente após a consulta ser confirmada.

A reserva é feita em uma transação no banco para impedir que duas pessoas ocupem a
mesma vaga. Pacientes não têm permissão para definir diretamente o profissional.

## Assistente virtual

O botão flutuante Clara aparece nas páginas públicas. Sem configuração de IA, funciona em modo de demonstração com respostas básicas, identificado na interface.

Para ativar respostas por IA, configure `OPENAI_API_KEY` e `OPENAI_MODEL` em `.env.local` (ou nas variáveis do servidor) e reinicie o Next.js. Use um modelo compatível com a Responses API disponível na sua conta. Nunca use o prefixo `NEXT_PUBLIC_` para a chave.

A integração usa a [Responses API](https://developers.openai.com/api/reference/cli/resources/responses/methods/create), com `store: false`. A conversa fica no estado da página, sem gravação no banco ou localStorage. Quando a IA está ativa, o histórico recente é enviado à OpenAI. O assistente orienta sobre navegação e serviços; não acessa dados de pacientes nem realiza agendamentos. A base de orientações fica em `src/lib/assistant.ts`.

O endpoint limita o tamanho do histórico e aplica um limite global de 30 requisições por minuto por processo. Para publicar com múltiplas instâncias, aplique também limitação distribuída no gateway e limites de gastos do provedor. O limite em memória reinicia com o servidor.
