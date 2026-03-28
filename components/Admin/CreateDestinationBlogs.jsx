"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import toast from "react-hot-toast";
import { PencilIcon, Plus, Trash2Icon, UploadIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CreateDestinationBlogs = () => {
    const [hotels, setHotels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editHotel, setEditHotel] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        location: "",
        image: { url: "", key: "" },
        imageClickLink: "",
    });

    // Fetch Destination Blogs and categories on mount
    useEffect(() => {
        fetchHotels();
        fetchCategories();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await fetch("/api/createHotel");
            const data = await res.json();
            setHotels(data);
        } catch (error) {
            toast.error("Failed to fetch Destination Blogs");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/hotelCategory");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    // --- Category handlers ---
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            return toast.error("Category name is required");
        }
        try {
            const res = await fetch("/api/hotelCategory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Category created!");
                setNewCategoryName("");
                setShowCategoryDialog(false);
                fetchCategories();
            } else {
                toast.error(data.error || "Failed to create category");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    // --- Form handlers ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        try {
            const res = await fetch("/api/cloudinary", {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData((prev) => ({ ...prev, image: { url: data.url, key: data.key || "" } }));
                toast.success("Image uploaded!");
            } else {
                toast.error("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            toast.error("Upload error: " + err.message);
        }
        setUploading(false);
    };

    const handleDeleteImage = () => {
        setFormData((prev) => ({ ...prev, image: { url: "", key: "" } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category || !formData.name || !formData.location) {
            return toast.error("Category, Name, and Location are required");
        }

        try {
            const method = editHotel ? "PATCH" : "POST";
            const payload = editHotel ? { id: editHotel, ...formData } : formData;

            const res = await fetch("/api/createHotel", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Destination Blogs ${editHotel ? "updated" : "added"} successfully!`);
                resetForm();
                fetchHotels();
            } else {
                toast.error(data.error || "Failed to save Destination Blogs");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (hotel) => {
        setEditHotel(hotel._id);
        setFormData({
            category: hotel.category,
            name: hotel.name,
            location: hotel.location,
            image: hotel.image || { url: "", key: "" },
            imageClickLink: hotel.imageClickLink || "",
        });
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/createHotel", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                toast.success("Destination Blogs deleted!");
                fetchHotels();
            } else {
                toast.error("Failed to delete Destination Blogs");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const resetForm = () => {
        setEditHotel(null);
        setFormData({
            category: "",
            name: "",
            location: "",
            image: { url: "", key: "" },
            imageClickLink: "",
        });
    };

    const confirmDelete = async () => {
        if (hotelToDelete) {
            await handleDelete(hotelToDelete);
            setHotelToDelete(null);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 w-full">
            <h2 className="text-2xl font-bold mb-6">{editHotel ? "Edit Destination Blogs" : "Add New Destination Blogs"}</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                {/* Category Select + Add Button */}
                <div>
                    <Label className="block mb-2 font-bold">Category</Label>
                    <div className="flex items-center gap-2">
                        <Select value={formData.category} onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}>
                            <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 flex-1">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-blue-600 bg-blue-50 max-h-60">
                                <SelectGroup>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} className="focus:bg-blue-200 font-bold" value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            onClick={() => setShowCategoryDialog(true)}
                            className="bg-blue-600 hover:bg-blue-500 shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-1" /> New
                        </Button>
                    </div>
                </div>

                {/* Destination Blogs Image Upload */}
                <div>
                    <Label className="block mb-2 font-bold">Destination Blogs Image</Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="mb-2 flex items-center gap-2 bg-blue-500 text-white"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <span>Upload Destination Blogs Image</span>
                        <UploadIcon className="w-4 h-4" />
                    </Button>
                    {uploading && <div className="text-blue-600 font-semibold">Uploading...</div>}
                    {formData.image.url && (
                        <div className="relative w-48 h-28 border rounded overflow-hidden mb-2">
                            <Image
                                src={formData.image.url}
                                alt="Destination Blogs Image Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                                title="Remove image"
                            >
                                <Trash2Icon className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Destination Blogs Name */}
                <div>
                    <Label className="block mb-2 font-bold">Destination Blogs Name</Label>
                    <Input
                        name="name"
                        placeholder="Enter Destination Blogs name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Location */}
                <div>
                    <Label className="block mb-2 font-bold">Location</Label>
                    <Input
                        name="location"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Image Click Link */}
                <div>
                    <Label className="block mb-2 font-bold">Image Click Link</Label>
                    <Input
                        name="imageClickLink"
                        placeholder="Enter link (URL opened when image is clicked)"
                        type="url"
                        value={formData.imageClickLink}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                        {editHotel ? "Update Hotel" : "Add Hotel"}
                    </Button>
                    {editHotel && (
                        <Button type="button" variant="outline" className="bg-gray-300 hover:bg-gray-200 text-black" onClick={resetForm}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>

            {/* Destination Blogs Table */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Existing Destination Blogs</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <TableRow key={hotel._id}>
                                <TableCell className="font-semibold">{hotel.category}</TableCell>
                                <TableCell>
                                    {hotel.image?.url ? (
                                        <Image src={hotel.image.url} alt={hotel.name} width={80} height={50} className="rounded-lg object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No image</span>
                                    )}
                                </TableCell>
                                <TableCell>{hotel.name}</TableCell>
                                <TableCell>{hotel.location}</TableCell>
                                <TableCell>
                                    {hotel.imageClickLink ? (
                                        <a href={hotel.imageClickLink} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm truncate max-w-[120px] block">
                                            View Link
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(hotel)} className="mr-2">
                                        <PencilIcon className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" onClick={() => { setShowDeleteModal(true); setHotelToDelete(hotel._id); }} variant="destructive">
                                        <Trash2Icon className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center py-4">No Destination Blogs found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Destination Blogs</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this Destination Blogs?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setHotelToDelete(null); }}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Category Dialog */}
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label className="font-semibold">Category Name</Label>
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g. Luxury, Budget, Resort..."
                            className="border-2 border-blue-600 focus:outline-none focus-visible:ring-0"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => { setShowCategoryDialog(false); setNewCategoryName(""); }}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleAddCategory}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateDestinationBlogs;