"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import toast from "react-hot-toast";
import { deleteFileFromUploadthing } from "@/utils/Utapi";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
const ManageBlogs = () => {
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        subTitle: "",
        order: 1,
        image: { url: "", key: "" },
        link: "",
    });

    // Fetch banners and determine the next order number
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("/api/addBanner");
                const data = await response.json();
                setBanners(data);

                // Auto-set next order number
                if (data.length > 0) {
                    const highestOrder = Math.max(...data.map((b) => b.order));
                    setFormData((prev) => ({ ...prev, order: highestOrder + 1 }));
                }
            } catch (error) {
                toast.error("Failed to fetch banners");
            }
        };
        fetchBanners();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (uploaded) => {
        if (uploaded.length > 0) {
            setFormData({ ...formData, image: { url: uploaded[0].url, key: uploaded[0].key } });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image.url || !formData.image.key) return toast.error("Please upload an image");
        try {
            const method = editBanner ? "PATCH" : "POST";
            const response = await fetch("/api/addBanner", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: editBanner }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Banner ${editBanner ? "updated" : "added"} successfully`);
                setEditBanner(null);

                // Refresh banner list
                const updatedBanners = await fetch("/api/addBanner").then((res) => res.json());
                setBanners(updatedBanners);

                // Reset form
                setFormData({
                    title: "",
                    subTitle: "",
                    order: updatedBanners.length + 1,
                    image: { url: "", key: "" },
                    link: "",
                });
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (banner) => {
        setEditBanner(banner._id);
        console.log(banner)
        setFormData({
            title: banner.title,
            subTitle: banner.subTitle,
            order: banner.order,
            image: banner.image,
            link: banner.link,
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/addBanner", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Banner deleted successfully");

                setBanners((prev) => prev.filter((banner) => banner._id !== id));

                // Update order numbers
                const updatedBanners = await fetch("/api/addBanner").then((res) => res.json());
                setBanners(updatedBanners);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleDeleteImage = async (key) => {
        if (key) {
            await deleteFileFromUploadthing(key);
            setFormData({ ...formData, image: { url: "", key: "" } });
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 w-full">
            <h2 className="text-2xl font-bold mb-6">{editBanner ? "Edit Blog" : "Add New Blog"}</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input name="title" value={formData.title} onChange={handleInputChange} />
                </div>
                <div>
                    <Label>Short Description</Label>
                    <Input name="subTitle" value={formData.subTitle} onChange={handleInputChange} />
                </div>
                <div>
                    <Label>URL</Label>
                    <Input name="link" type="url" value={formData.link} onChange={handleInputChange} />
                </div>
                <div>
                    <Label>Date</Label>
                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
                </div>

                                  <div className="flex md:flex-row flex-col items-center md:items-end gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="packageCode" className="font-semibold">Type Name Code</label>
                                        <Input name="packageCode" className="w-32 border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold" readOnly value="" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="priceUnit" className="font-semibold">Select Role</label>
                                        <Select name="priceUnit" className="p-2 border border-gray-300 rounded-md" >
                                            <SelectTrigger className="w-52 border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent className="border-2 border-blue-600 bg-blue-100">
                                                <SelectGroup>
                                                    <SelectItem className="focus:bg-blue-300 font-bold" value="Admin">Admin</SelectItem>
                                                    <SelectItem className="focus:bg-blue-300 font-bold" value="Solo Traveller">Solo Traveller</SelectItem>
                                                    <SelectItem className="focus:bg-blue-300 font-bold" value="Group">Family Group</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                <div>
                    <Label>Upload Blog Image</Label>
                    {formData.image.url ? (
                        <div className="relative">
                            <Image src={formData.image.url} alt="Blog Preview" width={400} height={200} className="rounded-lg shadow" />
                            <Button type="button" onClick={() => { handleDeleteImage(formData.image.key) }} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs">Remove</Button>
                        </div>
                    ) : (
                        <UploadButton endpoint="imageUploader" onClientUploadComplete={handleImageUpload} />
                    )}
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                    {editBanner ? "Update Blog" : "Add Blog"}
                </Button>
            </form>

            <h2 className="text-2xl font-bold mt-10 mb-4">Existing Blogs</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Titles</TableHead>
                        <TableHead>Subtitle</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.length > 0 ? (
                        banners.map((banner) => (
                            <TableRow key={banner._id}>
                                <TableCell>{banner.title}</TableCell>
                                <TableCell>{banner.subTitle}</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-pointer">Hover to view</span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-blue-600 font-medium text-base font-barlow shadow-2xl">
                                                <p>{banner.link}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>{banner.order}</TableCell>
                                <TableCell>
                                    <Image src={banner.image.url} alt="Banner" width={100} height={50} className="rounded-lg" />
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(banner)} className="mr-2 "><PencilIcon /></Button>
                                    <Button size="icon" onClick={() => handleDelete(banner._id)} variant="destructive"><Trash2Icon /></Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="5" className="text-center py-4">No banners found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ManageBlogs;
