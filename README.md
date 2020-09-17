# Dynamic web service on JAMStack

This application demonstrates the implementation of the dynamic logic on a JAMStack web site.

## Tech stack

- Static site generator - [Next.js](https://nextjs.org/)
- Source code management - [GitHub](https://github.com/)
- Hosting/CDN - [Netlify](https://www.netlify.com/)
- Database - [FaunaDB](https://fauna.com/)
- Headless CMS - N/A (This application focus on dynamic part of web service.)

## Deploy with one click

Click the [Deploy to netlify](https://app.netlify.com/start/deploy?repository=https://github.com/xiz-kak/dynamic-jamstack&stack=fauna) button.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/xiz-kak/dynamic-jamstack&stack=fauna)

### Prerequisite
You need to [set up FaunaDB](#set-up-faunadb) and obtain server secret key.

## Set up FaunaDB

First, create your own account at [FaunaDB](https://fauna.com/).

Create the followings at the [dashboard](https://dashboard.fauna.com/) of FaunaDB.

- Database - name: You can name as you like.
- Collection - name: `messages`
- Index - name: `all_messages` Leave blank at Terms and Values
