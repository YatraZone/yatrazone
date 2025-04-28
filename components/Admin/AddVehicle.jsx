'use client'

import { usePackage } from "@/context/PackageContext"
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { statesIndia } from "@/lib/IndiaStates"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { NumericFormat } from "react-number-format"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import dynamic from "next/dynamic"


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { Extension } from '@tiptap/core'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  PilcrowSquare, // For paragraph
} from 'lucide-react'

// Create a FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: '16px',
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return {
            style: `font-size: ${attributes.fontSize}`
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: '16px',
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize });
      },
    }
  }
})

// Create a LineHeight extension
const LineHeight = Extension.create({
  name: 'lineHeight',

  addAttributes() {
    return {
      lineHeight: {
        default: '1.5',
        parseHTML: element => element.style.lineHeight,
        renderHTML: attributes => {
          if (!attributes.lineHeight) return {}
          return {
            style: `line-height: ${attributes.lineHeight}`
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          lineHeight: {
            default: '1.5',
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return {
                style: `line-height: ${attributes.lineHeight}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => ({ chain }) => {
        return chain().setMark('textStyle', { lineHeight });
      },
    }
  }
})

const MenuBar = ({ editor }) => {
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  if (!editor) {
    return null
  }

  const fontSizes = [
    '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
  ]

  const lineHeights = [
    '1', '1.2', '1.5', '1.8', '2', '2.5', '3'
  ]

  const handleUrlSubmit = () => {
    if (urlInput) {
      editor.chain().focus().setLink({ href: urlInput }).run();
    }
    setShowUrlPopup(false);
    setUrlInput('');
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 relative">
      {/* Text Style Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
          title="Paragraph"
        >
          <PilcrowSquare className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Formatting Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lists Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Special Formatting Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-1 border-r pr-2">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-1 rounded cursor-pointer"
          title="Text Color"
        />
      </div>

      {/* Links Group */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => setShowUrlPopup(true)}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* URL Popup Modal */}
      {showUrlPopup && (
        <div className="absolute left-1/2 top-12 -translate-x-1/2 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 flex flex-col items-center min-w-[220px]">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="url-input" className="text-sm font-medium">Enter URL</label>
            <input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="https://example.com"
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowUrlPopup(false)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="button" onClick={handleUrlSubmit} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* History Group */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Font Size Dropdown */}
      <div className="flex items-center gap-1 border-r pr-2">
        <select
          className="p-1 rounded bg-transparent border border-gray-300 hover:bg-gray-100"
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run()
            }
          }}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          <option value="">Font Size</option>
          {fontSizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Line Height Dropdown */}
      <div className="flex items-center gap-1 border-r pr-2">
        <select
          className="p-1 rounded bg-transparent border border-gray-300 hover:bg-gray-100"
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setLineHeight(e.target.value).run()
            }
          }}
          value={editor.getAttributes('textStyle').lineHeight || '1.5'}
        >
          <option value="">Line Height</option>
          {lineHeights.map(height => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const AddVehicle = () => {
    const { handleSubmit, register, getValues, setValue, reset, watch } = useForm({
        defaultValues: {
            vehiclePlan: {
                vehicleName1: "",
                vehicleName2: "",
                vehicleName3: "",
                vehiclePrice1: 0,
                vehiclePrice2: 0,
                vehiclePrice3: 0,
                pickup: {
                    state: "",
                    city: "",
                    price1: 0,
                    price2: 0,
                    price3: 0,
                },
                drop: {
                    state: "",
                    city: "",
                    price1: 0,
                    price2: 0,
                    price3: 0,
                },
                vehiclePlanDesc: "",
            },
        },
    });

    const dropState = watch("vehiclePlan.drop.state");
    const dropCity = watch("vehiclePlan.drop.city");
    const pickupState = watch("vehiclePlan.pickup.state");
    const pickupCity = watch("vehiclePlan.pickup.city");

    const packages = usePackage()
    const [selectedPickupState, setSelectedPickupState] = useState("");
    const [selectedDropState, setSelectedDropState] = useState("");
    const [selectedPickupCity, setSelectedPickupCity] = useState("");
    const [selectedDropCity, setSelectedDropCity] = useState("");
    const [cities, setCities] = useState([]);

    const [selectedPickupOptions, setSelectedPickupOptions] = useState([]);
    const [selectedDropOptions, setSelectedDropOptions] = useState([]);


      const editor = useEditor({
        extensions: [
          StarterKit,
          Underline,
          TextStyle.configure({
            types: ['textStyle']
          }),
          FontSize.configure(),
          LineHeight.configure(),
          FontFamily,
          Typography,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Link.configure({
            openOnClick: false,
          }),
          Color,
          ListItem,
        ],
        content: packages?.basicDetails?.fullDesc || '',
        onUpdate: ({ editor }) => {
          setValue('basicDetails.fullDesc', editor.getHTML())
        },
        editorProps: {
          attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
          }
        }
      })
    const handlePickupCheckboxChange = (value) => {
        setSelectedPickupOptions((prev) =>
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        );
    };
    const handleDropCheckboxChange = (value) => {
        setSelectedDropOptions((prev) =>
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        );
    };

    useEffect(() => {
        if (packages) {
            Object.entries(packages.vehiclePlan).forEach(([key, value]) => {
                setValue(`vehiclePlan.${key}`, value);
            });

            // Ensure state is updated
            setSelectedPickupState(packages?.vehiclePlan?.pickup?.state || "");
            setSelectedDropState(packages?.vehiclePlan?.drop?.state || "");
            setSelectedPickupOptions(packages?.vehiclePlan?.pickup?.vehicleType || []);
            setSelectedDropOptions(packages?.vehiclePlan?.drop?.vehicleType || []);
        }
    }, [packages]);

    // Ensure selected state is updated when form value changes
    useEffect(() => {
        if (pickupState) setSelectedPickupState(pickupState);
    }, [pickupState]);

    useEffect(() => {
        if (dropState) setSelectedDropState(dropState);
    }, [dropState]);

    useEffect(() => {
        if (pickupCity) setSelectedPickupCity(pickupCity);
    }, [pickupCity]);

    useEffect(() => {
        if (dropCity) setSelectedDropCity(dropCity);
    }, [dropCity]);

    // Fetch cities from API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("/api/admin/website-manage/addCityName");
                const res = await response.json();
                if (response.ok) {
                    setCities(res.cities);
                } else {
                    toast.error(res.message, {
                        style: { borderRadius: "10px", border: "2px solid red" },
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch cities", {
                    style: { borderRadius: "10px", border: "2px solid red" },
                });
            }
        };

        fetchCities();
    }, []);

    const onSubmit = async (data) => {
        data.pkgId = packages._id
        data.vehiclePlan.pickup.vehicleType = selectedPickupOptions;
        data.vehiclePlan.drop.vehicleType = selectedDropOptions;
        data.vehiclePlan.pickup.state = selectedPickupState;
        data.vehiclePlan.pickup.city = selectedPickupCity;
        data.vehiclePlan.drop.state = selectedDropState;
        data.vehiclePlan.drop.city = selectedDropCity;

        if (data.vehiclePlan.vehicleName1 === "" || data.vehiclePlan.vehicleName2 === "" || data.vehiclePlan.vehicleName3 === "") {
            toast.error("Vehicle Name is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }
        if (data.vehiclePlan.vehiclePrice1 === 0 || data.vehiclePlan.vehiclePrice2 === 0 || data.vehiclePlan.vehiclePrice3 === 0) {
            toast.error("Vehicle Price is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }
        if (selectedPickupState === '' || selectedPickupCity === '') {
            toast.error("Pickup State/City is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }
        if (data.vehiclePlan.pickup.price1 === 0 || data.vehiclePlan.pickup.price2 === 0 || data.vehiclePlan.pickup.price3 === 0) {
            toast.error("Pickup Price is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }
        if (selectedDropState === '' || selectedDropCity === '') {
            toast.error("Drop State/City is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }
        if (data.vehiclePlan.drop.price1 === 0 || data.vehiclePlan.drop.price2 === 0 || data.vehiclePlan.drop.price3 === 0) {
            toast.error("Drop Price is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addVehicle", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const res = await response.json()
            if (response.ok) {
                toast.success(res.message, {
                    style: {
                        border: "2px solid green",
                        borderRadius: "10px",
                    }
                })
                window.location.reload();
            } else {
                toast.error(res.message, {
                    style: {
                        border: "2px solid red",
                        borderRadius: "10px",
                    }
                })
            }
        } catch (error) {
            toast.error("Something went wrong, Please try again", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px",
                }
            })
        }

    }

    return (
        <>
            <form className="flex flex-col items-center gap-8 my-20 w-full overflow-x-auto lg:overflow-visible bg-blue-100 max-w-7xl p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl font-semibold">Add Vehicle Plan</h1>
                <Table className="w-full min-w-max lg:min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center !text-black">Category</TableHead>
                            <TableHead className="!text-black text-center">Vehicle Name</TableHead>
                            <TableHead className="!text-black text-center">Fix Vehicle Price (For Entire Trip)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border font-semibold border-yellow-500 bg-yellow-200 w-1/3">Category 1 (2-4 People)</TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <Input type="text" className="border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed"  {...register("vehiclePlan.vehicleName1")} />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.vehiclePrice1")}
                                    onValueChange={(values) => setValue("vehiclePlan.vehiclePrice1", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border font-semibold border-cyan-500 bg-cyan-200 w-1/3">Category 2 (5-7 People)</TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <Input type="text" className="border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" {...register("vehiclePlan.vehicleName2")} />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.vehiclePrice2")}
                                    onValueChange={(values) => setValue("vehiclePlan.vehiclePrice2", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border font-semibold border-orange-500 bg-orange-200 w-1/3">Category 3 (8 and Above People)</TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <Input type="text" className="border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" {...register("vehiclePlan.vehicleName3")} />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/3">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.vehiclePrice3")}
                                    onValueChange={(values) => setValue("vehiclePlan.vehiclePrice3", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <h1 className="text-4xl font-semibold mt-12">Pickup & Drop</h1>
                <Table className="w-full min-w-max lg:min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center !text-black border font-semibold border-blue-500 bg-blue-100 w-1/4">State/City</TableHead>
                            <TableHead className="!text-black text-center border font-semibold border-yellow-500 bg-yellow-200 w-1/4">Cat-1 Price</TableHead>
                            <TableHead className="!text-black text-center border font-semibold border-cyan-500 bg-cyan-200 w-1/4">Cat-2 Price</TableHead>
                            <TableHead className="!text-black text-center border font-semibold border-orange-500 bg-orange-200 w-1/4">Cat-3 Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border-l font-semibold border-blue-600 flex flex-col items-center gap-4">
                                <Label>Pickup</Label>
                                <div className="flex gap-4">
                                    <Select
                                        name="state"
                                        className="p-2 border border-gray-300 rounded-md"
                                        value={selectedPickupState}
                                        onValueChange={(value) => { setValue(`vehiclePlan.pickup.state`, value); setSelectedPickupState(value) }}
                                    >
                                        <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                            <SelectValue placeholder="Select State" className="truncate" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-blue-600 font-barlow bg-blue-100">
                                            <SelectGroup>
                                                {statesIndia.sort().map((state, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        className="focus:bg-blue-300 font-bold truncate"
                                                        value={state}
                                                    >
                                                        {state}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        name="city"
                                        className="p-2 border border-gray-300 rounded-md"
                                        value={selectedPickupCity}
                                        onValueChange={(value) => setValue(`vehiclePlan.pickup.city`, value)}
                                    >
                                        <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                            <SelectValue placeholder="Select City for Pickup" className="truncate" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-blue-600 font-barlow bg-blue-100">
                                            <SelectGroup>
                                                {cities
                                                    .filter(cityGroup => cityGroup.stateName === selectedPickupState)
                                                    .flatMap(cityGroup => cityGroup.cities.map((city, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            className="focus:bg-blue-300 font-bold truncate"
                                                            value={city}
                                                        >
                                                            {city}
                                                        </SelectItem>
                                                    )))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.pickup.price1")}
                                    onValueChange={(values) => setValue("vehiclePlan.pickup.price1", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.pickup.price2")}
                                    onValueChange={(values) => setValue("vehiclePlan.pickup.price2", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.pickup.price3")}
                                    onValueChange={(values) => setValue("vehiclePlan.pickup.price3", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} className="border font-semibold border-blue-600 w-1/4">
                                <div className="flex items-center justify-center gap-8 my-2">
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="pickupRailwayStation"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedPickupOptions.includes("Railway Station")}
                                            onCheckedChange={() => handlePickupCheckboxChange("Railway Station")}
                                        />
                                        <label htmlFor="pickupRailwayStation" className="text-sm font-medium leading-none">
                                            Railway Station
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="pickupBusStand"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedPickupOptions.includes("Bus Stand")}
                                            onCheckedChange={() => handlePickupCheckboxChange("Bus Stand")}
                                        />
                                        <label htmlFor="pickupBusStand" className="text-sm font-medium leading-none">
                                            Bus Stand
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="pickupAirport"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedPickupOptions.includes("Airport")}
                                            onCheckedChange={() => handlePickupCheckboxChange("Airport")}
                                        />
                                        <label htmlFor="pickupAirport" className="text-sm font-medium leading-none">
                                            Airport
                                        </label>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border-l font-semibold border-blue-600 flex flex-col items-center gap-4">
                                <Label>Drop</Label>
                                <div className="flex gap-4">
                                    <Select
                                        name="state"
                                        className="p-2 border border-gray-300 rounded-md"
                                        value={selectedDropState}
                                        onValueChange={(value) => { setValue(`vehiclePlan.drop.state`, value); setSelectedDropState(value) }}
                                    >
                                        <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                            <SelectValue placeholder="Select State" className="truncate" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-blue-600 font-barlow bg-blue-100">
                                            <SelectGroup>
                                                {statesIndia.sort().map((state, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        className="focus:bg-blue-300 font-bold truncate"
                                                        value={state}
                                                    >
                                                        {state}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        name="city"
                                        className="p-2 border border-gray-300 rounded-md"
                                        value={selectedDropCity}
                                        onValueChange={(value) => setValue(`vehiclePlan.drop.city`, value)}
                                    >
                                        <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                            <SelectValue placeholder="Select City for Drop" className="truncate" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-blue-600 font-barlow bg-blue-100">
                                            <SelectGroup>
                                                {cities
                                                    .filter(cityGroup => cityGroup.stateName === selectedDropState)
                                                    .flatMap(cityGroup => cityGroup.cities.map((city, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            className="focus:bg-blue-300 font-bold truncate"
                                                            value={city}
                                                        >
                                                            {city}
                                                        </SelectItem>
                                                    )))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.drop.price1")}
                                    onValueChange={(values) => setValue("vehiclePlan.drop.price1", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.drop.price2")}
                                    onValueChange={(values) => setValue("vehiclePlan.drop.price2", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                            <TableCell className="border font-semibold border-blue-600 w-1/4">
                                <NumericFormat thousandSeparator=","
                                    decimalSeparator="."
                                    prefix="₹ "
                                    value={watch("vehiclePlan.drop.price3")}
                                    onValueChange={(values) => setValue("vehiclePlan.drop.price3", values.floatValue)} className="w-full p-1.5 rounded-md bg-transparent border-2 border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-dashed" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} className="border font-semibold border-blue-600 w-1/4">
                                <div className="flex items-center justify-center gap-8 my-2">
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="dropRailwayStation"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedDropOptions.includes("Railway Station")}
                                            onCheckedChange={() => handleDropCheckboxChange("Railway Station")}
                                        />
                                        <label htmlFor="dropRailwayStation" className="text-sm font-medium leading-none">
                                            Railway Station
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="dropBusStand"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedDropOptions.includes("Bus Stand")}
                                            onCheckedChange={() => handleDropCheckboxChange("Bus Stand")}
                                        />
                                        <label htmlFor="dropBusStand" className="text-sm font-medium leading-none">
                                            Bus Stand
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2 border-2 border-blue-600 bg-blue-300 p-2 rounded-full">
                                        <Checkbox
                                            id="dropAirport"
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            checked={selectedDropOptions.includes("Airport")}
                                            onCheckedChange={() => handleDropCheckboxChange("Airport")}
                                        />
                                        <label htmlFor="dropAirport" className="text-sm font-medium leading-none">
                                            Airport
                                        </label>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="vehiclePlanDesc" className="font-semibold">Vehicle Plan Description</label>
                   <MenuBar editor={editor} />
                                    <EditorContent
                                      editor={editor}
                                      className="min-h-[100px] p-2 prose max-w-none  border border-black rounded-2"
                                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded
                hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">Save</button>
            </form>
        </>
    )
}

export default AddVehicle
