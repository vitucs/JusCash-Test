export const ColumnsModel = {
    getColumns: (initialData) => {
        const columns = JSON.parse(localStorage.getItem('columns')) || initialData.columns;
        return columns;
    },
    setColumns: (data) => {
        localStorage.setItem('columns', JSON.stringify(data));
    },
};
