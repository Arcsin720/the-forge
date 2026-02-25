import { redirect } from "next/navigation";

export default function AccountPage() {
  // Rediriger vers le nouveau dashboard
  redirect("/dashboard");
}

