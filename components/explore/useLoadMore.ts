import {useEffect, useRef, useState} from "react";

export default function useLoadMore<T>(loadMore: (page: number) => Promise<T[]>): [items: T[], handleLoadMore: () => any, isLoading: boolean] {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            handleLoadMore();
        }
    }, []);

    function handleLoadMore() {
        setIsLoading(true);
        loadMore(page)
            .then((newItems) => {
                setItems([...items, ...newItems]);
                setPage(page + 1)
            })
            .finally(() => setIsLoading(false));
    }

    return [items, handleLoadMore, isLoading];
}