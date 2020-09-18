# Dynamic web service on Jamstack

This application demonstrates the implementation of the dynamic logic on a Jamstack web site.

Refer to [my blog post](https://tech.unifa-e.com/entry/dynamic-jamstack) for the background of this project.

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
You need to [set up FaunaDB](#set-up-faunadb) and obtain server key's secret.

### After deploy
You need to [set up Netlify Identity](#set-up-netlify-identity).

## Tutorial from scratch

### Set up Next.js

Create a project with `create-next-app` which is a boilertemplate of Next.js.

```
$ yarn create next-app dynamic-jamstack
$ cd dynamic-jamstack
$ yarn run dev
```

Access dev server at http://localhost:3000 . 

### Create a GitHub repository and push source code

```
$ git remote add origin git@github.com:xiz-kak/dynamic-jamstack.git
$ git branch -M master
$ git push -u origin master
```

Deployment to Netlify can be triggerd by `git push` to GitHub.

### Deploy to Netlify

#### Set up deploy commands

Deploy settings can be managed at Netlify's dashboard, but we also can use `netlify.toml` file.

Add a script to `package.json` .

```
# package.json

  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export” # <- Add this line.
  },
```

Create `netlify.toml` file at the root directory.

```
# netlify.toml

[build]
  command = "npm run build && npm run export"
  publish = "out"
```

#### Deploy at the Netlify web dashboard

Navigate to GitHub menu and select the target reository.

> Netlify dashboard > Site > New site from Git > GitHub

`Build command` and `Publish Directory` will be overwritten by `netlify.toml` , then leave blanks and click `Deploy site` .

Now the production site is up at the auto-generated URL.

### Set up Netlify Identity

Netlify Identity is an add-on to provide user auth features to the site.

Navigate to Identity menu and click `Enable Identity` .

> Netlify site dashboard > Identity > Enable Identity

Select prefer auth providers.

> Setting and usage > Registration > External providers

### Frontend coding

Install the official tool to use Identity features.

```
$ yarn add netlify-identity-widget
```

Frontend is composed of the following source codes.

```
dynamic-jamstack (App root)
├── pages
│   ├── index.js           // Home screen
│   └── new_message.js     // Message compose screen
├── components
│   ├── Message.js         // Display a single message
│   ├── MessageList.js     // Fetch data and dispaly list of messages
│   └── MessageForm.js     // Provide a message form and save data
└── utils
    └── netlifyAuth.js     // Auth logics using Netlify Identity
```

* `pages` directory -> Convert to static files by Next.js

* `components` directory -> React components which handle dynamic logics

`netlifyAuth.js` is an object to handle user auth by using Netlify Identity.

Refer to an official blog entry of Netlify for Identity.  
https://www.netlify.com/blog/2020/07/15/integrating-netlify-identity-into-your-next.js-apps

### Set up FaunaDB

First, create your own account at [FaunaDB](https://fauna.com/).

Create the followings at the [dashboard](https://dashboard.fauna.com/).

- Database - name: Any (as you like)
- Collection - name: `messages`
- Index - name: `all_messages` (Leave blank at Terms and Values)

Obtain the server secret (Key's Secret) after creating a new key at the SECURITY menu.

This secret will never be displayed again, so save somewhere safe.

### Netlify Functions

#### Set up build and deploy

Add the FaunaDB server secret to the environemtn variable of `FAUNADB_SERVER_SECRET` .

> Netlify site dashboard > Settings > Build & Deploy > Environment > Edit variables

Install npm packages

```
$ yarn add faunadb netlify-lambda
```

Add a script of the functions build to `package.json` .

```
# package.json

  "scripts": {
         :
    "build:functions": "netlify-lambda build functions" // <- Add this line.
  }
```

Add the functions build command and the output directory setting to `netlify.toml` .

```
# netlify.toml

[build]
  command = "npm run build && npm run export && npm run build:functions" // <- Add the functions build command.
  publish = "out"
  functions = "api" // <- Add this line.
```

#### Functions logic

Functions are composed of the following source codes.

```
dynamic-jamstack (App root)
└── functions
    ├── messages-create.js       // Save a message
    └── messages-read-all.js     // Get a list of messages
```

Refer to an official blog entry of Netlify for the data manipulation with FaunaDB.  
https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb

Refer to an official blog entry of Netlify for Identity and Functions.  
https://www.netlify.com/blog/2018/03/29/jamstack-architecture-on-netlify-how-identity-and-functions-work-together
