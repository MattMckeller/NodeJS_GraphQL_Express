const Subscription = {
    comment: {
        subscribe(parent, {postId}, {db: {posts}, pubsub}, info) {
            const post = posts.find((p) => p.id === postId && p.published);

            if (!post) {
                throw new Error('Unable to find post.');
            }

            return pubsub.asyncIterator(`comment:${postId}`)
        }
    },
    post: {
        subscribe(parent, args, {pubsub}, info) {
            return pubsub.asyncIterator('posts');
        }
    },
};

export {Subscription as default};