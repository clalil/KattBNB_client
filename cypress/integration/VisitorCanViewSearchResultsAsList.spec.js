describe('Visitor can view search results as a list', () => {
  before(function () {
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
  })

  it('and see correct amount of results', () => {
    cy.contains('3 result(s)')
  })

  it('and see correct prices', () => {
    cy.get('#2').within(() => {
      cy.contains('560 kr')
    })

    cy.get('#3').within(() => {
      cy.contains('460 kr')
    })
  })

  it('and not see hosts that are not available', () => {
    cy.get('#4').should('not.exist')
    cy.get('#5').should('not.exist')
  })

  it('and not see hosts that does not accept required amount of cats', () => {
    cy.get('#1').should('not.exist')
  })
  it('and see the full host profile when clicking on a list card', () => {
    let hostData = [
      '#nickname', '#description', '#per-day', 
      '#total', '#total-kr', '#avatar'
    ]
    cy.get('#2').click()
    hostData.forEach(data => {
      cy.contains(data)
    }) 
  })
})
