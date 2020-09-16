import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = (event, context, callback) => {
  console.log("Function `messages-read-all` invoked")
  return client.query(q.Paginate(q.Match(q.Ref("indexes/all_messages"))))
  .then((response) => {
    const messageRefs = response.data
    console.log("Messages refs", messageRefs)
    console.log(`${messageRefs.length} messages found`)
    // create new query out of message refs. http://bit.ly/2LG3MLg
    const getAllMessageDataQuery = messageRefs.map((ref) => {
      return q.Get(ref)
    })
    // then query the refs
    return client.query(getAllMessageDataQuery).then((ret) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
      })
    })
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}
