# Testes Automatizados em APIs REST com PactumJS

Este diretório contém testes automatizados para APIs REST utilizando a biblioteca PactumJS. Os testes cobrem operações CRUD, autenticação com JWT e validação de respostas.

## Tecnologias Utilizadas

- Node.js: Ambiente de execução
- Mocha: Framework de testes
- PactumJS: Biblioteca principal para testes de API
- Pactum-matchers: Para validações dinâmicas de tipos e estruturas

## Escopo de Testes

- [x] Autenticação: Login de usuário e obtenção de token JWT
- [x] GET Requests: Recuperar dados de endpoints protegidos
- [x] POST Requests: Criar novos recursos com autenticação
- [x] PUT/PATCH Requests: Atualizar recursos existentes
- [x] DELETE Requests: Remover recursos
- [x] Validação de Status Codes: Verificar códigos HTTP esperados
- [x] Tratamento de Erros: Validar respostas de erro

## Como Executar os Testes

### Executar todos os testes REST

```bash
npx mocha ./test/rest/**/*.test.js
```

### Executar teste específico

```bash
npx mocha ./test/rest/authentication.test.js
npx mocha ./test/rest/users.test.js
```

### Executar com modo verbose

```bash
npx mocha ./test/rest/**/*.test.js --reporter spec
```

### Executar com relatório JSON

```bash
npx mocha ./test/rest/**/*.test.js --reporter json > test-results.json
```

## Estrutura dos Testes

```
test/rest/
├── authentication.test.js    # Testes de autenticação e login
├── users.test.js             # Testes de endpoints de usuários
├── resources.test.js         # Testes de CRUD de recursos
└── README.md                 # Este arquivo
```

## Padrões de Teste

### Teste de Autenticação

```javascript
describe('REST API Authentication', () => {
  it('should authenticate user and return JWT token', async () => {
    await pactum
      .spec()
      .post('http://api.example.com/auth/login')
      .withBody({
        email: 'user@example.com',
        password: 'password123'
      })
      .expectStatus(200)
      .expectJsonMatch({
        token: pactum.like('jwt-token'),
        user: {
          id: pactum.like('123'),
          email: 'user@example.com'
        }
      });
  });
});
```

### Teste GET com Autenticação

```javascript
describe('REST API - Get Users', () => {
  let authToken;

  before(async () => {
    const response = await pactum
      .spec()
      .post('http://api.example.com/auth/login')
      .withBody({
        email: 'admin@example.com',
        password: 'password123'
      })
      .expectStatus(200);
    
    authToken = response.json.token;
  });

  it('should retrieve all users with authentication', async () => {
    await pactum
      .spec()
      .get('http://api.example.com/api/users')
      .withHeaders('Authorization', `Bearer ${authToken}`)
      .expectStatus(200)
      .expectJsonSchema({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      });
  });
});
```

### Teste POST - Criar Recurso

```javascript
it('should create a new user', async () => {
  const response = await pactum
    .spec()
    .post('http://api.example.com/api/users')
    .withHeaders('Authorization', `Bearer ${authToken}`)
    .withBody({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'securepass123'
    })
    .expectStatus(201)
    .expectJsonMatch({
      id: pactum.like('new-id-123'),
      name: 'New User',
      email: 'newuser@example.com'
    });
  
  console.log('User created successfully');
});
```

### Teste PUT - Atualizar Recurso

```javascript
it('should update an existing user', async () => {
  const userId = 'user-123';
  
  await pactum
    .spec()
    .put(`http://api.example.com/api/users/${userId}`)
    .withHeaders('Authorization', `Bearer ${authToken}`)
    .withBody({
      name: 'Updated Name',
      email: 'updated@example.com'
    })
    .expectStatus(200)
    .expectJsonMatch({
      id: userId,
      name: 'Updated Name',
      email: 'updated@example.com'
    });
});
```

### Teste DELETE - Remover Recurso

```javascript
it('should delete a user', async () => {
  const userId = 'user-123';
  
  await pactum
    .spec()
    .delete(`http://api.example.com/api/users/${userId}`)
    .withHeaders('Authorization', `Bearer ${authToken}`)
    .expectStatus(204);
});
```

### Teste de Erro - Validar Resposta de Falha

```javascript
it('should return 401 when authentication token is invalid', async () => {
  await pactum
    .spec()
    .get('http://api.example.com/api/users')
    .withHeaders('Authorization', 'Bearer invalid-token')
    .expectStatus(401)
    .expectJsonMatch({
      error: pactum.like('Unauthorized'),
      message: pactum.like('Invalid token')
    });
});

it('should return 404 when user does not exist', async () => {
  await pactum
    .spec()
    .get('http://api.example.com/api/users/non-existent-id')
    .withHeaders('Authorization', `Bearer ${authToken}`)
    .expectStatus(404)
    .expectJsonMatch({
      error: 'Not Found'
    });
});
```

## Validações Disponíveis

| Validação | Descrição | Exemplo |
|---|---|---|
| `expectStatus(code)` | Valida status HTTP | `.expectStatus(200)` |
| `expectBodyContains(text)` | Valida presença de texto | `.expectBodyContains('data')` |
| `expectJsonMatch(obj)` | Valida estrutura JSON com matchers | `.expectJsonMatch({ id: pactum.like(1) })` |
| `expectJsonSchema(schema)` | Valida contra JSON Schema | `.expectJsonSchema({ type: 'object' })` |
| `expectHeaders(key, value)` | Valida header específico | `.expectHeaders('content-type', 'application/json')` |

## Métodos HTTP Suportados

| Método | Uso | Status Esperado |
|---|---|---|
| GET | Recuperar dados | 200 |
| POST | Criar recurso | 201 |
| PUT | Atualizar recurso completo | 200 |
| PATCH | Atualizar parcialmente | 200 |
| DELETE | Remover recurso | 204 |

## Configuração de Ambiente

Configure a URL base da API. Você pode:

1. Usar variável de ambiente: `REST_API_URL`
2. Configurar diretamente nos testes
3. Usar arquivo de configuração centralizado

Exemplo de arquivo `.env`:

```bash
REST_API_URL=http://localhost:3000/api
TEST_USER_EMAIL=admin@example.com
TEST_USER_PASSWORD=senha123
TEST_TIMEOUT=10000
```

## Boas Práticas

- Reutilize tokens de autenticação em múltiplos testes usando hooks `before()`
- Organize testes por endpoint ou funcionalidade
- Use `beforeEach` para configuração comum entre testes
- Use `afterEach` para limpeza de dados de teste
- Sempre valide tanto o status code quanto a estrutura de resposta
- Teste casos de sucesso e erro
- Use constantes para URLs e dados de teste
- Implemente funções helper para operações comuns

## Resolução de Problemas

### Erro 401 - Não Autorizado

Verifique se o token está sendo obtido corretamente e se não expirou.

### Erro 404 - Recurso Não Encontrado

Confirme se o ID do recurso existe ou se a URL está correta.

### Timeout

Aumentar timeout do Mocha se necessário:

```bash
npx mocha ./test/rest/**/*.test.js --timeout 15000
```

### CORS ou Erro de Conexão

Verifique se a API está ativa e acessível da máquina de teste.

## Recursos Úteis

- [Documentação PactumJS](https://pactumjs.github.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [Mocha Documentation](https://mochajs.org/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JSON Schema](https://json-schema.org/)
