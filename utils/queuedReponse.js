module.exports = (context, messages, options = {}) => {
  const limit = options.limit || 10
  const joiner = options.joiner || '\n\n'
  const queue = []

  messages.reduce((chain, message, index, arr) => {
    return chain.then(() => {
      queue.push(message)
      if (queue.length === limit || index === arr.length - 1) {
        return context.reply(queue.join(joiner), options)
          .then(() => {
            queue.splice(0)
          })
      }
    })
  }, Promise.resolve())
}
