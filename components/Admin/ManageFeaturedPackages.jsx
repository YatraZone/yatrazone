"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UploadButton } from "@uploadthing/react"; // Import Uploadthing
import { deleteFileFromUploadthing } from "@/utils/Utapi";
import { X } from "lucide-react";

const ManageFeaturedPackages = () => {
    const [packages, setPackages] = useState([]);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        image: { url: "", key: "" }, // Storing both URL & Key
        link: "",
    });

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("/api/featured-packages");
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                toast.error("Failed to fetch packages");
            }
        };
        fetchPackages();
    }, []);

    const handleEdit = (pkg) => {
        setEditingPackage(pkg._id);
        setFormData(pkg);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingPackage
                ? `/api/featured-packages/${editingPackage}` // Update existing package
                : "/api/featured-packages"; // Create new package

            const method = editingPackage ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save package");
            }

            toast.success("Package saved successfully");
            setEditingPackage(null);
            setFormData({ title: "", image: { url: "", key: "" }, link: "" });

            // Refresh the list of packages
            const updatedPackages = await fetch("/api/featured-packages").then((res) => res.json());
            setPackages(updatedPackages);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleRemoveBanner = async (key) => {
        if (key) {
            const success = await deleteFileFromUploadthing(key);
            if (success) {
                setFormData({ ...formData, image: { url: "", key: "" } });
            }
        }
    };

    const handleDelete = async (id, imageKey) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                // Delete the image from Uploadthing first
                if (imageKey) {
                    await deleteFileFromUploadthing(imageKey);
                }

                // Then delete the package from database
                const response = await fetch(`/api/featured-packages/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete package");
                }

                toast.success("Package deleted successfully");

                // Refresh the list of packages
                const updatedPackages = await fetch("/api/featured-packages").then((res) => res.json());
                setPackages(updatedPackages);

                // If we were editing this package, clear the form
                if (editingPackage === id) {
                    setEditingPackage(null);
                    setFormData({ title: "", image: { url: "", key: "" }, link: "" });
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="p-6 mt-12 mx-auto max-w-7xl w-full ">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <Label>Title</Label>
                <Input name="title" placeholder="e.g. North India Tour Package" value={formData.title} onChange={handleChange} required />
                <Label>Link</Label>
                <Input name="link" placeholder="e.g. https://example.com/package-details" value={formData.link} onChange={handleChange} required />

                {/* Uploadthing Image Upload */}
                <Label>Upload Image</Label>
                {formData?.image?.url === "" && <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                            setFormData((prev) => ({
                                ...prev,
                                image: { url: res[0].ufsUrl, key: res[0].key }, // Storing both URL & Key
                            }));
                            toast.success("Image uploaded successfully!");
                        }
                    }}
                    onUploadError={(error) => {
                        toast.error(`Upload failed: ${error.message}`);
                    }}
                />}

                {formData?.image?.url && (
                    <div
                        className="relative aspect-video rounded-lg h-52 w-fit   overflow-hidden border-2 border-blue-600 group"
                    >
                        <Image
                            src={formData?.image?.url || 'https://dummyimage.com/600x400'}
                            alt={`Banner Preview`}
                            fill
                            sizes="100vw"
                            className={`object-contain w-full transition-opacity duration-500`}
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleRemoveBanner(formData?.image?.key)}
                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" type="submit">
                    {editingPackage ? "Update Package" : "Add Package"}
                </Button>
            </form >

            {/* Display Existing Packages */}
            < div className="mt-6" >
                <h2 className="text-xl font-bold">Existing Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {packages.map((pkg) => (
                        <div key={pkg._id} className="p-4 border rounded-lg shadow-md">
                            <Image src={pkg.image.url} alt={pkg.title} width={300} height={200} className="rounded-md" />
                            <h3 className="font-bold text-lg mt-2">{pkg.title}</h3>
                            <Button onClick={() => handleEdit(pkg)} className="mt-2 bg-blue-600 hover:bg-blue-700">
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleDelete(pkg._id, pkg.image.key)}
                                className="bg-red-600 hover:bg-red-700 ml-2"
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </div >
        </div >
    );
};

export default ManageFeaturedPackages;
