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
    createPost(parent, {data}, {prisma, request}, info) {
        const userId = getUserId(request);
        data = {...data, author: {connect: {id: userId}}};
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