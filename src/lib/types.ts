export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type Confidence = "Low" | "Medium" | "High";
export type InputType = "text" | "image" | "url";

export const CATEGORIES = [
  { id: "courier", label: "Courier / delivery message" },
  { id: "bank", label: "Bank message" },
  { id: "marketplace", label: "Marketplace deal" },
  { id: "rental", label: "Rental offer" },
  { id: "job", label: "Job offer" },
  { id: "investment", label: "Investment offer" },
  { id: "invoice", label: "Invoice" },
  { id: "contract", label: "Contract" },
  { id: "unknown", label: "Not sure / other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export interface RedFlag {
  title: string;
  explanation: string;
}

export interface AnalysisResult {
  risk_level: RiskLevel;
  risk_score: number;
  verdict: string;
  summary: string;
  red_flags: RedFlag[];
  recommended_actions: string[];
  what_not_to_do: string[];
  safe_reply: string;
  confidence_level: Confidence;
  category_detected: string;
}

export interface ScanRow extends AnalysisResult {
  id: string;
  user_id: string;
  input_type: InputType;
  original_text: string | null;
  uploaded_file_url: string | null;
  checked_url: string | null;
  category: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription_status: "free" | "plus" | "family";
  monthly_scan_limit: number;
  scans_used_this_month: number;
  usage_period_start: string;
}
