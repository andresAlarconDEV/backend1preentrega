import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);

const URL_BASE = 'http://localhost:8080/';

export const buildResponsePaginated = (data) => {
    const {docs, totalPages, prevPage, nextPage, page ,hasPrevPage, hasNextPage, limit, options, criteria, endpoint } = data;
    let link = URL_BASE+endpoint+'?limit='+limit;
    options.sort ? link = link+'&sort='+options.sort.price: link;
    criteria.category ? link = link +'&search='+criteria.category: link;
    return {
    status: "success",
    payload: docs.map((e)=> e.toJSON()),
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? link+'&page='+prevPage : null,
    nextLink: hasNextPage ? link+'&page='+nextPage : null
}
};

export const __dirname = path.dirname(__filename);
