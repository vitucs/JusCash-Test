export const LeadModel = {
    getLeads: () => {
        const leads = JSON.parse(localStorage.getItem('leads')) || [];
        return leads;
    },
    getLeadsByUser: (userEmail) => {
        const leads = JSON.parse(localStorage.getItem('leads')) || [];
        return leads.filter(lead => lead.createdBy === userEmail);
    },

    saveLeads: (leads) => {
        localStorage.setItem('leads', JSON.stringify(leads));
    },

    getColumns: () => {
        return JSON.parse(localStorage.getItem('columns')) || {
            'column-1': { id: 'column-1', title: 'Cliente Potencial', items: [] },
            'column-2': { id: 'column-2', title: 'Dados Confirmados', items: [] },
            'column-3': { id: 'column-3', title: 'Análise do Lead', items: [] },
        };
    },

    saveColumns: (columns) => {
        localStorage.setItem('columns', JSON.stringify(columns));
    },
};
