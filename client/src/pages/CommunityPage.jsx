import { useEffect, useState } from "react";
import { api } from "../api";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCommunityPosts().then(setPosts).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-[28px] mb-2">Community</h1>
      <p className="text-inksoft text-[15px] mb-8">What other students applying this week are saying.</p>
      {error && <p className="text-coral text-sm">{error}</p>}
      <div className="flex flex-col gap-3">
        {posts.map((p) => (
          <div className="card flex-row items-start gap-3" key={p.id} style={{ flexDirection: "row" }}>
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-violet to-teal flex-shrink-0" />
            <div>
              <div className="font-bold text-[13.5px] mb-0.5">@{p.handle}</div>
              <div className="text-[13.5px] text-inksoft">{p.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
