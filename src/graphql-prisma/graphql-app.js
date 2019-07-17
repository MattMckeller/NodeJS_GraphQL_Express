import '@babel/polyfill';
import {GraphQLServer, PubSub} from "graphql-yoga";
import {importSchema} from 'graphql-import'

const fs = require('fs');
import db from './db';

import prisma from './prisma-app';
import {resolvers} from "./resolvers";

const pubsub = new PubSub();

// Workaround for system issues with graphql files, and graphql-import enabled schema import statements.
const typeDefs = importSchema(fs.readFileSync('src/graphql-prisma/schema.gql', 'utf8'));

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
const port = process.env.PORT || 4000;
server.start({port}, () => {
    console.log('started server on port:' + port);
});
