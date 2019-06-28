import {GraphQLServer, PubSub} from "graphql-yoga";
const fs = require('fs');
import db from './src/graphql/db';
import Query from "./src/graphql/resolvers/Query";
import Mutation from "./src/graphql/resolvers/Mutation";
import Post from "./src/graphql/resolvers/Post";
import User from "./src/graphql/resolvers/User";
import Comment from "./src/graphql/resolvers/Comment";
import Subscription from "./src/graphql/resolvers/Subscription";

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
