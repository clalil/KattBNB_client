import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Message, Segment } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import '../react-day-picker-range.css'
import { formatDate, parseDate } from 'react-day-picker/moment'


class Search extends Component {
  constructor(props) {
    super(props)
    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.state = {
      errorDisplay: false,
      errors: '',
      searchData: '',
      loading: false,
      //startDate: null,
      //endDate: null,
      location: '',
      cats: '',
      from: undefined,
      to: undefined
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  // handleStartDateChange = date => {
  //   this.setState({
  //     startDate: date
  //   })
  //   if (date !== null) {
  //     this.setState({
  //       endDate: new Date(date.getTime() + 86400000)
  //     })
  //   } else {
  //     this.setState({
  //       endDate: null
  //     })
  //   }
  // }

  // handleEndDateChange = date => {
  //   this.setState({
  //     endDate: date
  //   })
  // }

  showFromMonth() {
    const { from, to } = this.state;
    if (!from) {
      return;
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from)
    }
  }

  handleFromChange(from) {
    // Change the from date and focus the "to" input field
    this.setState({ from });
  }

  handleToChange(to) {
    this.setState({ to }, this.showFromMonth)
  }

  listenEnterKeySearch = (event) => {
    if (event.key === 'Enter') {
      this.search(event)
    }
  }

  search = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.cats <= 0 || this.state.cats % 1 !== 0) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Number of cats must be a whole positive number!']
      })
    } else if (this.state.location === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You must choose a location to continue!']
      })
    } else if (this.state.startDate === null || this.state.endDate === null) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You must choose both check-in and check-out dates to continue!']
      })
    } else {
      axios.get(`/api/v1/host_profiles?location=${this.state.location}`).then(response => {
        this.setState({
          searchData: response.data,
          loading: false,
          errors: '',
          errorDisplay: false
        })
      })
    }
  }


  render() {

    let errorDisplay
    let searchButton
    let searchMessage

    const { from, to } = this.state;
    const modifiers = { start: from, end: to }

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header>Search could not be performed because of following error(s):</Message.Header>
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      searchButton = (
        <Button className='submit-button' loading>Search</Button>
      )
    } else {
      searchButton = (
        <Button id='search-button' className='submit-button' onClick={this.search}>Search</Button>
      )
    }

    if (this.state.searchData !== '' && this.state.searchData.length === 0) {
      searchMessage = (
        <Header>
          Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.
        </Header>
      )
    }


    return (
      <div className='content-wrapper' >
        <Header as='h2'>
          Find a cat sitter!
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            Find the person to take care of your cat(s) while you're away!
          </p>
          <Form id='search-form' style={{ 'margin': 'auto', 'maxWidth': '177px' }}>
            <div className='required field'>
              <label>
                Where
              </label>
              <Dropdown
                style={{ 'minWidth': '-webkit-fill-available' }}
                clearable
                search
                selection
                placeholder='Choose your location'
                options={LOCATION_OPTIONS}
                id='location'
                onChange={this.handleLocationChange}
                onKeyPress={this.listenEnterKeySearch}
              />
            </div>

            <div className='required field'>
              <label>
                When
              </label>
              <div className="InputFromTo">
                <DayPickerInput
                  value={from}
                  placeholder="From"
                  format="LL"
                  formatDate={formatDate}
                  parseDate={parseDate}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { after: to },
                    toMonth: to,
                    modifiers,
                    numberOfMonths: 1,
                    onDayClick: () => this.to.getInput().focus(),
                  }}
                  onDayChange={this.handleFromChange}
                />
                <span className="InputFromTo-to">
                  <DayPickerInput
                    ref={el => (this.to = el)}
                    value={to}
                    placeholder="To"
                    format="LL"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                      selectedDays: [from, { from, to }],
                      disabledDays: { before: from },
                      modifiers,
                      month: from,
                      fromMonth: from,
                      numberOfMonths: 1,
                    }}
                    onDayChange={this.handleToChange}
                  />
                </span>
              </div>
              </div>

              <Form.Input
                label='Number of cats'
                type='number'
                required
                id='cats'
                value={this.state.cats}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKeySearch}
                style={{ 'maxWidth': '180px' }}
              />
          </Form>
            {errorDisplay}
            {searchMessage}
            <div className='button-wrapper'>
              <div>
                {searchButton}
              </div>
            </div>
        </Segment>
      </div>
        )
      }
    }
    
    export default Search
