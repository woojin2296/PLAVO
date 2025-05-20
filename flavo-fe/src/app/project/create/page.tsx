import { ProjectCreateHeader } from "@/components/Header";
import { ProjectInfoInputSection } from "@/components/ProjectCreate";

export default function ProjectList() {
  return (
    <div className="flex flex-col">
      <ProjectCreateHeader />
      <div className="pt-20">
        <ProjectInfoInputSection />
      </div>
    </div>
  );
}
