import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import netlifyAuth from '@utils/netlifyAuth.js'
import MessageList from '@components/MessageList'

export default function Home({ messages }) {
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

  let login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }

  let logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }

  return (
    <div className="container">
      <Head>
        <title>メッセージ一覧</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {loggedIn ? (
          <>
            <p>{ user?.user_metadata.full_name }としてログイン中</p>
            <button className="btn-simple" onClick={ logout }>ログアウト</button>
            <Link href="/new_message">
              <p className="btn-simple">＋新規メッセージ</p>
            </Link>
          </>
        ) : (
          <button className="btn-simple" onClick={ login }>ログイン</button>
        )}
        <MessageList messages={ messages } />
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
          overflow: auto;
        }

        .btn-simple {
          border: 1px solid #ccc;
          background: white;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 2px;
          margin-top: 8px;
          cursor: pointer;
          box-shadow: 0px 2px 2px 0px rgba(0,0,0,.1);
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
