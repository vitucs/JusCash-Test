import { LeadModel } from '../models/LeadModel';

export const LeadController = {
    initializeData: (userEmail) => {
        const leads = LeadModel.getLeadsByUser(userEmail);
        const columns = LeadModel.getColumns();
        return { leads, columns };
    },

    addLead: (leads, lead, user, id) => {
        const newLead = { ...lead, id, createdBy: user };
        const updatedLeads = [...leads, newLead];                
        LeadModel.saveLeads(JSON.stringify(updatedLeads));
        return updatedLeads;
    },

    saveColumns: (columns) => {
        LeadModel.saveColumns(columns);
    },
};
