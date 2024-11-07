import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface I_Prop {
  headerRight?: ReactNode;
}

const TitleHeader: React.FC<I_Prop> = ({ headerRight }) => {
  const navigate = useNavigate();

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            navigate(-1);
          }}
          size={"icon"}
          variant={"outline"}
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-xl font-extrabold">Airship</h1>
      </div>
      {headerRight && <div>{headerRight}</div>}
    </header>
  );
};

export default TitleHeader;
