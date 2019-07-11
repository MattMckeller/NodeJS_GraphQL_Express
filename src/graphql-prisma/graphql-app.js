import {GraphQLServer, PubSub} from "graphql-yoga";

const fs = require('fs');
import db from './db';

import prisma from './prisma-app';
import {resolvers} from "./resolvers";

const pubsub = new PubSub();

// Importing it this way because for some reason my machine doesn't allow .graphql extensions to be writable
// and yoga graphql doesn't allow string reference to non .graphql file type??
const typeDefs = fs.readFileSync('src/graphql-prisma/schema.gql', 'utf8');

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
});

server.start(() => {
    console.log('started server on localhost:4000');
});
