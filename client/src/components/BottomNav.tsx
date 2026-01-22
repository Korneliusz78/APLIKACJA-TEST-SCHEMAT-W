import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Start" },
  { to: "/test", label: "Test" },
  { to: "/apteczka", label: "Apteczka" },
  { to: "/pytania", label: "Pytania" },
  { to: "/kontakt", label: "Kontakt" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-pad bg-slate-950/95 border-t border-slate-800">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {items.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              "py-3 text-center text-xs font-medium " +
              (isActive ? "text-emerald-300" : "text-slate-300")
            }
          >
            {i.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
