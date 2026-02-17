import "./feed.css";
import { FeedList } from "./components/feed-list";

export default function ClipsPage() {
  return (
    <section className="h-[94dvh] w-full overflow-hidden bg-black">
      <FeedList limit={10} mediaType="video" />
    </section>
  );
}
