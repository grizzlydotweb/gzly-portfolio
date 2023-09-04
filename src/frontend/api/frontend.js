import useData from "./index";

export function useCategories(parent) {
    const params = new URLSearchParams({
        parent: parent
    }).toString();
    return useData(`/wp-json/gzly-portfolio/v1/categories?${params}`);
}
export function useReferences(categories) {
    const params = new URLSearchParams({
        categories: categories
    }).toString();
    return useData(`/wp-json/gzly-portfolio/v1/references?${params}`);
}
