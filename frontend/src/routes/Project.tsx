import TitleHeader from "@/components/shared/TitleHeader";
import { useParams } from "react-router-dom";

const Project = () => {
  const { projectId } = useParams();
  return (
    <div>
      <TitleHeader title={`Project: ${projectId}`} />
    </div>
  );
};

export default Project;
