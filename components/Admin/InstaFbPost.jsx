"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";
import { PencilIcon, Trash2Icon } from "lucide-react";

const InstaFbPost = () => {
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [postFormData, setPostFormData] = useState({
        image: { url: "", key: "" },
        link: "",
    });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/instagram-posts");
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                toast.error("Failed to fetch Instagram posts");
            }
        };
        fetchPosts();
    }, []);

    const handlePostInputChange = (e) => {
        setPostFormData({ ...postFormData, [e.target.name]: e.target.value });
    };

    const handlePostImageUpload = (uploaded) => {
        setIsUploading(false);
        if (uploaded.length > 0) {
            setPostFormData({ ...postFormData, image: { url: uploaded[0].url, key: uploaded[0].key } });
        }
    };

    const handlePostImageUploadStart = () => {
        setIsUploading(true);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postFormData.image.url) return toast.error("Please upload an image");
        if (!postFormData.link) return toast.error("Please enter a link");
        try {
            const method = editPost ? "PATCH" : "POST";
            const url = "/api/instagram-posts";
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: postFormData.image.url, link: postFormData.link, id: editPost }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Instagram post ${editPost ? "updated" : "added"} successfully`);
                setEditPost(null);
                // Refresh posts
                const updatedPosts = await fetch("/api/instagram-posts").then((res) => res.json());
                setPosts(updatedPosts);
                setPostFormData({ image: { url: "", key: "" }, link: "" });
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handlePostEdit = (post) => {
        setEditPost(post._id);
        setPostFormData({
            image: { url: post.image, key: "" },
            link: post.link,
        });
    };

    const handlePostDelete = async (id) => {
        try {
            const response = await fetch(`/api/instagram-posts`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),

            });
            console.log(response)
            const data = await response.json();
            if (response.ok) {
                toast.success("Instagram post deleted successfully");
                setPosts((prev) => prev.filter((post) => post._id !== id));
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handlePostDeleteImage = async (key) => {
        setPostFormData({ ...postFormData, image: { url: "", key: "" } });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 w-full">
            <h2 className="text-2xl font-bold mb-6">{editPost ? "Edit Instagram Post" : "Add New Instagram Post"}</h2>
            <form onSubmit={handlePostSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block font-medium mb-1">Instagram Link</label>
                    <input
                        name="link"
                        type="url"
                        value={postFormData.link}
                        onChange={handlePostInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Upload Instagram Image</label>
                    {postFormData.image.url ? (
                        <div className="relative inline-block">
                            <Image src={postFormData.image.url} alt="Instagram Preview" width={200} height={200} className="rounded shadow" />
                            <button type="button" onClick={() => handlePostDeleteImage(postFormData.image.key)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">Remove</button>
                        </div>
                    ) : (
                        <div>
                            {isUploading && <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded shadow mb-2">Uploading...</div>}
                            <UploadButton endpoint="imageUploader" onUploadBegin={handlePostImageUploadStart} onClientUploadComplete={handlePostImageUpload} />
                        </div>
                    )}
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
                    {editPost ? "Update Post" : "Add Post"}
                </button>
            </form>
            <h2 className="text-lg font-bold mb-4">Existing Instagram Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white rounded shadow p-4 flex flex-col items-center">
                            <div className="w-[150px] h-[150px] mb-2 flex items-center justify-center overflow-hidden rounded bg-gray-50">
                                <Image 
                                    src={post.image} 
                                    alt="Instagram" 
                                    width={150} 
                                    height={150} 
                                    className="object-cover w-full h-full" 
                                />
                            </div>
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all mb-2">{post.link}</a>
                            <div className="flex flex-row gap-2 mt-2">
                                <button onClick={() => handlePostEdit(post)} className="bg-gray-200 px-2 py-1 rounded flex items-center justify-center"><PencilIcon size={16} /></button>
                                <button onClick={() => handlePostDelete(post._id)} className="bg-red-600 text-white px-2 py-1 rounded flex items-center justify-center"><Trash2Icon size={16} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">No Instagram posts found</div>
                )}
            </div>
        </div>
    );
};

export default InstaFbPost;
