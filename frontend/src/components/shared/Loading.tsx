import { Loader } from "lucide-react";

export const Loading = () => {
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <Loader className="animate-spin self-center" />
      </div>
    </>
  );
};
