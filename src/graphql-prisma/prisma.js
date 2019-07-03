import {Prisma} from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/graphql-prisma/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

const createPostForUser = async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id }');
    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts { id title } }');
    return user;
};

const updatePost = async (postId, data) => {
    try {
        const post = await prisma.mutation.updatePost({
            where: {
                id: postId
            },
            data: {
                ...data,
            }
        }, '{ id author { id } }');
        const user = await prisma.query.user({
            where: {
                id: post.author.id
            }
        }, '{ id name posts { id title body } }');
        return user;
    } catch (e) {
        console.log(e);
    }
};

// createPostForUser("cjxkpehl7002i072531k00yl2", {
//     title: "Node title " + Math.floor(Math.random() * 1000),
//     body: "Node body " + Math.floor(Math.random() * 1000),
//     published: true
// }).then((user) => console.log(JSON.stringify(user, undefined, 2)));

// updatePost("cjxkqz16l00z30725szihelyo", {
//     body: "Updated body " + Math.floor(Math.random() * 1000),
//     published: true
// }).then((user) => console.log(JSON.stringify(user, undefined, 2)));


