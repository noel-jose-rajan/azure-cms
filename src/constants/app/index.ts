import ENV from "../env";

const baseURL = ENV.BASE_URL;

export const CONST_DATA = {
  level_One_Id: 116,
  Approve_and_Forward_Id: 2,
  Approve_Id: 3,
  Word_Editor_Base_URL: `https://office.sdtgroup.tech/browser/dist/cool.html?WOPISrc=${baseURL}/cms/v1/wopi/files/`,
  Announcement_Id: 121,
  Incoming_External_id: 1,
  Outgoing_External_id: 2,
  Internal_id: 3,
  Reject_Inbound_Task_Id: 13,
  Route_Task_Id: 14,
  Route_CC_Task_Id: 15,
  Send_task_id: 16,
  Send_task_By_Post_Office_id: 70,
  Send_task_By_Email_id: 77,
  Send_task_By_G2G: 139,
  Outbound_Process_Id: 1,
  Inbound_Process_Id: 2,
  Route_Process_Id: 3,
  Adhoc_Process_Id: 4,
  Completed_status_id: 15,
  Pending_status_id: 16,
  SEND_TASK_SUBJECT: 107,
  Incoming_External_Type_ID: 1,
  Internal_outbound_Id: 78,
};
