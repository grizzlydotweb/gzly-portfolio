import {
    QueryControls,
} from "@wordpress/components";
import {useEffect, useState} from "react";
import ReferenceItem from "./ReferenceItem";


export default function App() {
    const [query, setQuery] = useState({data: {per_page: 1, 'filter': {'orderby': 'title', 'order': 'asc'}}})
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)

    let collection = new wp.api.collections['Gzly_portfolio'](query);
    useEffect(() => {
        collection.fetch(query).then(respoonse => {
            setPosts(respoonse);
        });
    }, [query])

    if (!posts) {
        return;
    }

    let items = posts.map((post) => {
        return (<ReferenceItem item={post} key={post.id} />)
    })

    return (
        <div className={'gzly-backend-reference-overview'}>
            <QueryControls
                maxItems={100}
                minItems={10}
                order={query.data.filter.order}
                orderBy={query.data.filter.orderby}
                onOrderByChange={(newOrderBy) => {
                    setQuery({...query, filter: {...query.data.filter, orderby: newOrderBy}})
                }}
                onOrderChange={(newOrder) => {
                    setQuery({...query, filter: {...query.data.filter, order: newOrder.toUpperCase()}})
                }}
                categoriesList={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={(newCategory) => {
                }}
                numberO
            />
            <div className={'grid auto-cols-auto md:grid-cols-4  gap-4'}>
                <ReferenceItem key={'new'} isNew />
                {items}
            </div>
        </div>
    )
}
