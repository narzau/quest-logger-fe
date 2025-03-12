import { Quest } from "@/types/quest";
import { useSortable } from "@dnd-kit/sortable";
import { QuestItem } from "./quest-item";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GripVertical, Clock, Bookmark } from "lucide-react";

export function SortableQuestItem({ quest }: { quest: Quest }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: quest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center mb-2">
      <div
        className="flex-shrink-0 w-4 cursor-grab text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-1">
        <QuestItem quest={quest} />
      </div>
    </div>
  );
}

interface SortableQuestItemProps {
  quest: Quest;
  isSelected: boolean;
  onSelect: () => void;
  getTypeIcon: (questType: string) => React.ReactNode;
  getRarityColorClass: (rarity: string) => string;
}

export function SortableQuestItem2({
  quest,
  isSelected,
  onSelect,
  getTypeIcon,
  getRarityColorClass,
}: SortableQuestItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: quest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-0.5">
      <div
        className="flex-shrink-0 h-full flex items-center px-0.5 text-muted-foreground hover:text-foreground cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
      </div>

      <div
        className={cn(
          "flex-1 flex items-start p-2 rounded-md border cursor-pointer transition-colors gap-2",
          isSelected
            ? "bg-primary/10 border-primary/30"
            : "hover:bg-accent/50 border-transparent",
          quest.is_completed && "opacity-70"
        )}
        onClick={onSelect}
      >
        <div className="mt-0.5">{getTypeIcon(quest.quest_type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h3
              className={cn(
                "text-sm font-medium leading-snug truncate",
                quest.is_completed && "line-through text-muted-foreground"
              )}
            >
              {quest.title}
            </h3>

            {quest.tracked && (
              <Bookmark className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1 py-0 h-4",
                getRarityColorClass(quest.rarity)
              )}
            >
              {quest.rarity}
            </Badge>

            {quest.is_completed && (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] px-1 py-0 h-4">
                Done
              </Badge>
            )}

            {quest.due_date && (
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 flex items-center gap-0.5"
              >
                <Clock className="h-2.5 w-2.5" />
                {new Date(quest.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            )}

            {/* {quest.labels && quest.labels.length > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 flex items-center gap-0.5"
              >
                <Tags className="h-2.5 w-2.5" />
                {quest.labels.length}
              </Badge>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
