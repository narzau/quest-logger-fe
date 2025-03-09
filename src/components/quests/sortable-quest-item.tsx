import { Quest } from "@/types/quest";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { QuestItem } from "./quest-item";

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
