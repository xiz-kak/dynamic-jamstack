import faunadb from 'faunadb' /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  /* parse the string body into a useable JS object */
  const data_body = JSON.parse(event.body)
  console.log("Function `messages-create` invoked", data_body)
  /* authorize user */
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({ "error": "You must be signed in to call this function" })
    })
  }
  const data_name = { name: user.user_metadata.full_name }
  const messageItem = {
    data: { ...data_name, ...data_body }
  }
  /* construct the fauna query */
  return client.query(q.Create(q.Ref("classes/messages"), messageItem))
  .then((response) => {
    console.log("success", response)
    /* Success! return the response with statusCode 200 */
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error)
    /* Error! return the error with statusCode 400 */
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}
