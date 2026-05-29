// test.js
const pactum = require('pactum');
const { spec } = pactum;
const { eachLike, like } = require('pactum-matchers');

let token;
beforeEach(async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders('Content-Type', 'application/json') // Adicione esta linha
        .withGraphQLQuery(`
        mutation authUser($email: String, $password: String) {
            authUser(email: $email, password: $password) {
              success
              token
            }
          }
    `)
        .withGraphQLVariables({
            email: "admin@admin.com",
            password: "admin123"
        })
        .returns('token', 'data.authUser.token')
})


it('Listagem de usuarios', async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders("Authorization", `Bearer ${('token')}`)
        .withHeaders('Content-Type', 'application/json') // Adicione esta linha
        .withGraphQLQuery(`
      query {
        Users {
          id
          email
          profile {
            firstName
          }
        }
      }
    `)
        .expectStatus(200)
        .expectJsonMatch({
            data: {
                Users: eachLike({
                    id: like("657b05fe31b986fc0a7a053"),
                    email: like('cliente@ebac.art.br'),
                    profile: {

                    }
                })
            }
        })
});