import { createFileRoute } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import { getDb } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — easyDUD" },
      {
        name: "description",
        content: "View and manage hotel registrations",
      },
    ],
  }),
  component: AdminDashboard,
});

interface Registration {
  id?: string;
  tier: string;
  hotelName: string;
  address: string;
  lat: number | null;
  lng: number | null;
  manualLocation: string;
  contactNumber?: string;
  images: string[];
  roomPricing: number;
  details: string;
  paymentMethod?: string;
  submittedAt: any;
  paymentId?: string;
  orderId?: string;
  paymentStatus?: string;
  starRating?: number;
  numRooms?: number;
  amenities?: string[];
}

function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
      setRegistrations(data);
    } catch (error) {
      console.error("Error loading registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "hotel_registrations.xlsx");
  };

  const clearRegistrations = async () => {
    if (confirm("Are you sure you want to clear all registrations?")) {
      try {
        const q = query(collection(db, "registrations"));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        setRegistrations([]);
      } catch (error) {
        console.error("Error clearing registrations:", error);
        toast.error("Failed to clear registrations");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={loadRegistrations}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-50"
            >
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              disabled={registrations.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </button>
            <button
              onClick={clearRegistrations}
              disabled={registrations.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Hotel Registrations ({registrations.length})
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all hotel registration submissions
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-muted-foreground">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-muted-foreground">No registrations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Hotel Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Address</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Tier</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Price/Night</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {registrations.map((reg, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-foreground">{reg.hotelName}</td>
                    <td className="px-4 py-3 text-foreground">{reg.contactNumber || "—"}</td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{reg.address}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        reg.tier === "premium" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {reg.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{reg.paymentMethod?.toUpperCase() || "—"}</td>
                    <td className="px-4 py-3 text-foreground">₹{Number(reg.roomPricing).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-foreground">
                      {reg.submittedAt?.toDate 
                        ? reg.submittedAt.toDate().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
