describe('User can view her host profile', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1',
      status: 200,
      response: 'fixture:host_profile_individual.json'
    })
    cy.route({
      method: 'PATCH',
      url: 'http://localhost:3007/api/v1/host_profiles/1',
      status: 200,
      response: 'fixture:successful_host_profile_update.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })

  it('and see the saved information', () => {
    let text = [
      ['#description', 'this is a description about me!!!!'],
      ['#address', 'Charles de Gaulle Airport'],
      ['#rate', '100 kr/day for 1 cat'],
      ['#maxCats', 'Maximum cats: 3'],
      ['#supplement', 'Extra 35 kr/day per cat']
    ]

    text.forEach(element => {
      cy.get(element[0]).contains(element[1])
    })

    cy.get('.react-datepicker__input-container').click()
    cy.contains('September 2019')
  })

  it('and change her description successfully', () => {
    cy.contains('This is my new description!!!').should('not.exist')
    cy.get('#change-description-link').click()
    cy.get('#newDescription').clear()
    cy.get('#newDescription').type('This is my new description!!!')
    cy.get('#description-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your description was succesfully updated!')
    })
    cy.contains('This is my new description!!!')
  })

  it('and change her maximum accepted cats successfully', () => {
    cy.contains('Maximum cats: 3').should('not.exist')
    cy.get('#change-maxCats-link').click()
    cy.get('#newMaxCats').clear()
    cy.get('#newMaxCats').type('5')
    cy.get('#maxCats-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your maximum amount of cats accepted was succesfully updated!')
    })
    cy.contains('Maximum cats: 5')
  })

  it('and change her daily rate successfully', () => {
    cy.contains('120 kr/day for 1 cat').should('not.exist')
    cy.get('#change-rate-link').click()
    cy.get('#newRate').clear()
    cy.get('#newRate').type('120')
    cy.get('#rate-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your daily rate for 1 cat was succesfully updated!')
    })
    cy.contains('120 kr/day for 1 cat')
  })

  it('and change her supplement rate successfully', () => {
    cy.contains('Extra 20 kr/day per cat').should('not.exist')
    cy.get('#change-supplement-link').click()
    cy.get('#newSupplement').clear()
    cy.get('#newSupplement').type('20')
    cy.get('#supplement-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your supplement rate for 1 cat was succesfully updated!')
    })
    cy.contains('Extra 20 kr/day per cat')
  })
})
