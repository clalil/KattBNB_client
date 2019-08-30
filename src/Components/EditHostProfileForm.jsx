import React, { Component } from 'react'
import { Header, Form, Icon, Button, Message } from 'semantic-ui-react'
import Geocode from 'react-geocode'
import axios from 'axios'
import DayPicker, { DateUtils } from 'react-day-picker'
import '../style.css'


class EditHostProfileForm extends Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.state = {
      selectedDays: [],
      description: '',
      user_input_address: '',
      address_search: true,
      latitude: '',
      longitude: '',
      lat: '',
      long: '',
      address: '',
      rate: '',
      addressError: '',
      addressErrorDisplay: false,
      errors: '',
      onCreateErrorDisplay: false,
      maxCats: '',
      supplement: '',
      availability: '',
      loading: false
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  convertAvailabilityDates() {
    let availableDates = this.state.selectedDays.map(function (day) {
      return new Date(day).getTime()
    })
    let sortedAvailableDates = availableDates.sort(function (a, b) { return a - b })
    this.setState({
      availability: sortedAvailableDates
    })
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state
    if (day > new Date() || day.toDateString() === (new Date()).toDateString()) {
      if (selected) {
        const selectedIndex = selectedDays.findIndex(selectedDay =>
          DateUtils.isSameDay(selectedDay, day)
        )
        selectedDays.splice(selectedIndex, 1)
      } else {
        selectedDays.push(day)
      }
      this.setState({ selectedDays })
      this.convertAvailabilityDates()
    }
  }

  generateRandomNumberLat = () => {
    const minValue = parseFloat(process.env.REACT_APP_COORDS_MIN)
    const maxValue = parseFloat(process.env.REACT_APP_COORDS_MAX)
    let resultNumber = (Math.random() * (maxValue - minValue) + minValue).toFixed(6)
    return parseFloat(resultNumber)
  }

  generateRandomNumberLong = () => {
    const minValue = parseFloat(process.env.REACT_APP_COORDS_MIN)
    const maxValue = parseFloat(process.env.REACT_APP_COORDS_MAX)
    let resultNumber = (Math.random() * (maxValue - minValue) + minValue).toFixed(6)
    return parseFloat(resultNumber)
  }

  geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(this.state.user_input_address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          latitude: lat,
          longitude: lng,
          lat: lat - this.generateRandomNumberLat(),
          long: lng + this.generateRandomNumberLong(),
          address: response.results[0].formatted_address,
          address_search: false,
          addressErrorDisplay: false
        })
      },
      error => {
        this.setState({
          addressErrorDisplay: true,
          addressError: error.message
        })
      }
    )
  }

  listenEnterKey = (event) => {
    if (event.key === "Enter") {
      this.createHostProfile(event)
    }
  }

  listenEnterKeyAddress = (event) => {
    if (event.key === "Enter") {
      this.geolocationDataAddress(event)
    }
  }

  // createHostProfile = (e) => {
  //   e.preventDefault()
  //   this.setState({ loading: true })
  //   const path = '/api/v1/host_profiles'
  //   const payload = {
  //     description: this.state.description,
  //     full_address: this.state.address,
  //     price_per_day_1_cat: this.state.rate,
  //     supplement_price_per_cat_per_day: this.state.supplement,
  //     max_cats_accepted: this.state.maxCats,
  //     availability: this.state.availability,
  //     lat: this.state.lat,
  //     long: this.state.long,
  //     latitude: this.state.latitude,
  //     longitude: this.state.longitude,
  //     user_id: this.props.user_id
  //   }
  //   const headers = {
  //     uid: window.localStorage.getItem('uid'),
  //     client: window.localStorage.getItem('client'),
  //     'access-token': window.localStorage.getItem('access-token')
  //   }
  //   axios.post(path, payload, { headers: headers })
  //     .then(() => {
  //       window.alert('You have successfully created your host profile! Click OK to be redirected.')
  //       setTimeout(function () { window.location.replace('/user-page') }, 500)
  //     })
  //     .catch(error => {
  //       this.setState({
  //         loading: false,
  //         errors: error.response.data.error,
  //         onCreateErrorDisplay: true
  //       })
  //     })
  // }


  render() {
    let addressSearch
    let addressErrorMessage

    let onCreateErrorMessage

    let createHostProfileButton

    if (this.state.address_search === true) {
      addressSearch = (
        <Form.Input
          label='Your full address'
          placeholder='Search..'
          id='user_input_address'
          value={this.state.user_input_address}
          onChange={this.onChangeHandler}
          onKeyPress={this.listenEnterKeyAddress}
          iconPosition='right'
          icon={<Icon id='search' name='search' link onClick={this.geolocationDataAddress.bind(this)} style={{ 'color': '#c90c61' }} />}
        />
      )
    } else {
      addressSearch = (
        <div>
          <label for='user_input_address'>
            Your full address
          </label>
          <p>
            {this.state.address}&nbsp;
            <Header as='strong' id='change-address-link' onClick={() => { this.setState({ address_search: true }) }} className='fake-link-underlined'>
              Not right?
            </Header>
          </p>
        </div>
      )
    }

    if (this.state.addressErrorDisplay) {
      addressErrorMessage = (
        <Message negative >
          {this.state.addressError}
        </Message>
      )
    }

    if (this.state.onCreateErrorDisplay) {
      onCreateErrorMessage = (
        <Message negative >
          <Message.Header>Host profile could not be saved because of following error(s):</Message.Header>
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      createHostProfileButton = (
        <Button id='save-host-profile-button' loading>
          Save
        </Button>
      )
    } else {
      createHostProfileButton = (
        <Button id='save-host-profile-button' onClick={this.createHostProfile}>
          Save
        </Button>
      )
    }

    const today = new Date()


    return (
      <div id='host-profile-form'>
        <Header as='h2'>
          Edit host profile
        </Header>
        <p className='small-centered-paragraph' style={{ 'margin-bottom': '1rem' }}>
          Fill in only the fields you want to edit. Leave the rest blank.
        </p>
        <Form id='host-profile-form'>
          <Form.TextArea
            label='About you'
            placeholder='Please write shortly about yourself and your experience with cats..'
            id='description'
            value={this.state.description}
            onChange={this.onChangeHandler}
            onKeyPress={this.listenEnterKey}
          />

          {addressErrorMessage}
          {addressSearch}


          <Form.Group
            widths='equal'
          >
            <Form.Input
              label='Your rate'
              type='number'
              placeholder='Your daily rate in kr/day'
              id='rate'
              value={this.state.rate}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />

            <Form.Input
              label='Max cats accepted'
              type='number'
              placeholder='Max amount'
              id='maxCats'
              value={this.state.maxCats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />

            <Form.Input
              label='Supplement'
              type='number'
              placeholder='+35kr/cat/day'
              id='supplement'
              value={this.state.supplement}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />
          </Form.Group>


          <div >
            <label for='availability'>
              Availability
            </label>

            <DayPicker
              showWeekNumbers
              disabledDays={{ before: today }}
              firstDayOfWeek={1}
              selectedDays={this.state.selectedDays}
              onDayClick={this.handleDayClick}
            />
          </div>

        </Form>

        {onCreateErrorMessage}

        <div className='button-wrapper'>
          <div>
            <Button secondary className='cancel-button' onClick={this.props.closeForm}>Close</Button>
          </div>
          <div>
            {createHostProfileButton}
          </div>
        </div>

      </div>
    )
  }
}

export default EditHostProfileForm
