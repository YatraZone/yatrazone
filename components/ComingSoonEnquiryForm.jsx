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
      adults: form.adults.value,
      children: form.children.value,
      infants: form.infants.value,
      travelDate: form.travelDate.value,
      startFrom: form.startFrom.value,
      whichLocation: form.whichLocation.value
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
      <div className="bg-pink-300 rounded-lg p-6 mt-10 max-w-xl mx-auto text-center">
        <h3 className="font-bold text-xl mb-2">Popup Message</h3>
        <p>Thank you for your interest in Yatrazone. One of our dedicated executives will connect with you shortly to assist with your travel needs and provide personalized support. We look forward to helping you plan your perfect journey.</p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-white text-pink-500 font-semibold rounded-full shadow hover:bg-pink-100 transition"
        >
          Home
        </a>
      </div>
    );
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <input className="rounded px-4 py-2" placeholder="Name" name="name" required />
      <input className="rounded px-4 py-2" placeholder="Phone Number" name="phone" required />
      <input className="rounded px-4 py-2" placeholder="Email" name="email" required />
      <input className="rounded px-4 py-2" placeholder="Address" name="address" required />
      <input className="rounded px-4 py-2" type="number" placeholder="Adult Count" name="adults" required />
      <input className="rounded px-4 py-2" type="number" placeholder="Child Count" name="children" required />
      <input className="rounded px-4 py-2" type="number" placeholder="Infant" name="infants" required />
      <input className="rounded px-4 py-2" type="date" placeholder="Travel Date" name="travelDate" required />
      <input className="rounded px-4 py-2" placeholder="Start From" name="startFrom" required />
      <input className="rounded px-4 py-2" placeholder="Which Location" name="whichLocation" required />
      <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
        <button type="submit" className="bg-orange-500 px-8 py-2 rounded text-white font-bold" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
}
