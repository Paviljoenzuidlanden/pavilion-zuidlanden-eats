import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import QuoteDocument, { type Quote } from "@/components/QuoteDocument";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function QuoteLink() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    document.title = "Uw offerte — Paviljoen Zuidlanden";
    let active = true;
    if (!token) { setError("Deze offertelink is ongeldig."); return; }
    supabase.functions.invoke("view-quote", { body: { token } }).then(({ data, error }) => {
      if (!active) return;
      if (error || !data?.quote) setError("Deze offertelink is ongeldig of verlopen. Neem contact op met Paviljoen Zuidlanden.");
      else setQuote(data.quote);
    });
    return () => { active = false; };
  }, [token]);
  const download = () => {
    document.body.classList.add("printing-quote");
    const done = () => { document.body.classList.remove("printing-quote"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print(); done();
  };
  return <main className="min-h-screen p-4 sm:p-6">
    <div className="max-w-[850px] mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-display">Paviljoen Zuidlanden</h1>
        {quote && <Button onClick={download}><Download className="w-4 h-4 mr-2" />Download PDF</Button>}
      </div>
      {error ? <p role="alert">{error}</p> : !quote ? <p>Offerte laden…</p> : <div className="quote-screen border border-border rounded-md"><QuoteDocument q={quote} /></div>}
    </div>
    {quote && createPortal(<div id="quote-print"><QuoteDocument q={quote} /></div>, document.body)}
  </main>;
}