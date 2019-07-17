import {Prisma} from 'prisma-binding';
import {fragmentReplacements} from "./resolvers";

const prisma = new Prisma({
    typeDefs: 'src/graphql-prisma/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET, // prevents users from directly accessing the endpoint w/o a token
    fragmentReplacements
});

export {prisma as default}

//
// const createPostForUser = async (authorId, data) => {
//     const userExists = await prismaApp.exists.User({
//         id: authorId,
//     });
//
//     if (!userExists) {
//         throw new Error('Unable to find user');
//     }
//
//     const post = await prismaApp.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ id author { id name email posts { id title } } }');
//
//     return post.author;
// };
//
// const updatePost = async (postId, data) => {
//     const postExists = await prismaApp.exists.Post({id: postId});
//
//     if (!postExists) {
//         throw new Error('Could not find post');
//     }
//
//     const post = await prismaApp.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data: {
//             ...data,
//         }
//     }, '{ id author { id name posts { id title body } } }');
//
//     return post.author;
// };

// createPostForUser("cjxkqhvxj00nm07252paz544m", {
//     title: "Node title " + Math.floor(Math.random() * 1000),
//     body: "Node body " + Math.floor(Math.random() * 1000),
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => console.log(err.message));

// updatePost("cjxnc0v4i02400763oa0zvjyd", {
//     body: "Updated body " + Math.floor(Math.random() * 1000),
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => console.log(err.message));




