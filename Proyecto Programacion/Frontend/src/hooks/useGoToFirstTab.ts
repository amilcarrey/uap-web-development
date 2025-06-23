import { useTabs } from "./tabs";
import { useNavigate } from "react-router-dom";

export function useGoToFirstTab() {
  const { data: tabs = [] } = useTabs();
  const navigate = useNavigate();

  return () => {
    if (tabs.length > 0) {
      navigate(`/board/${encodeURIComponent(tabs[0].title)}`);
    } else {
      navigate("/");
    }
  };
}