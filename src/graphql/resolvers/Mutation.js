import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, {data}, {db}, info) {
        const emailTaken = db.users.some((user) => user.email.toLowerCase() === data.email.toLowerCase());
        if (emailTaken) {
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidv4(),
            ...data
        };

        db.users.push(user);
        return user;
    },
    updateUser(parent, {id, data: {email, name, age}}, {db}, info) {
        const user = db.users.find((u) => u.id === id);
        if (!user) {
            throw new Error('Unable to find user');
        }

        if (typeof email === 'string') {
            const emailTaken = db.users.some((user) => user.email.toLowerCase() === email.toLowerCase());
            if (emailTaken) {
                throw new Error('Email taken.')
            }

            user.email = email;
        }

        if (typeof name === 'string') {
            user.name = name;
        }

        if (typeof age !== 'undefined') {
            user.age = age;
        }

        return user;
    },
    deleteUser(parent, {id}, {db, pubsub}, info) {
        const userIndex = db.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new Error('Unable to find user.')
        }

        const deletedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter(post => {
            const isMatch = post.author === id;
            if (isMatch) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !isMatch;
        });

        db.comments = db.comments.filter(comment => comment.author !== id);

        return deletedUser;
    },
    createPost(parent, {data}, {db}, info) {
        const userExists = db.users.some(user => user.id === data.author);
        if (!userExists) {
            throw new Error('Could not find user');
        }

        const post = {
            id: uuidv4(),
            ...data
        };

        db.posts.push(post);

        if (post.published) {
            pubsub.publish('posts', {
                post: {
                    mutation: 'CREATED',
                    data: post,
                }
            });
        }

        return post;
    },
    deletePost(parent, {id}, {db, pubsub}, info) {
        const postIndex = db.posts.findIndex((p) => p.id === id);
        if (postIndex === -1) {
            throw new Error('Could not find post');
        }

        const [post] = db.posts.splice(postIndex, 1);
        post.comments.forEach((postCommentID) => {
            db.comments = db.comments.filter((comment) => {
                return comment.id !== postCommentID
            });
        });

        if (post.published) {
            pubsub.publish('posts', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post;
    },
    updatePost(parent, {id, data: {title, body, published}}, {db: {posts}, pubsub}, info) {
        const post = posts.find((p) => p.id === id);
        const originalPost = {...post};
        if (!post) {
            throw new Error('Unable to find post');
        }

        if (typeof title === 'string') {
            post.title = title;
        }

        if (typeof body === 'string') {
            post.body = body;
        }

        if (typeof published === 'boolean') {
            post.published = published;
        }
        if (originalPost.published && !post.published) {
            pubsub.publish('posts', {
                post: {
                    mutation: 'DELETED',
                    data: originalPost
                }
            })
        } else if (!originalPost.published && post.published) {
            pubsub.publish('posts', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        } else if (post.published) {
            pubsub.publish('posts', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post;
    },
    createComment(parent, {data}, {db, pubsub}, info) {
        const userExists = db.users.some(user => user.id === data.author);
        const postExists = db.posts.some(existingPost => existingPost.id === data.post);
        if (!userExists) {
            throw new Error('Could not find user');
        }
        if (!postExists) {
            throw new Error('Could not find post');
        }
        const postIsPublished = db.posts.find(existingPost => existingPost.id === data.post).published === true;
        if (!postIsPublished) {
            throw new Error('Post is not published');
        }

        const comment = {
            id: uuidv4(),
            ...data
        };

        db.comments.push(comment);

        pubsub.publish(`comment:${data.post}`, {
            comment: {
                mutation: 'CREATE',
                data: comment,
            }
        });

        return comment;
    },
    updateComment(parent, {id, data: {text}}, {db: {comments, posts}, pubsub}, info) {
        const comment = comments.find((c) => c.id === id);
        if (!comment) {
            throw new Error('Unable to find post');
        }

        if (typeof text === 'string') {
            comment.text = text;
        }

        const post = posts.find(p => comment.post === p.id);
        if (!post) {
            throw new Error('Could not find post for comment');
        }

        pubsub.publish(`comment:${post.id}`, {
            comment: {
                mutation: 'UPDATE',
                data: comment,
            }
        });

        return comment;
    },
    deleteComment(parent, {id}, {db: {comments, posts}, pubsub}, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === id);
        if (commentIndex === -1) {
            throw new Error('Could not find comment')
        }

        const [comment] = comments.splice(commentIndex, 1);
        const post = posts.find(p => p.id === comment.post);

        pubsub.publish(`comment:${post.id}`, {
            comment: {
                mutation: 'DELETE',
                data: comment,
            }
        });

        return comment;
    }
};

export {Mutation as default};