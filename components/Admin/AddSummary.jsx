'use client'

import { usePackage } from "@/context/PackageContext"
import { useForm } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

const AddSummary = () => {
    const { handleSubmit, register, setValue, reset } = useForm()
    const packages = usePackage()

    const [editItem, setEditItem] = useState(null)
    const [selectedDay, setSelectedDay] = useState("")
    const [editSelectedDay, setEditSelectedDay] = useState("")

    // Dynamic description inputs for ADD form
    const [descriptions, setDescriptions] = useState([""])

    // Dynamic description inputs for EDIT form
    const [editDescriptions, setEditDescriptions] = useState([""])

    const summaries = packages.summary || []

    // Generate day options from Day 1 to Day 31
    const dayOptions = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`)

    // --- ADD form handlers ---
    const addDescriptionField = () => {
        setDescriptions(prev => [...prev, ""])
    }

    const removeDescriptionField = (index) => {
        setDescriptions(prev => prev.filter((_, i) => i !== index))
    }

    const handleDescriptionChange = (index, value) => {
        setDescriptions(prev => {
            const updated = [...prev]
            updated[index] = value
            return updated
        })
    }

    // --- EDIT form handlers ---
    const addEditDescriptionField = () => {
        setEditDescriptions(prev => [...prev, ""])
    }

    const removeEditDescriptionField = (index) => {
        setEditDescriptions(prev => prev.filter((_, i) => i !== index))
    }

    const handleEditDescriptionChange = (index, value) => {
        setEditDescriptions(prev => {
            const updated = [...prev]
            updated[index] = value
            return updated
        })
    }

    const onSubmit = async () => {
        const filteredDesc = descriptions.filter(d => d.trim() !== "")

        if (!selectedDay || filteredDesc.length === 0) {
            toast.error("Day and at least one description are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        const summary = {
            days: selectedDay,
            description: filteredDesc,
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addSummary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, summary }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Summary added successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error(`Failed to add summary: ${res.message}`, {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            toast.error("Something went wrong", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
        }
    }

    const handleEdit = (item) => {
        setEditItem(item)
        setEditSelectedDay(item.days)
        setEditDescriptions(item.description?.length > 0 ? [...item.description] : [""])
    }

    const handleUpdate = async () => {
        const filteredDesc = editDescriptions.filter(d => d.trim() !== "")

        if (!editSelectedDay || filteredDesc.length === 0) {
            toast.error("Day and at least one description are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        const summary = {
            _id: editItem._id,
            days: editSelectedDay,
            description: filteredDesc,
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addSummary", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, summary }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Summary updated successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
                setEditItem(null)
            } else {
                toast.error(`Failed to update summary: ${res.message}`, {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            toast.error("Error updating summary", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
        }
    }

    const handleDelete = async (summaryId) => {
        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addSummary", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, summaryId }),
            })

            if (response.ok) {
                toast.success("Summary deleted successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error("Failed to delete summary", {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            console.error("Error deleting summary:", error)
        }
    }

    return (
        <div className="flex flex-col items-center gap-8 my-20 font-barlow w-full bg-blue-100 max-w-5xl p-4 rounded-lg">
            <h1 className="text-4xl font-semibold">Add Summary</h1>

            {/* Add Summary Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white p-6 rounded-lg border-2 border-blue-200">
                <div className="grid grid-cols-1 gap-4">
                    {/* Day Selection */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-semibold">Day</Label>
                        <Select onValueChange={(value) => setSelectedDay(value)}>
                            <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                <SelectValue placeholder="Select Day" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-blue-600 bg-blue-100 max-h-60">
                                <SelectGroup>
                                    {dayOptions.map((day) => (
                                        <SelectItem key={day} className="focus:bg-blue-300 font-bold" value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dynamic Description Inputs */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold">Description Points</Label>
                            <Button
                                type="button"
                                size="sm"
                                onClick={addDescriptionField}
                                className="bg-blue-600 hover:bg-blue-500 h-8 px-3"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Point
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {descriptions.map((desc, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={desc}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        placeholder={`Description point ${index + 1}`}
                                        className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                                    />
                                    {descriptions.length > 1 && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => removeDescriptionField(index)}
                                            className="shrink-0 h-9 w-9"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                        Save Summary
                    </Button>
                </div>
            </form>

            {/* Summaries Table */}
            <Table className="max-w-5xl mx-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center !text-black">Day</TableHead>
                        <TableHead className="text-center !text-black">Description</TableHead>
                        <TableHead className="text-center !text-black">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {summaries.length > 0 ? (
                        summaries.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="border font-semibold border-blue-600 text-center">{item.days}</TableCell>
                                <TableCell className="border font-semibold border-blue-600">
                                    <ul className="list-disc list-inside text-sm">
                                        {item.description?.map((desc, di) => (
                                            <li key={di}>{desc}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell className="border font-semibold border-blue-600">
                                    <div className="flex items-center justify-center gap-4">
                                        <Button size="icon" onClick={() => handleEdit(item)} variant="outline">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" onClick={() => handleDelete(item._id)} variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="border font-semibold border-blue-600 text-center">
                                No Summary Added
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Edit Summary Dialog */}
            {editItem && (
                <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
                    <DialogContent className="md:!max-w-xl font-barlow">
                        <DialogHeader>
                            <DialogTitle>Edit Summary</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(handleUpdate)}>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Day Selection */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">Day</Label>
                                    <Select defaultValue={editItem.days} onValueChange={(value) => setEditSelectedDay(value)}>
                                        <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-blue-600 bg-blue-100 max-h-60">
                                            <SelectGroup>
                                                {dayOptions.map((day) => (
                                                    <SelectItem key={day} className="focus:bg-blue-300 font-bold" value={day}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Dynamic Description Inputs */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-semibold">Description Points</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={addEditDescriptionField}
                                            className="bg-blue-600 hover:bg-blue-500 h-8 px-3"
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add Point
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {editDescriptions.map((desc, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    value={desc}
                                                    onChange={(e) => handleEditDescriptionChange(index, e.target.value)}
                                                    placeholder={`Description point ${index + 1}`}
                                                    className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                                                />
                                                {editDescriptions.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeEditDescriptionField(index)}
                                                        className="shrink-0 h-9 w-9"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                                    Update Summary
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default AddSummary