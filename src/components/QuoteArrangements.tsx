import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookmarkPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { QuoteItem } from "@/lib/quotes";

export type Arrangement = Tables<"quote_arrangements">;
export default function QuoteArrangements({ arrangements, draft, onApply, onReload }: {
  arrangements: Arrangement[];
  draft: { itemsArr: QuoteItem[]; intro?: string | null; drinks_text?: string | null; notes?: string | null };
  onApply: (arrangement: Arrangement) => void; onReload: () => void;
}) {
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!name.trim()) return toast.error("Vul een arrangementnaam in");
    const items = draft.itemsArr.filter(i => i.title.trim()).map(i => ({ ...i, price: Number(i.price) || 0 }));
    if (!items.length) return toast.error("Voeg eerst een onderdeel toe aan het arrangement");
    setBusy(true);
    const { error } = await supabase.from("quote_arrangements").insert({ name: name.trim(), items,
      intro: draft.intro, drinks_text: draft.drinks_text, notes: draft.notes });
    setBusy(false);
    if (error) return toast.error(error.message);
    setName(""); onReload(); toast.success("Arrangement bewaard");
  };
  const remove = async () => {
    const arrangement = arrangements.find(a => a.id === selected);
    if (!arrangement || !window.confirm(`Arrangement "${arrangement.name}" verwijderen?`)) return;
    const { error } = await supabase.from("quote_arrangements").delete().eq("id", arrangement.id);
    if (error) return toast.error(error.message);
    setSelected(""); onReload();
  };
  return <div className="space-y-2 border-b border-border pb-3">
    <Label htmlFor="quote-arrangement">Vast arrangement</Label>
    <div className="flex gap-2 flex-wrap">
      <select id="quote-arrangement" className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm" value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">— Kies arrangement —</option>
        {arrangements.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <Button variant="outline" disabled={!selected} onClick={() => {
        const a = arrangements.find(a => a.id === selected);
        if (a && window.confirm("De arrangementregels en bijbehorende teksten vervangen?")) onApply(a);
      }}>Toepassen</Button>
      <Button size="icon" variant="ghost" aria-label="Arrangement verwijderen" disabled={!selected} onClick={remove}><Trash2 className="w-4 h-4" /></Button>
    </div>
    <div className="flex gap-2 flex-wrap">
      <Input aria-label="Naam vast arrangement" className="min-w-0 flex-1" placeholder="Naam nieuw arrangement" value={name} onChange={e => setName(e.target.value)} />
      <Button variant="outline" disabled={busy} onClick={save}><BookmarkPlus className="w-4 h-4 mr-1" />Bewaren als arrangement</Button>
    </div>
  </div>;
}