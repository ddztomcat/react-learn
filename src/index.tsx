import React from "react";
import { createRoot } from "react-dom/client";
import App from "./layout";
import "antd/dist/antd.css";
import apiAuth from "./feishu";
const root = document.getElementById("root");
apiAuth().then(() => {
	if (root) {
		createRoot(root).render(<App />);
	}
})
