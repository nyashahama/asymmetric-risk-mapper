import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Answers, ComputedRisk, computeRisks } from "@/lib/risks";

interface ReportData {
  risks: ComputedRisk[];
  email: string;
  loaded: boolean;
}

export function useReportData(): ReportData {
  const router = useRouter();
  const [risks, setRisks] = useState<ComputedRisk[]>([]);
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const paid = sessionStorage.getItem("rm_paid");
    if (!paid) {
      router.push("/preview");
      return;
    }
    const raw = sessionStorage.getItem("rm_answers");
    if (!raw) {
      router.push("/assessment");
      return;
    }
    setRisks(computeRisks(JSON.parse(raw) as Answers));
    setEmail(sessionStorage.getItem("rm_email") ?? "");
    setLoaded(true);
  }, [router]);

  return { risks, email, loaded };
}
