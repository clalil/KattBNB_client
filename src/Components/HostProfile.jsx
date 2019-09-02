import React, { Component } from 'react'
import axios from 'axios'
import { Divider, Header, Form, Button, Message, Segment } from 'semantic-ui-react'
import DayPicker, { DateUtils } from 'react-day-picker'
import '../style.css'

class HostProfile extends Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.state = {
      description: '',
      newDescription: '',
      full_address: '',
      rate: '',
      newRate: '',
      maxCats: '',
      newMaxCats: '',
      supplement: '',
      newSupplement: '',
      availability: [],
      newAvailability: [],
      selectedDays: [],
      errors: '',
      errorDisplay: false,
      loading: false,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false
    }
  }

  componentDidMount() {
    const path = `/api/v1/host_profiles/${this.props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.get(path, { headers: headers })
      .then(response => {
        this.setState({
          description: response.data.description,
          full_address: response.data.full_address,
          rate: response.data.price_per_day_1_cat,
          maxCats: response.data.max_cats_accepted,
          supplement: response.data.supplement_price_per_cat_per_day,
          availability: response.data.availability,
          selectedDays: response.data.availability.map(function (date) {
            return new Date(date)
          })
        })
      })
      .catch(error => {
        this.setState({
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
  }

  closeAllForms = () => {
    this.setState({
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false
    })
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  descriptionFormHandler = () => {
    this.setState({
      editDescriptionForm: !this.state.editDescriptionForm,
      newDescription: this.state.description,
      newMaxCats: '',
      newRate: '',
      newSupplement: '',
      newAvailability: [],
      errorDisplay: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false
    })
    this.props.closeLocPasForms()
  }

  maxCatsFormHandler = () => {
    this.setState({
      editMaxCatsForm: !this.state.editMaxCatsForm,
      newMaxCats: this.state.maxCats,
      newDescription: '',
      newRate: '',
      newSupplement: '',
      newAvailability: [],
      errorDisplay: false,
      editDescriptionForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false
    })
    this.props.closeLocPasForms()
  }

  rateFormHandler = () => {
    this.setState({
      editRateForm: !this.state.editRateForm,
      newRate: this.state.rate,
      newDescription: '',
      newMaxCats: '',
      newSupplement: '',
      newAvailability: [],
      errorDisplay: false,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editSupplementForm: false,
      editableCalendar: false
    })
    this.props.closeLocPasForms()
  }

  supplementFormHandler = () => {
    this.setState({
      editSupplementForm: !this.state.editSupplementForm,
      newSupplement: this.state.supplement,
      newDescription: '',
      newMaxCats: '',
      newRate: '',
      newAvailability: [],
      errorDisplay: false,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editableCalendar: false
    })
    this.props.closeLocPasForms()
  }

  availabilityFormHandler = () => {
    this.setState({
      editableCalendar: !this.state.editableCalendar,
      newAvailability: this.state.availability,
      newDescription: '',
      newMaxCats: '',
      newRate: '',
      newSupplement: '',
      errorDisplay: false,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false
    })
    this.props.closeLocPasForms()
  }

  updateDescription = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    if (this.state.newDescription !== '' && this.state.newDescription !== this.state.description) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = {
        description: this.state.newDescription
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            description: this.state.newDescription,
            editDescriptionForm: false
          })
          window.alert('Your description was succesfully updated!')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['The field is blank or unchanged!']
      })
    }
  }

  updateMaxCats = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    if (this.state.newMaxCats !== '' && this.state.newMaxCats !== this.state.maxCats && this.state.newMaxCats >= 1) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = {
        max_cats_accepted: this.state.newMaxCats
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            maxCats: Math.floor(this.state.newMaxCats),
            editMaxCatsForm: false
          })
          window.alert('Your maximum amount of cats accepted was succesfully updated!')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['The field is blank, unchanged or the number is invalid!']
      })
    }
  }

  listenEnterMaxCatsUpdate = (event) => {
    if (event.key === "Enter") {
      this.updateMaxCats(event)
    }
  }

  updateRate = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    if (this.state.newRate !== '' && this.state.newRate !== this.state.rate && this.state.newRate >= 0.01) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = {
        price_per_day_1_cat: this.state.newRate
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            rate: this.state.newRate,
            editRateForm: false
          })
          window.alert('Your daily rate for 1 cat was succesfully updated!')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['The field is blank, unchanged or the number is invalid!']
      })
    }
  }

  listenEnterRateUpdate = (event) => {
    if (event.key === "Enter") {
      this.updateRate(event)
    }
  }

  updateSupplement = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    if (this.state.newSupplement !== '' && this.state.newSupplement !== this.state.supplement && this.state.newSupplement >= 0) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = {
        supplement_price_per_cat_per_day: this.state.newSupplement
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            supplement: this.state.newSupplement,
            editSupplementForm: false
          })
          window.alert('Your supplement rate for 1 cat was succesfully updated!')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['The field is blank, unchanged or the number is invalid!']
      })
    }
  }

  listenEnterSupplementUpdate = (event) => {
    if (event.key === "Enter") {
      this.updateSupplement(event)
    }
  }

  updateAvailability = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    if (this.state.newAvailability !== this.state.availability) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const filteredAvailability = this.state.newAvailability.filter(function (value, index, arr) {
        return value > (new Date()).getTime()
      })
      const payload = {
        availability: filteredAvailability
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            availability: this.state.newAvailability,
            editableCalendar: false
          })
          window.alert('Your availability was succesfully updated!')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['There were no changes made in your availability!']
      })
    }
  }

  convertAvailabilityDates() {
    let availableDates = this.state.selectedDays.map(function (day) {
      return new Date(day).getTime()
    })
    let sortedAvailableDates = availableDates.sort(function (a, b) { return a - b })
    this.setState({
      newAvailability: sortedAvailableDates
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


  render() {

    let editDescriptionForm
    let descriptionFormSubmitButton
    let editMaxCatsForm
    let maxCatsFormSubmitButton
    let editRateForm
    let rateFormSubmitButton
    let editSupplementForm
    let supplementFormSubmitButton
    let availabilityFormSubmitButton
    let selectedDays
    let calendar
    const today = new Date()
    let errorDisplay
    const rate = parseFloat(this.state.rate)
    const supplement = parseFloat(this.state.supplement)

    selectedDays = this.state.availability.map(function (date) {
      return new Date(date)
    })

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      descriptionFormSubmitButton = (
        <Button loading id='description-submit-button' className='submit-button'>Change</Button>
      )
      maxCatsFormSubmitButton = (
        <Button loading id='maxCats-submit-button' className='submit-button'>Change</Button>
      )
      rateFormSubmitButton = (
        <Button loading id='rate-submit-button' className='submit-button'>Change</Button>
      )
      supplementFormSubmitButton = (
        <Button loading id='supplement-submit-button' className='submit-button'>Change</Button>
      )
      availabilityFormSubmitButton = (
        <Button loading id='availability-submit-button' className='submit-button'>Change</Button>
      )
    } else {
      descriptionFormSubmitButton = (
        <Button id='description-submit-button' className='submit-button' onClick={this.updateDescription}>Change</Button>
      )
      maxCatsFormSubmitButton = (
        <Button id='maxCats-submit-button' className='submit-button' onClick={this.updateMaxCats}>Change</Button>
      )
      rateFormSubmitButton = (
        <Button id='rate-submit-button' className='submit-button' onClick={this.updateRate}>Change</Button>
      )
      supplementFormSubmitButton = (
        <Button id='supplement-submit-button' className='submit-button' onClick={this.updateSupplement}>Change</Button>
      )
      availabilityFormSubmitButton = (
        <Button id='availability-submit-button' className='submit-button' onClick={this.updateAvailability}>Change</Button>
      )
    }

    if (this.state.editDescriptionForm) {
      editDescriptionForm = (
        <>
          <Form id='update-description'>
            <Form.TextArea
              required
              id='newDescription'
              value={this.state.newDescription}
              onChange={this.onChangeHandler}
            />
          </Form>
          <div className='button-wrapper'>
            <div>
              <Button secondary id='description-close-button' className='cancel-button' onClick={this.descriptionFormHandler}>Close</Button>
            </div>
            <div>
              {descriptionFormSubmitButton}
            </div>
          </div>
          {errorDisplay}
        </>
      )
    }

    if (this.state.editMaxCatsForm) {
      editMaxCatsForm = (
        <>
          <Form id='update-maxCats'>
            <Form.Input
              required
              type='number'
              id='newMaxCats'
              value={this.state.newMaxCats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterMaxCatsUpdate}
            />
          </Form>
          <div className='button-wrapper'>
            <div>
              <Button secondary id='maxCats-close-button' className='cancel-button' onClick={this.maxCatsFormHandler}>Close</Button>
            </div>
            <div>
              {maxCatsFormSubmitButton}
            </div>
          </div>
          {errorDisplay}
        </>
      )
    }

    if (this.state.editRateForm) {
      editRateForm = (
        <>
          <Form id='update-rate'>
            <Form.Input
              required
              type='number'
              id='newRate'
              value={this.state.newRate}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterRateUpdate}
            />
          </Form>
          <div className='button-wrapper'>
            <div>
              <Button secondary id='rate-close-button' className='cancel-button' onClick={this.rateFormHandler}>Close</Button>
            </div>
            <div>
              {rateFormSubmitButton}
            </div>
          </div>
          {errorDisplay}
        </>
      )
    }

    if (this.state.editSupplementForm) {
      editSupplementForm = (
        <>
          <Form id='update-supplement'>
            <Form.Input
              required
              type='number'
              id='newSupplement'
              value={this.state.newSupplement}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterSupplementUpdate}
            />
          </Form>
          <div className='button-wrapper'>
            <div>
              <Button secondary id='supplement-close-button' className='cancel-button' onClick={this.supplementFormHandler}>Close</Button>
            </div>
            <div>
              {supplementFormSubmitButton}
            </div>
          </div>
          {errorDisplay}
        </>
      )
    }    

    if (this.state.editableCalendar) {
      calendar = (
        <>
          <p>
            You can now update your availability dates:
          </p>
          <div style={{ 'margin-right': '-2rem', 'margin-left': '-2rem' }}>
            <DayPicker
              showWeekNumbers
              firstDayOfWeek={1}
              selectedDays={this.state.selectedDays}
              fromMonth={today}
              disabledDays={{ before: today }}
              onDayClick={this.handleDayClick}
            />
          </div>

          <div className='button-wrapper'>
            <div>
              <Button secondary id='availability-close-button' className='cancel-button' onClick={this.availabilityFormHandler}>Close</Button>
            </div>
            <div>
              {availabilityFormSubmitButton}
            </div>
          </div>
          {errorDisplay}
        </>
      )
    } else {
      calendar = (
        <div style={{ 'margin-right': '-2rem', 'margin-left': '-2rem' }}>
          <DayPicker
            showWeekNumbers
            firstDayOfWeek={1}
            selectedDays={selectedDays}
            fromMonth={selectedDays[0]}
            toMonth={selectedDays[selectedDays.length - 1]}
          />
        </div>
      )
    }


    return (
      <Segment className='whitebox'>
        <Header as='h1'>
          Your host profile
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          This is your <strong> host </strong> profile. Here you can update all your cat hosting information.
        </p>

        <Divider hidden />
        <p id='description'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{this.state.description}&ensp;
          <Header as='strong' id='change-description-link' onClick={this.descriptionFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editDescriptionForm}


        <p id='address'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" /></svg>
          &nbsp;{this.state.full_address}&ensp;
            <Header as='strong' id='change-address-link' className='fake-link-underlined'>
            Change
            </Header>
        </p>

        <p id='maxCats'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236.62 236.62"><path d="M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z" /></svg>
          &nbsp;Maximum cats: {this.state.maxCats}&ensp;
            <Header as='strong' id='change-maxCats-link' onClick={this.maxCatsFormHandler} className='fake-link-underlined'>
            Change
            </Header>
        </p>
        {editMaxCatsForm}

        <p id='rate'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z" /></svg>
          &nbsp;{rate} kr/day for 1 cat&ensp;
          <Header as='strong' id='change-rate-link' onClick={this.rateFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editRateForm}

        <p id='supplement'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" /></svg>
          &nbsp;Extra {supplement} kr/day per cat&ensp;
            <Header as='strong' id='change-supplement-link' onClick={this.supplementFormHandler} className='fake-link-underlined'>
            Change
            </Header>
        </p>
        {editSupplementForm}

        <p id='availability' style={{ 'margin-bottom': '0' }}>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" /></svg>
          &nbsp;Your availability&ensp;
          <Header as='strong' id='change-availability-link' onClick={this.availabilityFormHandler} className='fake-link-underlined' >
            Change
          </Header>
        </p>
        {calendar}

      </Segment>
    )
  }
}

export default HostProfile
