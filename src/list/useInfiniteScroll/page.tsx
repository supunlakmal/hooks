import React, { useState } from "react";
import { useInfiniteScroll } from "@supunlakmal/hooks";

function InfiniteScrollExample() {
    const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setItems((prev) => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i + 1)]);
            setLoading(false);
        }, 1000);
    };

    const ref = useInfiniteScroll({
        loading,
        hasNextPage: true,
        onLoadMore: loadMore,
    });

    return (
        <div>
            <h1>useInfiniteScroll Example</h1>
            <ul>
                {items.map((item) => (
                    <li key={item}>Item {item}</li>
                ))}
            </ul>
            <div ref={ref} style={{ height: "20px", backgroundColor: "lightgray" }}>
                {loading ? "Loading..." : "Scroll down to load more"}
            </div>
        </div>
    );
}

export default InfiniteScrollExample;