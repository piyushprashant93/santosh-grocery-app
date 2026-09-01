import { Search, Filter, Calendar, Download, Mail, MapPin, MoreHorizontal, Users, Star, ThumbsUp } from "lucide-react"
import { useState, useEffect } from "react"
import EmptyTableState from "../../components/common/EmptyTableState"

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

const stats = [
    { value: "4.8", label: "Average Rating", stars: true },
    { value: "128", label: "Total Reviews" },
    { value: "96%", label: "Positive Feedback" }
]

const reviews = [
    {
        name: "Alex Morgan",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        product: "Organic Whole Milk",
        rating: 5,
        message: "Absolutely love the fresh produce! The delivery was super fast too.",
        helpful: 12,
        time: "2 days ago"
    },
    {
        name: "Sarah Smith",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        product: "Artisan Sourdough Bread",
        rating: 4,
        message: "Great quality, but the packaging could be better.",
        helpful: 5,
        time: "1 week ago"
    },
    {
        name: "James Doe",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
        product: "Artisan Sourdough Bread",
        rating: 2,
        message: "Bread was a bit stale when it arrived.",
        helpful: 2,
        time: "3 weeks ago"
    }
]



const statusStyles: any = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-200 text-gray-600",
    New: "bg-blue-100 text-blue-700"
}

export default function CustomersandReviews() {

    const [tab, setTab] = useState("customers");
    const [customersData, setCustomersData] = useState<any[]>([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch(`${API_BASE}/retailer/customers`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    const payload = data.data || data;
                    const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.customers) ? payload.customers : (payload.users || []));
                    setCustomersData(Array.isArray(arr) ? arr : []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div className="space-y-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h1 className="lg:text-[34px] text-3xl font-playfair font-semibold">
                        Customers & Reviews
                    </h1>

                    <p className="text-[#6A7282] mt-2 lg:text-[18px] text-base">
                        Manage your customer relationships and monitor feedback.
                    </p>
                </div>

                <div className="flex gap-3">

                    <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white shadow-sm">
                        <Download size={16} />
                        Export CSV
                    </button>

                    <button className="flex items-center gap-2 bg-[#F54900] text-white rounded-lg px-4 py-2 shadow-sm">
                        <Mail size={16} />
                        Email All
                    </button>

                </div>

            </div>



            <div className="flex gap-2 bg-[#F1F5F9] rounded-xl p-1 w-fit">

                <button
                    onClick={() => setTab("customers")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${tab === "customers"
                            ? "bg-white shadow text-[#111827]"
                            : "text-[#6A7282]"
                        }`}
                >
                    <Users size={16} />
                    Customers List
                </button>

                <button
                    onClick={() => setTab("reviews")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${tab === "reviews"
                            ? "bg-white shadow text-[#111827]"
                            : "text-[#6A7282]"
                        }`}
                >
                    <Star size={16} />
                    Reviews & Ratings
                </button>

            </div>



            {tab === "customers" &&
                <div className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                        <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 w-full lg:w-[300px]">
                            <Search size={18} className="text-[#6A7282]" />
                            <input
                                placeholder="Search by name, email..."
                                className="w-full px-3 py-2 outline-none text-sm"
                            />
                        </div>

                        <div className="flex gap-3">

                            <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 shadow-sm bg-white">
                                <Filter size={16} />
                                Status
                            </button>

                            <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 shadow-sm bg-white">
                                <Calendar size={16} />
                                Date Joined
                            </button>

                        </div>

                    </div>



                    <div className="overflow-x-auto">

                        <table className="w-full text-left min-w-[950px]">

                            <thead className="border-b text-[#6A7282] text-sm">

                                <tr>

                                    <th className="py-3 min-w-6">
                                        <input type="checkbox" className="accent-[#F54900] cursor-pointer" />
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        CUSTOMER
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        STATUS
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        LOCATION
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        ORDERS
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        TOTAL SPENT
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E]">
                                        JOINED
                                    </th>

                                    <th className="py-3 text-sm font-medium text-[#62748E] text-center">
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>



                            <tbody>

                                {customersData.map((c, i) => (

                                    <tr key={c._id || i} className="border-b last:border-none">

                                        <td className="py-4">
                                            <input type="checkbox" className="accent-[#F54900] cursor-pointer" />
                                        </td>

                                        <td className="py-4">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={c.avatar || c.profilePicture || "https://images.unsplash.com/photo-151136746198b-98f534080980"}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />

                                                <div>

                                                    <p className="font-medium text-[#111827]">
                                                        {c.name || "Unknown Customer"}
                                                    </p>

                                                    <p className="text-sm text-[#6A7282]">
                                                        {c.email || "No email"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[c.status || "Active"] || statusStyles.Active}`}>
                                                {c.status || "Active"}
                                            </span>
                                        </td>

                                        <td className="py-4 text-[#374151]">

                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-[#6A7282]" />
                                                {c.location || "Online"}
                                            </div>

                                        </td>

                                        <td className="py-4 text-[#111827]">
                                            {c.orders || c.totalOrders || 0}
                                        </td>

                                        <td className="py-4 font-medium text-[#111827]">
                                            ${typeof c.spent === 'number' ? c.spent.toFixed(2) : (c.totalSpent || "0.00")}
                                        </td>

                                        <td className="py-4 text-[#6A7282]">
                                            {c.joined || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recently")}
                                        </td>

                                        <td className="py-4 text-center">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>

                                    </tr>

                                ))}
                                
                                {customersData.length === 0 && (
                                    <EmptyTableState colSpan={8} message="No customers found." />
                                )}

                            </tbody>

                        </table>

                    </div>



                    <div className="flex items-center justify-between mt-6 text-sm text-[#6A7282]">

                        <p>
                            Showing 5 of 245 customers
                        </p>

                        <div className="flex gap-3">

                            <button className="border border-[#E5E7EB] px-4 py-1.5 rounded-lg bg-gray-100">
                                Previous
                            </button>

                            <button className="border border-[#E5E7EB] px-4 py-1.5 rounded-lg bg-white">
                                Next
                            </button>

                        </div>

                    </div>

                </div>
            }

            {
                tab === "reviews" &&
                <div className="space-y-6">

                    <div className="grid md:grid-cols-3 gap-4">

                        {stats.map((s, i) => (

                            <div
                                key={i}
                                className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                            >

                                <div className="text-center">

                                    <h3 className="text-4xl font-playfair font-semibold">
                                        {s.value}
                                    </h3>

                                    {s.stars && (
                                        <div className="flex justify-center mt-2 text-[#F97316]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={18} fill="#F97316" />
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[#6A7282] mt-2">
                                        {s.label}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>



                    <div className="space-y-4">

                        {reviews.map((r, i) => (

                            <div
                                key={i}
                                className="border border-[#E5E7EB] bg-white rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={r.avatar}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />

                                        <div>

                                            <p className="font-medium text-[#111827]">
                                                {r.name}
                                            </p>

                                            <p className="text-sm text-[#6A7282]">
                                                purchased <span className="text-[#F54900]">{r.product}</span>
                                            </p>

                                        </div>

                                    </div>

                                    <span className="text-sm text-[#6A7282]">
                                        {r.time}
                                    </span>

                                </div>



                                <div className="flex mt-3 text-[#F97316]">

                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            fill={star <= r.rating ? "#F97316" : "transparent"}
                                            className={star <= r.rating ? "text-[#F97316]" : "text-gray-300"}
                                        />
                                    ))}

                                </div>



                                <p className="mt-3 text-[#374151]">
                                    "{r.message}"
                                </p>



                                <div className="flex items-center gap-4 mt-4 text-sm text-[#6A7282] border-t pt-4">

                                    <div className="flex items-center gap-2">
                                        <ThumbsUp size={16} />
                                        {r.helpful} found this helpful
                                    </div>

                                    <button className="text-[#F54900] font-medium">
                                        Reply to review
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            }

        </div>
    )
}