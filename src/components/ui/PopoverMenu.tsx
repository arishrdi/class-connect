import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { MoreVertical } from "lucide-react";

type PopoverMenuProps = {
  label1?: string;
  label2?: string;
  label3?: string;
  onAction1?: () => void;
  onAction2?: () => void;
  onAction3?: () => void;
};

const PopoverMenu: React.FC<PopoverMenuProps> = ({
  onAction1,
  onAction2,
  onAction3,
  label1,
  label2,
  label3,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full opacity-0 transition group-hover:opacity-100"
        >
          <MoreVertical size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-5 flex w-32 flex-col px-0 ">
        {label1 && (
          <Button variant="ghost" className="font-normal" onClick={onAction1}>
            {label1}
          </Button>
        )}
        {label2 && (
          <Button variant="ghost" className="font-normal" onClick={onAction2}>
            {label2}
          </Button>
        )}
        {label3 && (
          <Button variant="ghost" className="font-normal" onClick={onAction3}>
            {label3}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
