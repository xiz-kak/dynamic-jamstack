import React, { Component } from 'react'
import Message from './Message.js'

class MessageList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    fetch('/.netlify/functions/messages-read-all')
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(resJson => {
        console.log(resJson)
        if (!resJson || !resJson.length) {
          return null
        }

        const messages = resJson.reverse().map((message, i) => {
          const { data } = message
          return data
        })
        this.setState({ messages: messages})
      })
      .catch(err => {
        console.log('error:', err)
      })
  }

  render() {
    const { messages } = this.state

    return (
      <div>
        { messages && messages.length > 0 ? (
          messages.map((message, idx) => (
            <Message
              key={ idx }
              name={ message.name }
              body={ message.body }
            />
          ))
        ) : (
          <p>メッセージはありません</p>
        )}
      </div>
    )
  }
}

export default MessageList
