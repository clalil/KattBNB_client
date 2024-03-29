import React, { Component } from 'react'
import { Divider, Header, Message, Segment } from 'semantic-ui-react'
import MaxCatsUpdateForm from './MaxCatsUpdateForm'
import DescriptionUpdateForm from './DescriptionUpdateForm'
import RateUpdateForm from './RateUpdateForm'
import SupplementUpdateForm from './SupplementUpdateForm'
import AvailabilityUpdateForm from './AvailabilityUpdateForm'
import AvailabilityViewOnlyMode from './AvailabilityViewOnlyMode'
import AddressUpdateForm from './AddressUpdateForm'

class HostProfile extends Component {

  state = {
    errors: '',
    errorDisplay: false,
    editDescriptionForm: false,
    editMaxCatsForm: false,
    editRateForm: false,
    editSupplementForm: false,
    editableCalendar: false,
    editAddress: false
  }

  closeAllForms = () => {
    this.setState({
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      editAddress: false,
      errorDisplay: false,
      errors: ''
    })
  }

  formHandler = (e) => {
    let states = ['editDescriptionForm', 'editRateForm', 'editSupplementForm', 'editMaxCatsForm', 'editableCalendar', 'editAddress']
    states.forEach(stt => {
      (stt !== e.target.id) ? this.setState({ [stt]: false }) : this.setState({ [stt]: !this.state.stt })
    })
    this.setState({
      errorDisplay: false,
      errors: ''
    })
    this.props.closeLocPasForms()
  }

  render() {
    let editDescriptionForm, editMaxCatsForm, editRateForm, editSupplementForm, calendar, addressSearch, errorDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.editDescriptionForm) {
      editDescriptionForm = (
        <DescriptionUpdateForm
          description={this.props.description}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editMaxCatsForm) {
      editMaxCatsForm = (
        <MaxCatsUpdateForm
          maxCats={this.props.maxCats}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editRateForm) {
      editRateForm = (
        <RateUpdateForm
          rate={this.props.rate}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editSupplementForm) {
      editSupplementForm = (
        <SupplementUpdateForm
          supplement={this.props.supplement}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editableCalendar) {
      calendar = (
        <AvailabilityUpdateForm
          selectedDays={this.props.availability.map(function (date) {
            return new Date(date)
          })
          }
          availability={this.props.availability}
          id={this.props.id}
          incomingBookings={this.props.incomingBookings}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    } else {
      calendar = (
        <AvailabilityViewOnlyMode
          selectedDays={this.props.availability.map(function (date) {
            return new Date(date)
          })
          }
        />
      )
    }

    if (this.state.editAddress) {
      addressSearch = (
        <AddressUpdateForm
          fullAddress={this.props.fullAddress}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
          location={this.props.location}
        />
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
        {errorDisplay}
        <Divider hidden />
        <p id='description'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{this.props.description}&ensp;
          <Header as='strong' id='editDescriptionForm' onClick={this.formHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editDescriptionForm}
        <p id='address'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" /></svg>
          &nbsp;{this.props.fullAddress}&ensp;
          <Header as='strong' id='editAddress' onClick={this.formHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {addressSearch}
        <p id='maxCats'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236.62 236.62"><path d="M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z" /></svg>
          &nbsp;Maximum cats: {this.props.maxCats}&ensp;
          <Header as='strong' id='editMaxCatsForm' onClick={this.formHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editMaxCatsForm}
        <p id='rate'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z" /></svg>
          &nbsp;{this.props.rate} kr/day for 1 cat&ensp;
          <Header as='strong' id='editRateForm' onClick={this.formHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editRateForm}
        <p id='supplement'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" /></svg>
          &nbsp;Extra {this.props.supplement} kr/day per cat&ensp;
          <Header as='strong' id='editSupplementForm' onClick={this.formHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editSupplementForm}
        <p id='availability' style={{ 'marginBottom': '0' }}>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" /></svg>
          &nbsp;Your availability&ensp;
          <Header as='strong' id='editableCalendar' onClick={this.formHandler} className='fake-link-underlined' >
            Change
          </Header>
        </p>
        {calendar}
      </Segment>
    )
  }
}

export default HostProfile
