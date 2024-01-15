import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    sessionSecret: process.env.SESSION_SECRET || '123456789',
    githubOptions: process.env.GITHUB_OPTIONS,
    githubClientID: process.env.GITHUB_CLIENTID || 'testGitHub',
    githubClientSecret: process.env.GITHUB_CLIENTSECRET || 'testGitHub',
    githubCallbackURL: process.env.URLBASE+process.env.PORT+process.env.GITGUB_CALLBACKURL || 'testGitHub',
    urlBase: process.env.URLBASE+process.env.PORT+'/'
}


