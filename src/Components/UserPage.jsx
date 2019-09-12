import React, { Component } from 'react'
import HostProfileForm from './HostProfileForm'
import HostProfile from './HostProfile'
import { connect } from 'react-redux'
import { Header, Segment, Form, Dropdown, Button, Message, Divider, Image, Icon } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'
import Avatar from 'react-avatar-edit'
import Popup from 'reactjs-popup'
import Resizer from 'react-image-file-resizer'

class UserPage extends Component {

  hostProfileElement = React.createRef()

  state = {
    displayLocationForm: false,
    displayPasswordForm: false,
    avatar: this.props.avatar,
    location: this.props.location,
    newLocation: this.props.location,
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    loading: false,
    errorDisplay: false,
    errors: '',
    hostProfile: '',
    hostProfileForm: false,
    preview: null,
    rotateAvatar: false
  }

  async componentDidMount() {
    await axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ hostProfile: response.data })
    })
    if (this.state.hostProfile.length === 1) {
      this.setState({
        location: this.state.hostProfile[0]['user']['location'],
        newLocation: this.state.hostProfile[0]['user']['location']
      })
    }
  }

  listenEnterKeyLocation = (event) => {
    if (event.key === 'Enter') {
      this.updateLocation(event)
    }
  }

  listenEnterKeyPassword = (event) => {
    if (event.key === 'Enter') {
      this.updatePassword(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ newLocation: value })
  }

  avatarFormHandler = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      hostProfileForm: false,
      newLocation: this.state.location,
      errorDisplay: false,
      errors: '',
      preview: null,
      rotateAvatar: false,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      loading: false
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  locationFormHandler = () => {
    this.setState({
      displayLocationForm: !this.state.displayLocationForm,
      displayPasswordForm: false,
      preview: null,
      hostProfileForm: false,
      newLocation: this.state.location,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  passwordFormHandler = () => {
    this.setState({
      displayPasswordForm: !this.state.displayPasswordForm,
      displayLocationForm: false,
      preview: null,
      newLocation: this.state.location,
      hostProfileForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  hostProfileFormHandler = () => {
    this.setState({
      hostProfileForm: !this.state.hostProfileForm,
      preview: null,
      displayLocationForm: false,
      newLocation: this.state.location,
      displayPasswordForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
  }

  closeLocationAndPasswordForms = () => {
    this.setState({
      preview: null,
      displayLocationForm: false,
      newLocation: this.state.location,
      displayPasswordForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
  }

  updateAvatar = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.preview === null) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You have selected no avatar!']
      })
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/'
      const payload = {
        avatar: this.state.preview,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(response => {
          this.setState({
            avatar: response.data.data.avatar,
            loading: false,
            errorDisplay: false
          })
          window.location.reload(true)
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    }
  }

  updateLocation = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.newLocation === this.state.location || this.state.newLocation === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['No location selected or location is unchanged!']
      })
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/'
      const payload = {
        location: this.state.newLocation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(response => {
          this.setState({
            displayLocationForm: false,
            location: response.data.data.location,
            loading: false,
            errorDisplay: false
          })
          if (this.state.hostProfile.length === 1) {
            window.alert('Location succesfully changed!')
          } else {
            window.alert('Location succesfully changed!')
            window.location.reload(true)
          }
        })
        .catch(error => {
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
    } else if (this.state.newPassword === this.state.newPasswordConfirmation && this.state.newPassword.length >= 6) {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/password'
      const payload = {
        current_password: this.state.currentPassword,
        password: this.state.newPassword,
        password_confirmation: this.state.newPasswordConfirmation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            displayPasswordForm: false,
            errorDisplay: false
          })
          window.location.replace('/login')
          window.localStorage.clear()
          window.alert('Your password was successfully changed!')
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
        errorDisplay: true,
        errors: ["Check that 'new password' fields are an exact match with each other and that they consist of at least 6 characters"]
      })
    }
  }

  destroyAccount = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      hostProfileForm: false
    })
    if (window.confirm('Do you really want to delete your account?')) {
      const path = '/api/v1/auth'
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.delete(path, { headers: headers })
        .then(() => {
          window.localStorage.clear()
          window.alert('Your account was succesfully deleted!')
          window.location.replace('/')
        })
        .catch(() => {
          window.alert('There was a problem deleting your account! Please login and try again.')
          window.localStorage.clear()
          window.location.replace('/login')
        })
    }
  }

  onAvatarClose = () => {
    this.setState({ preview: null })
  }

  onAvatarCrop = (preview) => {
    this.setState({
      preview: preview,
      errors: [],
      errorDisplay: false
    })
  }

  onBeforeAvatarLoad = (elem) => {
    if (elem.target.files[0].size > 5242880) {
      this.setState({
        errorDisplay: true,
        errors: ['File cannot be over 5 MB!'],
        loading: true
      })
      elem.target.value = ''
    } else if (elem.target.files[0].type !== 'image/png' && elem.target.files[0].type !== 'image/jpeg' && elem.target.files[0].type !== 'image/jpg') {
      this.setState({
        errorDisplay: true,
        errors: ['Unsupported image file format!'],
        loading: true
      })
      elem.target.value = ''
    } else {
      this.setState({
        loading: false,
        errorDisplay: false,
        errors: []
      })
    }
  }

  dataURItoBlob = (dataURI) => {
    let binary = atob(dataURI.split(',')[1])
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let array = []
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i))
    }
    return new Blob([new Uint8Array(array)], { type: mimeString })
  }

  rotate = () => {
    let file = this.dataURItoBlob(this.state.preview)
    Resizer.imageFileResizer(
      file,
      10000,
      10000,
      'PNG',
      100,
      90,
      uri => {
        this.setState({
          preview: uri
        })
      },
      'base64'
    )
  }


  render() {
    let errorDisplay

    let locationForm
    let locationSubmitButton

    let passwordForm
    let passwordSubmitButton

    let hostProfile
    let hostProfileForm

    let avatar
    let avatarSubmitButton
    let avatarRotateButton
    let triggerRotateButton
    let noAvatar
    let avatarPopup

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative style={{ 'width': 'inherit' }} >
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
      locationSubmitButton = (
        <Button id='location-submit-button' className='submit-button' loading>Change</Button>
      )
      passwordSubmitButton = (
        <Button id='password-submit-button' className='submit-button' loading>Change</Button>
      )
      avatarSubmitButton = (
        <Button id='avatar-submit-button' className='submit-button' loading>Save</Button>
      )
      avatarRotateButton = (
        <Button className='submit-button' loading>Rotate</Button>
      )
    } else {
      locationSubmitButton = (
        <Button id='location-submit-button' className='submit-button' onClick={this.updateLocation}>Change</Button>
      )
      passwordSubmitButton = (
        <Button id='password-submit-button' className='submit-button' onClick={this.updatePassword}>Change</Button>
      )
      avatarSubmitButton = (
        <Button id='avatar-submit-button' className='submit-button' onClick={this.updateAvatar}>Save</Button>
      )
      if (this.state.preview === null) {
        avatarRotateButton = (
          <Button className='submit-button' disabled><Icon name='redo alternate' style={{ 'margin': 'auto' }} /></Button>
        )
      } else {
        avatarRotateButton = (
          <Button className='submit-button' onClick={this.rotate.bind(this)}><Icon name='redo alternate' style={{ 'margin': 'auto' }} /></Button>
        )
      }
    }

    if (this.state.preview) {
      triggerRotateButton = (
        <Button onClick={() => this.setState({ rotateAvatar: true })} className='submit-button'>Rotate</Button>
      )
    } else {
      triggerRotateButton = (
        <Button disabled className='submit-button'>Rotate</Button>
      )
    }

    if (this.state.rotateAvatar === true && this.state.preview !== null) {
      avatarPopup = (
        <div style={{ 'marginTop': '1rem', 'marginBottom': '1rem' }}>
          <Image src={this.state.preview} alt='Preview' style={{ 'height': '240px', 'margin': 'auto' }} />
          <div className='button-wrapper'>
            {avatarRotateButton}
            {avatarSubmitButton}
          </div>
        </div>
      )
    } else {
      avatarPopup = (
        <div style={{ 'marginBottom': '1rem' }}>
          <Avatar
            width={260}
            height={260}
            imageWidth={260}
            onCrop={this.onAvatarCrop}
            onClose={this.onAvatarClose}
            onBeforeFileLoad={this.onBeforeAvatarLoad}
            cropRadius={130}
            label={
              <div style={{ 'display': 'flex', 'marginTop': '8rem' }}>
                <Icon.Group>
                  <Icon name='photo' size='huge' style={{ 'color': '#d8d8d8' }} />
                  <Icon
                    corner='bottom right'
                    name='add'
                    circular
                    style={{ 'backgroundColor': '#c90c61', 'textShadow': 'none', 'color': '#ffffff' }}
                  />
                </Icon.Group>
              </div>
            }
          />
          {errorDisplay}
          <div className='button-wrapper'>
            {triggerRotateButton}
            {avatarSubmitButton}
          </div>
        </div>
      )
    }

    noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
    avatar = (
      <div style={{ 'margin': 'auto', 'display': 'table', 'marginBottom': '2rem' }} >
        <Icon.Group size='big' onClick={this.avatarFormHandler}>
          <Image src={this.state.avatar === null ? noAvatar : this.state.avatar} size='small'></Image>
          <Popup
            modal
            className='avatar-popup'
            trigger={
              <Icon
                id='add-avatar'
                corner='bottom right'
                name='pencil alternate'
                circular
                style={{ 'marginBottom': '1rem', 'backgroundColor': '#c90c61', 'textShadow': 'none', 'color': '#ffffff' }}
              />
            }
            position='top center'
            closeOnDocumentClick={true}
          >
            {avatarPopup}
          </Popup>
        </Icon.Group>
      </div>
    )

    if (this.state.displayLocationForm) {
      locationForm = (
        <>
          <Divider />
          <Form style={{ 'maxWidth': '194px' }}>
            <Dropdown
              clearable
              search
              selection
              placeholder='Select new location'
              options={LOCATION_OPTIONS}
              id='location'
              style={{ 'width': '100%' }}
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKeyLocation}
            />
            {errorDisplay}
          </Form>

          <div className='button-wrapper'>
            <Button secondary className='cancel-button' onClick={this.locationFormHandler}>Close</Button>
            {locationSubmitButton}
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    }

    if (this.state.displayPasswordForm) {
      passwordForm = (
        <>
          <Divider />
          <Form style={{ 'maxWidth': '194px' }}>
            <Form.Input
              required
              id='currentPassword'
              value={this.state.currentPassword}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Current password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='newPassword'
              value={this.state.newPassword}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='newPasswordConfirmation'
              value={this.state.newPasswordConfirmation}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password again'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <p className='small-centered-paragraph' style={{ 'marginBottom': '0' }}>
              Upon successful password change you will be redirected back to login.
            </p>
            {errorDisplay}
          </Form>

          <div className='button-wrapper'>
            <Button secondary className='cancel-button' onClick={this.passwordFormHandler}>Close</Button>
            {passwordSubmitButton}
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    }

    if (this.state.hostProfileForm === true) {
      hostProfileForm = (
        <HostProfileForm
          user_id={this.props.id}
          closeForm={this.hostProfileFormHandler.bind(this)} />
      )
    } else {
      hostProfileForm = (
        <div style={{ 'maxWidth': '300px', 'margin': 'auto' }}>
          <p className='small-centered-paragraph'>You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.</p>
          <Button id='create-host-profile-button' onClick={this.hostProfileFormHandler.bind(this)} >Create host profile</Button>
        </div>
      )
    }

    if (this.state.hostProfile.length === 1) {
      hostProfile = (
        <HostProfile
          id={this.state.hostProfile[0].id}
          closeLocPasForms={this.closeLocationAndPasswordForms.bind(this)}
          ref={this.hostProfileElement} />
      )
    } else {
      hostProfile = (
        hostProfileForm
      )
    }


    return (
      <div className='content-wrapper'>
        <Segment className='whitebox'>
          <Header as='h2'>
            Hi, {this.props.username}!
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            This is your <strong> basic </strong> profile. Here you can update your avatar, location, and password.
          </p>

          {avatar}

          <div style={{ 'margin': 'auto', 'display': 'table' }}>
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /></svg>
              &nbsp;{this.props.email}
            </p>

            <p id='user-location'>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{this.state.location}&ensp;
              <Header as='strong' id='change-location-link' onClick={this.locationFormHandler} className='fake-link-underlined'>
                Change
              </Header>
            </p>
            {locationForm}

            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z' /></svg>
              &nbsp;******&ensp;
              <Header as='strong' id='change-password-link' onClick={this.passwordFormHandler} className='fake-link-underlined'>
                Change
              </Header>
            </p>
            {passwordForm}
          </div>
        </Segment>

        <Divider hidden />
        {hostProfile}
        <Divider hidden />

        <Header id='delete-account-link' onClick={this.destroyAccount} className='fake-link-underlined' style={{ 'color': 'silver', 'marginBottom': '1rem' }} >
          Delete your account
        </Header>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar
})

export default connect(mapStateToProps)(UserPage)
