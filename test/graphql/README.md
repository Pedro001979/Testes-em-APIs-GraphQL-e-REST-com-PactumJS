# Testes Automatizados em APIs GraphQL com PactumJS

Este diretório contém testes automatizados para APIs GraphQL utilizando a biblioteca PactumJS, focado em consultas (Queries) e autenticação (Mutations) em um ambiente GraphQL.

## Tecnologias Utilizadas

- Node.js: Ambiente de execução
- Mocha: Framework de testes
- PactumJS: Biblioteca principal para testes de API
- Pactum-matchers: Para validações dinâmicas de tipos e estruturas (JsonMatch)

## Escopo de Testes

- [x] Autenticação (Mutation): Realiza o login de um usuário administrativo, valida o sucesso da operação e armazena o token JWT
- [x] Listagem de Usuários (Query): Utiliza o token armazenado para listar os usuários da plataforma, validando o status code e a estrutura dos dados retornados

## Como Executar os Testes

### Executar todos os testes GraphQL

```bash
npx mocha ./test/graphql/**/*.test.js
```

### Executar teste específico

```bash
npx mocha ./test/graphql/authentication.test.js
npx mocha ./test/graphql/queries.test.js
```

### Executar com modo verbose

```bash
npx mocha ./test/graphql/**/*.test.js --reporter spec
```

## Estrutura dos Testes

```
test/graphql/
├── authentication.test.js    # Testes de autenticação e login
├── queries.test.js           # Testes de queries GraphQL
├── mutations.test.js         # Testes de mutations GraphQL
└── README.md                 # Este arquivo
```

## Padrões de Teste

### Teste de Autenticação

Os testes de autenticação verificam se o login funciona corretamente e se o token JWT é gerado:

```javascript
describe('GraphQL Authentication', () => {
  it('should authenticate user and return JWT token', async () => {
    // Test implementation
  });
});
```

### Teste de Query com Autenticação

Os testes de query validam se os dados são retornados corretamente com autenticação ativa:

```javascript
describe('GraphQL Queries', () => {
  before(async () => {
    // Setup - obtain authentication token
  });

  it('should return users list with valid token', async () => {
    // Test implementation
  });
});
```

## Validações Utilizadas

- Status HTTP (200, 201, 400, 401, 404, 500)
- Estrutura de resposta JSON usando matchers
- Presença de campos obrigatórios
- Tipos de dados
- Valores de token JWT

## Configuração de Ambiente

A URL da API GraphQL deve ser configurada. Você pode:

1. Usar variável de ambiente: `GRAPHQL_API_URL`
2. Configurar diretamente nos testes
3. Usar arquivo de configuração centralizado

## Dicas Úteis

- Reutilize tokens de autenticação em múltiplos testes usando hooks `before()`
- Use `pactum-matchers` para validações complexas de respostas GraphQL
- Organize testes por funcionalidade
- Utilize `beforeEach` e `afterEach` para setup/teardown quando necessário
- Implemente helpers para queries GraphQL reutilizáveis
- Sempre verifique a estrutura de resposta, não apenas o status code

## Resolução de Problemas

### Token expirado

Se receber erro de autenticação, verifique se o token não expirou. Os testes obtêm um novo token em cada execução do `describe()`.

### API inacessível

Verifique se a URL da API está correta e se a API está ativa.

### Timeout

Se os testes demorarem muito, aumente o timeout do Mocha:

```bash
npx mocha ./test/graphql/**/*.test.js --timeout 15000
```

## Recursos Úteis

- [Documentação PactumJS](https://pactumjs.github.io/)
- [Documentação GraphQL](https://graphql.org/)
- [Mocha Documentation](https://mochajs.org/)
