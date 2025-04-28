'use client'

import { usePackage } from "@/context/PackageContext"
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { statesIndia } from "@/lib/IndiaStates"
import toast from "react-hot-toast"
import React, { useEffect, useState } from "react"
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic"
// const Tiptap = dynamic(() => import("../TiptapEditor"), { ssr: false });
import { Label } from "../ui/label"
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
const CreatePlanType = () => {
    const { handleSubmit, register, getValues, setValue, reset, watch } = useForm()
    const packages = usePackage()

    const [plans, setPlans] = useState([]);
    const [cities, setCities] = useState([])
    const [selectedStates, setSelectedStates] = useState({});
    const [activeTab, setActiveTab] = useState('createPlan');
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(plans?.[0]?.planName);

    const handleStateChange = (value, title) => {
        setValue(`state-${title}`, value);
        setSelectedStates(prev => ({ ...prev, [title]: value }));
    };
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
    useEffect(() => {
        const fetchCities = async () => {
            const getCities = await fetch('/api/admin/website-manage/addCityName')
            const res = await getCities.json()
            setCities(res.cities)
        }
        fetchCities()
    }, [])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch("/api/admin/website-manage/addPlanType");
                const res = await response.json();
                if (response.ok) {
                    setPlans(res);
                    // Set the default plan to the first plan in the array
                    if (res.length > 0) {
                        setSelectedPlan(res[0].planName);
                    }
                } else {
                    toast.error(res.message, {
                        style: { borderRadius: "10px", border: "2px solid red" }
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch plans", {
                    style: { borderRadius: "10px", border: "2px solid red" }
                });
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        if (selectedPlan && selectedCity) {
            const plan = plans.find(plan => plan.planName === selectedPlan);
            if (plan) {
                const cityData = plan.cities.find(city => city.city === selectedCity);
                if (cityData) {
                    // If data exists for the selected city and plan, populate the form fields
                    setValue("planName", plan.planName);
                    setValue("hotelName", cityData.hotelName);
                    setValue("adultPlan", cityData.adultPlan);
                    setValue("childPlan", cityData.childPlan);
                } else {
                    // Reset fields if no data is found
                    setValue("hotelName", "");
                    setValue("adultPlan", {
                        ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    });
                    setValue("childPlan", {
                        ep: { wem: { price: 0, margin: 0 } },
                        cp: { wem: { price: 0, margin: 0 } },
                        map: { wem: { price: 0, margin: 0 } },
                        ap: { wem: { price: 0, margin: 0 } },
                    });
                }
            } else {
                // Reset fields if no plan is found
                setValue("hotelName", "");
                setValue("adultPlan", {
                    ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                });
                setValue("childPlan", {
                    ep: { wem: { price: 0, margin: 0 } },
                    cp: { wem: { price: 0, margin: 0 } },
                    map: { wem: { price: 0, margin: 0 } },
                    ap: { wem: { price: 0, margin: 0 } },
                });
            }
        }
    }, [selectedPlan, selectedCity, plans, setValue]);

    const onSubmit = async (data) => {

        const formattedData = packages.info
            .filter((info) => info.typeOfSelection === "Day Plan")
            .map((info) => ({
                day: info.selectionTitle,
                state: data[`state-${info.selectionTitle}`] || "",
                city: data[`city-${info.selectionTitle}`] || "",
            }));

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addPlanType", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pkgId: packages._id,
                    createPlanType: formattedData,
                }),
            });

            if (response.ok) {
                toast.success("Plan type created successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
                window.location.reload()
            } else {
                toast.error("Failed to create plan type", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    }

    return (
        <div className="flex flex-col items-center font-barlow bg-blue-100 w-full p-4 rounded-lg my-20">
            <div className="flex gap-4 my-4">
                <button
                    onClick={() => setActiveTab('createPlan')}
                    className={`px-4 py-2 ${activeTab === 'createPlan' ? 'text-black border-blue-600' : 'border-white'} bg-blue-300 border-2 rounded-full`}
                >
                    Create Plan
                </button>
                <button
                    onClick={() => setActiveTab('planReview')}
                    className={`px-4 py-2 ${activeTab === 'planReview' ? 'text-black border-blue-600' : 'border-white'} ${packages?.basicDetails?.planCalculator !== "No" ? '' : 'hidden'} bg-blue-300 border-2 rounded-full`}
                >
                    Plan Review
                </button>
            </div>

            {activeTab === 'createPlan' && (
                <form className="flex flex-col items-center gap-8 my-12 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-4xl font-semibold">Create Plan Type</h1>

                    {packages?.basicDetails?.planCalculator !== "No" ? (
                        <>
                            <div className="w-full overflow-x-auto lg:overflow-visible">
                                <Table className="w-full min-w-max lg:min-w-0">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center !text-black">Day</TableHead>
                                            <TableHead className="text-center !text-black">Selected City</TableHead>
                                            <TableHead className="!text-black text-center">State</TableHead>
                                            <TableHead className="!text-black text-center">City</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {packages.info
                                            .filter((infoGroup) => infoGroup.typeOfSelection === "Day Plan")
                                            .map((info) => {
                                                const savedPlan = packages?.createPlanType?.find(plan => plan.day === info.selectionTitle);
                                                const savedState = savedPlan?.state || "";
                                                const savedCity = savedPlan?.city || "";

                                                return (
                                                    <TableRow key={info._id}>
                                                        <TableCell className="border font-semibold border-blue-600">{info.selectionTitle}</TableCell>
                                                        <TableCell className="border font-semibold border-blue-600">
                                                            <p className="text-center text-gray-400">
                                                                {savedCity || "City Not Selected"}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell className="border font-semibold border-blue-600 w-52">
                                                            <Select
                                                                name="state"
                                                                className="p-2 border border-gray-300 rounded-md"
                                                                onValueChange={(value) => handleStateChange(value, info.selectionTitle)}
                                                                defaultValue={savedState}
                                                            >
                                                                <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                                                    <SelectValue placeholder="Select State" />
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
                                                        </TableCell>
                                                        <TableCell className="border font-semibold border-blue-600 w-52">
                                                            <Select
                                                                name="city"
                                                                className="p-2 border border-gray-300 rounded-md"
                                                                onValueChange={(value) => setValue(`city-${info.selectionTitle}`, value)}
                                                                defaultValue={savedCity}
                                                            >
                                                                <SelectTrigger className="border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                                                    <SelectValue placeholder="Select City" />
                                                                </SelectTrigger>
                                                                <SelectContent className="border-2 border-blue-600 bg-blue-100 font-barlow">
                                                                    <SelectGroup>
                                                                        {cities
                                                                            .filter(cityGroup => cityGroup.stateName === (selectedStates[info.selectionTitle] || savedState))
                                                                            .flatMap(cityGroup => cityGroup.cities.map((city) => (
                                                                                <SelectItem
                                                                                    key={`${selectedStates[info.selectionTitle] || savedState}-${city}`}
                                                                                    className="focus:bg-blue-300 font-bold truncate"
                                                                                    value={city}
                                                                                >
                                                                                    {city}
                                                                                </SelectItem>
                                                                            )))
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex flex-col gap-2 col-span-4">
                                <Label htmlFor="planDescription" className="font-semibold">Plan Description</Label>
                                <div className="rounded-lg border-2 border-blue-600 focus-within:border-dashed focus-within:border-blue-500">
                                    <MenuBar editor={editor} />
                                    <EditorContent
                                        editor={editor}
                                        className="min-h-[200px] p-2 prose max-w-none bg-transparent"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                                Save
                            </button>
                        </>
                    ) : (
                        <h1 className="text-4xl text-red-600 bg-red-100 border-2 border-red-500 rounded-full p-4">
                            Plan Calculator is disabled
                        </h1>
                    )}
                </form>
            )}


            {activeTab === 'planReview' && (
                <>
                    <h1 className="text-4xl my-12 font-semibold text-center">Plan Review</h1>
                    <div className="flex flex-col gap-2 w-52">
                        <Label>Select Plan Type</Label>
                        <Select onValueChange={setSelectedPlan} value={selectedPlan}>
                            <SelectTrigger className="border-2 border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-blue-600 font-barlow">
                                <SelectGroup>
                                    {plans.map((item) => (
                                        <SelectItem className="focus:bg-blue-100" key={item._id} value={item.planName}>
                                            {item.planName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full overflow-x-auto lg:overflow-visible bg-blue-100 p-4 rounded-lg">
                        <Table className="w-full min-w-max lg:min-w-0 mt-10">
                            {/* Adult Plan Table */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={9} className="text-center bg-blue-400 text-black py-2 text-lg border border-blue-600 align-middle">
                                        ADULT PLAN
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead rowSpan={2} className="w-32 text-center bg-blue-700 text-white border border-blue-600 align-middle">
                                        PAX
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-red-200 border border-red-600 !text-black">
                                        EP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-yellow-200 border border-yellow-600 !text-black">
                                        CP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-orange-200 border border-orange-600 !text-black">
                                        MAP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-cyan-200 border border-cyan-600 !text-black">
                                        AP
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.createPlanType?.map((dayPlan, index) => {
                                    const city = dayPlan.city;
                                    const day = dayPlan.day;

                                    // Find the corresponding plan data for the selected plan and city
                                    const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
                                    const cityData = selectedPlanData?.cities.find(c => c.city === city);

                                    // Default values if no plan data is found
                                    const defaultAdultPlan = {
                                        ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                    };

                                    const adultPlan = cityData?.adultPlan || defaultAdultPlan;
                                    const peopleGroups = [2, 4, 6, 8]

                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell colSpan={9} className="w-full border border-blue-600 text-center">
                                                    <p className="w-fit mx-auto border-2 border-blue-600 bg-blue-300 text-lg p-2 rounded-full">{day} - {city}</p>
                                                </TableCell>
                                            </TableRow>
                                            {peopleGroups.map((pax) => (
                                                <React.Fragment key={pax}>
                                                    <TableRow>
                                                        <TableCell className="border font-semibold border-blue-600 text-center align-middle">
                                                            {pax}
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={(adultPlan.ep.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ep.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={(adultPlan.cp.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.cp.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={(adultPlan.map.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.map.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={(adultPlan.ap.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ap.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border font-semibold border-blue-600 text-center align-middle">
                                                            Extra Mattress
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ep.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ep.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.cp.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.cp.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.map.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.map.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ap.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-blue-600">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                                value={adultPlan.ap.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <Table className="w-full min-w-max lg:min-w-0 mt-10">
                            {/* Child Plan Table */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={9} className="text-center bg-blue-400 text-black py-2 text-lg border border-blue-600 align-middle">
                                        CHILD PLAN
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead rowSpan={2} className="w-32 text-center bg-blue-700 text-white border border-blue-600 align-middle">
                                        PAX
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-red-200 border border-red-600 !text-black">
                                        EP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-yellow-200 border border-yellow-600 !text-black">
                                        CP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-orange-200 border border-orange-600 !text-black">
                                        MAP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-cyan-200 border border-cyan-600 !text-black">
                                        AP
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-blue-700 text-white border border-blue-600">
                                        Margin %
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.createPlanType?.map((dayPlan, index) => {
                                    const city = dayPlan.city;
                                    const day = dayPlan.day;

                                    // Find the corresponding plan data for the selected plan and city
                                    const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
                                    const cityData = selectedPlanData?.cities.find(c => c.city === city);

                                    // Default values if no plan data is found
                                    const defaultChildPlan = {
                                        ep: { wem: { price: 0, margin: 0 } },
                                        cp: { wem: { price: 0, margin: 0 } },
                                        map: { wem: { price: 0, margin: 0 } },
                                        ap: { wem: { price: 0, margin: 0 } },
                                    };

                                    const childPlan = cityData?.childPlan || defaultChildPlan;

                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell colSpan={9} className="w-full border border-blue-600 text-center">
                                                    <p className="w-fit mx-auto border-2 border-blue-600 bg-blue-300 text-lg p-2 rounded-full">{day} - {city}</p>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="border font-semibold border-blue-600 text-center align-middle">
                                                    1
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.ep.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.ep.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.cp.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.cp.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.map.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.map.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.ap.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-blue-600">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-blue-600"
                                                        value={childPlan.ap.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    )
}

export default CreatePlanType