# Testes em APIs GraphQL e REST com PactumJS

[![GitHub License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

## Descrição

Este projeto contém testes automatizados para APIs GraphQL e REST utilizando o framework **PactumJS**. O objetivo é demonstrar como realizar testes eficientes, confiáveis e bem estruturados em endpoints de diferentes tipos, incluindo validação de respostas, autenticação com JWT e boas práticas em testes de integração de API.

## Objetivos

- Testar endpoints GraphQL com PactumJS
- Testar endpoints REST com PactumJS
- Validar respostas de APIs utilizando matchers e asserções customizadas
- Implementar testes de integração com autenticação JWT
- Demonstrar boas práticas em testes de APIs modernas
- Manter cobertura de testes clara e reproduzível

## Escopo de Testes

### GraphQL

- [x] Autenticação (Mutation): Realizar login de usuário administrativo, validar sucesso da operação e armazenar token JWT
- [x] Listagem de Usuários (Query): Utilizar token armazenado para listar usuários da plataforma, validando status code e estrutura dos dados retornados

### REST API

- [x] Endpoints REST com autenticação
- [x] Validação de respostas JSON
- [x] Testes de diferentes métodos HTTP (GET, POST, PUT, DELETE)
- [x] Tratamento de erros e status codes

## Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|---|---|---|
| PactumJS | v3.9.1 | Framework principal para testes de API |
| Mocha | v11.7.5 | Test runner |
| pactum-matchers | v1.2.0 | Validadores customizados e JsonMatch |
| Node.js | v14+ | Runtime JavaScript |

## Início Rápido

### Pré-requisitos

- Node.js v14.x ou superior
- npm ou yarn
- Git

### Instalação

```bash
git clone https://github.com/Pedro001979/Testes-em-APIs-GraphQL-com-PactumJS.git
cd Testes-em-APIs-GraphQL-com-PactumJS
npm install
```

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes com modo verbose
npm test -- --reporter spec

# Executar teste específico
npx mocha ./test/graphql/seu-arquivo.test.js

# Executar todos os testes GraphQL
npx mocha ./test/graphql/**/*.test.js

# Executar todos os testes REST
npx mocha ./test/rest/**/*.test.js
```

## Estrutura do Projeto

```
Testes-em-APIs-GraphQL-com-PactumJS/
├── test/
│   ├── graphql/                    # Testes GraphQL
│   │   ├── authentication.test.js  # Testes de autenticação GraphQL
│   │   ├── queries.test.js         # Testes de queries GraphQL
│   │   └── README.md               # Documentação dos testes GraphQL
│   ├── rest/                       # Testes REST API
│   │   ├── authentication.test.js  # Testes de autenticação REST
│   │   ├── users.test.js           # Testes de endpoints de usuários
│   │   └── README.md               # Documentação dos testes REST
│   └── config/
│       ├── pactum.setup.js         # Configuração do PactumJS
│       └── env.config.js           # Configurações de ambiente
├── package.json                    # Dependências e scripts
├── .mocharc.json                   # Configuração do Mocha
├── README.md                       # Este arquivo
└── LICENSE                         # Licença ISC
```

## Exemplos de Uso

### Teste GraphQL - Autenticação (Mutation)

```javascript
const pactum = require('pactum');

describe('GraphQL Authentication', () => {
  it('should successfully authenticate admin user', async () => {
    const response = await pactum
      .spec()
      .post('http://seu-graphql-api.com/graphql')
      .withBody({
        query: `
          mutation {
            login(email: "admin@example.com", password: "senha123") {
              token
              usuario {
                id
                nome
              }
            }
          }
        `
      })
      .expectStatus(200)
      .expectJsonMatch({
        data: {
          login: {
            token: pactum.like('jwt-token'),
            usuario: {
              id: pactum.like('123'),
              nome: pactum.like('Admin')
            }
          }
        }
      });
    
    const token = response.json.data.login.token;
    console.log('Authentication token obtained:', token);
  });
});
```

### Teste GraphQL - Listagem com Autenticação (Query)

```javascript
const pactum = require('pactum');

describe('GraphQL Queries', () => {
  let authToken;

  before(async () => {
    const loginResponse = await pactum
      .spec()
      .post('http://seu-graphql-api.com/graphql')
      .withBody({
        query: `mutation { login(email: "admin@example.com", password: "senha123") { token } }`
      })
      .expectStatus(200);
    
    authToken = loginResponse.json.data.login.token;
  });

  it('should list users with valid token', async () => {
    await pactum
      .spec()
      .post('http://seu-graphql-api.com/graphql')
      .withHeaders('Authorization', `Bearer ${authToken}`)
      .withBody({
        query: `
          query {
            usuarios {
              id
              nome
              email
            }
          }
        `
      })
      .expectStatus(200)
      .expectBodyContains('usuarios')
      .inspect();
  });
});
```

### Teste REST - Endpoint GET com Autenticação

```javascript
const pactum = require('pactum');

describe('REST API Users', () => {
  let authToken;

  before(async () => {
    const loginResponse = await pactum
      .spec()
      .post('http://seu-rest-api.com/auth/login')
      .withBody({
        email: 'admin@example.com',
        password: 'senha123'
      })
      .expectStatus(200);
    
    authToken = loginResponse.json.token;
  });

  it('should retrieve all users with valid authentication', async () => {
    await pactum
      .spec()
      .get('http://seu-rest-api.com/api/users')
      .withHeaders('Authorization', `Bearer ${authToken}`)
      .expectStatus(200)
      .expectJsonSchema({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string' }
          }
        }
      });
  });
});
```

### Teste REST - Endpoint POST com Validação

```javascript
const pactum = require('pactum');

describe('REST API Users - Create', () => {
  let authToken;

  it('should create a new user', async () => {
    const response = await pactum
      .spec()
      .post('http://seu-rest-api.com/api/users')
      .withHeaders('Authorization', `Bearer ${authToken}`)
      .withBody({
        nome: 'Novo Usuario',
        email: 'novo@example.com',
        senha: 'senha123'
      })
      .expectStatus(201)
      .expectJsonMatch({
        id: pactum.like('novo-id-123'),
        nome: 'Novo Usuario',
        email: 'novo@example.com'
      });
    
    console.log('User created with ID:', response.json.id);
  });
});
```

## Matchers e Validações Disponíveis

### PactumJS Matchers

| Matcher | Descrição | Exemplo |
|---|---|---|
| `pactum.like()` | Valida tipo de dado | `pactum.like('string')` |
| `pactum.eachLike()` | Valida array com tipo específico | `pactum.eachLike({ id: 1 }, { min: 1 })` |
| `pactum.regex()` | Valida com expressão regular | `pactum.regex(/^\d+$/)` |
| `expectStatus()` | Valida status HTTP | `.expectStatus(200)` |
| `expectBodyContains()` | Valida presença de texto | `.expectBodyContains('data')` |
| `expectJsonSchema()` | Valida estrutura JSON | `.expectJsonSchema({ type: 'object' })` |

## Boas Práticas Implementadas

1. **Separação de Responsabilidades**: Testes GraphQL e REST em diretórios separados
2. **Reutilização de Token**: Tokens armazenados em hooks `before()` para múltiplos testes
3. **Organização por Funcionalidade**: Testes agrupados por tipo de operação (autenticação, queries, etc)
4. **Limpeza de Dados**: Uso de `afterEach` para garantir estado consistente
5. **Documentação de Testes**: README específico em cada diretório de testes
6. **Configuração Centralizada**: Arquivo de setup compartilhado entre testes
7. **Validações Robustas**: Uso de matchers para validações flexíveis e confiáveis
8. **Tratamento de Erros**: Testes específicos para validar comportamento de erro

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```bash
GRAPHQL_API_URL=http://seu-graphql-api.com/graphql
REST_API_URL=http://seu-rest-api.com/api
TEST_USER_EMAIL=admin@example.com
TEST_USER_PASSWORD=senha123
TEST_TIMEOUT=10000
```

## Recursos Úteis

- [Documentação PactumJS](https://pactumjs.github.io/)
- [Documentação GraphQL](https://graphql.org/)
- [Mocha Documentation](https://mochajs.org/)
- [Pactum Matchers](https://pactumjs.github.io/advanced/matchers.html)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

## Contribuição

Contribuições são bem-vindas e encorajadas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/NovaFeature`
3. Commit suas mudanças: `git commit -m 'Adiciona NovaFeature'`
4. Push para a branch: `git push origin feature/NovaFeature`
5. Abra um Pull Request com descrição clara das alterações

## Autor

**Pedro Ricardo**

- GitHub: [@Pedro001979](https://github.com/Pedro001979)

## Licença

Este projeto está licenciado sob a Licença ISC. Veja o arquivo LICENSE para detalhes.

---

**Última atualização:** 29 de maio de 2026

**Versão do Projeto:** 2.0.0

**Suporte:** Para dúvidas ou problemas, abra uma issue no repositório do GitHub
