const Query = {
    users(parent, args, {db}, info) {
        const {query} = args;
        if (!query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase());
        });
    },
    me() {
        return {
            id: '123',
            name: 'Bob',
            email: 'adgfj@xiix.com',
        }
    },
    post(parents, args, {db}, info) {
        const {query} = args;
        if (!query) {
            return db.posts;
        }
        return db.posts.filter(({title, body}) => {
            return title.toLowerCase().includes(query.toLowerCase())
                || body.toLowerCase().includes(query.toLowerCase());
        });
    },
    comments(parents, args, {db}, info) {
        const {query} = args;
        if (!query) {
            return db.comments;
        } else {
            return db.comments.filter(comment => comment.text.toLowerCase().includes(query.toLowerCase()));
        }
    }
};

export { Query as default };