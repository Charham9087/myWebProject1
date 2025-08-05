"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function ContactPage({ SaveCustomerQueryToDB }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation (optional)
    const isEmpty = Object.values(form).some((value) => value.trim() === "");
    if (isEmpty) {
      alert("Please fill in all fields");
      return;
    }

    // Send to DB
    await SaveCustomerQueryToDB(form);

    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    alert("Your message has been sent!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">📞 Contact Us - A Store</h1>

      <div className="space-y-2 text-gray-700">
        <p>
          Email:{" "}
          <a href="mailto:astore3609@gmail.com" className="text-blue-600 underline">
            astore3609@gmail.com
          </a>
        </p>
        <p>
          Phone / WhatsApp:{" "}
          <a href="tel:+923304462277" className="text-blue-600 underline">
            0330-4462277
          </a>
        </p>
        <div className="flex gap-4 mt-2">
          <a href="https://facebook.com/astoreofficial" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
            <FaFacebookF size={22} />
          </a>
          <a href="https://instagram.com/astoreofficial" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
            <FaInstagram size={22} />
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">
          Want to reach us quickly? Send us a message below or contact us directly on WhatsApp!
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <Input name="phone" type="tel" placeholder="Your Phone Number" value={form.phone} onChange={handleChange} required />
          <Textarea name="message" placeholder="Your Message..." rows={4} value={form.message} onChange={handleChange} required />
          <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
