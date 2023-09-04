import useData from "./index";

export function useParentCategories() {
    return useData('/wp-json/gzly-portfolio/v1/backend/categories');
}
