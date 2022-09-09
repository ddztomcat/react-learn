import React from "react";
import { createRoot } from "react-dom/client";
import App from "./layout";
import "antd/dist/antd.css";

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(<App />);
}
