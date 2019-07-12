const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import getUserId from '../utils/get-user-id';

const Mutation = {
    async login(parent, {data: {email, password}}, {prisma}, info) {
        const user = await prisma.query.user({where: {email}});
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);

        return {
            user,
            token
        };
    },
    async createUser(parent, {data}, {prisma}, info) {
        if (data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        data.password = await bcrypt.hash(data.password, 8);

        const user = await prisma.mutation.createUser({data});
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);

        return {
            user,
            token
        }
    },
    updateUser(parent, {data}, {prisma, request}, info) {
        const userId = getUserId(request);

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data
        }, info);
    },
    deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        });
    },
    createPost(parent, {data}, {prisma, request}, info) {
        const userId = getUserId(request);
        data = {...data, author: {connect: {id: userId}}};
        return prisma.mutation.createPost({data}, info);
    },
    async deletePost(parent, {id}, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost({
            where: {id}
        }, info);
    },
    async updatePost(parent, {id, data}, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        });
        const postIsPublished = await prisma.exists.Post({
            id,
            published: true,
        });

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

        if (postIsPublished && data.published === false) {
            // delete all comments for post
            await prisma.mutation.deleteManyComments({where: {post: {id}}});
        }

        return prisma.mutation.updatePost({
            where: {
                id
            },
            data
        });
    },
    async createComment(parent, {data}, {prisma, request}, info) {
        const userId = getUserId(request);
        const postIsPublished = await prisma.exists.Post({id: data.post, published: true});

        if (!postIsPublished) {
            throw new Error('Can not comment on an unpublished post')
        }

        data = {
            ...data,
            author: {connect: {id: userId}},
            post: {connect: {id: data.post}},
        };
        return prisma.mutation.createComment({data}, info)
    },
    async updateComment(parent, {id, data}, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }

        return prisma.mutation.updateComment({
            where: {
                id
            },
            data
        }, info);
    },
    async deleteComment(parent, {id}, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({
            where: {id}
        }, info);
    }
};

export {Mutation as default};