import { useRouter } from "next/router";
import CaseForm from "@/components/cases/CaseForm";

export default function CaseDetailPage() {
  const router = useRouter();
  const { caseId } = router.query;
  return <CaseForm seguimientoId={caseId} />;
}
