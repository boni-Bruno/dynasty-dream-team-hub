# Dynasty Hub - Gerenciador de Liga Dynasty

Um aplicativo para gerenciar times e drafts de uma liga fantasy dynasty na plataforma Sleeper.

## 🏈 Funcionalidades

### ✅ Fase 1 - Foundation & Auth (Concluída)
- [x] Setup básico da UI com tema football
- [x] Navegação com sidebar responsiva  
- [x] Páginas principais: Dashboard, Draft, Players, Trades
- [x] Estrutura TypeScript para tipos do Sleeper
- [x] Hook para gerenciar estado da aplicação
- [x] Componente de autenticação preparado

### 🔄 Fase 2 - Core Features (Próxima)
- [ ] Integração real com Sleeper API via Supabase
- [ ] Dashboard funcional com dados do time
- [ ] Visualização de roster com campo de futebol
- [ ] Sistema de picks de draft

### 🚀 Fase 3 - Advanced Features (Futuro)
- [ ] Draft board dinâmico
- [ ] Sistema completo de trades
- [ ] Análises e insights avançados
- [ ] Notificações em tempo real

## 🛠 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **Estado**: React hooks + Context API
- **Roteamento**: React Router
- **Backend**: Supabase (necessário para API)

## 🔌 Integração com Sleeper

### API Endpoints Preparados:
```
GET https://api.sleeper.app/v1/league/{league_id}
GET https://api.sleeper.app/v1/league/{league_id}/rosters  
GET https://api.sleeper.app/v1/league/{league_id}/drafts
GET https://api.sleeper.app/v1/players/nfl
GET https://api.sleeper.app/v1/stats/nfl/{year}
```

### ⚠️ Próximo Passo Importante:
**É necessário conectar o projeto ao Supabase** para implementar a integração real com a API do Sleeper, pois:

1. A API do Sleeper não suporta CORS para navegadores
2. Precisamos de um backend para fazer proxy das requisições
3. Supabase Edge Functions são ideais para isso
4. Permitirá armazenar dados em cache para melhor performance

## 📱 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── ui/            # Componentes Shadcn/ui
│   ├── Layout.tsx     # Layout principal
│   ├── AppSidebar.tsx # Navegação lateral
│   └── SleeperAuth.tsx # Autenticação Sleeper
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx  # Painel principal
│   ├── Draft.tsx      # Draft board
│   ├── Players.tsx    # Avaliação jogadores  
│   └── Trades.tsx     # Gerenciamento trades
├── hooks/             # Hooks personalizados
│   └── useSleeperData.ts # Estado Sleeper
├── types/             # Tipos TypeScript
│   └── sleeper.ts     # Tipos da API Sleeper
└── index.css          # Design system
```

## 🎨 Design System

O tema foi customizado para refletir o ambiente do football americano:
- **Primary**: Verde campo (`--primary: 116 40% 25%`)
- **Background**: Tons neutros claros
- **Accent**: Verde para elementos ativos
- **Destrutivo**: Vermelho para ações críticas

## 🚀 Como Continuar

1. **Conectar ao Supabase** para habilitar chamadas à API do Sleeper
2. **Implementar Edge Functions** para cada endpoint do Sleeper
3. **Adicionar autenticação de usuário** via Supabase Auth
4. **Criar sistema de cache** para dados da liga
5. **Implementar notificações** em tempo real

---

**Status**: Fase 1 concluída ✅ | Próximo: Integração Supabase + API Sleeper

## Project info

**URL**: https://lovable.dev/projects/e1823291-702f-4335-ad71-90c526bed43d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e1823291-702f-4335-ad71-90c526bed43d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e1823291-702f-4335-ad71-90c526bed43d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
