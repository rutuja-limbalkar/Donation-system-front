import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DynamicRenderer = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/pages/${slug}`)
            .then(res => setPage(res.data))
            .catch(err => console.log("Page not found"));
    }, [slug]);

    if (!page) return <h2>Loading or Page Not Found...</h2>;

    return (
        <div className="container">
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
    );
};

export default DynamicRenderer;