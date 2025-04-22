'use client'

import { usePackage } from "@/context/PackageContext"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "../ui/badge"

const AddInfo = () => {
  const { handleSubmit, register, setValue, reset, watch } = useForm()
  const packages = usePackage()
  const selectedType = watch("info.typeOfSelection")

  const [editItem, setEditItem] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Filter "Day Plan" info
  const dayPlanInfo = packages.info.filter(info => info.typeOfSelection === "Day Plan")
  // Filter other info
  const otherInfo = packages.info.filter(info => info.typeOfSelection !== "Day Plan")

  const onSubmit = async (data) => {
    data.pkgId = packages._id

    if (!data.info.typeOfSelection || !data.info.selectionTitle || !data.info.selectionDesc) {
      toast.error("All fields are required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
      return
    }

    const packageDuration = packages.basicDetails?.duration || 0

    // Validate Day Plan count against package duration
    if (data.info.typeOfSelection === "Day Plan" && dayPlanInfo.length >= packageDuration && !editItem) {
      toast.error(`Cannot add more Day Plans than package duration (${packageDuration} days)`, {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
      return
    }

    try {
      const response = await fetch("/api/admin/website-manage/addPackage/addInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const res = await response.json()

      if (response.ok) {
        toast.success("Info added successfully!", {
          style: {
            border: "2px solid green",
            borderRadius: "10px"
          }
        })
        window.location.reload()
      } else {
        toast.error(`Failed To Update Package: ${res.message}`, {
          style: {
            border: "2px solid red",
            borderRadius: "10px"
          }
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
    }
  }

  const handleUpdate = async (data) => {
    data.info._id = editItem._id;
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage/addInfo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pkgId: packages._id,
          info: data.info,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Info updated successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
        window.location.reload();
        setEditItem(null);
      } else {
        toast.error(`Failed to update Info`, { style: { borderRadius: "10px", border: "2px solid red" } });
      }
    } catch (error) {
      toast.error("Error updating Info", { style: { borderRadius: "10px", border: "2px solid red" } });
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setValue("info.typeOfSelection", item.typeOfSelection);
    setValue("info.selectionTitle", item.selectionTitle);
    setValue("info.selectionDesc", item.selectionDesc);
    setValue("info.order", item.order);
  };

  const deleteMenuItem = async (InfoId) => {
    const id = packages._id;
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage/addInfo`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, InfoId }),
      });

      if (response.ok) {
        toast.success("Info deleted successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
        window.location.reload();
      } else {
        toast.error("Failed to delete info", { style: { borderRadius: "10px", border: "2px solid red" } });
      }
    } catch (error) {
      console.error("Error deleting info:", error);
    }
  };

  const handleTypeChange = (value) => {
    setValue("info.typeOfSelection", value);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 my-20 font-barlow w-full bg-blue-100 max-w-5xl p-4 rounded-lg">
        <h1 className="text-4xl font-semibold">Add Info</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-500"
          onClick={() => setIsOpen(true)}
        >
          Add Info
        </Button>

        {dayPlanInfo.length >= packages?.basicDetails?.duration && (
          <div className="text-red-600 font-bold">
            Maximum Day Plans ({packages.basicDetails?.duration}) reached for this package
          </div>
        )}

        {/* Main Table for Non-Day Plan Info */}
        <Table className="max-w-5xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center !text-black w-1/3">Section</TableHead>
              <TableHead className="w-1/3 !text-black text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otherInfo.length > 0 ? (
              otherInfo.sort((a, b) => a.order - b.order).map((info) => (
                <TableRow key={info._id} >
                  <TableCell className="border font-semibold border-blue-600 w-5/6"><Badge className="py-1.5 mr-4 hover:bg-blue-600 bg-blue-500 border-2 border-blue-600">{info?.typeOfSelection}</Badge>{info?.selectionTitle}</TableCell>
                  <TableCell className="border font-semibold border-blue-600">
                    <div className="flex items-center justify-center gap-6">
                      <Button size="icon" onClick={() => handleEdit(info)} variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" onClick={() => deleteMenuItem(info._id)} variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))) : (
              <TableRow>
                <TableCell colSpan={4} className="border font-semibold border-blue-600 text-center">
                  No Info Added
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Day Plan Table */}
        <div className="w-full max-w-5xl mt-8">
          <h2 className="text-2xl font-semibold mb-4">Day Plan Details ({dayPlanInfo.length}/{packages.basicDetails?.duration})</h2>
          <Table className="max-w-5xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center !text-black w-2/3">Day</TableHead>
                <TableHead className="w-1/3 !text-black text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayPlanInfo.length > 0 ? (
                dayPlanInfo.sort((a, b) => a.order - b.order).map((info) => (
                  <TableRow key={info._id}>
                    <TableCell className="border font-semibold border-blue-600 w-5/6"><Badge className="py-1.5 mr-4 hover:bg-blue-600 bg-blue-500 border-2 border-blue-600">{info?.typeOfSelection}</Badge>{info.selectionTitle}</TableCell>
                    <TableCell className="border font-semibold border-blue-600">
                      <div className="flex items-center justify-center gap-6">
                        <Button size="icon" onClick={() => handleEdit(info)} variant="outline">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" onClick={() => deleteMenuItem(info._id)} variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="border font-semibold border-blue-600 text-center">
                    No Day Plan Added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Info Dialogs */}
        {isOpen && (
          <Dialog open={!!isOpen} onOpenChange={() => { setIsOpen(false); window.location.reload(); }}>
            <DialogContent className="md:!max-w-3xl font-barlow">
              <DialogHeader>
                <DialogTitle>Add Info</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="typeOfSelection" className="font-semibold">Type Of Selection</label>
                    <Select
                      name="typeOfSelection"
                      className="p-2 border border-gray-300 rounded-md"
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select Type Of Selection" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-blue-600 bg-blue-100">
                        <SelectGroup>
                          <SelectItem
                            className="focus:bg-blue-300 font-bold"
                            value="Day Plan"
                            disabled={dayPlanInfo.length >= packages.basicDetails?.duration && !editItem}
                          >
                            Day Plan
                          </SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Inclusions">Inclusions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Exclusions">Exclusions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Location Map">Location Map</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Policy Content">Policy Content</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Frequently Asked Questions">Frequently Asked Questions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Important Information">Important Information</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {selectedType === "Day Plan" && dayPlanInfo.length >= packages.basicDetails?.duration && !editItem && (
                      <div className="text-red-600 font-bold">
                        Maximum Day Plans ({packages.basicDetails?.duration}) reached for this package
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 col-span-3">
                    <Label>Main Title Heading</Label>
                    <Input {...register("info.selectionTitle")} className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="selectionDesc" className="font-semibold">Description</label>
                    <Textarea name="selectionDesc" rows={8} className="border-2 font-bold border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0" onChange={(e) => setValue('info.selectionDesc', e.target.value)} {...register('info.selectionDesc')} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-500"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {editItem && (
          <Dialog open={!!editItem} onOpenChange={() => { setEditItem(null); window.location.reload(); }}>
            <DialogContent className="md:!max-w-3xl font-barlow">
              <DialogHeader>
                <DialogTitle>Edit Info</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="typeOfSelection" className="font-semibold">Type Of Selection</label>
                    <Select name="typeOfSelection" className="p-2 border border-gray-300 rounded-md" defaultValue={editItem.typeOfSelection} onValueChange={handleTypeChange}>
                      <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select Type Of Selection" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-blue-600 bg-blue-100">
                        <SelectGroup>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Day Plan">Day Plan</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Inclusions">Inclusions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Exclusions">Exclusions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Location Map">Location Map</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Policy Content">Policy Content</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Frequently Asked Questions">Frequently Asked Questions</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Important Information">Important Information</SelectItem>
                          <SelectItem className="focus:bg-blue-300 font-bold" value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 col-span-3">
                    <Label>Main Title Heading</Label>
                    <Input {...register("info.selectionTitle")} className="border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="selectionDesc" className="font-semibold">Description</label>
                    <Textarea name="selectionDesc" rows={8} className="border-2 font-bold border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0" onChange={(e) => setValue('info.selectionDesc', e.target.value)} {...register('info.selectionDesc')} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-500" type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </>
  )
}

export default AddInfo