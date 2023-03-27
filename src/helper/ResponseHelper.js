const resolveForSuccessResponseWith = (h, {
  code = 200,
  message,
  data = []
}) => {
  const response = h.response({
    status: 'success',
    message,
    data
  })
  response.type('application/json')
  response.code(code)

  return response
}

const resolveForFailedResponseWith = (h, {
  code = 404,
  message
}) => {
  const response = h.response({
    status: 'fail',
    message
  })
  response.type('application/json')
  response.code(code)

  return response
}

module.exports = {
  resolveForSuccessResponseWith,
  resolveForFailedResponseWith
}
