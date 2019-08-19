import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Form, Dropdown, Button, Message } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'

class UserPage extends Component {
  state = {
    displayLocationForm: false,
    displayPasswordForm: false,
    password: '',
    location: this.props.location,
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  listenEnterKeyLocation = (event) => {
    if (event.key === "Enter") {
      this.updateLocation(event)
    }
  }

  listenEnterKeyPassword = (event) => {
    if (event.key === "Enter") {
      this.updatePassword(event)
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

  locationFormHandler = () => {
    this.setState({
      displayLocationForm: !this.state.displayLocationForm,
      location: this.props.location,
      errorDisplay: false,
      password: ''
    })
  }

  passwordFormHandler = () => {
    this.setState({
      displayPasswordForm: !this.state.displayPasswordForm,
      errorDisplay: false,
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    })
  }

  updateLocation = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/'
      const payload = {
        current_password: this.state.password,
        location: this.state.location,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(response => {
          window.localStorage.setItem('client', response.headers.client)
          window.localStorage.setItem('access-token', response.headers['access-token'])
          window.localStorage.setItem('expiry', response.headers.expiry)
          this.setState({
            displayLocationForm: false,
            location: response.data.data.location,
            loading: false
          })
        })
        .catch(error => {
          window.localStorage.setItem('client', error.response.headers.client)
          window.localStorage.setItem('access-token', error.response.headers['access-token'])
          window.localStorage.setItem('expiry', error.response.headers.expiry)
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    }
  }

  updatePassword = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/password'
      const payload = {
        current_password: this.state.current_password,
        password: this.state.new_password,
        password_confirmation: this.state.new_password_confirmation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            displayPasswordForm: false,
            loading: false
          })
          window.location.replace('/login')
          window.localStorage.clear()
        })
        .catch(error => {
          window.localStorage.setItem('client', error.response.headers.client)
          window.localStorage.setItem('access-token', error.response.headers['access-token'])
          window.localStorage.setItem('expiry', error.response.headers.expiry)
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    }
  }


  render() {
    let errorDisplay

    let locationForm
    let locationSubmitButton

    let passwordForm
    let passwordSubmitButton

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id="message-error-list">
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      locationSubmitButton = (
        <Button id="location-submit-button" loading>Change location</Button>
      )
    } else {
      locationSubmitButton = (
        <Button id="location-submit-button" onClick={this.updateLocation}>Change location</Button>
      )
    }

    if (this.state.loading) {
      passwordSubmitButton = (
        <Button id="password-submit-button" loading>Change password</Button>
      )
    } else {
      passwordSubmitButton = (
        <Button id="password-submit-button" onClick={this.updatePassword}>Change password</Button>
      )
    }

    if (this.state.displayLocationForm) {
      locationForm = (
        <>
          {errorDisplay}
          <Form>
            <Dropdown
              clearable
              search
              selection
              style={{ 'width': '100%' }}
              placeholder="Select new location"
              options={LOCATION_OPTIONS}
              id='location'
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKeyLocation}
            />

            <Form.Input
              required
              id='password'
              value={this.state.password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Your password'
              onKeyPress={this.listenEnterKeyLocation}
            />
          </Form>

          {locationSubmitButton}

          <Button id="location-cancel-button" onClick={this.locationFormHandler.bind(this)}>Close</Button>

        </>
      )
    }

    if (this.state.displayPasswordForm) {
      passwordForm = (
        <>
          {errorDisplay}
          <Form>
            <Form.Input
              required
              id='current_password'
              value={this.state.current_password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Current password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='new_password'
              value={this.state.new_password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='new_password_confirmation'
              value={this.state.new_password_confirmation}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password again'
              onKeyPress={this.listenEnterKeyPassword}
            />
          </Form>

          {passwordSubmitButton}

          <Button id="location-cancel-button" onClick={this.passwordFormHandler.bind(this)}>Close</Button>

        </>

      )
    }

    return (
      <div className='content-wrapper'>
        <Segment className='whitebox'>
          <Header as='h2'>
            Hi, {this.props.username}!
            </Header>
          <p>
            This is your profile. Here you can update your location, picture and password.
          </p>
          <p>
            <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
            &nbsp;{this.props.email}
          </p>
          <p id='user-location'>
            <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
            &nbsp;{this.state.location}
          </p>
          <Header id='change-location-link' onClick={this.locationFormHandler.bind(this)} className='fake-link-underlined' >
            Change
          </Header>
          {locationForm}
          <p>
            <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" /></svg>
            &nbsp;******
          </p>
          <Header id='change-password-link' onClick={this.passwordFormHandler.bind(this)} className='fake-link-underlined' >
            Change
          </Header>
          {passwordForm}
        </Segment>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid
})

export default connect(mapStateToProps)(UserPage)
