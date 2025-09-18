/*
 * Public API Surface of aqagent
 */

export { AQAgentModule } from './lib/aqagent.module';
export { AQAgentListService  } from './lib/services/AgentListService/aqagent-list.service';
export { AgentListApi } from './lib/classes/agent-list-api';
export { IAgentAddReq,IAgentAddRole} from './lib/interfaces/base-agent-add-req';
export { IAgentUpdateReq,IAgentRole} from './lib/interfaces/base-agent-update-req';

