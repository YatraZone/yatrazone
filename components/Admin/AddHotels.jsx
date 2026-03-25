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
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

const AddHotels = () => {
    const { handleSubmit, register, setValue, reset } = useForm()
    const packages = usePackage()

    const [editItem, setEditItem] = useState(null)
    const [selectedDay, setSelectedDay] = useState("")
    const [editSelectedDay, setEditSelectedDay] = useState("")

    const hotels = packages.hotels || []

    // Generate day options from Day 1 to Day 31
    const dayOptions = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`)

    const onSubmit = async (data) => {
        const hotel = {
            days: selectedDay,
            cityName: data.cityName,
            hotelName: data.hotelName,
        }

        if (!hotel.days || !hotel.cityName || !hotel.hotelName) {
            toast.error("All fields are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotel }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Hotel added successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error(`Failed to add hotel: ${res.message}`, {
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
        setValue("editCityName", item.cityName)
        setValue("editHotelName", item.hotelName)
    }

    const handleUpdate = async (data) => {
        const hotel = {
            _id: editItem._id,
            days: editSelectedDay,
            cityName: data.editCityName,
            hotelName: data.editHotelName,
        }

        if (!hotel.days || !hotel.cityName || !hotel.hotelName) {
            toast.error("All fields are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotel }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Hotel updated successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
                setEditItem(null)
            } else {
                toast.error(`Failed to update hotel: ${res.message}`, {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            toast.error("Error updating hotel", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
        }
    }

    const handleDelete = async (hotelId) => {
        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotelId }),
            })

            if (response.ok) {
                toast.success("Hotel deleted successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error("Failed to delete hotel", {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            console.error("Error deleting hotel:", error)
        }
    }

    return (
        <div className="flex flex-col items-center gap-8 my-20 font-barlow w-full bg-blue-100 max-w-5xl p-4 rounded-lg">
            <h1 className="text-4xl font-semibold">Add Hotels</h1>

            {/* Add Hotel Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white p-6 rounded-lg border-2 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* City Name */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-semibold">City Name</Label>
                        <Input
                            {...register("cityName")}
                            placeholder="Enter city name"
                            className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                        />
                    </div>

                    {/* Hotel Name */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-semibold">Hotel Name</Label>
                        <Input
                            {...register("hotelName")}
                            placeholder="Enter hotel name"
                            className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                        Save Hotel
                    </Button>
                </div>
            </form>

            {/* Hotels Table */}
            <Table className="max-w-5xl mx-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center !text-black">Day</TableHead>
                        <TableHead className="text-center !text-black">City Name</TableHead>
                        <TableHead className="text-center !text-black">Hotel Name</TableHead>
                        <TableHead className="text-center !text-black">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <TableRow key={hotel._id}>
                                <TableCell className="border font-semibold border-blue-600 text-center">{hotel.days}</TableCell>
                                <TableCell className="border font-semibold border-blue-600 text-center">{hotel.cityName}</TableCell>
                                <TableCell className="border font-semibold border-blue-600 text-center">{hotel.hotelName}</TableCell>
                                <TableCell className="border font-semibold border-blue-600">
                                    <div className="flex items-center justify-center gap-4">
                                        <Button size="icon" onClick={() => handleEdit(hotel)} variant="outline">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" onClick={() => handleDelete(hotel._id)} variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="border font-semibold border-blue-600 text-center">
                                No Hotels Added
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Edit Hotel Dialog */}
            {editItem && (
                <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
                    <DialogContent className="md:!max-w-xl font-barlow">
                        <DialogHeader>
                            <DialogTitle>Edit Hotel</DialogTitle>
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

                                {/* City Name */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">City Name</Label>
                                    <Input
                                        {...register("editCityName")}
                                        className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                                    />
                                </div>

                                {/* Hotel Name */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">Hotel Name</Label>
                                    <Input
                                        {...register("editHotelName")}
                                        className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                                    Update Hotel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default AddHotels