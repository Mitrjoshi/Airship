/* eslint-disable @typescript-eslint/no-explicit-any */
import TitleHeader from "@/components/shared/TitleHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

const Project = () => {
  const { projectId } = useParams();
  const { toast } = useToast();

  const handleFileChange = (event: { target: { files: any } }) => {
    const files = event.target.files;

    if (files) {
      console.log("Selected files:", files);

      // Check if index.html exists
      const hasIndexHtml = Array.from(files).some(
        (file) => file.name === "index.html"
      );

      if (!hasIndexHtml)
        return toast({
          title: "Uh oh! index.html is missing.",
        });
    }
  };

  return (
    <div>
      <TitleHeader title={`Project: ${projectId}`} />

      <div className="p-10 flex justify-center items-center">
        <div>
          <Label htmlFor="folder">Select Folder</Label>
          <Input
            id="folder"
            type="file"
            onChange={handleFileChange}
            multiple
            {...({ webkitdirectory: "true", directory: "true" } as any)}
          />
        </div>
      </div>
    </div>
  );
};

export default Project;
