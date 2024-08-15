import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from 'uuid';
import NewLead from './NewLead';
import { toast } from 'react-toastify';
import { LeadController } from '../controllers/LeadController';
import { UserModel } from '../models/UserModel';
import { LeadModel } from '../models/LeadModel';
import { ColumnsModel } from '../models/ColumnsModel';

const sharedClasses = {
    primaryColor: 'text-customBlue',
    secondaryColor: 'bg-customBlue',
    secondaryColorForeground: 'text-white',
    mutedForeground: 'text-gray-500',
    background: 'bg-gray-100',
    padding: 'p-6',
    marginY: 'my-6',
    flex: 'flex',
    itemsCenter: 'items-center',
    spaceX: 'space-x-6',
    rounded: 'rounded-lg',
    hoverOpacity: 'hover:bg-blue-600',
    px: 'px-4',
    py: 'py-2',
    marginRight: 'mr-4',
    text3xl: 'text-3xl',
    fontWeightBold: 'font-bold',
};

const initialData = {
    columns: {
        'column-1': { id: 'column-1', title: 'Cliente Potencial', items: [] },
        'column-2': { id: 'column-2', title: 'Dados Confirmados', items: [] },
        'column-3': { id: 'column-3', title: 'Análise do Lead', items: [] },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
};

function Dashboard({ onLogout }) {
    const [data, setData] = useState(initialData);
    const [newLead, setNewLead] = useState(false);
    const [viewLead, setViewLead] = useState(null);
    const [leads, setLeads] = useState([]);
    const user = UserModel.getLoggedUser();

    useEffect(() => {
        const storedLeads = LeadModel.getLeads();
        const userLeads = storedLeads.filter(lead => lead.createdBy === user.email);

        const storedColumns = ColumnsModel.getColumns(initialData);
        setLeads(userLeads);

        const updatedColumns = { ...storedColumns };

        userLeads.forEach(lead => {
            const columnId = determineColumnForLead(lead);
            if (columnId && !updatedColumns['column-1'].items.includes(lead.id) && !updatedColumns['column-2'].items.includes(lead.id) && !updatedColumns['column-3'].items.includes(lead.id)) {
                updatedColumns[columnId].items.push(lead.id);
            }
        });

        setData(prevData => ({
            ...prevData,
            columns: updatedColumns
        }));
    }, [user.email]);

    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(data.columns));
    }, [data.columns]);

    const handleLogout = () => {
        UserModel.removeUser()
        onLogout();
    };

    const handleNewLead = () => {
        setNewLead(true);
    };

    const handleViewLead = (lead) => {
        setViewLead(lead);
    };

    const handleCancel = () => {
        setNewLead(false);
        setViewLead(null);
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        const sourceIndex = data.columnOrder.indexOf(source.droppableId);
        const destinationIndex = data.columnOrder.indexOf(destination.droppableId);

        // Bloqueia arrasto para a esquerda e salto de etapas
        if (destinationIndex < sourceIndex || (destinationIndex - sourceIndex) > 1) {
            return;
        }

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const startColumn = data.columns[source.droppableId];
        const finishColumn = data.columns[destination.droppableId];

        if (startColumn === finishColumn) {
            const newItemIds = Array.from(startColumn.items);
            newItemIds.splice(source.index, 1);
            newItemIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...startColumn,
                items: newItemIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newData);
        } else {
            const startItemIds = Array.from(startColumn.items);
            startItemIds.splice(source.index, 1);

            const finishItemIds = Array.from(finishColumn.items);
            if (!finishItemIds.includes(draggableId)) {
                finishItemIds.splice(destination.index, 0, draggableId);
            }

            const newStartColumn = {
                ...startColumn,
                items: startItemIds,
            };

            const newFinishColumn = {
                ...finishColumn,
                items: finishItemIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newStartColumn.id]: newStartColumn,
                    [newFinishColumn.id]: newFinishColumn,
                },
            };

            setData(newData);
        }
    };

    const addLead = (lead) => {
        const id = uuidv4();
        const uniqueLeads = LeadController.addLead(leads, lead, user, id);
        setLeads(uniqueLeads);

        const newColumns = { ...data.columns };
        if (!newColumns['column-1'].items.includes(id)) {
            newColumns['column-1'].items.push(id);
        }
        setData({ ...data, columns: newColumns });
        setNewLead(false);
        toast.success('Lead criado com sucesso');
    };

    const determineColumnForLead = (lead) => {
        return 'column-1'; // Default column
    };

    return (
        <div className={`${sharedClasses.padding} ${sharedClasses.background} w-screen h-screen`}>
            {newLead ? (
                <NewLead onAddLead={addLead} onCancel={handleCancel} />
            ) : viewLead ? (
                <NewLead lead={viewLead} onCancel={handleCancel} />
            ) : (
                <div>
                    <div className={`${sharedClasses.flex} ${sharedClasses.marginY} justify-between items-start`}>
                        <img 
                            aria-hidden="true" 
                            alt="logo" 
                            src="https://www.juscash.com.br/wp-content/themes/s3/assets/img/logo-white.svg" 
                            className={`${sharedClasses.marginRight} w-[600px] h-[100px]`}
                        />
                        <button onClick={handleLogout} className={`${sharedClasses.secondaryColor} ${sharedClasses.secondaryColorForeground} ${sharedClasses.px} ${sharedClasses.py} ${sharedClasses.rounded}`}>Logout</button>
                    </div>
                    <div className={`${sharedClasses.marginY} flex justify-end`}>
                        <button 
                            onClick={handleNewLead}
                            className={`${sharedClasses.secondaryColor} ${sharedClasses.secondaryColorForeground} ${sharedClasses.px} ${sharedClasses.py} ${sharedClasses.rounded}`}
                        >
                            + Novo Lead
                        </button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className={`${sharedClasses.flex} ${sharedClasses.marginY}`}>
                            {data.columnOrder.map((columnId) => {
                                const column = data.columns[columnId];
                                const items = column.items.map(itemId => {
                                    const lead = leads.find(lead => lead.id === itemId);
                                    return lead ? lead : { id: itemId, name: 'Item não encontrado' };
                                });

                                return (
                                    <Droppable key={column.id} droppableId={column.id}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="w-1/3 bg-gray-200 p-4 "
                                            >
                                                <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
                                                {items && items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="p-2 mb-2 bg-white border border-gray-300 rounded shadow"
                                                                onClick={() => handleViewLead(item)} 
                                                            >
                                                                {item.name}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                );
                            })}
                        </div>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
