import { Link } from "@/lib/router-compat";
import { MapPin, Wallet, ArrowRight, Users } from "lucide-react";
import {
  formatBudget,
  openingsLabel,
  roleBadges,
  roleLocationLabel,
  type TalentRole,
} from "@/lib/talent";

const RoleCard = ({ role }: { role: TalentRole }) => (
  <article className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {roleBadges(role).map((badge) => (
          <span
            key={badge}
            className={
              badge === "Paid training" || badge === "New"
                ? "rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
                : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            }
          >
            {badge}
          </span>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-snug">{role.title}</h3>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">{role.company}</p>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3">{role.summary}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5"><MapPin size={12} /> {roleLocationLabel(role)}</p>
        <p className="flex items-center gap-1.5"><Wallet size={12} /> {formatBudget(role)}</p>
        <p className="flex items-center gap-1.5 font-medium text-foreground"><Users size={12} /> {openingsLabel(role.openings)}</p>
      </div>
      {role.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {role.required_skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
    <Link
      to={`/talent/roles/${role.slug}`}
      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      View role and apply <ArrowRight size={14} />
    </Link>
  </article>
);

export default RoleCard;
