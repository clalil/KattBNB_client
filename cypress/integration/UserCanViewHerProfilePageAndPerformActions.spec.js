describe('User can view her profile page', () => {
  beforeEach(function () {
    cy.server()
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })

  it('successfully', () => {
    cy.contains('Hi, GeorgeTheGreek!')
  })

  it('and change her location successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_location_change.json',
    })
    cy.get('#change-location-link').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('#location-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Location succesfully changed!')
    })
  })

  it('and does not change her location successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 422,
      response: 'fixture:unsuccessful_location_change_user_page.json',
    })
    cy.get('#change-location-link').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('.ui > div > .ui > #location > .dropdown').click()
    cy.get('#location-submit-button').click()
    cy.contains('No location selected or location is unchanged!')
  })

  it('and change her password successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 200,
      response: 'fixture:successful_password_change_user_page.json',
    })
    cy.get('#change-password-link').click()
    cy.get('#currentPassword').type('password')
    cy.get('#newPassword').type('SeCuReP@SsWoRd')
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd')
    cy.get('#password-submit-button').click()
    cy.contains('Log in')
  })

  it('and unsuccessfully tries to change password', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 422,
      response: 'fixture:unsuccessful_password_change_user_page.json',
    })
    cy.get('#change-password-link').click()
    cy.get('#currentPassword').type('passwordD')
    cy.get('#newPassword').type('SeCuReP@SsWoR')
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd')
    cy.get('#password-submit-button').click()
    cy.contains("Check that 'new password' fields are an exact match with each other and that they consist of at least 6 characters")
  })

  it('and successfully deletes her account', () => {
    cy.route({
      method: 'DELETE',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_account_deletion.json',
    })
    cy.get('#delete-account-link').click()
    cy.contains('Find a cat sitter!')
  })
})
