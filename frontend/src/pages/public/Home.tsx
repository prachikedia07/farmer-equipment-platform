import { Link } from "react-router-dom";
import { Tractor, Users, Wrench, ShieldCheck, Sprout, CalendarCheck, IndianRupee, Star } from "lucide-react";
import { WheatDivider, FarmSceneBanner } from "../../components/FarmDecoration";
import { equipmentIcons } from "../../components/EquipmentIcon";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const { user } = useAuth();
const navigate = useNavigate();

const handleListEquipment = () => {
  if (!user) {
    toast("Please login as equipment owner");
    navigate("/login");
    return;
  }

  if (user.role !== "owner") {
    toast.error("Only equipment owners can list equipment");
    return;
  }

  navigate("/owner/dashboard");
};

  const features = [
    {
      icon: Tractor,
      title: "Wide Range of Equipment",
      desc: "From tractors to harvesters, find all farming equipment",
      color: "bg-[#EDE0CC] border-[#C9A96E]/60",
    },
    {
      icon: Users,
      title: "Trusted Owners",
      desc: "Connect with verified equipment owners near you",
      color: "bg-[#FFF3D6] border-[#E6C87A]/60",
    },
    {
      icon: Wrench,
      title: "Easy Booking",
      desc: "Book equipment in just a few clicks",
      color: "bg-[#E8EDE4] border-[#9BB08A]/60",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Multiple payment options including UPI and cash",
      color: "bg-[#FFF0D6] border-[#E6B86A]/60",
    },
  ];

  const equipment = [
    { key: "tractor",    label: "Tractor"   },
    { key: "hal",        label: "Hal"        },
    { key: "rotavator",  label: "Rotavator"  },
    { key: "cultivator", label: "Cultivator" },
    { key: "seedDrill",  label: "Seed Drill" },
    { key: "trolley",    label: "Trolley"    },
    { key: "thresher",   label: "Thresher"   },
    { key: "sprayer",    label: "Sprayer"    },
    { key: "harvester",  label: "Harvester"  },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] font-sans">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#FDF6E3] via-[#FFF8E7] to-[#F5EDD8] pt-10 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#E6A817]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-16 w-28 h-28 bg-[#E6A817]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#4A7C59]/10 text-[#4A7C59] border border-[#4A7C59]/25 px-4 py-2 rounded-full text-sm font-medium">
                <Sprout className="w-4 h-4 flex-shrink-0" />
                <span>Empowering Indian Farmers</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1A0E] leading-[1.1] tracking-tight">
                Rent Farm Equipment Near You
              </h1>
              <p className="text-base sm:text-lg text-[#5C3D1E]/75 leading-relaxed max-w-md">
                Connect with nearby equipment owners and book tractors, tools, and machinery for your farming needs
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/equipment"
                  className="inline-flex items-center justify-center gap-2 bg-[#4A2E15] hover:bg-[#3A2010] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Tractor className="w-4 h-4" />
                  Find Equipment
                </Link>
               <button onClick={handleListEquipment} className="inline-flex items-center justify-center gap-2 border-2 border-[#4A2E15] text-[#4A2E15] hover:bg-[#4A2E15]/5 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
  List Your Equipment
</button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E6A817]/20 to-[#4A2E15]/15 rounded-3xl blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop"
                  alt="Farmers working in field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WheatDivider />

      {/* ── FEATURES ── */}
      <section className="py-16 px-4 bg-[#FDF6E3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C1A0E] mb-3">
              Why Choose Our Platform
            </h2>
            <p className="text-[#5C3D1E]/70 text-base sm:text-lg">
              Making farm equipment rental simple and accessible
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-7 rounded-2xl border-2 ${f.color} text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default`}
              >
                <div className="bg-white rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <f.icon className="w-7 h-7 text-[#4A2E15]" />
                </div>
                <h3 className="font-bold text-[#2C1A0E] text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[#5C3D1E]/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FARM SCENE BANNER ── */}
      <section className="px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <FarmSceneBanner />
        </div>
      </section>

      <WheatDivider />

      {/* ── AVAILABLE EQUIPMENT ── */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Wave texture */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wavePattern" x="0" y="0" width="200" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 16 Q50 6, 100 16 T200 16" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wavePattern)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C1A0E] mb-3">
              Available Equipment
            </h2>
            <p className="text-[#5C3D1E]/70 text-base sm:text-lg">
              Browse our wide range of farming equipment
            </p>
          </div>

          {/* No static highlight — pure hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {equipment.map(({ key, label }) => (
              <div
                key={key}
                className="
                  group bg-white border border-[#E5D5B5] rounded-2xl p-5 text-center
                  cursor-pointer transition-all duration-200
                  hover:bg-[#FFF8E7] hover:border-[#E6A817] hover:shadow-md hover:-translate-y-0.5
                "
              >
                {equipmentIcons[key]({
                  className:
                    "h-10 w-10 mx-auto mb-3 text-[#4A2E15] transition-all duration-200 group-hover:text-[#E6A817] group-hover:scale-110",
                })}
                <p className="font-semibold text-sm text-[#2C1A0E]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WheatDivider />

      {/* ── VALUE PROPS ── */}
      <section className="py-16 px-4 bg-[#FDF6E3]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6">
            <div className="w-20 h-20 rounded-full bg-[#D4E8D4] flex items-center justify-center mb-5 shadow-sm">
              <CalendarCheck className="w-9 h-9 text-[#4A7C59]" />
            </div>
            <h3 className="font-bold text-lg text-[#2C1A0E] mb-2">Flexible Booking</h3>
            <p className="text-sm text-[#5C3D1E]/70 leading-relaxed">
              Book equipment by the hour, day, or week based on your needs
            </p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-20 h-20 rounded-full bg-[#FFF0C2] flex items-center justify-center mb-5 shadow-sm">
              <IndianRupee className="w-9 h-9 text-[#E6A817]" />
            </div>
            <h3 className="font-bold text-lg text-[#2C1A0E] mb-2">Best Prices</h3>
            <p className="text-sm text-[#5C3D1E]/70 leading-relaxed">
              Competitive rates with transparent pricing and no hidden fees
            </p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-20 h-20 rounded-full bg-[#E8E4DC] flex items-center justify-center mb-5 shadow-sm">
              <Star className="w-9 h-9 text-[#4A2E15]" />
            </div>
            <h3 className="font-bold text-lg text-[#2C1A0E] mb-2">Rated Equipment</h3>
            <p className="text-sm text-[#5C3D1E]/70 leading-relaxed">
              Read reviews and ratings from other farmers before booking
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A2E15] via-[#3A2010] to-[#2C1A0E] text-white px-8 py-14 md:px-14 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#E6A817]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E6A817]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Join thousands of farmers and equipment owners on our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-[#E6A817] hover:bg-[#D4981A] text-[#2C1A0E] px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white/70 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold text-sm backdrop-blur-sm transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-[#E5D5B5] text-center">
        <p className="text-sm text-[#5C3D1E]/50">
          © 2026 Farm Equipment Booking Platform
        </p>
      </footer>

    </div>
  );
}