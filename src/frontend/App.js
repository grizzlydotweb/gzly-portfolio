import {store, withStore} from 'react-context-hook'
import {useState} from "react";
import Categories from "./Components/Categories";
import References from "./Components/References";

export default withStore(function App({
  settings,
  demoMode = false
}) {
    store.set('enable_categories', settings?.enable_categories);
    store.set('parent_category', settings?.parent_category);
    store.set('category_dimensions', settings?.category_dimensions);
    store.set('row_height', settings?.row_height);
    store.set('demo_mode', demoMode);

    let [currentCategories, setCurrentCategories] = useState(settings.parent_category ? [settings.parent_category.slug] : []);
    const [demoActive, setDemoActive] = useState(true);
    if (demoMode) {
        let currentParentCategorySlug;
        currentCategories = (currentParentCategorySlug = settings.parent_category?.slug) !== null && currentParentCategorySlug !== void 0 ? currentParentCategorySlug : [];
    }

    return (
        <div className={'gzly-hauptsache-portfolio'}>
            {demoMode && demoActive && (<div
                className={'gzly-demo-mode-mask' + (demoActive ? ' gzly-demo-mode-mask--active' : '')}
                onClick={clickEvent => {
                    const handleClickOutside = e => {
                        setDemoActive(true);
                        document.removeEventListener("click", handleClickOutside);
                    };
                    setDemoActive(false);
                    document.addEventListener("click", handleClickOutside);
                }}
            ></div>)}
            {settings.enable_categories && (<Categories
                parent={settings.parent_category}
                categories={currentCategories}
                onChange={(e, currentCategories) => {
                    let categories = [];
                    if (currentCategories.length > 0) {
                        categories = currentCategories;
                    }
                    if (currentCategories.length <= 0 && settings.parent_category) {
                        categories.push(settings.parent_category.slug);
                    }
                    setCurrentCategories(currentCategories.length > 0 ? currentCategories : [settings.parent_category?.slug]);
                }
                }
            />)}
            <References categories={currentCategories} />
        </div>
    )
});
