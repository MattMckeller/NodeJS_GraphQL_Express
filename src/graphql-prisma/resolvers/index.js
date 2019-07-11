import { extractFragmentReplacements } from 'prisma-binding';
import Query from "./Query";
import Mutation from "./Mutation";
import Post from "./Post";
import User from "./User";
import Comment from "./Comment";
import Subscription from "./Subscription";

export const resolvers = {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment,
};

// extractFragmentReplacements takes in all resolvers and extracts all defined fragments,
// i.e. the one defined on user->email
export const fragmentReplacements = extractFragmentReplacements(resolvers);
