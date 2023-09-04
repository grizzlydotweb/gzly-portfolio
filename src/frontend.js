import ReactDOM from "react-dom";
import App from "./frontend/App";

const init = event => {
    const elements = document.getElementsByClassName('gzly-hauptsache-portfolio-placeholder');
    for (let element of elements) {
        ReactDOM.render(<div><App settings={JSON.parse(element.getAttribute('data-settings'))}/></div>, element)
    }
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
