import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Post } from "@/types/Post";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SelectBoards from "./SelectBoards";
import { Editor, EditorState, AtomicBlockUtils, ContentBlock} from 'draft-js';
import 'draft-js/dist/Draft.css';

export default function CreatePost({
    posts,
    setPosts,
    user,
    setter,
}: {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    user: any;
    setter: any;
}) {
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [selectedBoardname, setSelectedBoardname] = useState<string[]>([]);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if( selectedBoardname.length === 0) {
            alert("Please select a board");
            return;
        }
        
        const newPost: Post = {
            id: uuidv4(),
            title: postTitle,
            date: new Date(),
            board_names: selectedBoardname,
            body: postBody,
            likes: 0,
            dislikes: 0,
            views: 0,
            author_id: user.id,
            liked_users: [],
            disliked_users: [],
        };

        const response = await fetch("/api/createPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
        });

        if (response.ok) {
            const createPostResponse = await response.json();
            const postData = createPostResponse.post;

            // Convert the date string to a Date object
            if (postData && postData.date) {
                postData.date = new Date(postData.date);
            }

            setPosts([...posts, postData]);
        } else {
            // Handle errors
            console.error("Failed to create post");
        }

        setPostTitle("");
        setPostBody("");
        setter(false); // Close the modal
    };

    const handleCancel = () => {
        window.history.back(); // Navigate back to the previous page
    };

    const handlePastedImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string; // Use type assertion to treat result as string
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(
                editorState,
                { currentContent: contentStateWithEntity }
            );
            setEditorState(
                AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
            );
        };
        reader.readAsDataURL(file);
    };

    const handlePastedContent = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handlePastedImage(file);
                }
            }
        }
    };

    const handleDropContent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.indexOf('image') !== -1) {
            handlePastedImage(file);
        }
    };

    const blockRenderer = (contentBlock: ContentBlock) => {
        if (contentBlock.getType() === 'atomic') {
            const contentState = editorState.getCurrentContent();
            const entityKey = contentBlock.getEntityAt(0);
            if (entityKey) {
                const entity = contentState.getEntity(entityKey);
                const entityType = entity.getType();
                if (entityType === 'IMAGE') {
                    const data = entity.getData();
                    const src = data.src;
                    const alt = data.alt;
                    return {
                        component: ImageBlock,
                        editable: false,
                        props: {
                            src,
                            alt,
                        },
                    };
                }
            }
        }
    };
    
    const ImageBlock = (props: { src: string }) => {
        return <img src={props.src} alt="Embedded" />;
    };

    return (
        <Card className="w-[1000px]">
            <CardHeader>
                <CardTitle>Create Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="boardname">Board</Label>
                            <SelectBoards
                                boardnames={selectedBoardname}
                                setBoardnames={setSelectedBoardname}
                            />
                            <Label htmlFor="name">Title</Label>
                            <Input id="name" placeholder="Title" onChange={(e) => setPostTitle(e.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            {/* <textarea
                                id="body"
                                placeholder="What's on your mind?"
                                onChange={(e) => setPostBody(e.target.value)}
                                className="p-2 h-[350px] bg-white font-lg border border-border rounded-md focus:outline-none ring-none"
                            /> */}
                            <div
                                onPaste={handlePastedContent}
                                onDrop={handleDropContent}
                                style={{ border: '1px solid #ccc', minHeight: '100px' }}
                            >
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                    placeholder="Write your post here..."
                                    blockRendererFn={blockRenderer}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Post</Button>
            </CardFooter>
        </Card>
    );
}
