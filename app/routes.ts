import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), //index route মানে হলো default route of parent. Internally এটা equivalent: {path: "/",index: true,file: "routes/home.tsx"}. এখানে আলাদা কোনো প্যারেন্ট নাই। তাই "/" এটাই প্যারেন্ট।

  route("/auth", "routes/auth.tsx"), //This is normal route not default.
  route("/upload-resume", "routes/upload.tsx"),
] satisfies RouteConfig;
