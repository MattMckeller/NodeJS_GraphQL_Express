import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/graphql-prisma/generated',
    endpoint: 'localhost:4466',
});

