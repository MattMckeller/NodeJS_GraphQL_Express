import getUserId from '../utils/get-user-id';

const User = {
    email: {
        // We provide a fragment because we need the parent.id to resolve the email
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, {request}, info) {
            const userId = getUserId(request, false);

            if (parent.id === userId) {
                return parent.email;
            }

            return null;
        }
    },
    posts: {
        // We provide a fragment because we need the parent.id to resolve the email
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, {request, prisma}, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            });
        }
    }
};

export {User as default};