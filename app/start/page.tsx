import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StartClient from "./StartClient";

const TIER_MAP = {
  basic: "BASIC",
  pro: "PRO",
  elite: "ELITE"
} as const;

type SearchParams = {
  tier?: string;
};

export default async function StartPage(props: { searchParams: SearchParams }) {
  const session = await getServerSession(authOptions);
  const tierParam = (props.searchParams.tier ?? "").toLowerCase();
  const normalizedTier = TIER_MAP[tierParam as keyof typeof TIER_MAP];

  if (!normalizedTier) {
    redirect("/pricing");
  }

  if (!session) {
    const callback = `/start?tier=${tierParam}`;
    redirect(
      `/auth/signin?callbackUrl=${encodeURIComponent(callback)}`
    );
  }

  return <StartClient tier={normalizedTier} />;
}

