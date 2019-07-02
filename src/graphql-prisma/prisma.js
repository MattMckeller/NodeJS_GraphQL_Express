import {Prisma} from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/graphql-prisma/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

// prisma.query.users(null, `{ id name email posts { id title } }`).then((data) => {
//     console.log(JSON.stringify(data, undefined, 1));
// });

// prisma.query.comments(null, `{ id text author { id name } post { id title } }`).then((data) => {
//     console.log(JSON.stringify(data));
// }).catch(e => console.log(e));

// prisma.mutation.createPost({
//     data: {
//         title: "Node title " + Math.floor(Math.random() * 1000),
//         body: "Node body " + Math.floor(Math.random() * 1000),
//         published: true,
//         author: {
//             connect: {
//                 id: "cjxkpehl7002i072531k00yl2"
//             }
//         }
//     }
// }, '{ id title body published }').then((post) => {
//     console.log(JSON.stringify(post));
//     return prisma.query.users(null, `{ id name email posts { id title body } }`);
// }).then((users) => {
//     console.log(JSON.stringify(users, undefined, 1));
// });

// prisma.mutation.updatePost({
//     where: {id: "cjxm8g5pn01y90763td5y35ey"},
//     data: {published: true}
// }, '{ id title published }').then((post) => {
//     console.log(JSON.stringify(post, undefined, 1));
//     return prisma.query.posts(null, '{ id title published }');
// }).then((posts) => {
//     console.log(JSON.stringify(posts, undefined, 1));
// });


