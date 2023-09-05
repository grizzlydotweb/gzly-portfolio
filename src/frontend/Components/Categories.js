import {useStore} from "react-context-hook";
import {useState} from "react";
import {useCategories} from "../api/frontend";

export default function Categories({
    parent,
    onChange
}) {
    const [categoryDimensions] = useStore('category_dimensions');
    const [currentCategories, setCurrentCategories] = useState([]);
    const cats = useCategories(parent?.slug);
    if (!cats) {
        return;
    }
    const buttons = cats.map(cat => {
        const className = 'gzly-category';
        const selectedClass = currentCategories.includes(cat.slug) ? className + '--selected' : '';
        return (
            <button
                key={cat.slug}
                className={[className, selectedClass].join(' ')}
                value={cat.slug}
                onClick={e => {
                    const before = [...currentCategories];
                    const index = before.indexOf(cat.slug);
                    if (index === -1) {
                        before.push(cat.slug);
                    } else {
                        before.splice(index, 1);
                    }
                    if (typeof onChange === "function") {
                        onChange(e, before);
                    }
                    setCurrentCategories(before);
                }}
            >
                <div className={'gzly-category-image'}
                style={{
                    width: categoryDimensions,
                    height: categoryDimensions,
                    backgroundImage: `url(${cat.imageUrl})`
                }}></div>
                <div className={'gzly-category-title'}>{cat.title}</div>
                <div className={'gzly-category-description'}>{cat.description}</div>
            </button>
        )
    });

    return (<div className={'gzly-categories'}>{buttons}</div>)
}
