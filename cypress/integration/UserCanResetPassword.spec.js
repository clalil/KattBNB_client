describe('User can reset password', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000')
  })

  it('successfully', () => {
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 200,
      response: 'fixture:successful_password_reset.json',
    })
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 200,
      response: 'fixture:successful_password_change.json',
    })
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#login').click()
    cy.get('#login-form').within(() => {
      cy.get('#password-reset-link').click()
    })
    cy.get('#email').type('george@mail.com')
    cy.get('#reset-pass-button').click()
    cy.contains('Successful password reset request!')
    cy.visit('http://localhost:3000/change-password')
    cy.get('#password').type('new_password')
    cy.get('#password_confirmation').type('new_password')
    cy.get('#change-pass-button').click()
    cy.wait(3000)
    cy.contains('Log in')
  })
})