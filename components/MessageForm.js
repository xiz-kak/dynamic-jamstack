import React, { Component } from 'react'

class MessageForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      body: ''
    }

    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value.substr(0, 140) })
  }

  handleSubmit(event) {
    this.sendMessage()
    this.setState({ body: '' })
    event.preventDefault()
  }

  sendMessage() {
    const { body } = this.state

    this.generateHeaders().then((headers) => {
      fetch('/.netlify/functions/messages-create', {
        body: JSON.stringify({ body }),
        method: 'POST',
        headers
      }).then(res => {
        console.log('API response', res.json())
        this.props.onSendMessage()
      }).catch(err => {
        console.log('API error', err)
      })
    })
  }

  generateHeaders() {
    const headers = { "Content-Type": "application/json" }
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity.currentUser().jwt().then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` }
      })
    }
    return Promise.resolve(headers)
  }

  render() {
    return (
      <form className="MessageForm" onSubmit={ this.handleSubmit }>
        <textarea
          value={ this.state.body }
          placeholder={ `${ this.props.fullName }としてメッセージを投稿` }
          onChange={ this.handleBodyChange }
        />
        <input type="submit" value="送信" />

        <style jsx>{`
          .MessageForm {
            display: flex;
            flex-direction: column;
            width: 500px;
            margin: 8px 4px;
            padding-bottom: 16px;
          }

          .MessageForm textarea {
            display: flex;
            flex-direction: column;
            height: 180px;
            padding: 2px 8px;
          }

          .MessageForm input {
            border: 1px solid #ccc;
            background: white;
            padding: 4px 8px;
            border-radius: 2px;
            margin-top: 8px;
            cursor: pointer;
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,.1);
          }

          .MessageForm input:hover {
            box-shadow: 0px 2px 2px 2px rgba(0,0,0,.1);
          }
        `}</style>
      </form>
    )
  }
}

export default MessageForm
