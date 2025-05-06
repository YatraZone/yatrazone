"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ComingSoonEnquiryForm({ packageId }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const data = {
      packageId: packageId ? (typeof packageId === "string" ? packageId : String(packageId)) : undefined,
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      travelDate: form.travelDate.value,
      startFrom: form.startFrom.value,
      whichLocation: form.whichLocation.value,
      adults: form.adults.value,
      children: form.children.value === '' ? 0 : form.children.value,
      infants: form.infants.value === '' ? 0 : form.infants.value
    };
    const res = await fetch("/api/comingSoonEnquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
      console.log(res)
      toast.success("Enquiry submitted!");
      form.reset();
    } else {
      toast.error("Failed to submit enquiry");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-8 mt-12 max-w-lg mx-auto shadow-md animate-fade-in">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        <h2 className="font-extrabold text-3xl text-gray-800 mb-2">Thank You!</h2>
        <p className="text-gray-700 text-lg mb-6">Your enquiry has been received. Our team will contact you soon to help you plan your spiritual journey with YatraZone.</p>
        <a
          href="/"
          className="inline-block px-8 py-2 bg-green-500 text-white font-semibold rounded-full shadow hover:bg-green-600 transition"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <form className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-8 animate-fade-in" onSubmit={handleSubmit}>
      
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Enquire for this Package</h2>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Full Name</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="Enter your name" name="name" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Phone Number</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="Enter your phone number" name="phone" required />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-semibold text-gray-700">Email</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="Enter your email" name="email" required />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-semibold text-gray-700">Address</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="Enter your address" name="address" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Travel Date</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" type="date" name="travelDate" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Start From</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="City of Departure" name="startFrom" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Which Location</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" placeholder="Destination" name="whichLocation" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Adults</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" type="number" min="1" placeholder="No. of Adults" name="adults" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Children</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" type="number" min="0" placeholder="No. of Children" name="children" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Infants</label>
          <input className="rounded px-4 py-2 border border-gray-300 focus:border-orange-500 focus:outline-none" type="number" min="0" placeholder="No. of Infants" name="infants" />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button type="submit" className="bg-orange-500 px-10 py-3 rounded-full text-white font-bold text-lg shadow hover:bg-orange-600 transition-all duration-200" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
}
