/**
 * Interface for leave-group lambda sns message body
 * @interface
 * @property {string} userPk
 * @property {string} groupPk
 */
export interface LeaveGroupSnsMessageBody {
  userPk: string;
  groupPk: string;
}
