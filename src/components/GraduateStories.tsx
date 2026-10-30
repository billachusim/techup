import { ArrowRight, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { graduateStories, type GraduateStory } from "@/data/graduateStories";

const StoryCard = ({ story }: { story: GraduateStory }) => (
  <Card className="bg-card border-border h-full">
    <CardContent className="p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3">
        {story.photo ? (
          <img
            src={story.photo}
            alt={story.name}
            width={56}
            height={56}
            loading="lazy"
            className="w-14 h-14 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-lg font-bold text-primary-foreground">
              {story.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold">{story.name}</h3>
          <p className="text-sm text-muted-foreground">
            {story.course}
            {story.campus ? `, ${story.campus}` : ""} · {story.graduated}
          </p>
        </div>
      </div>

      <p className="text-sm flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">{story.before}</span>
        <ArrowRight
          size={14}
          className="text-primary shrink-0"
          aria-label="now"
        />
        <span className="font-semibold">
          {story.now}
          {story.company ? ` at ${story.company}` : ""}
        </span>
      </p>

      <blockquote className="text-muted-foreground leading-relaxed flex-1">
        “{story.quote}”
      </blockquote>

      {story.linkedin && (
        <a
          href={story.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-link hover:underline"
        >
          <Linkedin size={14} aria-hidden="true" /> {story.name} on LinkedIn
        </a>
      )}
    </CardContent>
  </Card>
);

// Renders nothing until src/data/graduateStories.ts has a real story in it.
const GraduateStories = ({
  limit,
  className = "py-16 px-4",
}: {
  limit?: number;
  className?: string;
}) => {
  const stories = limit ? graduateStories.slice(0, limit) : graduateStories;
  if (stories.length === 0) return null;

  return (
    <section id="graduate-stories" className={className}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Graduate stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where some of our graduates started, and where they are now, in
            their own words.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.name} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GraduateStories;
