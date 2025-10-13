# Guia de Integração da API ConnectWorkout

## Visão Geral

Este documento fornece informações abrangentes sobre a integração da API entre o frontend ConnectWorkout (React Native/Expo) e o backend (.NET Core).

## Índice

1. [Configuração](#configuração)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Serviços da API](#serviços-da-api)
4. [Definições de Tipos](#definições-de-tipos)
5. [Fluxo de Autenticação](#fluxo-de-autenticação)
6. [Endpoints da API](#endpoints-da-api)
7. [Exemplos de Uso](#exemplos-de-uso)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Solução de Problemas](#solução-de-problemas)

---

## Configuração

### Configuração da URL do Backend

A URL base da API está configurada em `app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000', // Atualize com a URL do seu backend
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
}
```

### Importante: Atualize a BASE_URL de acordo com seu ambiente:

- **Emulador Android**: Use `http://10.0.2.2:5000` (equivalente ao localhost)
- **Simulador iOS**: Use `http://localhost:5000`
- **Dispositivo Físico**: Use o endereço IP do seu computador (ex: `http://192.168.1.100:5000`)
- **Produção**: Use a URL do seu servidor de produção

### Configuração da Porta do Backend

O backend é executado na porta especificada em `launchSettings.json`. A URL de desenvolvimento padrão é tipicamente:
- HTTPS: `https://localhost:7000` (ou porta configurada)
- HTTP: `http://localhost:5000` (ou porta configurada)

---

## Estrutura do Projeto

```
app/
├── config/
│   └── api.config.ts          # Configuração da API e definições de endpoints
├── types/
│   └── api.types.ts           # Definições de tipos TypeScript correspondendo aos DTOs do backend
├── services/
│   ├── api.client.ts          # Instância Axios com interceptors
│   ├── auth.service.ts        # Serviço de autenticação
│   ├── user.service.ts        # Serviço de usuário
│   ├── instructor.service.ts  # Serviço de instrutor
│   ├── exercise.service.ts    # Serviço de exercícios
│   └── index.ts              # Exportações de serviços
└── contexts/
    └── AuthContext.tsx        # Contexto de autenticação com integração da API
```

---

## Serviços da API

### 1. Serviço de Autenticação (`auth.service.ts`)

Gerencia operações relacionadas à autenticação.

**Métodos:**
- `register(data: RegisterUserDto): Promise<AuthResultDto>`
- `login(data: LoginDto): Promise<AuthResultDto>`
- `logout(): Promise<void>`

### 2. Serviço de Usuário (`user.service.ts`)

Gerencia perfil de usuário e operações de busca.

**Métodos:**
- `getProfile(): Promise<UserDto>`
- `updateProfile(data: UpdateUserDto): Promise<UserDto>`
- `searchUsers(query: string, page?: number, pageSize?: number): Promise<UserDto[]>`
- `getUserById(id: number): Promise<UserDto>`

### 3. Serviço de Instrutor (`instructor.service.ts`)

Operações específicas do instrutor (requer função de Instrutor).

**Métodos:**
- `getStudents(): Promise<StudentSummaryDto[]>`
- `getStudentDetails(studentId: number): Promise<UserDto>`
- `connectWithStudent(studentId: number): Promise<{message: string}>`
- `removeStudent(studentId: number): Promise<{message: string}>`

### 4. Serviço de Exercícios (`exercise.service.ts`)

Operações do banco de dados de exercícios.

**Métodos:**
- `searchExercises(name: string): Promise<ExerciseDbModel[]>`
- `getExerciseById(id: string): Promise<ExerciseDbModel>`
- `getBodyParts(): Promise<string[]>`
- `getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDbModel[]>`
- `getTargets(): Promise<string[]>`
- `getExercisesByTarget(target: string): Promise<ExerciseDbModel[]>`
- `getEquipments(): Promise<string[]>`
- `getExercisesByEquipment(equipment: string): Promise<ExerciseDbModel[]>`

---

## Definições de Tipos

Todos os tipos TypeScript estão definidos em `app/types/api.types.ts` e correspondem exatamente aos DTOs do backend.

### Tipos Principais

```typescript
// Enums
enum UserType {
  Instructor = 1,
  Student = 2,
}

enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

// Tipos de Autenticação
interface LoginDto {
  email: string;
  password: string;
}

interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: Gender;
  userType: UserType;
  description?: string;
}

interface AuthResultDto {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
  user: UserDto;
}

interface UserDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  userType: UserType;
  description: string;
}
```

---

## Fluxo de Autenticação

### 1. Fluxo de Login

```typescript
import { useAuthContext } from './contexts/AuthContext';

const { login } = useAuthContext();

try {
  await login({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  });
  // Usuário está autenticado agora
} catch (error) {
  console.error('Erro no login:', error);
}
```

### 2. Fluxo de Registro

```typescript
import { useAuthContext } from './contexts/AuthContext';
import { UserType, Gender } from './types/api.types';

const { register } = useAuthContext();

try {
  await register({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'senha123',
    age: 25,
    gender: Gender.Male,
    userType: UserType.Student,
    description: 'Entusiasta de fitness'
  });
  // Usuário está registrado e autenticado agora
} catch (error) {
  console.error('Erro no registro:', error);
}
```

### 3. Gerenciamento de Tokens

O cliente da API gerencia automaticamente a injeção de tokens:
- Tokens são armazenados no AsyncStorage
- Token de acesso é adicionado automaticamente aos cabeçalhos das requisições
- Interceptor de requisição adiciona o cabeçalho `Authorization: Bearer {token}`
- Interceptor de resposta trata erros 401 e atualização de token (quando implementado)

---

## Endpoints da API

### Endpoints de Autenticação

| Método | Endpoint | Autenticação Necessária | Descrição |
|--------|----------|-------------------------|-----------|
| POST | `/api/auth/register` | Não | Registrar novo usuário |
| POST | `/api/auth/login` | Não | Login do usuário |

### Endpoints de Usuário

| Método | Endpoint | Autenticação Necessária | Descrição |
|--------|----------|-------------------------|-----------|
| GET | `/api/users/profile` | Sim | Obter perfil do usuário atual |
| PUT | `/api/users/profile` | Sim | Atualizar perfil do usuário atual |
| GET | `/api/users/search?query={query}&page={page}&pageSize={pageSize}` | Sim | Buscar usuários |
| GET | `/api/users/{id}` | Sim | Obter usuário por ID |

### Endpoints de Instrutor

| Método | Endpoint | Autenticação Necessária | Função Necessária | Descrição |
|--------|----------|-------------------------|-------------------|-----------|
| GET | `/api/instructors/students` | Sim | Instrutor | Obter todos os alunos |
| GET | `/api/instructors/students/{studentId}` | Sim | Instrutor | Obter detalhes do aluno |
| POST | `/api/instructors/connect` | Sim | Instrutor | Conectar com um aluno |
| DELETE | `/api/instructors/students/{studentId}` | Sim | Instrutor | Remover um aluno |

### Endpoints de Exercícios

| Método | Endpoint | Autenticação Necessária | Descrição |
|--------|----------|-------------------------|-----------|
| GET | `/api/exercises/search?name={name}` | Sim | Buscar exercícios por nome |
| GET | `/api/exercises/{id}` | Sim | Obter exercício por ID |
| GET | `/api/exercises/bodyparts` | Sim | Obter todas as partes do corpo |
| GET | `/api/exercises/bodypart/{bodyPart}` | Sim | Obter exercícios por parte do corpo |
| GET | `/api/exercises/targets` | Sim | Obter todos os músculos alvo |
| GET | `/api/exercises/target/{target}` | Sim | Obter exercícios por músculo alvo |
| GET | `/api/exercises/equipments` | Sim | Obter todos os tipos de equipamento |
| GET | `/api/exercises/equipment/{equipment}` | Sim | Obter exercícios por equipamento |

---

## Exemplos de Uso

### Usando o Serviço de Autenticação Diretamente

```typescript
import { AuthService } from './services';

// Login
const result = await AuthService.login({
  email: 'usuario@exemplo.com',
  password: 'senha123'
});

// Registro
const result = await AuthService.register({
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  password: 'senha123',
  userType: UserType.Instructor
});
```

### Usando o Serviço de Usuário

```typescript
import { UserService } from './services';

// Obter perfil do usuário atual
const profile = await UserService.getProfile();

// Atualizar perfil
const updatedProfile = await UserService.updateProfile({
  name: 'Novo Nome',
  age: 30,
  description: 'Descrição atualizada'
});

// Buscar usuários
const users = await UserService.searchUsers('João', 1, 10);

// Obter usuário por ID
const user = await UserService.getUserById(123);
```

### Usando o Serviço de Instrutor

```typescript
import { InstructorService } from './services';

// Obter todos os alunos
const students = await InstructorService.getStudents();

// Obter detalhes do aluno
const student = await InstructorService.getStudentDetails(123);

// Conectar com aluno
await InstructorService.connectWithStudent(123);

// Remover aluno
await InstructorService.removeStudent(123);
```

### Usando o Serviço de Exercícios

```typescript
import { ExerciseService } from './services';

// Buscar exercícios
const exercises = await ExerciseService.searchExercises('supino reto');

// Obter exercício por ID
const exercise = await ExerciseService.getExerciseById('exercise-id');

// Obter todas as partes do corpo
const bodyParts = await ExerciseService.getBodyParts();

// Obter exercícios por parte do corpo
const chestExercises = await ExerciseService.getExercisesByBodyPart('chest');

// Obter todos os alvos
const targets = await ExerciseService.getTargets();

// Obter exercícios por alvo
const bicepsExercises = await ExerciseService.getExercisesByTarget('biceps');

// Obter todos os tipos de equipamento
const equipments = await ExerciseService.getEquipments();

// Obter exercícios por equipamento
const barbellExercises = await ExerciseService.getExercisesByEquipment('barbell');
```

### Usando em Componentes React

```typescript
import React, { useEffect, useState } from 'react';
import { UserService } from '../services';
import { UserDto } from '../types/api.types';

function ProfileScreen() {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await UserService.getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error}</Text>;
  if (!profile) return <Text>Perfil não encontrado</Text>;

  return (
    <View>
      <Text>Nome: {profile.name}</Text>
      <Text>Email: {profile.email}</Text>
    </View>
  );
}
```

---

## Tratamento de Erros

### Tratamento de Erros do Cliente da API

O cliente da API inclui tratamento automático de erros:

```typescript
// Todos os erros são transformados no formato ApiError
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Exemplo de uso
try {
  await UserService.getProfile();
} catch (error: any) {
  // error é ApiError
  console.error('Status:', error.status);
  console.error('Mensagem:', error.message);
  console.error('Erros de validação:', error.errors);
}
```

### Códigos de Status HTTP Comuns

- **200**: Sucesso
- **400**: Requisição Inválida (erros de validação)
- **401**: Não Autorizado (token inválido/ausente)
- **403**: Proibido (permissões insuficientes)
- **404**: Não Encontrado
- **500**: Erro Interno do Servidor

### Tratando Erros de Validação

```typescript
try {
  await AuthService.register(data);
} catch (error: any) {
  if (error.status === 400 && error.errors) {
    // Tratar erros de validação
    Object.keys(error.errors).forEach(field => {
      console.log(`${field}: ${error.errors[field].join(', ')}`);
    });
  }
}
```

---

## Solução de Problemas

### Problemas Comuns

#### 1. Falha na Requisição de Rede

**Problema**: Não é possível conectar ao backend

**Soluções**:
- Verifique a `BASE_URL` em `api.config.ts`
- Para Emulador Android, use `10.0.2.2` ao invés de `localhost`
- Para dispositivo físico, certifique-se de que ambos estão na mesma rede
- Verifique se o backend está rodando

#### 2. 401 Não Autorizado

**Problema**: Token inválido ou expirado

**Soluções**:
- Faça login novamente para obter um novo token
- Verifique o tempo de expiração do token na configuração do backend
- Verifique se o token está sendo armazenado corretamente

#### 3. Erros de CORS

**Problema**: Política CORS bloqueando requisições

**Soluções**:
- Configure CORS no `Program.cs` do backend
- Adicione a URL do frontend às origens permitidas
- Habilite credenciais se necessário

#### 4. Erros de Tipo

**Problema**: Incompatibilidade de tipos TypeScript

**Soluções**:
- Certifique-se de que `api.types.ts` corresponde exatamente aos DTOs do backend
- Execute `npm run type-check` para verificar tipos
- Atualize tipos quando os DTOs do backend mudarem

### Dicas de Depuração

1. **Habilitar Logging do Axios**:
```typescript
// Em api.client.ts
apiClient.interceptors.request.use(config => {
  console.log('Requisição:', config.method?.toUpperCase(), config.url);
  return config;
});
```

2. **Verificar Logs do Backend**:
- Monitore o console do backend para erros
- Verifique a conexão com SQL Server
- Verifique a configuração do JWT

3. **Testar com Postman/Swagger**:
- Use Swagger UI em `http://localhost:5000/swagger`
- Teste endpoints independentemente
- Verifique formatos de requisição/resposta

---

## Requisitos de Configuração do Backend

### 1. String de Conexão

Certifique-se de que o `appsettings.json` do backend tem a conexão correta com o banco de dados:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=SEU_SERVIDOR;Database=FitnessApp;..."
  }
}
```

### 2. Configuração JWT

Verifique as configurações JWT em `appsettings.json`:
```json
{
  "Jwt": {
    "Key": "sua-chave-secreta-com-pelo-menos-32-caracteres",
    "Issuer": "FitnessApp",
    "Audience": "FitnessAppUsers",
    "DurationInMinutes": 60
  }
}
```

### 3. Configuração CORS

Adicione suporte CORS no `Program.cs` do backend se necessário:
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:8081") // Servidor dev Expo
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// ...

app.UseCors();
```

---

## Próximos Passos

1. **Atualizar Configuração da API**: Edite `app/config/api.config.ts` com a URL do seu backend
2. **Testar Autenticação**: Tente fazer login através do app
3. **Monitorar Tráfego de Rede**: Use React Native Debugger ou Flipper
4. **Implementar Funcionalidades**: Use os serviços em seus componentes
5. **Adicionar Tratamento de Erros**: Implemente mensagens de erro amigáveis ao usuário
6. **Testar em Dispositivo Físico**: Garanta configuração de rede adequada

---

## Resumo

✅ **Integração Completa**:
- Cliente API com axios e interceptors
- Camada de serviço com tipagem segura correspondendo aos DTOs do backend
- Fluxo de autenticação com gerenciamento de tokens
- Serviços de Usuário, Instrutor e Exercícios
- AuthContext integrado com API
- Tratamento abrangente de erros

📋 **Todos os Endpoints Integrados**:
- ✅ Auth: Registro, Login
- ✅ Usuários: Perfil, Atualização, Busca, Obter por ID
- ✅ Instrutores: Gerenciamento de alunos
- ✅ Exercícios: Busca, filtros por parte do corpo, alvo, equipamento

🔧 **Configuração Necessária**:
- Atualizar `API_CONFIG.BASE_URL` em `app/config/api.config.ts`
- Garantir que o backend está rodando e acessível
- Verificar conectividade de rede entre frontend e backend
