import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Mail, Clock, Send } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


export default function ContactSection() {
  const [data] = useState({
    headquarters: {
      line1: "123 Innovation Drive,",
      line2: "Tech Valley, CA 94043",
      country: "United States"
    },
    email: {
      general: "hello@hubnepa.com",
      support: "support@hubnepa.com"
    },
    businessHours: {
      weekdays: "Mon - Fri: 9:00 AM - 6:00 PM",
      weekends: "Sat - Sun: 10:00 AM - 4:00 PM"
    }
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://mr-santosh-grocery-backend.onrender.com/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success(result.message || "Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-theme-bg py-24 text-theme-text">
      <div className="max-w-[1265px] mx-auto lg:px-6 px-3">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-[54px] font-medium">
            Get in Touch
          </h2>
          <p className="text-theme-muted max-w-[731px] mx-auto text-[22px] mt-6">
            Have a question or feedback? We're here to help. Reach out to our
            team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          <div className="space-y-6">
            <div className="bg-theme-surface border border-theme-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-[#0D542B33] flex items-center justify-center mb-4">
                <MapPin className="text-[#00C950]" size={20} />
              </div>
              <h3 className="font-playfair text-[20px] font-medium mb-2">Headquarters</h3>
              <p className="text-theme-muted text-base">
                {data.headquarters.line1}
                <br />
                {data.headquarters.line2}
                <br />
                {data.headquarters.country}
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-[#1D4ED833] flex items-center justify-center mb-4">
                <Mail className="text-[#60A5FA]" size={20} />
              </div>
              <h3 className="font-playfair text-[20px] font-medium mb-2">Email Us</h3>
              <p className="text-theme-muted text-base">
                General: {data.email.general}
                <br />
                Support: {data.email.support}
              </p>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-[#9333EA33] flex items-center justify-center mb-4">
                <Clock className="text-[#C084FC]" size={20} />
              </div>
              <h3 className="font-playfair text-[20px] font-medium mb-2">Business Hours</h3>
              <p className="text-theme-muted text-base">
                {data.businessHours.weekdays}
                <br />
                {data.businessHours.weekends}
              </p>
            </div>
          </div>

          <div className="bg-theme-surface border border-theme-border rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-theme-muted">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-2 h-11 bg-theme-bg border border-theme-border rounded-lg px-4 outline-none" />
                </div>

                <div>
                  <label className="text-sm text-theme-muted">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-2 h-11 bg-theme-bg border border-theme-border rounded-lg px-4 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm text-theme-muted">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-2 h-11 bg-theme-bg border border-theme-border rounded-lg px-4 outline-none" />
              </div>

              <div>
                <label className="text-sm text-theme-muted">Subject</label>
                <input name="subject" value={formData.subject} onChange={handleChange} required className="w-full mt-2 h-11 bg-theme-bg border border-theme-border rounded-lg px-4 outline-none" />
              </div>

              <div>
                <label className="text-sm text-theme-muted">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full mt-2 h-32 bg-theme-bg border border-theme-border rounded-lg px-4 py-3 outline-none" />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full h-[48px] rounded-lg bg-[#009966] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="relative">
          <div className="mt-16 rounded-xl overflow-hidden border border-theme-border relative z-0">
            <div className="h-[400px]">
              <MapContainer
                center={[37.4221, -122.0841]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[37.4221, -122.0841]} icon={icon}>
                  <Popup>HubNepa Headquarters</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
            <div className="bg-theme-surface px-8 py-6 rounded-xl border border-theme-border text-center">
              <MapPin className="mx-auto mb-2 text-[#00C950]" />
              <p className="font-playfair text-lg">Visit Our Office</p>
              <p className="text-theme-muted text-base">
                We love meeting our community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
