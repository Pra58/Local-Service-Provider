export function extractErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "-";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}
