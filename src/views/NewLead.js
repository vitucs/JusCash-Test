import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';
import { LeadModel } from '../models/LeadModel';

const inputClasses = "mt-1 block w-full border border-zinc-300 dark:border-zinc-600 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const checkboxLabelClasses = "text-sm dark:text-zinc-300";
const buttonClasses = "rounded-md p-2";

const NewLead = ({ onAddLead, lead, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [checkboxes, setCheckboxes] = useState({
        todos: false,
        'honorarios-sucumbenciais': false,
        'honorarios-contratuais': false,
        'honorarios-dativos': false,
        'credito-do-autor': false
    });

    const user = UserModel.getLoggedUser();

    useEffect(() => {
        if (lead) {
            setName(lead.name);
            setEmail(lead.email);
            setTelephone(lead.telephone);
            setCheckboxes(lead.checkboxes || {});
        }
    }, [lead]);

    const handleCheckboxChange = (id) => {
        if (id === 'todos') {
            const newState = !checkboxes.todos;
            setCheckboxes({
                todos: newState,
                'honorarios-sucumbenciais': newState,
                'honorarios-contratuais': newState,
                'honorarios-dativos': newState,
                'credito-do-autor': newState
            });
        } else {
            const newCheckboxes = {
                ...checkboxes,
                [id]: !checkboxes[id],
            };

            const allChecked = Object.keys(newCheckboxes)
                .filter(key => key !== 'todos')
                .every(key => newCheckboxes[key]);

            setCheckboxes({
                ...newCheckboxes,
                todos: allChecked,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const leads = LeadModel.getLeads();
        var leadExists = false;

        if(JSON.parse(leads).length > 0) {
            leadExists = JSON.parse(leads).filter(existingLead => {
                if(existingLead.email === email){
                    return existingLead;
                }
            });
        }
        

        if (leadExists.length>0) {
            toast.error('Já existe um lead com esse email');
        } else {
            const newLead = {
                name,
                email,
                telephone,
                checkboxes,
                createdBy: user.email 
            };
            onAddLead(newLead);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">{lead ? "Lead" : "Novo Lead"}</h2>
                <form onSubmit={handleSubmit}>
                    <label className={labelClasses}>Dados do Lead</label>
                    <div className="mb-4">
                        <label className={labelClasses}>Nome Completo*</label>
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            className={inputClasses} 
                            required 
                            disabled={lead} 
                        />
                    </div>
                    <div className="mb-4">
                        <label className={labelClasses}>E-mail*</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            className={inputClasses} 
                            required 
                            disabled={lead} 
                        />
                    </div>
                    <div className="mb-4">
                        <label className={labelClasses}>Telefone*</label>
                        <input 
                            value={telephone} 
                            onChange={(e) => setTelephone(e.target.value)} 
                            type="tel" 
                            className={inputClasses} 
                            required 
                            disabled={lead} 
                        />
                    </div>
                    <div className="mb-4">
                        <label className={labelClasses}>Oportunidades</label>
                        <div className="flex flex-col">
                            {Object.keys(checkboxes).map(id => (
                                <div key={id} className="flex items-center mb-2">
                                    <input 
                                        type="checkbox" 
                                        id={id} 
                                        checked={checkboxes[id]} 
                                        onChange={() => handleCheckboxChange(id)} 
                                        className="mr-2" 
                                        disabled={lead} 
                                    />
                                    <label htmlFor={id} className={checkboxLabelClasses}>{id.replace(/-/g, ' ')}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button 
                            onClick={onCancel} 
                            type="button" 
                            className={`bg-zinc-300 text-zinc-700 ${buttonClasses} hover:bg-zinc-400`}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={`bg-customBlue text-white ${buttonClasses} hover:bg-blue-600`} 
                            disabled={lead}
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLead;
