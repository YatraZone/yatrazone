'use client'

import { usePackage } from "@/context/PackageContext"
import { useForm } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, X } from "lucide-react"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
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

    addGlobalAttributes() {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    fontSize: {
                        default: null,
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
                return chain().setMark('textStyle', { fontSize }).run();
            },
        }
    }
})

// Create a LineHeight extension
const LineHeight = Extension.create({
    name: 'lineHeight',

    addGlobalAttributes() {
        return [
            {
                types: ['paragraph', 'heading'],
                attributes: {
                    lineHeight: {
                        default: null,
                        parseHTML: element => String(element.style.lineHeight),
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
            setLineHeight: lineHeight => ({ commands }) => {
                const value = String(lineHeight)
                const paragraphUpdated = commands.updateAttributes('paragraph', { lineHeight: value })
                const headingUpdated = commands.updateAttributes('heading', { lineHeight: value })
                return paragraphUpdated || headingUpdated
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
        '0.5', '0.75', '1', '1.2', '1.5', '1.8', '2', '2.5', '3'
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
                            editor.chain().focus().setLineHeight(String(e.target.value)).run()
                        }
                    }}
                    value={editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight || '1.5'}
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

const IncludePackage = () => {
    const { handleSubmit, register, setValue, reset, watch } = useForm()
    const packages = usePackage()
    const selectedType = watch("info.typeOfSelection")

    const [editItem, setEditItem] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [editorContent, setEditorContent] = useState('');

    // Highlights state: array of { highlightName: '', highlightDesc: [''] }
    const [highlights, setHighlights] = useState([]);
    const [editHighlights, setEditHighlights] = useState([]);

    // Table state: array of { tableName: '', tableDesc: ['', ''] } (pairs of 2 columns)
    const [tableData, setTableData] = useState([]);
    const [editTableData, setEditTableData] = useState([]);

    // --- Highlight Helpers ---
    const addHighlight = (setter) => setter(prev => [...prev, { highlightName: '', highlightDesc: [''] }]);
    const removeHighlight = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
    const updateHighlightName = (setter, idx, val) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], highlightName: val }; return u; });
    const addHighlightDesc = (setter, idx) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], highlightDesc: [...u[idx].highlightDesc, ''] }; return u; });
    const removeHighlightDesc = (setter, hIdx, dIdx) => setter(prev => { const u = [...prev]; u[hIdx] = { ...u[hIdx], highlightDesc: u[hIdx].highlightDesc.filter((_, i) => i !== dIdx) }; return u; });
    const updateHighlightDesc = (setter, hIdx, dIdx, val) => setter(prev => { const u = [...prev]; const d = [...u[hIdx].highlightDesc]; d[dIdx] = val; u[hIdx] = { ...u[hIdx], highlightDesc: d }; return u; });

    // --- Table Helpers ---
    const addTableEntry = (setter) => setter(prev => [...prev, { tableName: '', tableDesc: ['', ''] }]);
    const removeTableEntry = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
    const updateTableName = (setter, idx, val) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], tableName: val }; return u; });
    const addTableRow = (setter, idx) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], tableDesc: [...u[idx].tableDesc, '', ''] }; return u; });
    const removeTableRow = (setter, tIdx, rowStart) => setter(prev => { const u = [...prev]; const d = [...u[tIdx].tableDesc]; d.splice(rowStart, 2); u[tIdx] = { ...u[tIdx], tableDesc: d }; return u; });
    const updateTableDesc = (setter, tIdx, dIdx, val) => setter(prev => { const u = [...prev]; const d = [...u[tIdx].tableDesc]; d[dIdx] = val; u[tIdx] = { ...u[tIdx], tableDesc: d }; return u; });
    const addEditor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle.configure({ types: ['textStyle'] }),
            FontSize.configure(),
            LineHeight.configure(),
            FontFamily,
            Typography,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            Color,
            ListItem,
        ],
        content: editorContent,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setEditorContent(html)
            setValue('info.selectionDesc', html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            }
        }
    });
    const editEditor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle.configure({ types: ['textStyle'] }),
            FontSize.configure(),
            LineHeight.configure(),
            FontFamily,
            Typography,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            Color,
            ListItem,
        ],
        content: editorContent,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setEditorContent(html)
            setValue('info.selectionDesc', html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            }
        }
    });

    // Get include packages data
    const includePackages = packages.includePackage || []

    useEffect(() => {
        if (isOpen && !editItem && addEditor) {
            setEditorContent('');
            setValue('info.selectionDesc', '');
            if (addEditor) addEditor.commands.setContent('');
            setHighlights([]);
            setTableData([]);
        }
    }, [isOpen, editItem, setValue]);

    useEffect(() => {
        if (editItem) {
            setEditorContent(editItem.selectionDesc || '');
            setValue('info.selectionDesc', editItem.selectionDesc || '');
            if (editEditor) editEditor.commands.setContent(editItem.selectionDesc || '');
        }
    }, [editItem, setValue]);

    const onSubmit = async (data) => {
        const includePackageData = {
            pkgId: packages._id,
            includePackage: {
                selectionHighlight: highlights.filter(h => h.highlightName.trim() !== ''),
                selectionTable: tableData.filter(t => t.tableName.trim() !== ''),
                selectionDesc: editorContent || ''
            }
        }

        if (!includePackageData.includePackage.selectionDesc) {
            toast.error("Description is required", {
                style: {
                    border: "2px solid red",
                    borderRadius: "10px"
                }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/includePackage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(includePackageData)
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Include package added successfully!", {
                    style: {
                        border: "2px solid green",
                        borderRadius: "10px"
                    }
                })
                setIsOpen(false)
                setHighlights([])
                setTableData([])
                setEditorContent('')
                if (addEditor) addEditor.commands.setContent('')
                window.location.reload()
            } else {
                toast.error(`Failed to add include package: ${res.message}`, {
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
        const includePackageData = {
            pkgId: packages._id,
            includePackage: {
                _id: editItem._id,
                selectionHighlight: editHighlights.filter(h => h.highlightName.trim() !== ''),
                selectionTable: editTableData.filter(t => t.tableName.trim() !== ''),
                selectionDesc: editorContent || ''
            }
        }

        try {
            const response = await fetch(`/api/admin/website-manage/addPackage/includePackage`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(includePackageData),
            });

            const res = await response.json();

            if (response.ok) {
                toast.success("Include package updated successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
                setEditItem(null);
                setIsOpen(false);
                setEditHighlights([]);
                setEditTableData([]);
                setEditorContent('');
                if (editEditor) editEditor.commands.setContent('');
                window.location.reload();
            } else {
                toast.error(`Failed to update include package`, { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            toast.error("Error updating include package", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setIsOpen(true);
        setEditorContent(item.selectionDesc || '');
        // Initialize highlights
        setEditHighlights(item.selectionHighlight?.length > 0
            ? item.selectionHighlight.map(h => ({ highlightName: h.highlightName || '', highlightDesc: h.highlightDesc?.length > 0 ? [...h.highlightDesc] : [''] }))
            : []);
        // Initialize table data
        setEditTableData(item.selectionTable?.length > 0
            ? item.selectionTable.map(t => ({ tableName: t.tableName || '', tableDesc: t.tableDesc?.length > 0 ? [...t.tableDesc] : ['', ''] }))
            : []);
    };

    const deleteMenuItem = async (includePackageId) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addPackage/includePackage`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, includePackageId }),
            });

            if (response.ok) {
                toast.success("Include package deleted successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
                window.location.reload();
            } else {
                toast.error("Failed to delete include package", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            console.error("Error deleting include package:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-8 my-20 font-barlow w-full bg-blue-100 max-w-5xl p-4 rounded-lg">
                <h1 className="text-4xl font-semibold">Include Packages</h1>
                <div className="w-full max-w-5xl mt-8 bg-white border-2 border-blue-400 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">{editItem ? 'Edit Include Package' : 'Add Include Package'}</h2>
                        <Button type="button" size="sm" variant="outline" onClick={() => { setIsOpen(false); setEditItem(null); setHighlights([]); setTableData([]); setEditHighlights([]); setEditTableData([]); }} className="text-red-600 border-red-600">
                            <X className="w-4 h-4 mr-1" /> Close
                        </Button>
                    </div>
                    <form onSubmit={editItem ? handleSubmit(handleUpdate) : handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">

                            {/* ===== DESCRIPTION SECTION ===== */}
                            <div className="flex flex-col gap-2 col-span-4">
                                <label htmlFor="selectionDesc" className="font-semibold">📝 Description</label>
                                <MenuBar editor={editItem ? editEditor : addEditor} />
                                <EditorContent
                                    editor={editItem ? editEditor : addEditor}
                                    className="h-[250px] overflow-y-auto min-h-[100px] p-2 prose max-w-none bg-transparent border border-black rounded-2"
                                />
                            </div>

                            {/* ===== TABLE SECTION ===== */}
                            <div className="col-span-4 border-t border-gray-300 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="font-semibold text-lg">📊 Table Data</label>
                                    <Button type="button" size="sm" onClick={() => editItem ? addTableEntry(setEditTableData) : addTableEntry(setTableData)} className="bg-green-600 hover:bg-green-500 h-8 px-3">
                                        <Plus className="w-4 h-4 mr-1" /> Add Table
                                    </Button>
                                </div>
                                {(editItem ? editTableData : tableData).map((tbl, tIdx) => (
                                    <div key={tIdx} className="mb-4 border-2 border-green-300 rounded-lg p-4 bg-green-50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Input
                                                value={tbl.tableName}
                                                onChange={(e) => editItem ? updateTableName(setEditTableData, tIdx, e.target.value) : updateTableName(setTableData, tIdx, e.target.value)}
                                                placeholder="Table Heading/Title"
                                                className="border-2 border-green-600 focus:outline-none focus-visible:ring-0 font-bold flex-1"
                                            />
                                            <Button type="button" size="icon" variant="destructive" onClick={() => editItem ? removeTableEntry(setEditTableData, tIdx) : removeTableEntry(setTableData, tIdx)} className="shrink-0 h-9 w-9">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-green-200">
                                            {Array.from({ length: Math.ceil(tbl.tableDesc.length / 2) }, (_, rowIdx) => {
                                                const colStart = rowIdx * 2;
                                                return (
                                                    <div key={rowIdx} className="flex items-center gap-3 mb-3 last:mb-0">
                                                        <div className="flex-1">
                                                            <Input
                                                                value={tbl.tableDesc[colStart] || ''}
                                                                onChange={(e) => editItem ? updateTableDesc(setEditTableData, tIdx, colStart, e.target.value) : updateTableDesc(setTableData, tIdx, colStart, e.target.value)}
                                                                placeholder="Column 1 Header"
                                                                className="border border-green-400 focus:outline-none focus-visible:ring-0 text-sm font-medium"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Input
                                                                value={tbl.tableDesc[colStart + 1] || ''}
                                                                onChange={(e) => editItem ? updateTableDesc(setEditTableData, tIdx, colStart + 1, e.target.value) : updateTableDesc(setTableData, tIdx, colStart + 1, e.target.value)}
                                                                placeholder="Column 2 Header"
                                                                className="border border-green-400 focus:outline-none focus-visible:ring-0 text-sm font-medium"
                                                            />
                                                        </div>
                                                        {tbl.tableDesc.length > 2 && (
                                                            <Button type="button" size="icon" variant="ghost" onClick={() => editItem ? removeTableRow(setEditTableData, tIdx, colStart) : removeTableRow(setTableData, tIdx, colStart)} className="shrink-0 h-8 w-8 text-red-500 hover:text-red-700">
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => editItem ? addTableRow(setEditTableData, tIdx) : addTableRow(setTableData, tIdx)} className="mt-3 text-green-600 hover:text-green-800 h-7 text-xs border border-green-600 bg-green-100">
                                            <Plus className="w-3 h-3 mr-1" /> Add Row
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* ===== HIGHLIGHTS SECTION ===== */}
                            <div className="col-span-4 border-t border-blue-300 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="font-semibold text-lg">✨ Highlights</label>
                                    <Button type="button" size="sm" onClick={() => editItem ? addHighlight(setEditHighlights) : addHighlight(setHighlights)} className="bg-blue-600 hover:bg-blue-500 h-8 px-3">
                                        <Plus className="w-4 h-4 mr-1" /> Add Highlight
                                    </Button>
                                </div>
                                {(editItem ? editHighlights : highlights).map((hl, hIdx) => (
                                    <div key={hIdx} className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Input
                                                value={hl.highlightName}
                                                onChange={(e) => editItem ? updateHighlightName(setEditHighlights, hIdx, e.target.value) : updateHighlightName(setHighlights, hIdx, e.target.value)}
                                                placeholder="Highlight Title"
                                                className="border-2 border-blue-600 focus:outline-none focus-visible:ring-0 font-bold"
                                            />
                                            <Button type="button" size="icon" variant="destructive" onClick={() => editItem ? removeHighlight(setEditHighlights, hIdx) : removeHighlight(setHighlights, hIdx)} className="shrink-0 h-9 w-9">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {hl.highlightDesc.map((desc, dIdx) => (
                                            <div key={dIdx} className="flex items-center gap-2 mb-1 ml-4">
                                                <Input
                                                    value={desc}
                                                    onChange={(e) => editItem ? updateHighlightDesc(setEditHighlights, hIdx, dIdx, e.target.value) : updateHighlightDesc(setHighlights, hIdx, dIdx, e.target.value)}
                                                    placeholder={`Point ${dIdx + 1}`}
                                                    className="border border-blue-400 focus:outline-none focus-visible:ring-0 text-sm"
                                                />
                                                {hl.highlightDesc.length > 1 && (
                                                    <Button type="button" size="icon" variant="ghost" onClick={() => editItem ? removeHighlightDesc(setEditHighlights, hIdx, dIdx) : removeHighlightDesc(setHighlights, hIdx, dIdx)} className="shrink-0 h-8 w-8 text-red-500 hover:text-red-700">
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button type="button" size="sm" variant="ghost" onClick={() => editItem ? addHighlightDesc(setEditHighlights, hIdx) : addHighlightDesc(setHighlights, hIdx)} className="ml-4 mt-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 h-7 text-xs border border-blue-600 bg-blue-100">
                                            <Plus className="w-3 h-3 mr-1" /> Add Point
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditItem(null); setHighlights([]); setTableData([]); setEditHighlights([]); setEditTableData([]); }}>
                                Cancel
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                                {editItem ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Include Packages Table */}
                <Table className="max-w-5xl mx-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center !text-black w-1/3">Description</TableHead>
                            <TableHead className="w-1/3 !text-black text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {includePackages.length > 0 ? (
                            includePackages.sort((a, b) => (a.order || 0) - (b.order || 0)).map((pkg) => (
                                <TableRow key={pkg._id} >
                                    <TableCell className="border font-semibold border-blue-600 w-5/6">
                                        <div className="truncate max-w-xs" title={pkg.selectionDesc?.substring(0, 100)}>
                                            {pkg.selectionDesc?.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                        </div>
                                    </TableCell>
                                    <TableCell className="border font-semibold border-blue-600">
                                        <div className="flex items-center justify-center gap-6">
                                            <Button size="icon" onClick={() => handleEdit(pkg)} variant="outline">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" onClick={() => deleteMenuItem(pkg._id)} variant="destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={2} className="border font-semibold border-blue-600 text-center">
                                    No Include Packages Added
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


            </div>
        </>
    )
}

export default IncludePackage