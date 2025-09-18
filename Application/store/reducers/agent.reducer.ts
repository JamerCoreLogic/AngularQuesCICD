import { createReducer, on } from "@ngrx/store";
;
import * as AgentActions from '../actions/agent.actions';
import { AgentAdmin } from "src/app/modules/agents/agent-admin-model";

// export interface AgentState {
//   agentList: any[];
//   error: any;
//   loading: boolean;
// }


export interface AgentState {
    agents: AgentAdmin[];
    //   registerType: 'Yes' | 'No' | null;
    error: any;
}
export const initialState: AgentState = {
    agents: [],
    error: null,
};

export const agentReducer = createReducer(
    initialState,
    on(AgentActions.loadAgentList, (state) => ({
        ...state,
        loading: true
    })),
    on(AgentActions.loadAgentListSuccess, (state, { agentList }) => ({
        ...state,
        agents: agentList,
        loading: false
    })),
    on(AgentActions.loadAgentListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);