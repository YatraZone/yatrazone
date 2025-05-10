"use client";

import React, { useEffect, useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ArrowDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const MenuBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [openFixedMenu, setOpenFixedMenu] = useState(null);
    const [menuItems, setMenuItems] = useState(props.menuItems || []);
    const [fixedMenuItems, setFixedMenuItems] = useState(props.fixedMenuItems || []);

    useEffect(() => {
        // Only fetch if menuItems not provided as prop
        if (!props.menuItems) {
            fetch("/api/getAllMenuItems")
                .then(res => res.json())
                .then(data => {
                    let arr = Array.isArray(data) ? data : (Array.isArray(data.packages) ? data.packages : []);
                    setMenuItems(arr.filter(item => item.active));
                });
        } else {
            setMenuItems(props.menuItems.filter(item => item.active));
        }
    }, [props.menuItems]);

    useEffect(() => {
        // Only fetch if fixedMenuItems not provided as prop
        if (!props.fixedMenuItems) {
            fetch("/api/subMenuFixed")
                .then(res => res.json())
                .then(data => {
                    let arr = Array.isArray(data) ? data : (Array.isArray(data.packages) ? data.packages : []);
                    setFixedMenuItems(arr.filter(item => item.active));
                });
        } else {
            setFixedMenuItems(props.fixedMenuItems.filter(item => item.active));
        }
    }, [props.fixedMenuItems]);

    useEffect(() => {
        const handleMenuItemsUpdated = () => {
            fetch("/api/getAllMenuItems")
                .then(res => res.json())
                .then(data => {
                    let arr = Array.isArray(data) ? data : (Array.isArray(data.packages) ? data.packages : []);
                    setMenuItems(arr.filter(item => item.active));
                });
            fetch("/api/subMenuFixed")
                .then(res => res.json())
                .then(data => {
                    let arr = Array.isArray(data) ? data : (Array.isArray(data.packages) ? data.packages : []);
                    setFixedMenuItems(arr.filter(item => item.active));
                });
        };
        window.addEventListener('menuItemsUpdated', handleMenuItemsUpdated);
        return () => {
            window.removeEventListener('menuItemsUpdated', handleMenuItemsUpdated);
        };
    }, []);

    const toggleMenu = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };
    const toggleFixedMenu = (index) => {
        setOpenFixedMenu(openFixedMenu === index ? null : index);
    };

    return (
        <>
            {/* Mobile Menu */}
            <div className="lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="text-blue-600" size={24} /> : <Menu className="text-blue-600" size={24} />}
                </button>
            </div>

            <div className={clsx(
                "absolute top-8  md:top-12 mt-4 rounded-xl left-0 w-[90vw] text-black bg-white shadow-md lg:hidden transition-all duration-300 overflow-hidden",
                isOpen ? "max-h-[500px]" : "max-h-0"
            )}>
                {menuItems.map((item, index) => (
                    <div key={index} className="border-b">
                        <button
                            onClick={() => toggleMenu(index)}
                            className="w-full text-left p-3 text-sm font-medium  hover:bg-gray-100"
                        >
                            {item.title}
                        </button>
                        <div className={clsx(
                            "transition-all duration-300 overflow-hidden",
                            openMenu === index ? "max-h-[300px]" : "max-h-0"
                        )}>
                            <ul className="pl-4 pb-2">
                                {item.subMenu
                                    .filter(sub => sub.active)
                                    .sort((a, b) => a.order - b.order)
                                    .map((subItem, subIndex) => (
                                        <li key={subIndex} className="py-1">
                                            <Link href={`/category/${subItem.url}`} className="text-sm text-gray-700 hover:text-blue-600">
                                                {subItem.title}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {fixedMenuItems.map((item, index) => (
                    <div key={index} className="border-b">
                        <button
                            onClick={() => toggleFixedMenu(index)}
                            className="w-full text-left p-3 text-sm font-medium  hover:bg-gray-100"
                        >
                            {item.catTitle}
                        </button>
                        <div className={clsx(
                            "transition-all duration-300 overflow-y-auto",
                            openFixedMenu === index ? "max-h-[300px]" : "max-h-0"
                        )}>
                            <ul className="pl-4 pb-2">
                                {item.subCat
                                    .filter(subCat => subCat.active)
                                    .map((category, idx) => (
                                        <React.Fragment key={idx}>
                                            <li className="py-1">
                                                {category.title}
                                            </li>
                                            {category.subCatPackage
                                                .filter(pkg => pkg.active)
                                                .map((subItem, subIndex) => (
                                                    <Link key={subIndex} href={`${subItem.url}`} className="flex flex-col gap-4 py-2 pl-4 text-sm text-gray-700 hover:text-blue-600">
                                                        - {subItem.title}
                                                    </Link>
                                                ))}
                                        </React.Fragment>
                                    ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu.Root className="hidden lg:flex relative justify-center" >
                <NavigationMenu.List className="flex space-x-4">
                    {menuItems.map((item, index) => (
                        <NavigationMenu.Item key={index} className="relative flex justify-center">
                            <NavigationMenu.Trigger className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-500 data-[state=open]:bg-blue-300 data-[state=open]:text-black rounded-md">
                                {item.title} <ArrowDown className="ml-2" size={12} />
                            </NavigationMenu.Trigger>
                            <AnimatePresence>
                                {item.subMenu.length > 0 && (
                                    <NavigationMenu.Content asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="absolute top-full mt-2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md w-52"
                                        >
                                            <ul className="grid gap-2 p-2 text-sm">
                                                {item.subMenu
                                                    .filter(sub => sub.active)
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            <NavigationMenu.Link asChild>
                                                                <Link
                                                                    className="block px-4 py-2 hover:bg-blue-100 rounded-md"
                                                                    href={`/category/${subItem.url}`}
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </NavigationMenu.Link>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </motion.div>
                                    </NavigationMenu.Content>
                                )}
                            </AnimatePresence>
                        </NavigationMenu.Item>
                    ))}
                    {fixedMenuItems.length > 0 && fixedMenuItems.map((cat, index) => (
                        <NavigationMenu.Item key={index} className="relative flex justify-center">
                            <NavigationMenu.Trigger className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-500 data-[state=open]:bg-blue-300 data-[state=open]:text-black rounded-md">
                                {cat.catTitle} <ArrowDown className="ml-2" size={12} />
                            </NavigationMenu.Trigger>
                            <AnimatePresence>
                                <NavigationMenu.Content asChild>
                                    {(() => {
                                        const activeSubCats = cat.subCat.filter(subCat => subCat.active);
                                        const singleCategory = activeSubCats.length === 1;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className={`absolute top-full mt-2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md ${singleCategory ? 'w-52' : 'w-[400px] lg:w-[600px]'}`}
                                            >
                                                <div className={
                                                    singleCategory
                                                        ? "flex flex-col items-start justify-center p-4"
                                                        : "grid gap-4 p-6 grid-cols-2 lg:grid-cols-3"
                                                }>
                                                    {activeSubCats.map((category, idx) => (
                                                        <div key={idx} className={singleCategory ? "flex flex-col items-start w-full" : "flex flex-col"}>
                                                            <h3 className={singleCategory ? "font-medium text-gray-700 mb-2 text-start w-full px-2" : "font-medium text-gray-700 mb-2"}>{category.title}</h3>
                                                            <ul className={singleCategory ? "space-y-1 flex flex-col items-start w-full px-2" : "space-y-2"}>
                                                                {category.subCatPackage
                                                                    .filter(pkg => pkg.active)
                                                                    .map((item, itemIdx) => (
                                                                        <li key={itemIdx} className={singleCategory ? "w-full" : undefined}>
                                                                            <Link href={item.url} className={singleCategory ? "text-gray-600 hover:text-blue-600 text-sm text-start w-full block" : "text-gray-600 hover:text-blue-600 text-sm"}>
                                                                                {item.title}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        );
                                    })()}
                                </NavigationMenu.Content>
                            </AnimatePresence>
                        </NavigationMenu.Item>
                    ))}
                </NavigationMenu.List>
            </NavigationMenu.Root>
        </>
    );
};

export default MenuBar;