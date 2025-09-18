import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AgentState } from '../reducers/agent.reducer';

export const selectAgentState = createFeatureSelector<AgentState>('agent'); // Key in StoreModule

// All agents
export const selectAllAgents = createSelector(
    selectAgentState,
    (state: AgentState) => state.agents
);

// Filtered agents by agencyId and excluding current user
export const selectFilteredAgents = createSelector(
    selectAgentState,
    (state: AgentState, props: { agencyId: number; currentUserId: number }) => {
        return state.agents
        // state.agents.filter(agent =>
        //     agent.userId !== props.currentUserId &&
        //     (props.agencyId > 0 ? agent.agencyId === props.agencyId : true)
        // )
    }
);

// No record message
export const selectAgentNoRecordMessage = createSelector(
    selectFilteredAgents,
    (agents) => agents.length > 0 ? '' : 'No Record Found.'
);
