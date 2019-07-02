import {GraphQLServer, PubSub} from "graphql-yoga";
const fs = require('fs');
import db from './db';
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Subscription from "./resolvers/Subscription";

const pubsub = new PubSub();

// Importing it this way because for some reason my machine doesn't allow .graphql extensions to be writable
// and yoga graphql doesn't allow string reference to non .graphql file type??
const typeDefs = fs.readFileSync('./src/graphql/schema.gql', 'utf8');

const server = new GraphQLServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment,
    },
    context: {
        db,
        pubsub,
    },
});

server.start(() => {
    console.log('started server');
});
