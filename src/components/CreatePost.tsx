
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Post } from "@/types/Post"
import { useState } from "react"

export default function CreatePost( { posts, setPosts, boardname, user }: { posts: Post[], setPosts: (posts: Post[]) => void, boardname: string, user: any }){

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you'd also send this to your backend to store
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      title: postTitle,
      date: new Date(),
      board: boardname,
      body: postBody,
      author: user.given_name,
      authorId: user.id,
      comments: [],
    };
    console.log(newPost)
    setPosts([...posts, newPost]);
    setPostTitle('');
    setPostBody('');
};

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input id="name" placeholder="Title" onChange={(e) => setPostTitle(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <textarea id="body" placeholder="What's on your mind?" onChange={(e) => setPostBody(e.target.value)} className="h-[350px] bg-white font-lg border-none focus:outline-none ring-none"/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Post</Button>
      </CardFooter>
    </Card>
  );
}