import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Answers, ComputedRisk, computeRisks } from "@/lib/risks";

interface PreviewData {
  risks: ComputedRisk[];
  loaded: boolean;
}

export function usePreviewData(): PreviewData {
  const router = useRouter();
  const [risks, setRisks] = useState<ComputedRisk[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rm_answers");
    if (!raw) {
      router.push("/assessment");
      return;
    }
    setRisks(computeRisks(JSON.parse(raw) as Answers));
    setLoaded(true);
  }, [router]);

  return { risks, loaded };
}
