import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth0Authorizer-function')

const jwksUrl = 'https://dev-kgmshv-f.eu.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  // 1. JWKS 
  const response = await Axios.get(jwksUrl);
  const jwkset = response['data'] // A JSON object that represents a set of JWKs
  const keys = jwkset['keys'] // JWKS is a set of keys containing the public keys that should be used to verify any JWT issued by the authorization server

  // 2. JWT from the authorization header.
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // 3. grab the kid property from the header.
  const jwtKid = jwt.header.kid
  logger.info(`JWT Kid : ${jwtKid}`)

  // 4. Find the _signature verification_ (use=sig).
  const signingKey = keys
    .filter(key => key.use === 'sig'
      && key.kty === 'RSA'
      && key.kid === jwtKid
      && ((key.x5c && key.x5c.length) || (key.n && key.e))
    ).map(key => {
      // 5. Using the x5c property build a certificate.
      return { kid: key.kid, publicKey: certToPEM(key.x5c[0]) };
    });

  if (!signingKey.length) {
    throw new Error(`The JWKS endpoint did not contain any signature verification key matching kid = ${jwtKid}`)
  }

  return verify(token, signingKey[0].publicKey, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}
