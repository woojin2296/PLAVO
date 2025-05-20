import { HomeHeader } from "@/components/Header";
import { ProfileStatusSection, ProjectPinSection, UpcommingProjectSection } from "@/components/Home";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeHeader />
      <div className="pt-20">
        <ProfileStatusSection 
          name="홍길동"
          rank={82}
          total_projects={25}
          completed_projects={12}
          practice_counts={[8, 5, 3, 1, 27]}
          total_score={84}
          speed_score={23}
          pose_score={26}
          qna_score={28} 
        />
        <ProjectPinSection />
        <UpcommingProjectSection />
      </div>
    </div>
  );
}
