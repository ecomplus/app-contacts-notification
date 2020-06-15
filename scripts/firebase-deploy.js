require('dotenv').config()

const {
  FIREBASE_TOKEN,
  SERVER_OPERATOR_TOKEN,
  SERVER_BASE_URI,
  RECAPTCHA_KEY,
  RECAPTCHA_SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
} = process.env

require('./scripts-minification')

const { name, version } = require('../package.json')
const { project, baseUri } = require('./_constants')
const client = require('firebase-tools')

const config = [
  `pkg.version=${version}`,
  `pkg.name=${name}`,
  `server.operator_token=${SERVER_OPERATOR_TOKEN}`,
  `recaptcha.secret=${RECAPTCHA_SECRET}`,
  `recaptcha.key=${RECAPTCHA_KEY}`,
  `aws.access_key=${AWS_ACCESS_KEY_ID}`,
  `aws.secret_access=${AWS_SECRET_ACCESS_KEY}`
]
if (SERVER_BASE_URI) {
  config.push(`server.base_uri=${SERVER_BASE_URI}`)
}

client.functions.config.set(config, { project })
  .then(() => client.deploy({
    project,
    only: 'functions',
    token: FIREBASE_TOKEN,
    force: true
  }))

  .then(() => {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `\nDeployed with success to Firebase project '${project}'`
    )
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\nBase URI: ${baseUri}`
    )
    console.log()
  })

  .catch(err => {
    console.error(err)
    process.exit(1)
  })
