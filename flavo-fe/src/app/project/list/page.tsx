import { ProjectListHeader } from "@/components/Header";
import { ProjectListSection } from "@/components/ProjectList";

export default function ProjectList() {
  return (
    <div className="flex flex-col">
      <ProjectListHeader />
      <div className="pt-20">
        <ProjectListSection />
      </div>
    </div>
  );
}
