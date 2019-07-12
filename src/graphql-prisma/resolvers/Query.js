import getUserId from '../utils/get-user-id';

const Query = {
    users(parent, args, {prisma}, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            };
        }

        return prisma.query.users(opArgs, info);
    },
    me(parent, args, {request, prisma}, info) {
        const userId = getUserId(request);

        return prisma.query.user({where: {id: userId}}, info);
    },
    myPosts(parent, {query}, {request, prisma}, info) {
        const userId = getUserId(request);
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        };

        if (query) {
            opArgs.where.OR = [{
                title_contains: query
            }, {
                body_contains: query
            }]
        }

        return prisma.query.posts(opArgs, info);
    },
    posts(parent, args, {prisma}, info) {
        const opArgs = {
            where: {
                published: true,
            }
        };

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parent, args, {db, prisma}, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(opArgs, info);
    },
    async post(parent, {id}, {prisma, request}, info) {
        const userId = getUserId(request, false);

        const posts = await prisma.query.posts({
            where: {
                id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info);

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0];
    }
};

export {Query as default};