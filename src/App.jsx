import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ListPage from "./ListPage";
import DetailPage from "./DetailPage";
import NotFoundPage from "./NotFoundPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ListPage />} />
          <Route path="/pokemon/:name" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}