import { redirect } from "next/navigation";
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
  const tierParam = (props.searchParams.tier ?? "").toLowerCase();
  const normalizedTier = TIER_MAP[tierParam as keyof typeof TIER_MAP];

  if (!normalizedTier) {
    redirect("/pricing");
  }

  return <StartClient tier={normalizedTier} />;
}

