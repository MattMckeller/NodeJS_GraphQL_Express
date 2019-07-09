import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, {data}, {prisma}, info) {
        return prisma.mutation.createUser({data}, info);
    },
    updateUser(parent, {id, data}, {prisma}, info) {
        return prisma.mutation.updateUser({
            where: {
                id
            },
            data
        }, info);
    },
    deleteUser(parent, {id}, {prisma}, info) {
        return prisma.mutation.deleteUser({
            where: {
                id
            }
        });
    },
    createPost(parent, {data}, {prisma}, info) {
        data = {...data, author: {connect: {id: data.author}}};
        console.log(data);
        return prisma.mutation.createPost({data}, info);
    },
    deletePost(parent, {id}, {prisma}, info) {
        return prisma.mutation.deletePost({
            where: {id}
        }, info);
    },
    updatePost(parent, {id, data}, {prisma}, info) {
        return prisma.mutation.updatePost({
            where: {
                id
            },
            data
        });
    },
    createComment(parent, {data}, {prisma}, info) {
        data = {
            ...data,
            author: {connect: {id: data.author}},
            post: {connect: {id: data.post}},
        };
        return prisma.mutation.createComment({data}, info)
    },
    updateComment(parent, {id, data}, {prisma}, info) {
        return prisma.mutation.updateComment({
            where: {
                id
            },
            data
        }, info);
    },
    deleteComment(parent, {id}, {prisma}, info) {
        return prisma.mutation.deleteComment({
            where: {id}
        }, info);
    }
};

export {Mutation as default};