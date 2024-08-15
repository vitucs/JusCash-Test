export const ColumnsController = {
    verifyAndUpdateColumns: (userLeads, updatedColumns) => {
        userLeads.forEach(lead => {
            const columnId = 'column-1';
            if (columnId && !updatedColumns['column-1'].items.includes(lead.id) && !updatedColumns['column-2'].items.includes(lead.id) && !updatedColumns['column-3'].items.includes(lead.id)) {
                updatedColumns[columnId].items.push(lead.id);
            }
        });
    },
};
