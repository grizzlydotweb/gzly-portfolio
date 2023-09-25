import {createRoot} from "react-dom/client";

import App from "./backend-overview/App";

const init = event => {
    const element = document.getElementById('gzly-reference-overview-entrypoint');
    const root = createRoot(element)
    root.render(<App />)
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

