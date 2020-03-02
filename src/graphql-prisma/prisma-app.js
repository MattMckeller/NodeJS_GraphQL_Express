import {Prisma} from 'prisma-binding';
import {fragmentReplacements} from "./resolvers";

const prisma = new Prisma({
    typeDefs: 'src/graphql-prisma/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET, // prevents users from directly accessing the endpoint w/o a token
    fragmentReplacements
});

export {prisma as default}
