// Demo data
const usersData = [{
    id: '1',
    name: 'Adam',
    email: 'adam@xiix.com',
    age: 1,
    comments: ['99', '98'],
    posts: ['10', '20']
}, {
    id: '2',
    name: 'Bob',
    email: 'bob@xiix.com',
    age: 2,
    comments: ['97'],
    posts: ['96'],
}, {
    id: '3',
    name: 'Carl',
    email: 'carl@xiix.com',
    comments: ['96'],
    posts: [],
}];

const postsData = [{
    id: '10',
    title: 'title one',
    body: 'body one a',
    published: true,
    author: '1',
    comments: ['99', '98'],
}, {
    id: '20',
    title: 'title two b',
    body: 'body two',
    published: true,
    author: '1',
    comments: ['97'],
}, {
    id: '30',
    title: 'title three c',
    body: 'body three',
    published: false,
    author: '2',
    comments: ['96'],
}];

const commentData = [{
    id: '99',
    text: 'comment text one a',
    post: '10',
    author: '1'
}, {
    id: '98',
    text: 'comment text two b',
    post: '10',
    author: '1'
}, {
    id: '97',
    text: 'comment text three c',
    post: '20',
    author: '2'
}, {
    id: '96',
    text: 'comment text four d',
    post: '30',
    author: '3'
}];

const db = {
    users: usersData,
    posts: postsData,
    comments: commentData
};

export {db as default};