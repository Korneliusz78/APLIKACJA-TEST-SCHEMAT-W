export default function ChatBubble({ role, text }: { role: "user" | "ai"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div className={
        "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed border " +
        (isUser ? "bg-emerald-500/15 border-emerald-500/30" : "bg-slate-900/70 border-slate-700")
      }>
        {text}
      </div>
    </div>
  );
}
