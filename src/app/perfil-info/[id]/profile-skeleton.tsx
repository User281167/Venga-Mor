import SectionImg from "@/components/section-img";

export function ProfileSkeleton() {
  return (
    <SectionImg>
      <div className="flex flex-col items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse" />
        <div className="mt-4 w-64 h-8 bg-gray-200 animate-pulse" />
        <div className="mt-2 w-48 h-8 bg-gray-200 animate-pulse" />
      </div>
    </SectionImg>
  );
}
