# ConnectWorkout API - Referência Rápida

## 🚀 Início Rápido

### 1. Configurar URL do Backend

Edite `app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:5000', // Emulador Android
  // BASE_URL: 'http://localhost:5000', // Simulador iOS
  // BASE_URL: 'http://192.168.1.100:5000', // Dispositivo Físico
}
```

### 2. Importar Serviços

```typescript
import { AuthService, UserService, InstructorService, ExerciseService } from './services';
```

### 3. Usar AuthContext

```typescript
import { useAuthContext } from './contexts/AuthContext';

const { login, register, logout, user, isAuthenticated } = useAuthContext();
```

---

## 📡 Todos os Endpoints da API Disponíveis

### Autenticação (Sem Autenticação Necessária)

```typescript
// Registrar
POST /api/auth/register
Body: { name, email, password, age?, gender?, userType, description? }

// Login
POST /api/auth/login
Body: { email, password }
```

### Usuários (Autenticação Necessária)

```typescript
// Obter perfil do usuário atual
GET /api/users/profile

// Atualizar perfil
PUT /api/users/profile
Body: { name?, age?, gender?, description?, currentPassword?, newPassword? }

// Buscar usuários
GET /api/users/search?query={query}&page={page}&pageSize={pageSize}

// Obter usuário por ID
GET /api/users/{id}
```

### Instrutores (Autenticação + Função de Instrutor Necessária)

```typescript
// Obter todos os alunos
GET /api/instructors/students

// Obter detalhes do aluno
GET /api/instructors/students/{studentId}

// Conectar com aluno
POST /api/instructors/connect
Body: { studentId }

// Remover aluno
DELETE /api/instructors/students/{studentId}
```

### Exercícios (Autenticação Necessária)

```typescript
// Buscar exercícios
GET /api/exercises/search?name={name}

// Obter exercício por ID
GET /api/exercises/{id}

// Obter todas as partes do corpo
GET /api/exercises/bodyparts

// Obter exercícios por parte do corpo
GET /api/exercises/bodypart/{bodyPart}

// Obter todos os músculos alvo
GET /api/exercises/targets

// Obter exercícios por alvo
GET /api/exercises/target/{target}

// Obter todos os tipos de equipamento
GET /api/exercises/equipments

// Obter exercícios por equipamento
GET /api/exercises/equipment/{equipment}
```

---

## 💻 Exemplos de Código

### Login

```typescript
const { login } = useAuthContext();

await login({
  email: 'usuario@exemplo.com',
  password: 'senha123'
});
```

### Registro

```typescript
import { UserType, Gender } from './types/api.types';

const { register } = useAuthContext();

await register({
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: 'senha123',
  age: 25,
  gender: Gender.Male,
  userType: UserType.Student
});
```

### Obter Perfil

```typescript
import { UserService } from './services';

const profile = await UserService.getProfile();
```

### Buscar Usuários

```typescript
import { UserService } from './services';

const users = await UserService.searchUsers('João', 1, 10);
```

### Obter Alunos (Instrutor)

```typescript
import { InstructorService } from './services';

const students = await InstructorService.getStudents();
```

### Buscar Exercícios

```typescript
import { ExerciseService } from './services';

const exercises = await ExerciseService.searchExercises('supino reto');
```

---

## 🎯 Enums de Tipo

```typescript
enum UserType {
  Instructor = 1,
  Student = 2,
}

enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}
```

---

## ⚠️ Tratamento de Erros

```typescript
try {
  await UserService.getProfile();
} catch (error: any) {
  console.error('Erro:', error.message);
  console.error('Status:', error.status);

  // Tratar erros de validação
  if (error.errors) {
    Object.keys(error.errors).forEach(field => {
      console.log(`${field}: ${error.errors[field]}`);
    });
  }
}
```

---

## 📂 Arquivos do Projeto

```
app/
├── config/
│   └── api.config.ts          # Configuração da API ⚙️
├── types/
│   └── api.types.ts           # Tipos TypeScript 📝
├── services/
│   ├── api.client.ts          # Cliente Axios 🔌
│   ├── auth.service.ts        # Serviço de autenticação 🔐
│   ├── user.service.ts        # Serviço de usuário 👤
│   ├── instructor.service.ts  # Serviço de instrutor 👨‍🏫
│   ├── exercise.service.ts    # Serviço de exercícios 💪
│   └── index.ts              # Exportações 📦
└── contexts/
    └── AuthContext.tsx        # Contexto de autenticação 🔑
```

---

## 🔍 Depuração

### Verificar se o backend está rodando:
```bash
curl http://localhost:5000/weatherforecast
```

### Ver Documentação Swagger:
```
http://localhost:5000/swagger
```

### URLs Comuns:
- Emulador Android: `http://10.0.2.2:5000`
- Simulador iOS: `http://localhost:5000`
- Dispositivo Físico: `http://IP_DO_SEU_COMPUTADOR:5000`

---

## ✅ Checklist

- [ ] Backend está rodando
- [ ] Atualizado `API_CONFIG.BASE_URL`
- [ ] Conexão com banco de dados funcionando
- [ ] Consegue acessar Swagger UI
- [ ] Testado login/registro
- [ ] Conectividade de rede verificada

---

Para documentação completa, veja `API_INTEGRATION_GUIDE.md`
