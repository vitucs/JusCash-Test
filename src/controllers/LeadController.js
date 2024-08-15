import { LeadModel } from '../models/LeadModel';

export const LeadController = {
    initializeData: (userEmail) => {
        const leads = LeadModel.getLeadsByUser(userEmail);
        const columns = LeadModel.getColumns();
        return { leads, columns };
    },

    addLead: (leads, lead, user, id) => {
        const newLead = { ...lead, id, createdBy: user.email };
        const updatedLeads = [...leads, newLead];

        // Verifica e remove duplicações
        const uniqueLeads = Array.from(new Map(updatedLeads.map(lead => [lead.id, lead])).values());
        LeadModel.saveLeads(JSON.stringify(uniqueLeads));
        return uniqueLeads;
    },

    saveColumns: (columns) => {
        LeadModel.saveColumns(columns);
    },
};
