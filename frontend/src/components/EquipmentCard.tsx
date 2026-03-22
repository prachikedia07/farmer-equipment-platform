import { useNavigate } from "react-router-dom";
import { MapPin, Star, IndianRupee } from "lucide-react";
import BookingModal from "./BookingModal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function EquipmentCard({ item }: any) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const handleBook = () => {
    if (!user) {
      toast.error("Please login to book equipment");
      navigate("/login");
      return;
    }

    if (user.role !== "farmer") {
      toast.error("Only farmers can book equipment");
      return;
    }

    setOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0E8D8] overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="h-48 bg-[#F5EDD8]">
        {item.image ? (
          <img src={item.image} className="w-full h-full object-cover" />
        ) : null}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">

        <h2 className="text-lg font-bold mb-2">{item.name}</h2>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>{item.rating}</span>
          <span>({item.numReviews})</span>
        </div>

        <div className="mb-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {item.location}
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            ₹{item.price}/{item.pricingType}
          </div>
        </div>

        <p className="text-sm mb-4">
          Owner: {item.owner?.name}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => navigate(`/equipment/${item._id}`)}
            className="flex-1 bg-[#4A2E15] hover:bg-[#3A2010] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            View Details
          </button>

          <button
            onClick={handleBook}
            className="flex-1 border-2 border-[#E5D5B5] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#4A2E15] text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            Book
          </button>
        </div>
      </div>

      {/* ✅ MODAL */}
      <BookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        equipmentId={item._id}
      />
    </div>
  );
}