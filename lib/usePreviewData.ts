import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComputedRisk, computeRisks, Answers } from "@/lib/risks";
import apiClient from "@/api/apiClient";

interface PreviewData {
  risks: ComputedRisk[];
  sessionID: string | null;
  loaded: boolean;
  error: boolean;
}

export function usePreviewData(): PreviewData {
  const router = useRouter();
  const [risks, setRisks] = useState<ComputedRisk[]>([]);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("session_id");

    if (!id) {
      // No session at all — send them back to the start
      router.replace("/assessment");
      return;
    }

    setSessionID(id);

    const fetchAnswers = async () => {
      try {
        // Fetch the questions endpoint which already merges saved_answer into
        // each question — this gives us the full answer map in one request.
        const res = await apiClient.get<{
          questions: { id: string; saved_answer: string }[];
        }>(`/session/${id}/questions`);

        // Build an Answers map: { questionID -> answerText }
        const answers: Answers = {};
        for (const q of res.data.questions) {
          if (q.saved_answer) {
            answers[q.id] = q.saved_answer;
          }
        }

        const computed = computeRisks(answers);
        setRisks(computed);
        setLoaded(true);
      } catch (err) {
        console.error("usePreviewData: failed to fetch answers", err);
        setError(true);
        setLoaded(true);
      }
    };

    fetchAnswers();
  }, [router]);

  return { risks, sessionID, loaded, error };
}
