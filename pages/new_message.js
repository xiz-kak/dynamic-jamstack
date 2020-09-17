import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import netlifyAuth from '@utils/netlifyAuth.js'
import MessageForm from '@components/MessageForm'

export default function NewMessage() {
  let [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)
  let [user, setUser] = useState(null)

  useEffect(() => {
    let isCurrent = true
    netlifyAuth.initialize((user) => {
      if (isCurrent) {
        setLoggedIn(!!user)
        setUser(user)
      }
    })

    return () => {
      isCurrent = false
    }
  }, [])

  let sendMessage = (message) => {
    const data = {
      body: message
    }

    generateHeaders().then((headers) => {
      fetch('/.netlify/functions/messages-create', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }).then(res => {
        console.log('API response', res.json())
        window.location.href = '/'
      }).catch(err => {
        console.log('API error', err)
      })
    })
  }

  let generateHeaders = () =>  {
    const headers = { "Content-Type": "application/json" };
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity.currentUser().jwt().then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      })
    }
    return Promise.resolve(headers);
  }

  return (
    <div className="container">
      <Head>
        <title>New Message</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {loggedIn ? (
          <MessageForm
            fullName={ user?.user_metadata.full_name }
            onSendMessage={ sendMessage }
          />
        ) : (
          <main>
            <p>ログインしてください</p>
            <Link href="/">
              <a>ホームに戻る</a>
            </Link>
          </main>
        )}
      </main>

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
