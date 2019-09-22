import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Message, Segment } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import enGB from 'date-fns/locale/en-GB'
import '../react-datepicker.css'
import axios from 'axios'

registerLocale('enGB', enGB)


class Search extends Component {
  state = {
    errorDisplay: false,
    errors: '',
    searchData: '',
    loading: false,
    startDate: null,
    endDate: null,
    location: '',
    cats: ''
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  handleStartDateChange = date => {
    this.setState({
      startDate: date
    })
    if (date !== null) {
      this.setState({
        endDate: new Date(date.getTime() + 86400000)
      })
    } else {
      this.setState({
        endDate: null
      })
    }
  }

  handleEndDateChange = date => {
    this.setState({
      endDate: date
    })
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

    let checkOutCalendar
    let errorDisplay
    let searchButton
    let searchMessage

    if (this.state.startDate === null) {
      checkOutCalendar = (
        <DatePicker
          isClearable
          withPortal
          showWeekNumbers
          disabled
          locale='enGB'
          dateFormat='yyyy/MM/dd'
          placeholderText='Check-out'
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
      )
    } else {
      checkOutCalendar = (
        <DatePicker
          isClearable
          withPortal
          showWeekNumbers
          locale='enGB'
          dateFormat='yyyy/MM/dd'
          placeholderText='Check-out'
          minDate={this.state.startDate.getTime() + 86400000}
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
      )
    }

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
        <div id='search-form'>
          <Header as='h2'>
            Find a cat sitter!
          </Header>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
            Find the person to take care of your cat with a few clicks!
          </p>
          <Segment className='whitebox'>
            <Form id='search-form' style={{ 'textAlign': 'center' }}>
              <div className='required field'>
                <label>
                  Where
              </label>
              </div>
              <Dropdown
                clearable
                search
                selection
                placeholder='Choose your location'
                options={LOCATION_OPTIONS}
                id='location'
                onChange={this.handleLocationChange}
                onKeyPress={this.listenEnterKeySearch}
              />
              <br />
              <br />
              <div className='required field'>
                <label>
                  When
              </label>
              </div>
              <Form.Group
                widths='equal'
                style={{ 'display': 'contents' }}
              >
                <div style={{ 'marginBottom': '5px' }}>
                  <DatePicker
                    isClearable
                    withPortal
                    showWeekNumbers
                    locale='enGB'
                    dateFormat='yyyy/MM/dd'
                    placeholderText='Check-in'
                    minDate={new Date().getTime() + 86400000}
                    selected={this.state.startDate}
                    onChange={this.handleStartDateChange}
                  />
                </div>
                {checkOutCalendar}
              </Form.Group>
              <br />
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
          </Segment>
          <div className='button-wrapper'>
            <div>
              {searchButton}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Search
