import React, { Component } from 'react'

class Message extends Component {
  render() {
    const { name, body } = this.props

    return (
      <div className="Message">
        <div className="Message-name">From: { name }</div>
        <div className="Message-body">{ body }</div>

        <style jsx>{`
          .Message {
            border: 1px solid gray;
            margin: 12px;
            border-radius: 4px;
            width: 500px;
            background-color: #fafbfd;
            box-shadow: 1px 2px 5px 3px rgba(0,0,0,.1);
            padding: 4px 2px;
          }

          .Message-name {
            font-size: 18px;
            margin: 0 8px 4px;
            border-bottom: 1px solid #333;
            text-align: left;
            padding: 4px 8px;
          }

          .Message-body {
            word-wrap: break-word;
            padding: 8px;
          }
        `}</style>
      </div>
    )
  }
}

export default Message
