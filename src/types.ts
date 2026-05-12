/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PanelFunction {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface SystemStats {
  activeCount: number;
  totalFunctions: number;
  speed: number;
  health: 'Normal' | 'Stable' | 'Heavy' | 'Dangerous';
  uptime: string;
  totalUsers: string;
  totalSessions: string;
  avgSpeed: string;
}

export const FUNCTIONS: PanelFunction[] = [
  {
    id: 1,
    name: "Aimlock Nhẹ (Legit)",
    description: "Công nghệ aimlock nhẹ không bị phát hiện",
    icon: "Target"
  },
  {
    id: 2,
    name: "Tâm Bám Đầu 95%",
    description: "Bám đầu tự động với độ chính xác cao",
    icon: "Focus"
  },
  {
    id: 3,
    name: "DPI Siêu Cấp (1200)",
    description: "Tăng DPI cho chơi nhanh nhất",
    icon: "Zap"
  },
  {
    id: 4,
    name: "Bypass FF Thường",
    description: "Vượt qua hệ thống phát hiện (giả lập)",
    icon: "ShieldCheck"
  },
  {
    id: 5,
    name: "Optimize FF MAX",
    description: "Tối ưu hóa cho Free Fire MAX",
    icon: "Settings"
  }
];
