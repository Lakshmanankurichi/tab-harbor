export interface Tab {
  id: string;
  session_id: string;
  title: string;
  url: string;
  favicon_url: string | null;
  position: number;
}

export interface Session {
  id: string;
  device_uuid: string;
  title: string;
  tags: string[];
  tab_count: number;
  created_at: string;
  tabs?: Tab[];
}

export interface CreateSessionPayload {
  deviceUUID: string;
  tabs: Array<{
    title: string;
    url: string;
    favicon_url: string | null;
    position: number;
  }>;
}
