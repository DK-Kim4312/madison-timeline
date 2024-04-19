"use client";
import React, { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import { Post } from "@/types/Post";
import CreatePost from "./CreatePost";
import { Button } from "./ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import PostPreview from "./PostPreview";
import GuestPostPreview from "./GuestPostPreview";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const supabase = createClient();

async function fetchPosts(boardname: string): Promise<Post[]> {
    let response;
    if (boardname === "Main") {
        response = await supabase.from("posts").select().order("date", { ascending: false });
    } else {
        response = await supabase
            .from("posts")
            .select()
            .contains("board_names", [boardname])
            .order("date", { ascending: false });
    }

    const { data, error } = response;

    if (error) {
        console.log("Error fetching posts:");
        console.error(error);
        return [];
    }

    // Convert date strings to JavaScript Date objects
    const fetchedPosts = data.map((post: { date: string | number | Date  } ) => ({
        ...post,
        date: new Date(post.date),
    }));

    return fetchedPosts as Post[];
}

function BoardView({ boardname }: { boardname: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [numPosts, setNumPosts] = useState(0);
    // const [createPostModal, setCreatePostModal] = useState(false);
    const { isLoading, user } = useKindeBrowserClient();

    // Use effect to fetch posts on mount
    useEffect(() => {
        fetchPosts(boardname).then(setPosts);
        setNumPosts( posts.length );
    }, [boardname, numPosts, posts.length]);

    if (isLoading) return <div>Loading...</div>;
    return (
        <div className=" flex flex-col justify-center align-center m-10">
            <div className="h-[77vh] overflow-auto gap-3 xl:max-w-[calc(100vw-250px)] md:max-w-[calc(100vw-250px)] sm:max-w-[100vw]">
                {user
                    ? posts && posts.map((post) => <PostPreview key={post.id} post={post} user={user} numPosts={numPosts} setNumPosts={setNumPosts}/>)
                    : posts && posts.map((post) => <GuestPostPreview key={post.id} post={post} />)}
            </div>

            <div className="absolute right-5 bottom-0">
                {!user ? (
                    <div className="text-red-500">You must be logged in to post</div>
                ) : (
                    <Link href="/createPost">
                        <Button className="shadow-md mb-2">
                            Create Post
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default BoardView;
