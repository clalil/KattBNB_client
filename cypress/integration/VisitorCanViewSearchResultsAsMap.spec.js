describe('Visitor can view search results as a map', () => {
  before(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
    cy.wait(2000)
    cy.clock().then((clock) => {
      clock.restore()
    })
    cy.get('#map-button').click()
  })

  it('and see correct datapoints', () => {
    let labels = [
      '#2', '#5'
    ]

    labels.forEach(label => {
      cy.get(label).should('be.visible')
    })
  })

  it('and not see hosts that are not available', () => {
    cy.get('#6').should('not.exist')
    cy.get('#7').should('not.exist')
  })

  it('and not see hosts that does not accept required amount of cats', () => {
    cy.get('#10').should('not.exist')
  })

  it('and see a popup with host information by clicking on a specific datapoint', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })

    cy.get('#2').click({ force: true })

    let hostData = [
      'carla', 'Stockholm', '140 kr/day', 'The stay for 2 cats with carla during the dates of 2019-10-08 until 2019-10-11 would in total cost', '560 kr'
    ]

    hostData.forEach(data => {
      cy.contains(data)
    })
  })

  it("and see the full host profile after clicking 'more' in host popup", () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    let hostData = [
      [
        '#nickname', '#description', '#per-day',
        '#total'
      ],
      ['carla', 'I have the nicest hair in the world! And I love cats btw :P', '140 kr/day', '560 kr']
    ]
    cy.get('#2').click({ force: true })
    cy.get('#more').click()

    hostData[0].forEach(data => {
      cy.get(data).contains(hostData[1][hostData[0].indexOf(data)])
    })

    cy.get('#avatar').should('be.visible')
  })
})
