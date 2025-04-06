import {
  ArrowUpward,
  ArrowForward,
  ArrowDownward,
  PlayCircleFilled,
  AssignmentTurnedIn,
  Assignment
} from '@mui/icons-material';

export const TASK_STATUS = {
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed'
};
  
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const STATUS_ICONS = {
  [TASK_STATUS.ASSIGNED]: Assignment,
  [TASK_STATUS.IN_PROGRESS]: PlayCircleFilled,
  [TASK_STATUS.COMPLETED]: AssignmentTurnedIn
};

export const PRIORITY_ICONS = {
  [TASK_PRIORITY.HIGH]: ArrowUpward,
  [TASK_PRIORITY.MEDIUM]: ArrowForward,
  [TASK_PRIORITY.LOW]: ArrowDownward
};