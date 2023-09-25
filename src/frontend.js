const ReactDOM = require('react-dom');
console.log(ReactDOM)

import { createRoot } from 'react-dom/client';
import App from "./frontend/App";

const init = event => {
    const elements = document.getElementsByClassName('gzly-hauptsache-portfolio-placeholder');
    for (let element of elements) {
        const root = createRoot(element)
        root.render(<div><App settings={JSON.parse(element.getAttribute('data-settings'))}/></div>)
    }
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
