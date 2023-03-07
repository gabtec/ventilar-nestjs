# BACKLOG

[√] replace bcrypt with argon2id for tokens generation/signing

[√] refresh token logic not working. I bypassed with long lived accessToken, for now

[√] @authController cookiesDef has maxAge hardcoded to 1000000

[√] POST /api/users/register (after 1 admin is register the route gets unavailable)

[] TO_FIX: on new dev workspace deploy I 1st have to create a ward in database (manually), and then I can use /api/users/register to create admin user (this must be automated)
Use a temp container with plsql to run a script...

[√] exemplo com argon2 tokens
https://github.com/lujakob/nestjs-realworld-example-app/blob/master/src/user/user.service.ts

[] exemplo com testes e openApi spec
https://github.com/pvarentsov/typescript-clean-architecture/blob/master/src/application/api/http-rest/controller/MediaController.ts

[] put usersParser in a separate file as a service provider

# TESTS

[] warning: jsonwebtokens uses numbers as seconds and strings as ms
[] warning: cookies expireIn also in seconds
