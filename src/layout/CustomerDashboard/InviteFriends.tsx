import { useEffect, useState } from "react";
import { useCurrency } from "./CurrencyContext";
import {
  Gift,
  Copy,
  Twitter,
  Facebook,
  Mail,
  Share2,
  Users,
  CheckCircle2,
  Wallet,
  Star,
  Check,
} from "lucide-react";

type ReferralInfo = {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  rewardPoints: number;
  walletBalance: number;
  earning: string;
};

type ReferredUser = {
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  status?: string;
  joinedAt?: string;
  createdAt?: string;
};

const steps = [
  {
    id: 1,
    title: "Invite Friends",
    desc: "Share your unique link via email or social media.",
    icon: Users,
  },
  {
    id: 2,
    title: "They Join",
    desc: "Friends sign up and get $20 off their first order.",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "You Earn",
    desc: "Get $20 credit automatically after their first delivery.",
    icon: Gift,
  },
];

const API_BASE = "https://mr-santosh-grocery-backend.onrender.com/api/v1";

export default function InviteFriends() {
  const { formatPrice } = useCurrency();
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const [infoRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/referral`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/referral/referred-users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const infoData = await infoRes.json();
        const usersData = await usersRes.json();

        if (!infoRes.ok) {
          throw new Error(infoData?.message || "Failed to load referral info.");
        }

        if (!usersRes.ok) {
          throw new Error(usersData?.message || "Failed to load referred users.");
        }

        setReferralInfo(infoData?.data ?? null);
        setReferredUsers(usersData?.data?.users ?? []);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load referral data.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchReferralData();
  }, []);

  // Backend sometimes returns "undefined/signup?ref=..." when its base URL
  // env var isn't set — fall back to building the link client-side.
  const shareLink =
    referralInfo &&
    (!referralInfo.referralLink || referralInfo.referralLink.includes("undefined"))
      ? `${window.location.origin}/signup?ref=${referralInfo.referralCode}`
      : referralInfo?.referralLink ?? "";

  const shareText = "Join me and get $20 off your first order!";

  const copyCode = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — fail silently in UI,
      // the input is readOnly so the user can still select & copy manually.
    }
  };

  const shareOnTwitter = () => {
    if (!shareLink) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnFacebook = () => {
    if (!shareLink) return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareLink,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareViaEmail = () => {
    if (!shareLink) return;
    const subject = encodeURIComponent("You're invited!");
    const body = encodeURIComponent(`${shareText}\n\n${shareLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareMore = async () => {
    if (!shareLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "You're invited!",
          text: shareText,
          url: shareLink,
        });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
    } else {
      await copyCode();
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text px-6 py-[74px]">
      <div className="max-w-[960px] mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#00BC7D33] flex items-center justify-center mx-auto mb-6">
          <Gift size={36} className="text-[#00D492]" />
        </div>

        <h1 className="lg:text-[54px] text-[32px] font-medium font-playfair mb-4">
          Invite Friends & Earn
        </h1>

        <p className="text-theme-muted text-lg max-w-[620px] mx-auto">
          Share the luxury experience. Give your friends{" "}
          <span className="text-theme-text">$20 off</span> and earn{" "} <br />
          <span className="text-[#00BC7D] font-bold">
            {referralInfo?.earning ?? "$20 credit"}
          </span>{" "}
          when they dine.
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-4 py-3 max-w-[620px] mx-auto">
            {error}
          </p>
        )}

        <div className="mt-16 bg-theme-surface border border-theme-border lg:rounded-2xl rounded-lg lg:p-8 p-3 shadow-[0px_25px_50px_-12px_#000000]">
          <p className="text-sm text-start tracking-widest text-theme-muted mb-3">
            YOUR REFERRAL CODE
          </p>

          <div className="flex gap-3 mb-6 flex-wrap">
            <input
              value={
                loading
                  ? "Loading..."
                  : referralInfo?.referralCode ?? "No code available"
              }
              readOnly
              className="md:flex-1 h-16 w-full flex items-center text-[22px] placeholder:text-[#00D492] text-[#00D492] outline-none px-4 rounded-lg border border-theme-border bg-theme-bg tracking-widest"
            />
            <button
              onClick={copyCode}
              disabled={loading || !shareLink}
              className="px-10 h-16 flex items-center gap-2 rounded-lg bg-theme-surface hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={shareOnTwitter}
              disabled={loading || !shareLink}
              className="bg-theme-surface text-black py-6 rounded-xl flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Twitter size={22} className="text-theme-muted" />
              Twitter
            </button>

            <button
              onClick={shareOnFacebook}
              disabled={loading || !shareLink}
              className="bg-theme-surface text-black py-6 rounded-xl flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Facebook size={22} className="text-theme-muted" />
              Facebook
            </button>

            <button
              onClick={shareViaEmail}
              disabled={loading || !shareLink}
              className="bg-theme-surface text-black py-6 rounded-xl flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail size={22} className="text-theme-muted" />
              Email
            </button>

            <button
              onClick={shareMore}
              disabled={loading || !shareLink}
              className="bg-theme-surface text-black py-6 rounded-xl flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={22} className="text-theme-muted" />
              More
            </button>
          </div>
        </div>

        {/* Stats row — surfaces totalReferrals / rewardPoints / walletBalance from the API */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-theme-surface border border-theme-border rounded-xl p-5 flex flex-col items-center gap-2">
            <Users size={20} className="text-[#00D492]" />
            <p className="text-2xl font-playfair">
              {loading ? "—" : referralInfo?.totalReferrals ?? 0}
            </p>
            <p className="text-xs text-theme-muted tracking-wide">
              Total Referrals
            </p>
          </div>

          <div className="bg-theme-surface border border-theme-border rounded-xl p-5 flex flex-col items-center gap-2">
            <Star size={20} className="text-[#00D492]" />
            <p className="text-2xl font-playfair">
              {loading ? "—" : referralInfo?.rewardPoints ?? 0}
            </p>
            <p className="text-xs text-theme-muted tracking-wide">
              Reward Points
            </p>
          </div>

          <div className="bg-theme-surface border border-theme-border rounded-xl p-5 flex flex-col items-center gap-2">
            <Wallet size={20} className="text-[#00D492]" />
            <p className="text-2xl font-playfair">
              {loading
                ? "—"
                : `${formatPrice((referralInfo?.walletBalance ?? 0))}`}
            </p>
            <p className="text-xs text-theme-muted tracking-wide">
              Wallet Balance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto mt-16">
        <h2 className="text-3xl font-playfair mb-8">How it Works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="bg-theme-surface border border-theme-border rounded-xl p-6 relative"
              >
                <span className="absolute -top-4 -left-4 bg-[#1D293D] border border-[#314158] text-base rounded-full w-9 h-9 text-theme-muted flex items-center justify-center font-bold">
                  {step.id}
                </span>

                <Icon className="text-[#00BC7D] mb-4" size={36} />

                <h3 className="font-playfair text-xl mb-2">{step.title}</h3>

                <p className="text-theme-muted">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referred users list — API returns data.users, previously had no UI at all */}
      <div className="max-w-[960px] mx-auto mt-16">
        <h2 className="text-3xl font-playfair mb-8">Your Referrals</h2>

        <div className="bg-theme-surface border border-theme-border rounded-xl p-6">
          {loading ? (
            <p className="text-theme-muted text-center py-8">
              Loading referrals...
            </p>
          ) : referredUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1D293D] flex items-center justify-center">
                <Users size={24} className="text-theme-muted" />
              </div>
              <p className="text-[#E2E8F0]">No referrals yet</p>
              <p className="text-theme-muted text-sm max-w-[360px]">
                Share your code above — friends who join will show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E293B]">
              {referredUsers.map((u, i) => (
                <div
                  key={u._id ?? i}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-[#E2E8F0]">
                      {u.fullName || u.name || u.email || "Referred user"}
                    </p>
                    {(u.joinedAt || u.createdAt) && (
                      <p className="text-xs text-theme-muted mt-1">
                        Joined{" "}
                        {new Date(
                          u.joinedAt || u.createdAt || "",
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {u.status && (
                    <span className="text-xs px-3 py-1 rounded-full bg-[#00BC7D33] text-[#00D492] capitalize">
                      {u.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}