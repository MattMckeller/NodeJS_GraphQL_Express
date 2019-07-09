const Query = {
    users(parent, args, {prisma}, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            };
        }

        return prisma.query.users(opArgs, info);
    },
    me() {
        return {
            id: '123',
            name: 'Bob',
            email: 'adgfj@xiix.com',
        }
    },
    posts(parents, args, {prisma}, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parents, args, {db, prisma}, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(opArgs, info);
    }
};

export {Query as default};