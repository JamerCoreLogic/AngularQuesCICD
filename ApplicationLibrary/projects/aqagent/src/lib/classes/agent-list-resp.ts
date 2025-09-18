import { IAgentListResp, IAgentData, IAgentBranch, IAgentRole, IUnderwriterLob } from '../interfaces/base-agent-list-resp';
import { IAgentList } from '../interfaces/base-agent-list-resp';
import { AgentList } from './agent-list'
import { AgentBranch } from './agent-branch';
import { Agentrole } from './agent-role';
import { UnderwriterLob } from './agent-lob'





export class AgentListResp implements IAgentListResp {
    data: IAgentData = {
        agentList: []
    };
    success: boolean;
    message?: any;

    constructor(resp: IAgentListResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.agentList = this.filterAgentLsit(resp.data.agentList);
    }

    private filterAgentLsit(resp: IAgentList[]) {
        
        if (resp && resp.length) {
            

            return resp.map((res: IAgentList) => {
                let obj: IAgentList = {
                    agent: new AgentList(res.agent),
                    agentBranch: res.agentBranch.filter(branch => {
                        return new AgentBranch(branch);
                    }),
                    agentRoles: res.agentRoles.filter(role => {
                        return new Agentrole(role);
                    }),
                    underwriterLob:res.underwriterLob?res.underwriterLob.filter(lob => {
                        return new UnderwriterLob(lob);
                    }):[],
                    underwriterState:res.underwriterState?res.underwriterState.filter(state => {
                        return state;
                    }):[],
                    underwriterAssistant:res.underwriterAssistant?res.underwriterAssistant.filter(assistant => {
                        return assistant;
                    }):[],
                }
                return obj;
            });
        }
    }
}