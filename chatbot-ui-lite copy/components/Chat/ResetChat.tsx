import { FC } from "react";

interface Props {
  onReset: () => void;
}

export const ResetChat: FC<Props> = ({ onReset }) => {
  return (
    <div className="flex flex-row items-center">
      <button
        className="
        btn btn-outline btn-primary
        "
        onClick={() => onReset()}
      >
        Reset
      </button>
    </div>
  );
};
;