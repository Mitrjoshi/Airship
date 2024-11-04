import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface I_Prop {
  title: string;
  headerRight?: ReactNode;
}

const TitleHeader: React.FC<I_Prop> = ({ title, headerRight }) => {
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
        {title}
      </div>
      {headerRight && <div>{headerRight}</div>}
    </header>
  );
};

export default TitleHeader;
